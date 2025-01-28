import React from 'react'

const Card = ({icon, title, data, iconBg}) => {
  return (
    <div className='w-[300px] h-[100px] rounded-lg shadow-md bg-white p-3 relative cursor-pointer'>
        <div className={`w-[50px] h-[50px] shadow p-2 rounded-b-lg ${iconBg} absolute -top-4 right-3 flex justify-center items-center`}>
            <>{icon}</>
        </div>
        <div className='p-4'>
            <p className='text-xs'>{title}</p>
            <h2 className='text-4xl font-semibold'>{data}</h2>
        </div>
        <div>
        </div>
    </div>
  )
}

export default Card