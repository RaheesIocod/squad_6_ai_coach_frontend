<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SettingsIcon,
  FileText,
  LayoutDashboard
} from 'lucide-vue-next'
import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Sense AI',
      logo: GalleryVerticalEnd,
      plan: 'Smart AI Coach',
    },

  ],
  navMain: [
    {
      title: 'Home',
      url: '/app/home',
      icon: LayoutDashboard,
    },
    {
      title: 'Call Report',
      url: '/app/call-report',
      icon: FileText,
    },

    {
      title: 'Settings',
      url: '#',
      icon: SettingsIcon,
      items: [
        {
          title: 'Profile',
          url: '/app/profile',
        },
        {
          title: 'Knowledge Base',
          url: '/app/knowledge-base',
        },
        // {
        //   title: 'Billing',
        //   url: '#',
        // },
        // {
        //   title: 'Limits',
        //   url: '#',
        // },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader class="border-b  py-[14.5px]">
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <!-- <NavProjects :projects="data.projects" /> -->
    </SidebarContent>
    <SidebarFooter>
      <!-- <NavUser :user="data.user" /> -->
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
