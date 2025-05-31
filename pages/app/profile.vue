<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

// Form validation schema
const formSchema = toTypedSchema(z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email')
}))

const userDetails = computed(() => {
    return JSON.parse(localStorage.getItem('user') || '{}')
})

// Profile data with validation
const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: userDetails.value.name || '',
        email: userDetails.value.email || ''
    }
})

const saveProfileChanges = handleSubmit((values) => {
    console.log('Saving profile changes:', values)
    // Add API call to save profile data
})
</script>

<template>
    <div>
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/docs/components/accordion.html">
                        Settings
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <div class="">
            <div class="max-w-6xl mx-auto">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                </div>

                <!-- Profile Information -->
                <div class="max-w-2xl">
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h2 class="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
                        <p class="text-gray-600 text-sm mb-6">Update your personal information and account details</p>

                        <form class="space-y-6" @submit.prevent="saveProfileChanges">
                            <!-- Name Field -->
                            <FormField v-slot="{ componentField }" name="name">
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input disabled v-bind="componentField" placeholder="Enter your full name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>

                            <!-- Email Field -->
                            <FormField v-slot="{ componentField }" name="email">
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled v-bind="componentField" type="email"
                                            placeholder="Enter your email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>

                            <!-- <Button type="submit"
                                class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                                @click="saveProfileChanges">
                                Save Profile Changes
                            </Button> -->
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
