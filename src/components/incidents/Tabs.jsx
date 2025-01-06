import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Tabs = () => {
    const {pathname} = useLocation();
    const navigate = useNavigate();

    const links = [
        {
            name:"Incidents",
            isActive:pathname === "/incidents" ? true : false,
            link: "/incidents"
        },
        {
            name:"Maintenances",
            isActive:pathname.includes("maintenance") ? true : false,
            link: "/incidents/maintenance"
        },
        {
            name:"Consumables",
            isActive: pathname.includes("consommable") ? true : false,
            link: "/incidents/consommable"
        },
        {
            name:"Equipements",
            isActive:pathname.includes("equipement") ? true : false,
            link: "/incidents/equipement"
        }
    ]

  return (
    <div className='flex gap-2 items-center'>
        {
            links.map((link, index) => <div key={index} className={`px-2 p-1 ${link?.isActive ? "bg-secondary text-white" : "border-[1px] border-gray-300"} rounded-full cursor-pointer text-sm font-semibold`}onClick={()=>navigate(link?.link)}>{link?.name}</div>)
        }
    </div>
  )
}

export default Tabs