import React, {useEffect, useState} from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import { ChevronDown, DatabaseBackupIcon, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import toast from 'react-hot-toast';




const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {

  const handleDelete = async (id) =>{
    if (window.confirm("Voulez vous supprimer le group d'equipement ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/equipment-group-families/${id}`;
        let response = await fetch(url, {
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}` || ''
          },
        });
        toast.success("Supprimé avec succès");
        fetchData();
        return
        console.log(response.error)
        if(!response.error){
        }
      } catch (error) {
        console.error(error);
        toast.error("Vérifier la connexion internet, nous ne pouvons pas récupérer les équipements.");
      }
    }
  }

  const {handleFetch} = useFetch();

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
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingRow, setEditingRow] = useState("");


  const [open, setOpen] = useState(false);
  const columns = [
    {
      title:"No ref",
      dataIndex:"numRef",
      width:"100px",
      render:(value, record)=>
        editingRow == record.id ?
        <input className='w-full border rounded-lg p-2 text-sm'/>:
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
      render:(value)=><p className='text-sm capitalize'>{employees.find(site => site.value === value)?.name || value}</p>
    },
    {
      title:"Date de création",
      dataIndex:"createdAt",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(new Date(value).toLocaleString().toString())}</p>
    },
    {
      title:"Actions",
      width:  "200px",
      fixed: 'right',
      render:(value, record)=>
        editingRow == record.id ?
        <button title='Enregistrer' className='text-xs p-2 bg-secondary rounded-lg text-white shadow flex gap-2'>
          <DatabaseBackupIcon className='h-4 w-4'/>
          <span>Sauvegarder</span>
        </button>:
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
  ]
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
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
  },[])

  useEffect(()=>{
  },[editingRow])

  return (
    <div className="w-full">
      <div className="py-2 px-4 w-full max-h-[500px]">
        <Form>
          <Table 
            footer={() => <div className='flex'>{pagination}</div>}
            dataSource={dataList}
            bordered={true}
            columns={columns}
            onRow={record => ({
              onClick: () => {
                setOpen(true);
              }
            })}
            scroll={{
                x: 500,
                y: "40vh"
            }}
            pagination={false}
            loading={loading}
          />
        </Form>
      </div>
    </div>
  )
}

export default Datalist
