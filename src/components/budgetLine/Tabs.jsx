import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {getEmployee} from '../../utils/entity.utils'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { Drawer } from 'antd';

import { AUTHCONTEXT } from '../../contexts/AuthProvider';

const Tabs = () => {

    const { setEmployeeData } = useContext(AUTHCONTEXT);
    
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const links = [
        {
            name:"Dashboard",
            isActive:pathname == "/budgetLine" ? true : false,
            link: "/budgetLine",
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Exercice Budgetaire",
            isActive:pathname.includes("budgetLineOf") ? true : false,
            link: "/budgetLine/budgetLineOf",
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Famille Ligne Budgetaire",
            isActive:pathname.includes("majorBudgetLine") ? true : false,
            link: "/budgetLine/majorBudgetLine",
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Libellé Ligne Budgetaire",
            isActive: pathname.includes("budgetLineName") ? true : false,
            link: "/budgetLine/budgetLineName",
            requiredPermissions:[],
            requiredRoles:[]
        },
        // {
        //     name:"ANtDesign",
        //     isActive: pathname.includes("antDesign") ? true : false,
        //     link: "/budgetLine/antDesign",
        //     requiredPermissions:[],
        //     requiredRoles:[]
        // },
        
        {
            name:"Derogations",
            isActive:pathname.includes("Derogations") ? true : false,
            link: "/budgetLine/Derogations",
            requiredPermissions:[],
            requiredRoles:[]
        },
    ]

    useEffect(()=>{
        const handleCheckPermissions = async () =>{
            try {
                let employee = await getEmployee();
                setEmployeeData(employee)
                if(employee != null){
                    let permissions = employee?.employeePermissions.map(permission=>permission?.permission.permissionName);
                    setUserPermissions(permissions || []);

                    let roles = employee?.employeeRoles.map(role => role?.role.roleName);
                    setUserRoles(roles || []);
                    
                }
            } catch (error) {
                console.log(error);
            }
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