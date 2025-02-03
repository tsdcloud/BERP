import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Tabs = () => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([""]);
    // const [userPermissions, setUserPermissions] = useState(["incident__view_incident_causes","incident__view_incident_types", "incident__view_maintenance_types", "incident__view_equipements"]);

    const links = [
        {
            name:"Dashboard",
            isActive:pathname.includes("dashboard") ? true : false,
            link: "/incidents/dashboard",
            requiredPermissions:[]
        },
        {
            name:"Incidents",
            isActive:pathname === "/incidents" ? true : false,
            link: "/incidents",
            requiredPermissions:[]
        },
        {
            name:"Hors pont",
            isActive: pathname.includes("off-bridge") ? true : false,
            link: "/incidents/off-bridge",
            requiredPermissions:[]
        },
        {
            name:"Maintenances",
            isActive:(pathname.includes("maintenance") && !pathname.includes("type")) ? true : false,
            link: "/incidents/maintenance",
            requiredPermissions:[]
        },
        {
            name:"Causes d'incidents",
            isActive:pathname.includes("incident-cause") ? true : false,
            link: "/incidents/incident-cause",
            requiredPermissions:["incident__view_incident_causes"]
        },
        {
            name:"Types d'incidents",
            isActive:pathname.includes("incident-type") ? true : false,
            link: "/incidents/incident-type",
            requiredPermissions:["incident__view_incident_types"]
        },
        {
            name:"Type de Maintenances",
            isActive:pathname.includes("maintenance-type") ? true : false,
            link: "/incidents/maintenance-type",
            requiredPermissions:["incident__view_maintenance_types"]
        },
        // {
        //     name:"Consommables",
        //     isActive: pathname.includes("consommable") ? true : false,
        //     link: "/incidents/consommable"
        // },
        {
            name:"Equipements",
            isActive:pathname.includes("equipement") ? true : false,
            link: "/incidents/equipement",
            requiredPermissions:["incident__view_equipements"]
        }
    ]

  return (
    <div className='flex gap-2 items-center w-full px-2 overflow-x-auto'>
        {
            links.map((link, index) => 
                link.requiredPermissions.every(permission => userPermissions.includes(permission)) &&
            <div key={index} className={`px-2 p-1 ${link?.isActive ? "bg-secondary text-white" : "border-[1px] border-gray-300"} rounded-full cursor-pointer text-sm font-semibold`} onClick={()=>navigate(link?.link)}>{link?.name}</div>
        )
        }
    </div>
  )
}

export default Tabs