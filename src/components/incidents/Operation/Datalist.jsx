import React, {useEffect, useState} from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import { ChevronDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import toast from 'react-hot-toast';




const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {

  const handleDelete = async (id) =>{
    if (window.confirm("Voulez vous supprimer l'equipement ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/equipements/${id}`;
        let response = await fetch(url, {
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}` || ''
          },
        });
        if(response.status === 200){
          toast.success("Supprimé avec succès");
          fetchData();
          return
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
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingRow, setEditingRow] = useState("");


  const columns = [
    {
      title:"Num ref",
      dataIndex:"equipement",
      width:  "200px",
      render:(value)=><p className='text-sm'>{highlightText(value?.numRef) || "--"}</p>
    },
    {
      title:"Equipement",
      dataIndex:"equipement",
      width:  "200px",
      render:(value)=><p>{value?.title ||"--"}</p>
    },
    {
      title:"Type d'action",
      dataIndex:"actionType",
      width:  "200px",
      render:(value)=><p className='text-sm'>{
        value == "START" ? "Démarrage" : 
        value == "STOP" ? "Arrêt" :
        value == "REFUEL" ? "Ravitaillement" : 
        highlightText(value) || '--'}</p>
    },
    {
      title:"Site",
      dataIndex:"siteId",
      width:  "200px",
      render:(value)=><p className='text-sm'>{sites.find(site => site.value === value)?.name ||"--"}</p>
    },
    {
      title:"Contenu",
      dataIndex:"content",
      width:  "200px",
      render:(value)=><p className='text-sm'>{highlightText(value)||"--"}</p>
    },
    {
      title:"Date et création",
      dataIndex:"createdAt",
      width:  "200px",
      render:(value)=><p className='text-sm'>{new Date(value).toLocaleString() ||"--"}</p>
    },
    {
      title:"Description",
      dataIndex:"description",
      width:  "200px",
      render:(value)=><p className='text-sm'>{highlightText(value) || "--"}</p>
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

  const handleFetchSites = async (link) =>{
    try {
      let response = await handleFetch(link);    
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setSites(formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  
  }
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
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
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