import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export default function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className='px-4 flex justify-between'>
        <div className='flex space-x-2 w-full'>
          <Skeleton className="h-9 w-[40%]" />
          <Skeleton className="h-9 w-[15%]" />
        </div>
        <Skeleton className="h-9 w-[15%]" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {[...Array(5)].map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-6 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(7)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {[...Array(5)].map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}