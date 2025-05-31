<script setup lang="ts">
const route = useRoute()
const id = route?.params?.id as string

const cookie = useCookie('token')
const token = cookie.value
const config = useRuntimeConfig()

const { data: responseData } = await useAsyncData(
    `response-with-id`,
    async () => {
        try {
            const response = await $fetch(`${config.public.apiBaseUrl}/responses/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id,
                    deep: true,
                },
            })
            return response
        }
        catch (error) {
            console.error('Failed to fetch campaign details:', error)
            return null
        }
    },
)

// Mock data - replace with actual data from responseData
const metrics = {
    talkToListenRatio: 15,
    objectionHandling: 80,
    conversionProbability: 99,
    fillerWords: 2,
    totalWords: 200
}

async function exportReport() {
    try {
        const response = await $fetch(`${config.public.apiBaseUrl}/responses/export?format=pdf`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                response_id: id,
            },
        })

        // Create a blob and download the PDF
        const blob = new Blob([response], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    } catch (error) {
        console.error('Failed to export report:', error)
    }
}

</script>

<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold">{{ responseData?.data?.call_name }}</h1>
                <!-- <p class="text-gray-600">Handle an inbound call from a potential customer asking about your product
                    features and pricing.</p> -->
            </div>
            <button @click="exportReport" class="bg-custom rounded text-white px-6 py-2">
                Export Report
            </button>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
            <!-- Performance Metrics -->
            <div class="bg-white  rounded-xl shadow-sm p-6">
                <h2 class="text-xl font-semibold mb-6">Performance Metrics</h2>
                <div class="space-y-6">
                    <!-- Talk-to-Listen Ratio -->
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Talk-to-Listen Ratio</span>
                            <span class="text-gray-900">{{ responseData?.data?.metrics?.talk_to_listen_ratio }}%</span>
                        </div>
                        <div class="h-2 bg-gray-100 rounded-full">
                            <div class="h-full bg-blue-600 rounded-full"
                                :style="`width: ${responseData?.data?.metrics?.total_silence_duration}%`" />
                        </div>
                    </div>

                    <!-- Objection Handling -->
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Objection Handling Efficiency</span>
                            <span class="text-gray-900">{{ responseData?.data?.metrics?.objection_handling_efficiency
                                }}%</span>
                        </div>
                        <div class="h-2 bg-gray-100 rounded-full">
                            <div class="h-full bg-purple-600 rounded-full"
                                :style="`width: ${responseData?.data?.metrics?.objection_handling_efficiency}%`" />
                        </div>
                    </div>

                    <!-- Conversion Probability -->
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Conversion Probability</span>
                            <span class="text-gray-900">{{ responseData?.data?.metrics?.conversion_probability
                                }}%</span>
                        </div>
                        <div class="h-2 bg-gray-100 rounded-full">
                            <div class="h-full bg-blue-600 rounded-full"
                                :style="`width: ${responseData?.data?.metrics?.conversion_probability}%`" />
                        </div>
                    </div>

                    <!-- Stats Grid -->
                    <div class="grid grid-cols-2 gap-4 mt-6">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-gray-900">{{ metrics.fillerWords }}</div>
                            <div class="text-sm text-gray-600">Filler Words Used</div>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-gray-900">{{
                                responseData?.data?.metrics?.total_words_spoken }}</div>
                            <div class="text-sm text-gray-600">Total Words Spoken</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Strengths and Improvements -->
            <div class="space-y-8">
                <!-- Call Strengths -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h2 class="text-xl font-semibold text-green-600 mb-4">Emotions</h2>
                    <ul class="space-y-3">
                        <li v-for="(strength, index) in responseData?.data?.analysis?.emotions" :key="index"
                            class="flex items-start gap-2">
                            <div class="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                            <span class="text-gray-700 capitalize">{{ strength }}</span>
                        </li>
                    </ul>
                </div>

                <!-- Areas for Improvement -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h2 class="text-xl font-semibold text-orange-600 mb-4">Important Words</h2>
                    <ul class="space-y-3">
                        <li v-for="(improvement, index) in responseData?.data?.analysis?.important_words" :key="index"
                            class="flex items-start gap-2">
                            <div class="w-2 h-2 mt-2 rounded-full bg-orange-500"></div>
                            <span class="text-gray-700">{{ improvement }}</span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6 mt-3">
            <h2 class="text-xl font-semibold text-orange-600 mb-4">Areas of improvements</h2>
            <ul class="space-y-3">
                <li v-for="(improvement, index) in responseData?.data?.analysis?.areas_of_improvement" :key="index"
                    class="flex items-start gap-2">
                    <div class="w-2 h-2 mt-2 rounded-full bg-orange-500"></div>
                    <span class="text-gray-700">{{ improvement }}</span>
                </li>
            </ul>
        </div>
        <div class="border p-5 rounded-lg mt-3">
            <h2 class="text-xl font-semibold mb-4 text-green-600">Summary</h2>
            {{ responseData?.data?.response?.summary_response }}
        </div>
    </div>
</template>