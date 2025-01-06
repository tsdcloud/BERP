const Tabs = (links) => {
    
  return (
    <div className='flex gap-2 items-center'>
        {
            links.map((link, index) => <div key={index} className={`px-2 p-1 ${link?.isActive ? "bg-secondary text-white" : "border-[1px] border-gray-300"} rounded-full cursor-pointer text-sm font-semibold`}onClick={()=>navigate(link?.link)}>{link?.name}</div>)
        }
    </div>
  )
}

export default Tabs