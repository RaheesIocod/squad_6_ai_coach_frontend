<script setup lang="ts">
import { HoverCardArrow } from 'reka-ui'
import { parseFilename } from 'ufo'
import { mimeTypes } from '~/constants/files'

const props = defineProps({
  modelValue: {
    type: [File, String, Object],
    required: true,
    default: '',
  },
  id: {
    type: String,
    default: 'file-input',
  },
  title: {
    type: String,
    default: 'Add Document',
  },
  previewLabel: {
    type: String,
    default: ' Selected File',
  },
  maxSize: {
    type: Number,
    default: 3000000,
  },
  icon: {
    type: String,
    default: 'mdi:image-add',
  },
  supportedExtensions: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hidePreview: {
    type: Boolean,
    default: false,
  },
  dimension: {
    type: Object as () => { width: number, height: number } | null,
    default: null,
  },
})

const emits = defineEmits(['update:modelValue', 'remove', 'select'])

// RETURN FUNCTIONS

function checkOutput(output: File | string | null) {
  if (output instanceof File) {
    return 'file'
  }
  else if (typeof output === 'string' && output?.length) {
    return 'url'
  }
  else {
    return 'unknown'
  }
}

async function readFile(file: File) {
  return new Promise((resolve, reject) => {
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const type = file.type
      const preview = URL.createObjectURL(file)

      // Check dimensions only if the file is an image
      if (type.startsWith('image/')) {
        const img = new Image()

        img.onload = () => {
          const { width, height } = img

          // Check dimensions if the dimension prop is provided
          if (props.dimension) {
            const { width: maxWidth, height: maxHeight } = props.dimension
            if (width > maxWidth || height > maxHeight) {
              handleError({
                data: {
                  message: `Image dimensions should not exceed ${maxWidth}x${maxHeight}px.`,
                },
              })
              file = null
              reject(new Error('Image dimensions exceed the allowed size.'))
              return
            }
          }

          resolve({ file, preview, type, ext, name: file.name, width, height })
        }

        img.onerror = error => reject(error)

        img.src = preview
      }
      else {
        // If not an image, resolve without checking dimensions
        resolve({ file, preview, type, ext, name: file.name })
      }
    }
    catch (error) {
      console.error(error)
      reject(error)
    }
  })
}

function readUrl(url: string) {
  return new Promise((resolve, reject) => {
    try {
      const name = parseFilename(url, { strict: true })
      const file = url
      const preview = url
      const ext = name?.split('.').pop().toLowerCase()
      const type = mimeTypes[ext] || 'application/octet-stream'
      resolve({ name, file, preview, type, ext })
    }
    catch (error) {
      console.error(error)
      reject(error)
    }
  })
}

// COMPUTED FUNCTIONS

const file = computed({
  get: () => (props.modelValue),
  set: (value: object) => {
    emits('update:modelValue', value)
  },
})

const accept = computed(() => {
  const extensions = props.supportedExtensions.length ? props.supportedExtensions : Object.keys(mimeTypes)
  return extensions.map(ext => mimeTypes[ext])
})

const attachment = computedAsync(
  async () => {
    if (checkOutput(file.value) === 'file') {
      return await readFile(file.value)
    }
    else if (checkOutput(file.value) === 'url') {
      return await readUrl(file.value)
    }
    else {
      return {}
    }
  },
  null,
)

// METHODS
function removeAttachment() {
  file.value = null
  emits('remove')
}

function selectAttachment(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files)
    return

  if (!accept.value.includes(target.files[0].type)) {
    handleError({ data: { message: `Please select a supported file type` } })
    file.value = ''
    return
  }

  if (target.files[0]?.size > props.maxSize) {
    handleError({ data: { message: `Please keep your file size under ${props.maxSize / 1000000}MB` } })
    file.value = ''
    return
  }

  file.value = target.files[0]
  emits('select', target.files[0])
}
function computedAsync<T>(
  getter: () => Promise<T>,
  defaultValue: T,
) {
  const data = ref(defaultValue)
  const error = ref(null)

  watchEffect(async () => {
    try {
      data.value = await getter()
    }
    catch (e) {
      error.value = e
      console.error(e)
    }
  })

  return computed(() => data.value)
}
</script>

<template>
  <div class="flex">
    <HoverCard :open-delay="50" class="w-full">
      <HoverCardTrigger class="w-full">
        <template v-if="loading">
          <slot name="loading">
            <label :for="id" class="text-xs text-gray-normal font-400 cursor-pointer">
              {{ attachment?.name || "Loading..." }}
              <Icon name="svg-spinners:270-ring" size="18" class="text-primary mx-2" />
            </label>
          </slot>
        </template>
        <template v-else-if="attachment?.preview">
          <slot name="preview" v-bind="{ attachment, removeAttachment, selectAttachment }">
            <label :for="id" class="text-xs text-gray-normal font-400 cursor-pointer">
              <span v-if="previewLabel">{{ previewLabel }}</span>
              <button type="button" name="remove" class="ml-2 text-red-500 hover:text-red-700"
                @click="removeAttachment">
                Remove
              </button>
            </label>
          </slot>
        </template>

        <template v-else>
          <label :for="id">
            <slot v-bind="{ attachment, removeAttachment, selectAttachment }">
              <div
                class="relative cursor-pointer px-3 h-8.5 bg-white flex items-center justify-center rounded-1 border border-gray-light text-xs gap-x-2 text-gray-normal">
                <Icon v-if="icon" :name="icon" size="20px" />
                <span v-if="title">{{ title }}</span>
              </div>
            </slot>
          </label>
          <input :id="id" type="file" class="hidden" :accept="accept" @change="selectAttachment">
        </template>
      </HoverCardTrigger>
      <HoverCardContent v-if="attachment?.preview && !hidePreview" side="top" class="w-fit">
        <BaseFileInputPreview v-bind="attachment" />
        <HoverCardArrow class="fill-primary" :width="14" />
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
