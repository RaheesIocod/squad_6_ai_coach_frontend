<script setup lang="ts">
import { ChevronRight, type LucideIcon } from 'lucide-vue-next'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

defineProps<{
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}>()

const route = useRoute()

const active = (item: { title: string; url: string }) => {
  return route.path === item.url
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible v-for="item in items" :key="item.title" as-child
        :default-open="item.isActive || (item.items?.some(subItem => subItem.url === route.path))"
        class="group/collapsible">
        <SidebarMenuItem>
          <NuxtLink :to="item.url">
            <CollapsibleTrigger as-child>
              <SidebarMenuButton :class="{ 'bg-custom': active(item) }" :tooltip="item.title">
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
                <ChevronRight v-if="item.items && item.items.length > 0"
                  class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
          </NuxtLink>
          <CollapsibleContent v-if="item.items && item.items.length > 0">
            <SidebarMenuSub class="pl-0 gap-0">
              <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title"
                :class="active(subItem) && 'border-l-2 border-black '" class="hover:border-l-2 hover:border-black">
                <SidebarMenuSubButton class="hover:bg-transparent hover:text-black" :class="active(subItem) && ''"
                  as-child>
                  <a :href="subItem.url">
                    <span>{{ subItem.title }}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
