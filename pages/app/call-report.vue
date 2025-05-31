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

const data: Payment[] = [
    {
        id: 'm5gr84i9',
        amount: 316,
        name: 'John Smith',
        email: 'john.smith@yahoo.com',
        duration: 45,
        date: '2024-01-15'
    },
    {
        id: '3u1reuv4',
        amount: 242,
        name: 'Sarah Johnson',
        email: 'sarah.j@gmail.com',
        duration: 30,
        date: '2024-01-14'
    },
    {
        id: 'derv1ws0',
        amount: 837,
        name: 'Michael Brown',
        email: 'mbrown@gmail.com',
        duration: 60,
        date: '2024-01-13'
    },
    {
        id: '5kma53ae',
        amount: 874,
        name: 'Emily Davis',
        email: 'emily.davis@gmail.com',
        duration: 25,
        date: '2024-01-12'
    },
    {
        id: 'bhqecj4p',
        amount: 721,
        name: 'David Wilson',
        email: 'dwilson@hotmail.com',
        duration: 40,
        date: '2024-01-11'
    },
]

const columnHelper = createColumnHelper<Payment>()

const columns = [

    columnHelper.accessor('name', {
        enablePinning: true,
        header: 'Name',
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
    }),
    columnHelper.accessor('date', {
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
            }, () => ['Date'])
        },
        cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('date')),
    }),
    columnHelper.accessor('duration', {
        header: () => h('div', { class: 'text-right' }, 'Duration'),
        cell: ({ row }) => {


            return h('div', { class: 'text-right font-medium' }, `${row.getValue('duration')} min`)
        },
    }),

    columnHelper.accessor('actions', {
        header: () => h('div', { class: 'text-right mr-18' }, 'actions'),
        cell: ({ row }) => {


            return h('div', { class: 'text-right font-medium' }, [
                [
                    h(Button, {
                        variant: 'outline',
                        size: 'sm',
                        class: 'mr-2 rounded border-[#2563eb] text-[#2563eb] hover:text-[#2563eb]',
                        onClick: () => {
                            console.log('export', row.original)
                        }
                    }, () => ['Export']),
                    h(Button, {
                        variant: 'default',
                        size: 'sm',
                        class: 'bg-custom rounded',
                        onClick: () => {
                            console.log('view', row.original)
                        }
                    }, () => ['View Report']),
                ]
            ])
        },
    }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
    onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
    state: {
        get sorting() { return sorting.value },
        get columnFilters() { return columnFilters.value },
        get columnVisibility() { return columnVisibility.value },
        get rowSelection() { return rowSelection.value },
        get expanded() { return expanded.value },
        columnPinning: {
            left: ['status'],
        },
    },
})
</script>

<template>
    <div class="w-full space-y-6">
        <div>
            <div class="text-[24px] font-bold">
                Calls Reports
            </div>
            <div class="text-xs text-gray-500 font-normal">
                Detailed analysis and coaching insights from your sales calls
            </div>
        </div>
        <div class="border rounded-lg p-5">
            <div class="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                            <TableHead v-for="header in headerGroup.headers" :key="header.id"
                                :data-pinned="header.column.getIsPinned()" :class="cn(
                                    { 'sticky bg-background/95': header.column.getIsPinned() },
                                    header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                                )">
                                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                    :props="header.getContext()" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <template v-if="table.getRowModel().rows?.length">
                            <template v-for="row in table.getRowModel().rows" :key="row.id">
                                <TableRow :data-state="row.getIsSelected() && 'selected'">
                                    <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id"
                                        :data-pinned="cell.column.getIsPinned()" :class="cn(
                                            { 'sticky bg-background/95': cell.column.getIsPinned() },
                                            cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                                        )">
                                        <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                    </TableCell>
                                </TableRow>
                                <TableRow v-if="row.getIsExpanded()">
                                    <TableCell :colspan="row.getAllCells().length">
                                        {{ JSON.stringify(row.original) }}
                                    </TableCell>
                                </TableRow>
                            </template>
                        </template>

                        <TableRow v-else>
                            <TableCell :colspan="columns.length" class="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>



        <!-- <div class="flex items-center justify-end space-x-2 py-4">
            <div class="flex-1 text-sm text-muted-foreground">
                {{ table.getFilteredSelectedRowModel().rows.length }} of
                {{ table.getFilteredRowModel().rows.length }} row(s) selected.
            </div>
            <div class="space-x-2">
                <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()"
                    @click="table.previousPage()">
                    Previous
                </Button>
                <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
                    Next
                </Button>
            </div>
        </div> -->
    </div>
</template>