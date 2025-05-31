<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps({
  file: {
    type: [String, File],
    default: '',
  },
  preview: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'image',
  },
  class: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  ext: {
    type: String,
    default: '',
  },
})

function openAttachment() {
  const _file = props.file
  if (_file instanceof File) {
    const wnd = window.open('', '_blank')
    wnd.document.write(`<iframe width='100%' height='100%' src='${props.preview}'></iframe>`)
  }

  else if (typeof _file === 'string') {
    window.open(_file, '_blank')
  }

  // wnd.document.write(`<iframe width='100%' height='100%' src='https://docs.google.com/viewer?url=http://www.pdf995.com/samples/pdf.pdf'></iframe>`)
}

const fileType = computed(() => {
  const ext = props.ext
  switch (true) {
    case ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg'].includes(ext):
      return 'image'
    case ['mp3', 'wav', 'ogg'].includes(ext):
      return 'audio'
    case ['mp4', 'webm', 'avi', 'mpeg', 'mov'].includes(ext):
      return 'video'
    case ext === 'pdf':
      return 'pdf'
    case ext === 'txt':
      return 'text'
    case ext === 'html':
      return 'html'
    case ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext):
      return 'office'
    case ext === 'csv':
      return 'csv'
    default:
      return 'unknown'
  }
})
</script>

<template>
  <div :class="cn('w-60', props.class)">
    <template v-if="fileType === 'image'">
      <img :src="preview" class="mx-auto  w-full !object-contain ">
    </template>

    <template v-else-if="fileType === 'video'">
      <video class="-scale-100 rotate-180 mx-auto w-full !object-contain" :src="preview" controls />
    </template>

    <template v-else-if="fileType === 'audio'">
      <audio :src="preview" controls class=" w-full !object-contain  h-10" />
    </template>

    <template v-else>
      <div class="bg-[#FFF] p-2 rounded-1 flex justify-between items-center gap-2  relative  border-1 rounded-lg ">
        <div class="flex gap-x-2 items-center">
          <Icon name="fe:document" class="text-secondary" size="20" />
          <span class="text-[#1F1E1C] text-xs text-start !break-words truncate-left max-w-42 ">{{ name }}</span>
        </div>
        <Button v-if="fileType === 'pdf'" variant="soft" @click="openAttachment">
          <Icon name="fluent:open-16-filled" size="20" />
        </Button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.truncate-left {
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  white-space: nowrap;
}

.truncate-left * {
  direction: ltr;
}
</style>
