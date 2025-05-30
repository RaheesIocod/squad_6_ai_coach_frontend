import { defineEventHandler, readBody } from 'h3'
import { OpenAI } from 'openai'
// import { getContextFromVectorDB } from '~/server/lib/vector-db'
const config = useRuntimeConfig()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const question = body.query

  // Retrieve context from your vector DB (e.g., Pinecone, Weaviate, Chroma)
  const context = await getContextFromVectorDB(question)

  // Use LLM to generate response
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `Context: ${context}\n\nQuestion: ${question}` }
    ]
  })

  return { answer: completion.choices[0].message.content }
})
