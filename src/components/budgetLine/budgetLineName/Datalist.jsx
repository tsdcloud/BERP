import React, {useEffect, useState, useContext} from 'react';
import { Button } from '../../ui/button';
import { useForm } from 'react-hook-form';
import { XMarkIcon, TrashIcon, ExclamationTriangleIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { CheckCircle, ChevronDown, MoreHorizontal } from "lucide-react";
import CustomPagination from '../../common/Pagination';
import VerifyPermission from '../../../utils/verifyPermission';
// import CloseIncidentForm from './CloseIncidentForm';




const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {

  // const {roles, permissions} = useContext(PERMISSION_CONTEXT);

  const highlightText = (text) => {
    if (!searchValue) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text?.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  };


  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const { handlePatch } = useFetch()

  const handleDelete = async (id) =>{
      if (window.confirm("Voulez vous supprimer la Ligne ?")) {
        try {
          let url = `${URLS.API_BUDGETLINE}/budget-line-names/delete/${id}`;
          let response = await fetch(url, {
            method:"PATCH",
            headers:{
              "Content-Type":"application/json",
              'authorization': `Bearer ${localStorage.getItem('token')}` || ''
            }
          });
          if(response.status === 204){
            alert("Deleted successfully");
            fetchData();
          }
        } catch (error) {
          console.log(error);
        }
      }
    }


  const columns=[
    {
      title:"No ref",
      dataIndex:"numRef",
      width:"100px",
      render:(value, record)=>
        <p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title:"Code",
      dataIndex:"code",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title:"Nom",
      dataIndex:"name",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title:"Famille Ligne Budgetaire",
      dataIndex:"majorBudgetLine",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value?.name)}</p>
    },
    {
      title:"Action",
      dataIndex:"",
      fixed:"right",
      width:"75px",
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

              <DropdownMenuSeparator />
              
              <VerifyPermission functions={permissions} roles={roles} expected={['']}>
                <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" onClick={()=>handleDelete(record.id)}>
                  <TrashIcon className='text-red-500 h-4 w-6'/>
                  <span className='text-red-500'>Supprimer</span>
                </DropdownMenuItem>
              </VerifyPermission>
            </DropdownMenuContent>
          </DropdownMenu>
      },
  ]
  
  return (
    <div className="w-full">
      <div className="py-2 px-4 w-full max-h-[50vh] h-[50vh]">
        <Form>
          <Table 
            footer={() => <div className='flex w-full justify-end'>{pagination}</div>}
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