// server/api/upload-vectorize.post.ts
import { defineEventHandler, readRawBody } from 'h3'
import formidable from 'formidable'
import fs from 'fs/promises'
// import { OpenAI } from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'
import { v4 as uuid } from 'uuid'
import * as pdfjsLib from 'pdfjs-dist'

export default defineEventHandler(async (event) => {
  //   const config = useRuntimeConfig()

  //   // Setup OpenAI and Pinecone clients
  //   const openai = new OpenAI({ apiKey: config.public.openaiApiKey })
  //   const pinecone = new Pinecone({ apiKey: config.public.pineconeApiKey })

  //   const indexName = config.public.pineconeIndex

  //   // Parse multipart/form-data using formidable
  //   const form = formidable({ keepExtensions: true })

  //   const { files } = await new Promise<{ files: formidable.Files }>((resolve, reject) => {
  //     form.parse(event.node.req, (err, fields, files) => {
  //       if (err) reject(err)
  //       else resolve({ files })
  //     })
  //   })

  //   const file = files.file as formidable.File | formidable.File[]
  //   if (!file) {
  //     return { statusCode: 400, error: 'No file uploaded' }
  //   }

  //   // Handle case when multiple files uploaded - take first
  //   const uploadFile = Array.isArray(file) ? file[0] : file

  //   if (!uploadFile.filepath) {
  //     return { statusCode: 400, error: 'File path is missing' }
  //   }

  //   // Read the uploaded file as buffer
  //   const buffer = await fs.readFile(uploadFile.filepath)

  //   let fullText = ''
  //   // If PDF, extract text using pdfjs-dist, else treat as text
  //   if (uploadFile.originalFilename?.toLowerCase().endsWith('.pdf')) {
  //     fullText = await extractTextFromPDFBuffer(buffer)
  //   } else {
  //     fullText = buffer.toString('utf-8')
  //   }

  //   if (!fullText || fullText.trim().length === 0) {
  //     return { statusCode: 400, error: 'No text extracted from file' }
  //   }

  //   // Split text into chunks (~500 words)
  //   const chunks = splitIntoChunks(fullText, 500)

  //   // Prepare Pinecone namespace
  //   const namespace = pinecone.index(indexName).namespace('uploads')

  //   const vectors = []

  //   // Embed chunks using OpenAI and prepare vectors
  //   for (const chunk of chunks) {
  //     const embeddingResponse = await openai.embeddings.create({
  //       model: 'text-embedding-ada-002',
  //       input: chunk,
  //     })

  //     vectors.push({
  //       id: uuid(),
  //       values: embeddingResponse.data[0].embedding,
  //       metadata: {
  //         text: chunk,
  //         source: uploadFile.originalFilename,
  //       },
  //     })
  //   }

  //   // Upsert vectors to Pinecone
  //   await namespace.upsert(vectors)

  return {
    statusCode: 200,
    message: `Successfully uploaded and embedded chunks.`,
  }
})

// Extract text from PDF buffer using pdfjs-dist
async function extractTextFromPDFBuffer(buffer: Buffer): Promise<string> {
  const uint8Array = new Uint8Array(buffer)
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
  const pdf = await loadingTask.promise

  let fullText = ''
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ')
    fullText += pageText + '\n'
  }

  return fullText
}

// Split large text into chunks of approx. chunkSize words
function splitIntoChunks(text: string, chunkSize: number): string[] {
  const words = text.split(/\s+/)
  const chunks = []
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '))
  }
  return chunks
}
