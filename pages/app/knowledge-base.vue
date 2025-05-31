<template>
  <div class="min-h-screen">
    <!-- Breadcrumb -->
    <div class="px-4 py-3 text-sm text-gray-500">
      <span>Settings</span>
      <span class="mx-1">></span>
      <span>Knowledge Base Management</span>
    </div>

    <!-- Main Container -->
    <div class="px-4">
      <div class="bg-white">
        <!-- Header Section -->
        <div class="px-6 py-6">
          <h1 class="text-2xl font-normal text-black mb-2">Settings</h1>
          <p class="text-sm text-gray-500">
            Adipiscing netus leo orci faucibus. Turpis eleifend.
          </p>
        </div>

        <!-- Knowledge Base Management Section -->
        <div class="6 pb-6">
          <div class="mb-6">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h2 class="text-lg font-medium text-black">Knowledge Base Management</h2>
            </div>
            <p class="text-sm text-gray-500">
              Upload documents to enhance AI coaching insights.
            </p>
          </div>

          <!-- Upload Area -->
          <div class="border-2 border-dashed border-gray-300 rounded-lg bg-white" style="min-height: 200px;"
            @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileInput">
            <div class="flex flex-col items-center justify-center h-full py-12 px-6 cursor-pointer">
              <!-- Upload Icon -->
              <div class="mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m3 3l-3-3" />
                </svg>
              </div>

              <p class="text-base text-gray-700 mb-1 text-center">
                Drag and drop files here, or click to browse
              </p>

              <p class="text-sm text-gray-500 mb-4 text-center">
                Support for PDF, CSV, and DOCX files up to 10MB each
              </p>

              <button
                class="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                @click.stop="triggerFileInput">
                Browse Files
              </button>
            </div>

            <!-- <input ref="fileInput" type="file" multiple accept=".txt" class="hidden" @change="handleFileSelect"> -->
            <input ref="fileInput" type="file" multiple accept=".txt" class="hidden" @change="handleFileSelect">
          </div>
          <p class="text-sm text-gray-500 mb-4 text-center">
            Support for TXT files up to 10MB each
          </p>

          <!-- AI Processing Status -->
          <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-3 mt-0.5">
                <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd" />
                </svg>
              </div>

              <div>
                <h3 class="text-sm font-medium text-blue-900 mb-1">
                  AI Processing Status
                </h3>
                <p class="text-sm text-blue-700">
                  Uploaded documents are automatically processed to enhance coaching insights. Processing typically
                  takes 2-5 minutes per document.
                </p>
              </div>
            </div>
          </div>


          <!-- Uploaded Files List -->
          <div v-if="uploadedFiles.length > 0" class="mt-6">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Uploaded Files</h3>
            <div class="space-y-2">
              <div v-for="file in uploadedFiles" :key="file.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <span :class="getStatusClass(file.status)" class="px-2 py-1 text-xs font-medium rounded-full mr-3">
                    {{ file.status }}
                  </span>
                  <button class="text-red-500 hover:text-red-700" @click="removeFile(file.id)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive data
const fileInput = ref(null)
const uploadedFiles = ref([])

// Add these at the top of your script setup
const config = useRuntimeConfig()
const cookie = useCookie('token')
const token = cookie.value

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = async (files) => {
  for (const file of files) {
    if (validateFile(file)) {
      const fileObj = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        status: 'Processing',
        file: file
      }

      uploadedFiles.value.push(fileObj)

      try {
        // Create FormData and append file
        const formData = new FormData()
        formData.append('file', file)

        // Make API call
        const response = await fetch('http://localhost:8000/upload-knowledge-base-file', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        // Update file status to complete
        const index = uploadedFiles.value.findIndex(f => f.id === fileObj.id)
        if (index !== -1) {
          uploadedFiles.value[index].status = 'Complete'
        }

      } catch (error) {
        console.error('Error uploading file:', error)
        // Update file status to error
        const index = uploadedFiles.value.findIndex(f => f.id === fileObj.id)
        if (index !== -1) {
          uploadedFiles.value[index].status = 'Error'
        }
      }
    }
  }
}

// Update validateFile function to only allow .txt files
const validateFile = (file) => {
  const allowedTypes = ['text/plain']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!allowedTypes.includes(file.type)) {
    alert('Only .txt files are supported')
    return false
  }

  if (file.size > maxSize) {
    alert('File size must be less than 10MB')
    return false
  }

  return true
}

const removeFile = (fileId) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'Complete':
      return 'bg-green-100 text-green-800'
    case 'Error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<style scoped>
/* Any additional styles can go here */
</style>