<script setup inherit-attrs="false">
import { cn } from '@/utils/ui'

const props = defineProps({
  class: String,
  maxSize: Number,
})

function setEvent(event) {
  const newEvent = { ...event }
  newEvent.target = event.dataTransfer
  return newEvent
}

const dragging = ref(false)

const $attrs = useAttrs()
</script>

<template>
  <BaseFileInput
    v-bind="$attrs"
    :max-size="maxSize"
    :class="cn('h-30 min-w-40 w-full border-gray border-dashed border-2 text-xs px-5', props.class, (dragging && 'border-blue-normal'))"
    data-cy="input-file"
    @remove="dragging = false"
  >
    <template #default="{ selectAttachment }">
      <div
        class="flex flex-col items-center justify-center w-full h-full"
        @dragover.prevent="() => (dragging = true)"
        @dragleave="dragging = false"
        @drop.prevent="(event) => { selectAttachment(setEvent(event)) }"
      >
        <Icon
          :name="dragging ? 'pixelarticons:drag-and-drop' : 'line-md:upload-loop'"
          size="20"
        />
        {{ dragging ? "Drop here" : "Drag Your file" }}
        <slot />
      </div>
    </template>

    <template #preview="{ selectAttachment, attachment, removeAttachment }">
      <div
        class="flex flex-col items-center justify-center w-full h-full"
        @dragover.prevent="() => (dragging = true)"
        @dragleave="dragging = false"
        @drop.prevent="(event) => { selectAttachment(setEvent(event)) }"
      >
        <span class="text-xs break-words max-w-full">{{ attachment.name }}</span>
        <button
          type="button"
          name="remove"
          class="ml-2 text-red-500 hover:text-red-700"
          @click="removeAttachment"
        >
          Remove
        </button>
      </div>
    </template>
  </BaseFileInput>
</template>
