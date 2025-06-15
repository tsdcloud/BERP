import React from 'react'
import { Table } from 'antd'

const OperationsDataList = ({data}) => {

    const columns = [
        {
          title:"Type d'action",
          dataIndex:"actionType",
          width:"100px",
          render:(value, record)=>
            <p className='text-sm'>{value==="STOP" ? "Arrêt" : value === "START"? "Démarrage" : "Ravitaillement"||"--"}</p>
        },
        {
          title:"Contenue",
          dataIndex:"content",
          width:"200px",
          render:(value)=><p className='text-sm'>{value ||"--"}</p>
        },
        {
          title:"Description",
          dataIndex:"description",
          width:"200px",
          render:(value)=><p className='text-sm capitalize'>{value||"--"}</p>
        },
        {
          title:"Date de l'opération",
          dataIndex:"createdAt",
          width:"200px",
          render:(value)=><p className='text-sm capitalize'>{new Date(value).toLocaleString()||"--"}</p>
        },
      ]

  return (
    <div className='bg-gray-50 rounded-lg'>
      <div>
        <h4 className='p-4 font-bold'>Suivi Equipement</h4>
      </div>
      <Table
          bordered
          columns={columns}
          dataSource={data}
      />
    </div>
  )
}

export default OperationsDataList