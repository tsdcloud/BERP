import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {getEmployee} from '../../utils/entity.utils'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { Drawer } from 'antd';
import { URLS } from '../../../configUrl';
import { useFetch } from '../../hooks/useFetch';


const Tabs = () => {
    
    const {pathname} = useLocation();
    const {handleFetch} = useFetch();
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const links = [
        {
            name:"Dashboard",
            isActive:pathname.includes("dashboard") ? true : false,
            link: "/incidents/dashboard",
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Incidents",
            isActive:pathname === "/incidents" ? true : false,
            link: "/incidents",
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Hors pont",
            isActive: pathname.includes("off-bridge") ? true : false,
            link: "/incidents/off-bridge",
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Maintenances",
            isActive:(pathname.includes("maintenance") && !pathname.includes("type")) ? true : false,
            link: "/incidents/maintenance",
            requiredPermissions:["incident__view_maintenance"],
            requiredRoles:["maintenance technician", "HSE supervisor", "IT technician", "manager", "coordinator"]
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

    useEffect(()=>{
        const handleCheckPermissions = async () =>{
            const employee = await getEmployee();
            if(!employee){
               setIsLoading(false);
               return 
            }
      
            const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
            const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
            
            let empPerms = employeePermissions?.employeePermissions
            let empRoles = employeeRoles?.employeeRoles
      
            let formatedRoles = empRoles.map(role=>role?.role.roleName)
            let formatedPerms = empPerms.map(perm=>perm?.permission.permissionName)
      
      
            setUserRoles(formatedRoles);
            setUserPermissions(formatedPerms);
            
            setIsLoading(false);
          }
          handleCheckPermissions();
    }, []);

    

  return (
    <div>
        <div className='hidden md:flex gap-2 items-center whitespace-nowrap overflow-x-auto no-scrollbar'>
            {
                links.map((link, index) => 
                (
                    (
                        link.requiredPermissions.some(permission => userPermissions.includes(permission)) || 
                        link.requiredRoles.some(role => userRoles.includes(role)) 
                    ) ||
                    (
                        link.requiredPermissions.length === 0 &&
                        link.requiredRoles.length === 0
                    )
                
                )  &&
                    <div key={index} className={`px-2 p-1 shadow-md ${link?.isActive ? "bg-secondary text-white" : "border-[1px] border-gray-300"} rounded-full cursor-pointer text-sm font-semibold flex justify-center`} onClick={()=>navigate(link?.link)}><span>{link?.name}</span></div>
                )
            }
        </div>

        <button className='mx-2 border p-2 rounded-lg bg-primary md:hidden' onClick={()=>setIsOpen(true)}>
            <Bars3BottomLeftIcon className='text-white h-6 w-6'/>
        </button>
        <Drawer open={isOpen} onClose={()=>setIsOpen(false)} placement='left'>
            <div className='flex flex-col gap-2'>
                {
                    links.map((link, index) => 
                        (
                            (
                                link.requiredPermissions.some(permission => userPermissions.includes(permission)) || 
                                link.requiredRoles.some(role => userRoles.includes(role)) 
                            ) ||
                            (
                                link.requiredPermissions.length === 0 &&
                                link.requiredRoles.length === 0
                            )
                         ) &&
                        <div key={index} className={`px-2 p-1 ${link?.isActive ? "bg-secondary text-white" : "border-[1px] border-gray-300"} rounded-full cursor-pointer text-sm font-semibold flex justify-center`} onClick={()=>navigate(link?.link)}><span>{link?.name}</span></div>
                    )
                }
            </div>
        </Drawer>
    </div>
  ) 
}

export default Tabs