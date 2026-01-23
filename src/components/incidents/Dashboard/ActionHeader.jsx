import { DocumentIcon } from '@heroicons/react/24/outline'
import React from 'react'

const ActionHeader = ({onIncidentClick, onMaintenanceClick, onClickOffBridge, onClickOperationGe}) => {
  return (
    <div className='flex p-2 rounded-lg border space-x-2 bg-white shadow'>
        <button 
            className='bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center space-x-1'
            onClick={onIncidentClick}
        >
            <DocumentIcon className='text-white h-5 w-5'/>
            <span>Extraction d'incindents</span>
        </button>
        <button 
            className='bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center space-x-1'
            onClick={onMaintenanceClick}
        >
            <DocumentIcon className='text-white h-5 w-5'/>
            <span>Extraction maintenances</span>
        </button>
        <button 
            className='bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center space-x-1'
            onClick={onClickOffBridge}
        >
            <DocumentIcon className='text-white h-5 w-5'/>
            <span>Extraction hors ponts</span>
        </button>
        <button
            className='bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center space-x-1'
            onClick={onClickOperationGe}
        >
            <DocumentIcon className='text-white h-5 w-5'/>
            <span>Extraction des opérations GE</span>
        </button>
    </div>
  );
};

export default ActionHeader