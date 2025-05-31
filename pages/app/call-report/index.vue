<script setup lang="ts">
import type {
    ColumnFiltersState,
    ExpandedState,
    SortingState,
    VisibilityState,
} from '@tanstack/vue-table'
import {
    createColumnHelper,
    FlexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table'
import { ChevronDown, ChevronsUpDown } from 'lucide-vue-next'

import { h, ref } from 'vue'
import { cn } from '@/lib/utils'
import { valueUpdater } from '@/components/ui/table/utils'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export interface Payment {
    id: string
    amount: number
    name: string
    email: string
    duration: number
    date: string

}
const config = useRuntimeConfig()
const cookie = useCookie('token')
const token = cookie.value

const { data: list } = await useAsyncData(
    `response-list`,
    async () => {
        try {
            const response = await $fetch(`${config.public.apiBaseUrl}/get-responses`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response
        }
        catch (error) {
            console.error('Failed to fetch campaign details:', error)
            return null
        }
    },)


const data = computed(() => {
    return list || []
})
// const data: Payment[] = [
//     {
//         id: 'm5gr84i9',
//         amount: 316,
//         name: 'John Smith',
//         email: 'john.smith@yahoo.com',
//         duration: 45,
//         date: '2024-01-15'
//     },
//     {
//         id: '3u1reuv4',
//         amount: 242,
//         name: 'Sarah Johnson',
//         email: 'sarah.j@gmail.com',
//         duration: 30,
//         date: '2024-01-14'
//     },
//     {
//         id: 'derv1ws0',
//         amount: 837,
//         name: 'Michael Brown',
//         email: 'mbrown@gmail.com',
//         duration: 60,
//         date: '2024-01-13'
//     },
//     {
//         id: '5kma53ae',
//         amount: 874,
//         name: 'Emily Davis',
//         email: 'emily.davis@gmail.com',
//         duration: 25,
//         date: '2024-01-12'
//     },
//     {
//         id: 'bhqecj4p',
//         amount: 721,
//         name: 'David Wilson',
//         email: 'dwilson@hotmail.com',
//         duration: 40,
//         date: '2024-01-11'
//     },
// ]

const columnHelper = createColumnHelper<Payment>()

// const columns = [

//     columnHelper.accessor('name', {
//         enablePinning: true,
//         header: 'Name',
//         cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
//     }),
//     columnHelper.accessor('date', {
//         header: ({ column }) => {
//             return h(Button, {
//                 variant: 'ghost',
//             }, () => ['Date'])
//         },
//         cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('date')),
//     }),
//     columnHelper.accessor('duration', {
//         header: () => h('div', { class: 'text-right' }, 'Duration'),
//         cell: ({ row }) => {


//             return h('div', { class: 'text-right font-medium' }, `${row.getValue('duration')} min`)
//         },
//     }),

//     columnHelper.accessor('actions', {
//         header: () => h('div', { class: 'text-right mr-18' }, 'actions'),
//         cell: ({ row }) => {


//             return h('div', { class: 'text-right font-medium' }, [
//                 [
//                     h(Button, {
//                         variant: 'outline',
//                         size: 'sm',
//                         class: 'mr-2 rounded border-[#2563eb] text-[#2563eb] hover:text-[#2563eb]',
//                         onClick: () => {
//                             console.log('export', row.original)
//                         }
//                     }, () => ['Export']),
//                     h(Button, {
//                         variant: 'default',
//                         size: 'sm',
//                         class: 'bg-custom rounded',
//                         onClick: () => {
//                             console.log('view', row.original)
//                         }
//                     }, () => ['View Report']),
//                 ]
//             ])
//         },
//     }),
// ]

// const sorting = ref<SortingState>([])
// const columnFilters = ref<ColumnFiltersState>([])
// const columnVisibility = ref<VisibilityState>({})
// const rowSelection = ref({})
// const expanded = ref<ExpandedState>({})

// const table = useVueTable({
//     get data() { return list?.data || [] },
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getExpandedRowModel: getExpandedRowModel(),
//     onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
//     onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
//     onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
//     onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
//     onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
//     state: {
//         get sorting() { return sorting.value },
//         get columnFilters() { return columnFilters.value },
//         get columnVisibility() { return columnVisibility.value },
//         get rowSelection() { return rowSelection.value },
//         get expanded() { return expanded.value },
//         columnPinning: {
//             left: ['status'],
//         },
//     },
// })
const loading = ref(false)
async function exportReport(id: number) {
    try {
        const response = await $fetch(`${config.public.apiBaseUrl}/responses/export?format=pdf`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                response_id: id,
            },
        })

        // Create a blob and download the PDF
        const blob = new Blob([response], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    } catch (error) {
        console.error('Failed to export report:', error)
    }
}

</script>

<template>
    <div class="w-full space-y-6 p-6">
        <!-- Header -->
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Call Reports</h1>
            <p class="text-sm text-gray-500">
                Detailed analysis and coaching insights from your sales calls
            </p>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg border border-gray-200">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <!-- Table Header -->
                    <thead class="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th class="px-6 py-3">Name</th>
                            <th class="px-6 py-3">Date</th>
                            <!-- <th class="px-6 py-3">Duration</th>
                            <th class="px-6 py-3">Lead Converted?</th> -->
                            <th class="px-6 py-3 text-right pr-20">Actions</th>
                        </tr>
                    </thead>

                    <!-- Table Body -->
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="item in list?.data" :key="item.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 font-medium">
                                {{ item.name || 'Unknown' }}
                            </td>
                            <td class="px-6 py-4 text-gray-600">
                                {{ new Date(item.created_at).toLocaleDateString() }}
                            </td>
                            <!-- <td class="px-6 py-4 text-gray-600">
                                {{ item.metrics?.total_words_spoken ? Math.round(item.metrics.total_words_spoken / 150)
                                    : 0 }} min
                            </td> -->
                            <!-- <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div
                                        :class="`w-2 h-2 rounded-full mr-2 ${item.metrics?.conversion_probability >= 70 ? 'bg-green-500' : 'bg-red-500'}`">
                                    </div>
                                    <span
                                        :class="`${item.metrics?.conversion_probability >= 70 ? 'text-green-600' : 'text-red-600'}`">
                                        {{ item.metrics?.conversion_probability >= 70 ? 'Yes' : 'No' }}
                                    </span>
                                </div>
                            </td> -->
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <Button variant="outline" class="rounded" @click="exportReport(item.id)">
                                        Export
                                    </Button>
                                    <Button @click="navigateTo(`/app/call-report/${item.id}`)"
                                        class=" bg-blue-600 text-white rounded hover:bg-blue-700">
                                        View Report
                                    </Button>
                                </div>
                            </td>
                        </tr>

                        <!-- Empty State -->
                        <tr v-if="!list?.data?.length">
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                                No calls to display
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination can be added here if needed -->
        </div>
    </div>
</template>