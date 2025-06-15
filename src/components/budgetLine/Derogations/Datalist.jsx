import React, {useEffect, useState, useContext} from 'react';
import { Button } from '../../ui/button';
import { useForm } from 'react-hook-form';
import { XMarkIcon, TrashIcon, ExclamationTriangleIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog"
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

  const formatData = (tableData) => {
    if (tableData.lenght === 0) return "--";

    return tableData.map((elm, index)=>{
      return <div key={index} className='flex flex-col px-2 p-1'>
      {index > 0 ? <hr className='border-t border-dashed border-blue-400 pb-2'/> : ""}
      <div className='flex'>
        <div className='flex flex-none'>
          <span className='font-bold h-4 w-4 bg-blue-500 rounded-full text-center text-xs m-2'>{index + 1}</span>
        </div>
        <div className='pt-1 text-sm'>
          <div>
            <span>ligne budgetaire débitée: </span>
            <span className='font-bold'> 
              {elm?.breakdownBudgetLineOfDebited?.budgetLineOf?.budgetLineName?.name} ({elm?.breakdownBudgetLineOfDebited?.month})
            </span> 
          </div>

          <div>
            <span>ligne budgetaire créditée: </span>
            <span className='font-bold'> 
              {elm?.breakdownBudgetLineOfCredited?.budgetLineOf?.budgetLineName?.name} ({elm?.breakdownBudgetLineOfCredited?.month})
            </span> 
          </div>

          <div>
            <span>montant transferé: </span>
            <span className='font-bold'>
              {elm.Amount}F
            </span>
          </div>
        </div>
      </div>
    </div>
    })
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
      title:"Details",
      dataIndex:"derogationLignes",
      width:"200px",
      render:(value)=><p className='text-sm'>{formatData(value)}</p>
    },
    {
      title:"Description",
      dataIndex:"description",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value)}</p>
    },
    // {
    //   title:"Action",
    //   dataIndex:"",
    //   fixed:"right",
    //   width:"75px",
    //   render:(value, record)=>
    //     <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>

    //           <DropdownMenuSeparator />
              
    //           <VerifyPermission functions={permissions} roles={roles} expected={['']}>
    //             <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" onClick={()=>handleDelete(record.id)}>
    //               <TrashIcon className='text-red-500 h-4 w-6'/>
    //               <span className='text-red-500'>Supprimer</span>
    //             </DropdownMenuItem>
    //           </VerifyPermission>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //   },
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