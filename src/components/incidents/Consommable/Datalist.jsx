import React, {useEffect, useState} from 'react'
import { useFetch } from '../../../hooks/useFetch';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "../../ui/pagination"
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../../ui/table"
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';

  const HEADERS =[
    {
        name:"Nom"
    }
  ]


const Datalist = ({dataList}) => {
    
  return (
    <Table className="bg-white rounded-lg my-3">
        <TableHeader>
        <TableRow>
            {
                HEADERS.map((header, index)=><TableHead key={index} className="w-[100px]">{header.name}</TableHead>)
            }
        </TableRow>
    </TableHeader>
    {
        dataList.length > 0 ?
        <TableBody>
            
        </TableBody> :
        <div className='flex justify-center p-4 items-center gap-2'>
            <ArchiveBoxXMarkIcon className='h-8 w-8 text-gray-500'/>
            <h4 className='text-gray-500 text-md'>Aucune donnée pour le moment</h4>
        </div>
    }
    </Table>
  )
}

export default Datalist