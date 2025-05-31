<script setup lang="ts">
import { useStorage } from '@vueuse/core'


import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const callInfo = useStorage('call-info-state')
const callInfo2 = {
    metrics: {
        talkToListenRatio: 15,
        objectionHandling: 80,
        conversionProbability: 99,
        fillerWords: 2,
        totalWords: 200
    },
    strengths: [
        'Dignissim eleifend at laoreet eu sed ultricies lectus dolor orci.',
        'Dignissim eleifend at laoreet eu sed ultricies lectus dolor orci.',
        'Dignissim eleifend at laoreet eu sed ultricies lectus dolor orci.',
        'Dignissim eleifend at laoreet eu sed ultricies lectus dolor orci.'
    ],
    improvements: [
        'Dignissim eleifend at laoreet eu sed ultricies lectus dolor orci.',
        'Dignissim eleifend at laoreet eu sed ultricies lectus dolor orci.',
        'Dignissim eleifend at laoreet eu sed ultricies lectus dolor orci.'
    ]
}

const formSchema = toTypedSchema(z.object({
    name: z.string().min(1, 'name is required'),
}))
const { handleSubmit } = useForm({
    validationSchema: formSchema,

})

const onSubmit = handleSubmit(async (values) => {

    console.log('Form submitted:', values)
    // Here you can handle the form submission, e.g., send data to an API
})




</script>

<template>
    <!-- <div>
        call info
        {{ callInfo }}
    </div> -->
    <div class="">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold">Call Info</h1>
                <!-- <p class="text-gray-600">Handle an inbound call from a potential customer asking about your product
                    features and pricing.</p> -->
            </div>
            <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Export Report
            </button>
        </div>

        <form>
            <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
                <FormItem>
                    <FormLabel class="font-normal">Call Name</FormLabel>
                    <FormControl>
                        <Input id="name" v-bind="componentField" class="placeholder:text-sm h-11 w-1/4 mb-4" type="text"
                            placeholder="Call Name here" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>

        </form>

        <!-- Performance Metrics -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 class="text-xl font-semibold mb-6">Performance Metrics</h2>
            <div class="space-y-4">
                <!-- Talk-to-Listen Ratio -->
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">Talk-to-Listen Ratio</span>
                    <div class="flex items-center gap-2">
                        <div class="w-60 h-2 bg-gray-200 rounded-full">
                            <div class="h-2 bg-blue-500 rounded-full"
                                :style="`width: ${callInfo2.metrics.talkToListenRatio}%`" />
                        </div>
                        <span class="text-gray-700 w-12">{{ callInfo2.metrics.talkToListenRatio }}%</span>
                    </div>
                </div>

                <!-- Objection Handling -->
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">Objection Handling Efficiency</span>
                    <div class="flex items-center gap-2">
                        <div class="w-60 h-2 bg-gray-200 rounded-full">
                            <div class="h-2 bg-blue-500 rounded-full"
                                :style="`width: ${callInfo2.metrics.objectionHandling}%`" />
                        </div>
                        <span class="text-gray-700 w-12">{{ callInfo2.metrics.objectionHandling }}%</span>
                    </div>
                </div>

                <!-- Conversion Probability -->
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">Conversion Probability</span>
                    <div class="flex items-center gap-2">
                        <div class="w-60 h-2 bg-gray-200 rounded-full">
                            <div class="h-2 bg-blue-500 rounded-full"
                                :style="`width: ${callInfo2.metrics.conversionProbability}%`" />
                        </div>
                        <span class="text-gray-700 w-12">{{ callInfo2.metrics.conversionProbability }}%</span>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-4 mt-6">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="text-3xl font-bold text-gray-900">{{ callInfo2.metrics.fillerWords }}</div>
                        <div class="text-gray-600">Filler Words Used</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="text-3xl font-bold text-gray-900">{{ callInfo2.metrics.totalWords }}</div>
                        <div class="text-gray-600">Total Words Spoken</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Strengths and Improvements Grid -->
        <div class="grid grid-cols-2 gap-8">
            <!-- Strengths -->
            <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-xl font-semibold text-green-600 mb-4">Call Strengths</h2>
                <ul class="space-y-3">
                    <li v-for="(strength, index) in callInfo2.strengths" :key="index" class="flex items-start gap-2">
                        <div class="w-2 h-2 mt-2 rounded-full bg-green-500" />
                        <span class="text-gray-700">{{ strength }}</span>
                    </li>
                </ul>
            </div>

            <!-- Improvements -->
            <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-xl font-semibold text-orange-600 mb-4">Areas for Improvement</h2>
                <ul class="space-y-3">
                    <li v-for="(improvement, index) in callInfo2.improvements" :key="index"
                        class="flex items-start gap-2">
                        <div class="w-2 h-2 mt-2 rounded-full bg-orange-500" />
                        <span class="text-gray-700">{{ improvement }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <Button type="submit" class="bg-custom mt-4 w-[300px]" @click="onSubmit">
            save
        </Button>
    </div>
</template>