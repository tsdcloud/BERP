import { DocumentIcon } from '@heroicons/react/24/outline'
import React from 'react'

const ActionHeader = ({onIncidentClick, onMaintenanceClick}) => {
  return (
    <div className='flex p-2 rounded-lg border space-x-2'>
        <button 
            className='bg-secondary text-white p-2 text-xs rounded-lg shadow-md flex items-center space-x-1'
            onClick={onIncidentClick}
        >
            <DocumentIcon className='text-white h-3 w-3'/>
            <span>Generer rapport incindents</span>
        </button>
        <button 
            className='bg-secondary text-white p-2 text-xs rounded-lg shadow-md flex items-center space-x-1'
            onClick={onMaintenanceClick}
        >
            <DocumentIcon className='text-white h-3 w-3'/>
            <span>Generer rapport maintenances</span>
        </button>
    </div>
  )
}

export default ActionHeader