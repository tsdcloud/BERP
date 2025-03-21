import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {getEmployee} from '../../utils/entity.utils'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { Drawer } from 'antd';


const Tabs = () => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([""]);
    const [userRoles, setUserRoles] = useState([""]);
    const [isOpen, setIsOpen] = useState(false);
    // const [userPermissions, setUserPermissions] = useState(["incident__view_incident_causes","incident__view_incident_types", "incident__view_maintenance_types", "incident__view_equipements"]);

    useEffect(()=>{
        const handleCheckPermissions = async () =>{
            try {
                let employee = await getEmployee();
                if(employee != null){
                    let permissions = employee?.employeePermissions.map(permission=>permission?.permission.permissionName);
                    setUserPermissions(permissions || []);

                    let roles = employee?.employeeRoles.map(role => role?.role.roleName);
                    setUserRoles(roles || []);
                }
            } catch (error) {
                console.log(error)
            }
        }
        handleCheckPermissions();
    }, [])
    const links = [
        {
            name:"Dashboard",
            isActive:pathname.includes("dashboard") ? true : false,
            link: "/incidents/dashboard",
            requiredPermissions:[],
            requiredRoles:["maintenance technician", "head guard", "customer manager", "coordinator", "HSE supervisor", "IT technician", "manager"]
        },
        {
            name:"Incidents",
            isActive:pathname === "/incidents" ? true : false,
            link: "/incidents",
            requiredPermissions:[],
            requiredRoles:["maintenance technician", "head guard", "customer manager", "coordinator", "HSE supervisor", "IT technician", "manager"]
        },
        {
            name:"Hors pont",
            isActive: pathname.includes("off-bridge") ? true : false,
            link: "/incidents/off-bridge",
            requiredPermissions:["incident__view_off_bridges"],
            requiredRoles:["maintenance technician", "head guard", "coordinator", "manager"]
        },
        {
            name:"Maintenances",
            isActive:(pathname.includes("maintenance") && !pathname.includes("type")) ? true : false,
            link: "/incidents/maintenance",
            requiredPermissions:[""],
            requiredRoles:["maintenance technician", "HSE supervisor", "IT technician", "manager"]
        },
        {
            name:"Causes d'incidents",
            isActive:pathname.includes("incident-cause") ? true : false,
            link: "/incidents/incident-cause",
            requiredPermissions:["incident__view_incident_causes"],
            requiredRoles:["IT technician"]
        },
        {
            name:"Types d'incidents",
            isActive:pathname.includes("incident-type") ? true : false,
            link: "/incidents/incident-type",
            requiredPermissions:["incident__view_incident_types"],
            requiredRoles:["IT technician"]
        },
        {
            name:"Type de Maintenances",
            isActive:pathname.includes("maintenance-type") ? true : false,
            link: "/incidents/maintenance-type",
            requiredPermissions:["incident__view_maintenance_types"],
            requiredRoles:["IT technician"]
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
            requiredPermissions:["incident__view_equipements"],
            requiredRoles:["IT technician"]
        }
    ]

  return (
    <div>
        <button className='mx-2 border p-2 rounded-lg bg-primary md:hidden' onClick={()=>setIsOpen(true)}>
            <Bars3BottomLeftIcon className='text-white h-6 w-6'/>
        </button>
        <Drawer open={isOpen} onClose={()=>setIsOpen(false)} placement='left'>
            <div className='flex flex-col gap-2'>
                {
                    links.map((link, index) => 
                            (link.requiredPermissions.filter(permission => userPermissions.includes(permission)).length !==0 || link.requiredRoles.filter(role => userRoles.includes(role))).length !== 0 &&
                        <div key={index} className={`px-2 p-1 ${link?.isActive ? "bg-secondary text-white" : "border-[1px] border-gray-300"} rounded-full cursor-pointer text-sm font-semibold flex justify-center`} onClick={()=>navigate(link?.link)}><span>{link?.name}</span></div>
                    )
                }
            </div>
        </Drawer>
        <div className='hidden md:flex gap-2 items-center whitespace-nowrap overflow-x-auto no-scrollbar'>
            {
                links.map((link, index) => 
                    (link.requiredPermissions.filter(permission => userPermissions.includes(permission)).length !==0 || link.requiredRoles.filter(role => userRoles.includes(role))).length !== 0 &&
                <div key={index} className={`px-2 p-1 ${link?.isActive ? "bg-secondary text-white" : "border-[1px] border-gray-300"} rounded-full cursor-pointer text-sm font-semibold flex justify-center`} onClick={()=>navigate(link?.link)}><span>{link?.name}</span></div>
            )
            }
        </div>
    </div>
  ) 
}

export default Tabs