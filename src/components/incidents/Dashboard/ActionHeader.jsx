// import { DocumentIcon } from '@heroicons/react/24/outline'
// import React from 'react'

// const ActionHeader = ({onIncidentClick, onMaintenanceClick, onClickOffBridge, onClickOperationGe, onClickReportingCg, onClickWatchReport}) => {
//   return (
//     <div className='flex p-2 rounded-lg border space-x-2 bg-white shadow'>
//         <button 
//             className='bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center space-x-1'
//             onClick={onIncidentClick}
//         >
//             <DocumentIcon className='text-white h-5 w-5'/>
//             <span>Extraction d'incindents</span>
//         </button>
//         <button 
//             className='bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center space-x-1'
//             onClick={onMaintenanceClick}
//         >
//             <DocumentIcon className='text-white h-5 w-5'/>
//             <span>Extraction maintenances</span>
//         </button>
//         <button 
//             className='bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center space-x-1'
//             onClick={onClickOffBridge}
//         >
//             <DocumentIcon className='text-white h-5 w-5'/>
//             <span>Extraction hors-ponts</span>
//         </button>
//         <button
//             className='bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center space-x-1'
//             onClick={onClickOperationGe}
//         >
//             <DocumentIcon className='text-white h-5 w-5'/>
//             <span>Extraction opérations GE</span>
//         </button>
//         <button
//             className='bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center space-x-1'
//             onClick={onClickReportingCg}
//         >
//             <DocumentIcon className='text-white h-5 w-5'/>
//             <span>Extraction reporting CG</span>
//         </button>
//         <button
//             className='bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center space-x-1'
//             onClick={onClickWatchReport}
//         >
//             <DocumentIcon className='text-white h-5 w-5'/>
//             <span>Extraction rapports des quart</span>
//         </button>
//     </div>
//   );
// };

// export default ActionHeader

import { DocumentIcon } from '@heroicons/react/24/outline'
import React from 'react'

const ActionHeader = ({
  onIncidentClick,
  onMaintenanceClick,
  onClickOffBridge,
  onClickOperationGe,
  onClickReportingCg,
  onClickWatchReport,
}) => {
  const buttons = [
    { label: "Extraction d'incidents", onClick: onIncidentClick },
    { label: 'Extraction maintenances', onClick: onMaintenanceClick },
    { label: 'Extraction hors-ponts', onClick: onClickOffBridge },
    { label: 'Extraction opérations GE', onClick: onClickOperationGe },
    { label: 'Extraction reporting CG', onClick: onClickReportingCg },
    { label: 'Extraction rapports des quarts', onClick: onClickWatchReport },
  ]

  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-lg border bg-white shadow w-full overflow-x-auto">
      {buttons.map((button, index) => (
        <button
          key={index}
          className="bg-secondary text-white p-2 text-sm rounded-lg shadow-md flex items-center gap-1 whitespace-nowrap"
          onClick={button.onClick}
        >
          <DocumentIcon className="text-white h-5 w-5" />
          <span>{button.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ActionHeader