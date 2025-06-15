import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useFetch } from '../../../hooks/useFetch';

const MaintenanceDataList = ({data}) => {

  const [employees, setEmployees] = useState([]);
  const [externalEntities, setExternalEntities] = useState([]);

  const {handleFetch} = useFetch();

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
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
    handleFetchExternalEntities(`${import.meta.env.VITE_ENTITY_API}/suppliers`);
  }, []);

  const columns = [
    {
      title:"Num ref",
      dataIndex:"numRef",
      width:"100px",
      render:(value)=><p className='text-sm'>{value||"--"}</p>
    },
    {
      title:"Utilisateur",
      dataIndex:"createdBy",
      width:"200px",
      render:(value)=><p className='text-sm'>{employees.find(employee => employee.value === value)?.name || "N/A"}</p>
    },
    {
      title:"Maintenancier",
      dataIndex:"supplierId",
      width:"100px",
      render:(value)=><p className='text-sm'>{employees.find(employee => employee.value === value)?.name || externalEntities.find(entity => entity.value === value)?.name || "--"}</p>
    },
    {
      title:"Date de création",
      dataIndex:"createdAt",
      width:"200px",
      render:(value)=><p className='text-sm'>{new Date(value).toLocaleString()||"--"}</p>
    },
    {
      title:"Date de clôture",
      dataIndex:"closedDate",
      width:"200px",
      render:(value)=><p className='text-sm capitalize'>{new Date(value).toLocaleString()||"--"}</p>
    },
    {
      title:"Desrciption",
      dataIndex:"description",
      width:"200px",
      render:(value)=><p className='text-sm capitalize'>{value||"--"}</p>
    },
  ]

  return (
    <div className='bg-gray-50 rounded-lg'>
      <div>
        <h4 className='p-4 font-bold'>Maintenances</h4>
      </div>
        <Table 
          columns={columns}
          dataSource={data}
        />
    </div>
  )
}

export default MaintenanceDataList