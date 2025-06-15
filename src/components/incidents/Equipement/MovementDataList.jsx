import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useFetch } from '../../../hooks/useFetch';

const MovementDataList = ({data}) => {

  const [sites, setSites] = useState([]);
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
  useEffect(()=>{
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
  }, [])
  
  const columns = [
    {
      title:"Site d'origine",
      dataIndex:"originSite",
      width:"100px",
      render:(value)=><p className='text-sm'>{sites.find(site => site.value === value)?.name||"--"}</p>
    },
    {
      title:"Destination",
      dataIndex:"destinationSite",
      width:"200px",
      render:(value)=><p className='text-sm'>{sites.find(site => site.value === value)?.name||"--"}</p>
    },
    {
      title:"Description",
      dataIndex:"description",
      width:"200px",
      render:(value)=><p className='text-sm capitalize'>{value||"--"}</p>
    },
    {
      title:"Date du deplacement",
      dataIndex:"createdAt",
      width:"200px",
      render:(value)=><p className='text-sm capitalize'>{new Date(value).toLocaleString()||"--"}</p>
    },
  ]

  return (
    <div className='bg-gray-50 rounded-lg'>
      <div>
        <h4 className='p-4 font-bold'>Déplacements</h4>
      </div>
        <Table 
          columns={columns}
          dataSource={data}
        />
    </div>
  )
}

export default MovementDataList