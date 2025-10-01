import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {getEmployee} from '../../utils/entity.utils'
import { ArchiveBoxIcon, Bars3BottomLeftIcon, ChevronLeftIcon, ChevronRightIcon, Cog6ToothIcon, ExclamationTriangleIcon, RectangleStackIcon, TruckIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { Drawer } from 'antd';
import { URLS } from '../../../configUrl';
import { useFetch } from '../../hooks/useFetch';
import { ArrowLeftRightIcon, PlugZap2Icon, SnowflakeIcon } from 'lucide-react';
import { usePermissions } from '../../contexts/PermissionsProvider';


const Tabs = () => {
    
    const {pathname} = useLocation();
    const {handleFetch} = useFetch();
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const tabsContainerRef = useRef(null);
    const activeTabRef = useRef(null);
    
    const links = [
        {
            name:"Dashboard",
            isActive:pathname.includes("dashboard") ? true : false,
            link: "/incidents/dashboard",
            icon:<RectangleStackIcon className='h-4 w-4' />,
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Incidents",
            isActive:pathname === "/incidents" ? true : false,
            link: "/incidents",
            icon:<ExclamationTriangleIcon className='h-4 w-4' />,
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Hors pont",
            isActive: pathname.includes("off-bridge") ? true : false,
            link: "/incidents/off-bridge",
            icon:<TruckIcon className='h-4 w-4' />,
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Suivi de GE",
            isActive:pathname.includes("operations") ? true : false,
            link: "/incidents/operations",
            icon:<PlugZap2Icon className='h-4 w-4' />,
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Deplacement équipement",
            isActive:pathname.includes("movements") ? true : false,
            link: "/incidents/movements",
            icon:<ArrowLeftRightIcon className='h-4 w-4' />,
            requiredPermissions:[],
            requiredRoles:[]
        },
        {
            name:"Maintenances",
            isActive:(pathname.includes("maintenance") && !pathname.includes("type")) ? true : false,
            link: "/incidents/maintenance",
            icon:<WrenchScrewdriverIcon className='h-4 w-4' />,
            requiredPermissions:["incident__view_maintenance"],
            requiredRoles:["maintenance technician", "HSE supervisor", "IT technician", "manager", "coordinator"]
        },
        {
            name:"Equipements",
            isActive:pathname.includes("equipement") ? true : false,
            link: "/incidents/equipement",
            icon:<ArchiveBoxIcon className='h-4 w-4' />,
            requiredPermissions:[],
            requiredRoles:[]
            // requiredPermissions:["incident__view_equipements"],
            // requiredRoles:["maintenance technician", "HSE supervisor", "IT technician", "manager", "coordinator"]
        },
        {
            name:"Type Equipements",
            isActive:pathname.includes("equipment-groups") ? true : false,
            link: "/incidents/equipment-groups",
            icon:<ArchiveBoxIcon className='h-4 w-4' />,
            requiredPermissions:["incident__view_group_equipements"],
            requiredRoles:["IT technician", "maintenance technician","maintenance technician", "HSE supervisor", "IT technician", "manager", "coordinator"]
        },
        {
            name:"Domaines Equipements",
            isActive:pathname.includes("equipment-group-families") ? true : false,
            link: "/incidents/equipment-group-families",
            icon:<ArchiveBoxIcon className='h-4 w-4' />,
            requiredPermissions:["incident__view_equipment-families"],
            requiredRoles:["IT technician", "maintenance technician", "maintenance technician", "HSE supervisor", "IT technician", "manager", "coordinator"]
        },
        {
            name:"Causes d'incidents",
            isActive:pathname.includes("incident-cause") ? true : false,
            link: "/incidents/incident-cause",
            icon:<Cog6ToothIcon className='h-4 w-4' />,
            requiredPermissions:["incident__view_incident_causes"],
            requiredRoles:["IT technician", "maintenance technician", "maintenance technician", "manager", "coordinator"]
        },
        {
            name:"Types d'incidents",
            isActive:pathname.includes("incident-type") ? true : false,
            link: "/incidents/incident-type",
            icon:<Cog6ToothIcon className='h-4 w-4' />,
            requiredPermissions:["incident__view_incident_types"],
            requiredRoles:["IT technician", "maintenance technician", "maintenance technician", "manager","coordinator"]
        },
        // {
        //     name:"Type de Maintenances",
        //     isActive:pathname.includes("maintenance-type") ? true : false,
        //     link: "/incidents/maintenance-type",
        //     icon:<Cog6ToothIcon className='h-4 w-4' />,
        //     requiredPermissions:["incident__view_maintenance_types"],
        //     requiredRoles:["IT technician"]
        // }
    ]

    const { roles, permissions } = usePermissions()

    useEffect(()=>{
        const handleCheckPermissions = async () =>{
            setUserRoles(roles);
            setUserPermissions(permissions);
            setIsLoading(false);
          }
          handleCheckPermissions();
          checkScroll();
    }, []);

    const checkScroll = () => {
        if (tabsContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scrollLeft = () => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const scrollToActiveTab = () => {
        if (activeTabRef.current && tabsContainerRef.current) {
            const container = tabsContainerRef.current;
            const activeTab = activeTabRef.current;
            const containerWidth = container.clientWidth;
            const activeTabLeft = activeTab.offsetLeft;
            const activeTabWidth = activeTab.offsetWidth;

            const scrollPosition = activeTabLeft - (containerWidth / 2) + (activeTabWidth / 2);
            
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        checkScroll();
        scrollToActiveTab();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

  return (
    <div className="relative  overflow-y-hidden">
        <div className='hidden md:flex items-center'>
            {(
                <button 
                    onClick={scrollLeft}
                    className="absolute left-0 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
            )}
            
            <div 
                ref={tabsContainerRef}
                className='flex gap-2 items-center whitespace-nowrap overflow-x-auto overflow-y-hidden no-scrollbar px-8'
                onScroll={checkScroll}
            >
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
                        <div 
                            key={index} 
                            ref={link.isActive ? activeTabRef : null}
                            className={`px-2 ${link.icon && "flex items-center gap-2"} p-1 shadow-md ${link?.isActive ? "bg-secondary text-white" : "border-[1px] border-gray-300"} rounded-full cursor-pointer text-sm font-semibold flex justify-center`} 
                            onClick={()=>navigate(link?.link)}
                        >
                            {link?.icon}
                            <span>{link?.name}</span>
                        </div>
                    )
                }
            </div>

            {(
                <button 
                    onClick={scrollRight}
                    className="absolute right-0 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                >
                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                </button>
            )}
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
                        <div 
                        key={index} 
                        ref={link.isActive ? activeTabRef : null}
                        className={`px-2 ${link.icon && "flex items-center gap-2"} p-1 shadow-md ${link?.isActive ? "bg-secondary text-white" : "border-[1px] border-gray-300"} rounded-full cursor-pointer text-sm font-semibold flex justify-center`} 
                        onClick={()=>navigate(link?.link)}
                        >
                            {link?.icon}
                            <span>{link?.name}</span>
                        </div>
                    )
                }
            </div>
        </Drawer>
    </div>
  ) 
}

export default Tabs