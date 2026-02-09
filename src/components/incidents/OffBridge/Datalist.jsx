import React, {useEffect, useState, useContext} from 'react';
import { PERMISSION_CONTEXT } from '../../../contexts/PermissionsProvider';
import { Button } from '../../ui/button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import { useFetch } from '../../../hooks/useFetch';
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { URLS } from '../../../../configUrl';
import VerifyPermission from '../../../utils/verifyPermission';
 




const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {

  const handleDelete = async (id) =>{
    if (window.confirm("Voulez vous supprimer le hors pont ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/off-bridges/${id}`;
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
    
  const {roles, permissions} = useContext(PERMISSION_CONTEXT);
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
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
      title:"Site",
      dataIndex:"siteId",
      width:"200px",
      render:(value, record)=> 
        editingRow == record.id ?
        <input />:
        <p className='text-sm'>{sites.find(site => site.value === value)?.name || value}</p>
    },
    {
      title:"Tier",
      dataIndex:"tier",
      width:"150px",
      render:(value)=><p className='text-sm'>{externalEntities.find(entity => entity.value === value)?.name}</p>
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
      title:"Type de facturation",
      dataIndex:"paymentMode",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{value === "CASH" ? "ESPECE" : value === "BILLABLE" ? "A FACTURER" : highlightText(value) || "--"}</p>
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
      render:(value)=><p className='text-sm capitalize'>{externalEntities.find(entity => entity.value === value)?.name}</p>
    },
    {
      title:"Produit",
      dataIndex:"product",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{products.find(product => product.value === value)?.name}</p>
    },
    {
      title:"Transporteur",
      dataIndex:"transporter",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{externalEntities.find(entity => entity.value === value)?.name}</p>
    },
    {
      title:"Vehicule",
      dataIndex:"vehicle",
      width:"150px",
      render:(value)=><p className='text-sm capitalize'>{highlightText(value) || "--"}</p>
    },
    {
      title:"Description",
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
      title:"Utilisateur",
      dataIndex:"createdBy",
      width:"200px",
      render:(value)=><p className='text-sm'>{employees.find(employee => employee.value === value)?.name || "N/A"}</p>
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
          <VerifyPermission expected={["incident__can_delete_maintenance"]} functions={permissions} roles={roles}>
            <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" onClick={()=>handleDelete(record.id)}>
              <TrashIcon className='text-red-500 h-4 w-6'/>
              <span className='text-red-500'>Supprimer</span>
            </DropdownMenuItem>
          </VerifyPermission>
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
        console.log(externalEntities)
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  const handleFetchProducts = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setProducts(formatedData);
        console.log(externalEntities)
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
    handleFetchExternalEntities(`${import.meta.env.VITE_ENTITY_API}/suppliers`);
    handleFetchProducts(`${import.meta.env.VITE_ENTITY_API}/articles`);
  }, []);
  
  return (
    <div className="w-full">
      <div className="py-4 px-4 w-full max-h-[500px]">
        <Form>
          <Table 
            footer={() => <div className='flex justify-end w-full'>{pagination}</div>}
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
    </div>
  )
}

export default Datalist