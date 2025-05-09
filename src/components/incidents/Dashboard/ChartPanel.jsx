import React from 'react';
import { Tabs } from 'antd';
import { TrafficConeIcon } from 'lucide-react';
import Chart from '../Chart';

const ChartPanel = ({incidentStats, maintenanceStats}) => {
    const onChange = key => {
        console.log(key);
    };
    
    const items = [
        {
          key: '1',
          label: <div className='flex items-center gap-2'>
            <TrafficConeIcon className='h-5'/>
            <p>Tendances des incidents</p>
          </div>,
          children: <div className='h-full w-full flex items-center justify-center'>
            <Chart datas={incidentStats}/>
          </div>,
        },
        {
          key: '2',
          label: 'Tendances des équipements',
          children: 'Content of Tab Pane 2',
        },
      ];

  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  )
}

export default ChartPanel