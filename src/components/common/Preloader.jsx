import React from 'react'

function PreLoader({text, subTitle}) {
  return (
    <div className='h-screen w-full flex flex-col justify-center items-center absolute z-50'>
        <h4 className='text-6xl'>{text}</h4>
        <div className='flex items-center space-x-2'>
            <div className='border-l-2 border-t-2 border-r-2  border-secondary rounded-full h-8 w-8 animate-spin'></div>
            <p className='text-sm'>{subTitle}</p>
        </div>
    </div>
  )
}

export default PreLoader