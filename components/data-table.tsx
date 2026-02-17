"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconDotsVertical,
  IconGripVertical,
  IconCircleCheck,
  IconAlertTriangle,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Product = {
  id: number
  name: string
  category: string
  status: "Active" | "Draft" | "Out of Stock"
  price: number
  stock: number
  sku: string
}

const columns: ColumnDef<Product>[] = [
  {
    id: "drag",
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Product Details",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.sku}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status
      return (
        <Badge
          variant="outline"
          className={
            s === "Active" ? "border-green-500 text-green-600 bg-green-50" :
            s === "Out of Stock" ? "border-red-500 text-red-600 bg-red-50" :
            "border-orange-500 text-orange-600 bg-orange-50"
          }
        >
          {s}
        </Badge>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
  },
  {
    accessorKey: "stock",
    header: "Inventory",
    cell: ({ row }) => (
      <span className={row.original.stock < 10 ? "text-red-600 font-bold" : ""}>
        {row.original.stock} in stock
      </span>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" size="icon"><IconDotsVertical className="size-4" /></Button>
    ),
  },
]

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <div {...attributes} {...listeners} className="cursor-grab p-1 hover:bg-muted rounded">
      <IconGripVertical className="size-4 text-muted-foreground" />
    </div>
  )
}

function DraggableRow({ row }: { row: Row<Product> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1, zIndex: isDragging ? 10 : 1 }
  return (
    <TableRow ref={setNodeRef} style={style}>
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  )
}

export function ProductAdminTable({ initialData }: { initialData: Product[] }) {
  const [data, setData] = React.useState(initialData)
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel() })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIdx = prev.findIndex(i => i.id === active.id)
        const newIdx = prev.findIndex(i => i.id === over.id)
        return arrayMove(prev, oldIdx, newIdx)
      })
      toast.success("Order updated")
    }
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(header => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <SortableContext items={data.map(d => d.id)} strategy={verticalListSortingStrategy}>
              {table.getRowModel().rows.map(row => <DraggableRow key={row.id} row={row} />)}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}