import React from 'react'
import { PrinterIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ActionHeaders = ({
    filterOptions=[],
    input,
    selectValue,
    selectChange
}) => {
  return (
    <div className='px-4 flex justify-between w-full'>
        <div className='flex items-center flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0'>
            <div className='flex items-center border rounded-lg mx-2 text-sm px-2 bg-gray-100 shadow-sm w-full md:w-[300px]'>
                <FunnelIcon className='h-4 text-black'/>
                <select className="p-2 focus:outline-none bg-gray-100 w-full" value={selectValue} onChange={(evt)=>selectChange(evt)}>
                    <option value="">Filtrer par...</option>
                    {
                        filterOptions?.map((option, index) => <option key={option?.key ||index} value={option?.value}>{option?.name}</option>)
                    }
                </select>
            </div>
            <div className='flex items-center gap-4 relative w-full'>
                {input}
            </div>
        </div>
    </div>
  )
}

export default ActionHeaders