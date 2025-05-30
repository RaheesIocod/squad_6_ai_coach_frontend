<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
import * as z from 'zod'
const config = useRuntimeConfig()

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const formSchema = toTypedSchema(z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    // email: 'agent@example.com',
    email: ' ',
    // password: 'password',
    password: ' ',
  },
})
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const type = ref<'password' | 'text'>('password')

function setType() {
  type.value = type.value === 'password' ? 'text' : 'password'
}

const getType = computed(() => {
  return type.value === 'password' ? 'lucide:eye-off' : 'lucide:eye'
})

const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    const { email, password } = values
    const response = await $fetch(`${config.public.apiBaseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email,
        password,
      },
    })
    // set cookie
    const cookie = useCookie('token')
    cookie.value = response.access_token
    // set user data in local storage
    localStorage.setItem('user', JSON.stringify(response.user))
    // Redirect to home page
    useRouter().push('app/call')
  } catch (error) {
    console.error('Login error:', error)
    // You might want to show an error message to the user here
  } finally {
    loading.value = false
  }
})

</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="py-10">
      <div class="flex justify-center gap-x-2">
        <img src="/images/logo.svg" alt="">
        <div class="flex flex-col text-start items-start gap-y-2 leading-[15px]">
          <div class="font-bold text-[20px]">
            sensAi
          </div>
          <div class="text-xs text-normal text-gray-500">
            Smart AI Coach
          </div>
        </div>
      </div>
      <CardHeader class="text-center">

        <CardTitle class="text-xl">
          Welcome back
        </CardTitle>
        <CardDescription>
          Login with your Apple or Google account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <div class="grid gap-6">

            <div class="grid gap-6">
              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel class="font-normal">Email Address</FormLabel>
                     <FormControl>
                      <Input id="email" v-bind="componentField"  class="placeholder:text-sm h-10" type="email" placeholder="m@example.com"  />
                     </FormControl>
                     <FormMessage  class="text-xs"/>
                  </FormItem>
                </FormField>
              </div>
                <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                  <FormLabel class="font-normal">Password</FormLabel>
                  <FormControl>
                    <div class="relative">
                    <Input id="password" v-bind="componentField" class="placeholder:text-sm h-10" :type="type" placeholder="Enter your password" />
                    <Icon @click="setType" :name="getType" class="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer" />
                    </div>
                  </FormControl>
                  <FormMessage  class="text-xs"/>
                  </FormItem>
                </FormField>
                </div>
              <Button :disabled="loading"  type="submit" class="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 ">
                Login 
                <Icon v-if="loading" name="lucid:loader" class="animate-spin"></Icon>
              </Button>
            </div>
            <!-- <div class="text-center text-sm">
              Don't have an account?
              <a href="#" class="underline underline-offset-4">
                Sign up
              </a>
            </div> -->
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

