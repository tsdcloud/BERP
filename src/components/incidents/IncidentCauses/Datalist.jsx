import React, {useEffect, useState} from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "../../ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Input } from "../../../components/ui/input"
import {
  // Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
 




const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {
  const {handleFetch} = useFetch();

  const handleDelete = async (id) =>{
    if (window.confirm("Voulez vous supprimer la cause d'incident ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/incident-causes/${id}`;
        let response = await fetch(url, {
          method:"DELETE"
        });
        if(response.status === 200){
          alert("Deleted successfully");
          fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const highlightText = (text) => {
    if (!searchValue) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text?.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  };
          
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [employees, setEmployees] = useState([]);
  const [editingRow, setEditingRow] = useState("");
  const [columns, setColumns] = useState([
    {
      title:"No ref",
      dataIndex:"numRef",
      width:"100px",
      render:(value, record)=>
        editingRow == record.id ?
        <input />:
        <p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title:"Nom",
      dataIndex:"name",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title:"Cree par",
      dataIndex:"createdBy",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title:"Date de création",
      dataIndex:"createdAt",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value?.split("T")[0])}</p>
    },
    {
      title:"Dernière mise a jour",
      dataIndex:"updatedAt",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value?.split("T")[0])}</p>
    },
    {
      title:"Actions",
      width:  "200px",
      fixed: 'right',
      render:(value, record)=>
        editingRow == record.id ?
        <button title='Enregistrer'>Enreg...</button>:
      <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem 
                className="flex gap-2 items-center cursor-pointer"
                onClick={()=>{
                  setEditingRow(record.id)
                }}
              >
                <PencilIcon className='h-4 w-6'/>
                <span className=''>Editer</span>
              </DropdownMenuItem> */}
              <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" 
                onClick={()=>handleDelete(record.id)}>
                <TrashIcon className='text-red-500 h-4 w-6'/>
                <span className='text-red-500'>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </>
    },
  ])
    
  const handleFetchEmployees = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setEmployees(formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
  },[editingRow])

  useEffect(()=>{
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
  },[])

  return (
    <div className="w-full">
      <div className="py-2 px-4 w-full max-h-[500px]">
        <Form>
          <Table 
            footer={() => <div className='flex justify-end'>{pagination}</div>}
            dataSource={dataList}
            columns={columns}
            bordered={true}
            scroll={{
                x: 500,
                y: "40vh"
            }}
            pagination={false}
            loading={loading}
          />
        </Form>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
      </div>
    </div>
  )
}

export default Datalist