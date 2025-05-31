<!-- <template>
  <div class="w-screen flex flex-col bg-white-normal relative mx-0 h-full">
    <main
        id="default_main"
        class="slot-container flex-grow-1 transition overflow-auto font-sans"
    >
      <slot />
    </main>
  </div>

</template> -->

<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Bell } from 'lucide-vue-next'

// const userDetails = localStorage.getItem('user')

const userDetails = computed(() => {
  return JSON.parse(localStorage.getItem('user') || '{}')
})

</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
        <div class="flex items-center gap-2 px-4 justify-between w-full">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
          <!-- <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> -->
          <div class="flex items-center gap-2 ml-auto">
            <Bell class="mr-2" />
            <Avatar>
              <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div class="text-sm font-medium ">
              {{ userDetails.name }}
            </div>
          </div>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-[26px]">
        <slot />
        <!-- <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="bg-muted/50 aspect-video rounded-xl" />
          <div class="bg-muted/50 aspect-video rounded-xl" />
          <div class="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> -->
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
