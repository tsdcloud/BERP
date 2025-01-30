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
} from "../../ui/dropdown-menu";
import { URLS } from '../../../../configUrl';
 




const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {

  const handleDelete = async (id) =>{
    if (window.confirm("Voulez vous supprimer le hors pont ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/off-bridges/${id}`;
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
      title:"Tier",
      dataIndex:"tier",
      width:"150px",
      render:(value)=><p className='text-sm'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Conteneur 1",
      dataIndex:"container1",
      width:"150px",
      render:(value)=><p className='text-sm'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Conteneur 2",
      dataIndex:"container2",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Plomb 1",
      dataIndex:"plomb1",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Plomb 2",
      dataIndex:"plomb2",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Chargeur",
      dataIndex:"loader",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Produit",
      dataIndex:"product",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Transporteur",
      dataIndex:"transporter",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Vehicule",
      dataIndex:"vehicle",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Numero de BL",
      dataIndex:"blNumber",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Chauffeur",
      dataIndex:"driver",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Remorque",
      dataIndex:"trailer",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Chef de guerrite",
      dataIndex:"userId",
      width:"200px",
      render:(value)=><p className='text-sm'>{employees.find(site => site.value === value)?.name || "N/A"}</p>
    },
    {
      title:"Date de création",
      dataIndex:"createdAt",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value?.split("T")[0])}</p>
    },
    {
      title:"Actions",
      width:  "200px",
      fixed: 'right',
      render:(value, record)=>
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
          {/* {
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
                        },
                        body:JSON.stringify({status: "CLOSED", updatedBy:"878c6bae-b754-4577-b614-69e15821dac8"})
                      });
                      if(response.status === 200){
                        let urlIncident = `${URLS.INCIDENT_API}/incidents/${record.incidentId}`;
                        let response = await fetch(urlIncident, {
                          method:"PATCH",
                          headers:{
                            "Content-Type":"application/json",
                          },
                          body:JSON.stringify({status: "CLOSED"})
                        });
                        if(response.status == 200){
                          fetchData();
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
          } */}
          <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" onClick={()=>handleDelete(record.id)}>
            <TrashIcon className='text-red-500 h-4 w-6'/>
            <span className='text-red-500'>Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    },
  ]
    
  const {handleFetch, handlePost} = useFetch();

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
            footer={() => <div className='flex'></div>}
            dataSource={dataList}
            columns={columns}
            bordered={true}
            scroll={{
                x: 500,
                y: "30vh"
            }}
            pagination={pagination}
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