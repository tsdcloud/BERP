import React, {useEffect, useState} from 'react';
import { Button } from '../../ui/button';
import { INCIDENT_STATUS } from '../../../utils/constant.utils';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import { useFetch } from '../../../hooks/useFetch';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { URLS } from '../../../../configUrl';
 




const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {
 
  const handleDelete = async (id) =>{
    if (window.confirm("Voulez vous supprimer la maintenance ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/maintenances/${id}`;
        let response = await fetch(url, {
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}` || ''
          },
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
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [externalEntities, setExternalEntities] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingRow, setEditingRow] = useState("");

  const columns=[
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
      title:"Ref incident",
      dataIndex:"incident",
      width:"100px",
      render:(value)=><p className='text-sm'>{highlightText(value?.numRef) || "--"}</p>
    },
    {
      title:"Equipement",
      dataIndex:"equipement",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value?.name)}</p>
    },
    {
      title:"Site",
      dataIndex:"siteId",
      width:"200px",
      render:(value)=>
        <p className='text-sm capitalize'>
          {sites.find(site => site.value === value)?.name || value}
        </p>
    },
    {
      title:"Date previsionells",
      dataIndex:"projectedDate",
      width:"200px",
      render:(value)=><p className='text-sm'>{value?.split("T")[0] || "--"}</p>
    },
    {
      title:"Prochain maintenance",
      dataIndex:"nextMaintenance",
      width:"200px",
      render:(value)=><p className='text-sm'>{value?.split("T")[0] || "--"}</p>
    },
    {
      title:"Utilisateur",
      dataIndex:"createdBy",
      width:"200px",
      render:(value)=><p className='text-sm'>{employees.find(employee => employee.value === value)?.name || "N/A"}</p>
    },
    {
      title:"Cloturer par",
      dataIndex:"closedBy",
      width:"200px",
      render:(value)=>
        <p className='text-sm capitalize'>
          {employees.find(employee => employee.value === value)?.name || value || "--"}
        </p>
    },
    {
      title:"Maintenancier",
      dataIndex:"supplierId",
      width:"200px",
      render:(value)=><p className='text-sm'>{employees.find(site => site.value === value)?.name || externalEntities.find(site => site.value === value)?.name || "--"}</p>
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
      title:"Statut",
      dataIndex:"status",
      width:"200px",
      fixed:"right",
      render:(value)=>(
        <div className={`${
          value === "UNDER_MAINTENANCE"?"border-yellow-500 bg-yellow-300":
          value === "CLOSED" ? "border-green-500 bg-green-300" :""
        } p-2 rounded-lg border`}>{INCIDENT_STATUS[value] || "Unknown Status"}</div>
      )
    },
    {
      title:"Actions",
      width:  "200px",
      fixed: 'right',
      render:(value, record)=>
        editingRow == record.id ?
        <button title='Enregistrer'>Enreg...</button>:
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(payment.id)}
          >
            Copy payment ID
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          {
            (record.status === "PENDING") &&
            <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
              <button className='flex items-center space-x-2'
                onClick={async ()=>{
                  if (window.confirm("Voulez vous cloturer la maintenance ?")) {
                    try {
                      let url = `${URLS.INCIDENT_API}/maintenances/${record.id}`;
                      let response = await fetch(url, {
                        method:"PATCH",
                        headers:{
                          "Content-Type":"application/json",
                          'authorization': `Bearer ${localStorage.getItem('token')}` || ''
                        },
                        body:JSON.stringify({status: "CLOSED"})
                      });
                      if(response.status === 200){
                        let urlIncident = `${URLS.INCIDENT_API}/incidents/${record.incidentId}`;
                        let response = await fetch(urlIncident, {
                          method:"PATCH",
                          headers:{
                            "Content-Type":"application/json",
                            'authorization': `Bearer ${localStorage.getItem('token')}` || ''
                          },
                          body:JSON.stringify({status: "CLOSED"})
                        });
                        if(response.status == 200){
                          fetchData();
                        } else {
                          fetchData()
                        }
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }
                }}
              >
                <XMarkIcon />
                <span>Cloturer la maintenance</span>
              </button>
            </DropdownMenuItem>
          }
          <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" onClick={()=>handleDelete(record.id)}>
            <TrashIcon className='text-red-500 h-4 w-6'/>
            <span className='text-red-500'>Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    },
  ]
    
  const {handleFetch} = useFetch();

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

  const handleFetchExternalEntities = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setExternalEntities(formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
    handleFetchExternalEntities(`${import.meta.env.VITE_ENTITY_API}/suppliers`);
  }, []);
  
  return (
    <div className="w-full">
      <div className="py-4 px-4 w-full max-h-[500px]">
        <Form>
          <Table 
            footer={() => <div className='flex w-full justify-end'>{pagination}</div>}
            dataSource={dataList}
            columns={columns}
            bordered={true}
            scroll={{
                x: 500,
                y: "30vh"
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