// import React, {useEffect, useState} from 'react';
// import Header from '../../components/layout/Header';
// import Tabs from '../../components/incidents/Tabs';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';

// import { 
//     Cog6ToothIcon, 
//     CursorArrowRaysIcon, 
//     ExclamationTriangleIcon, 
//     PlusIcon, 
//     PrinterIcon, 
//     TruckIcon,
//     BuildingOfficeIcon // Import ajouté
// } from '@heroicons/react/24/outline';
// import ActionHeader from '../../components/incidents/Dashboard/ActionHeader';
// import { useNavigate } from 'react-router-dom';
// import {
//     Dialog,
//     DialogContent,
//     DialogFooter,
//     DialogHeader,
// } from "../../components/ui/dialog"
// import RapportIncidentForm from '../../components/incidents/Dashboard/RapportIncidentForm';
// import RapportMaintenanceForm from '../../components/incidents/Dashboard/RapportMaintenanceForm';
// import RapportOffBridgeForm from '../../components/incidents/Dashboard/RapportOffBridgeForm';
// import RapportOffOperatioGeForm from '../../components/incidents/Dashboard/RapportOffOperatioGeForm';
// import { FloatButton } from 'antd';
// import Card from '../../components/incidents/Dashboard/Card';
// import { WrenchIcon } from 'lucide-react';

// const Dashboard = () =>{
//     const {handleFetch} = useFetch();
//     const [incidents, setIncidents] = useState([]);
//     const [incidentStats, setIncidentStats] = useState([]);
//     const [maintenanceStats, setMaintenanceStats] = useState([]);
//     const [isOpenned, setIsOpenned] = useState(false);
//     const [openFloatBtn, setOpenFloatBtn] = useState(false);
//     const [dialogType, setDialogType] = useState("");

//     const [totalIncident, setTotalIncident] = useState(0);
//     const [totalIncidentPending, setTotalIncidentPending] = useState(0);
//     const [totalIncidentClosed, setTotalIncidentClosed] = useState(0);
//     const [totalIncidentUnderMaintenance, setTotalIncidentUnderMaintenance] = useState(0);

//     const [totalMaintenance, setTotalMaintenance] = useState(0);
//     const [totalMaintenanceClosed, setTotalMaintenanceClosed] = useState(0);
//     const [totalMaintenancePending, setTotalMaintenancePending] = useState(0);

//     const [totalOffBridge, setTotalOffBridge] = useState(0);
//     const [page, setPage] = useState(0);
//     const [pageList, setPageList] = useState([]);
    
//     const navigate = useNavigate();

//     const fetchIncidentsPending= async () => {
//         let url = `${URLS.INCIDENT_API}/incidents?status=PENDING`;
//         try {
//             const response = await handleFetch(url);
//             if(response.data){
//                 setTotalIncidentPending(response?.total);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const fetchIncidentsClosed= async () => {
//         let url = `${URLS.INCIDENT_API}/incidents?status=CLOSED`;
//         try {
//             const response = await handleFetch(url);
//             if(response.data){
//                 setTotalIncidentClosed(response?.total);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
    
//     const fetchIncidentsInMaintenance= async () => {
//         let url = `${URLS.INCIDENT_API}/incidents?status=UNDER_MAINTENANCE`;
//         try {
//             const response = await handleFetch(url);
//             if(response.data){
//                 setTotalIncidentUnderMaintenance(response.data?.length);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
    
//     const fetchIncidents= async () => {
//         let url = `${URLS.INCIDENT_API}/incidents`;
//         try {
//             const response = await handleFetch(url);
//             if(response.data){
//                 setIncidents(response.data);
//                 setTotalIncident(response.total);
//                 setPage(response.page);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
    
//     const fetchMaintenancesPending= async () => {
//         let url = `${URLS.INCIDENT_API}/maintenances?status=PENDING`;
//         try {
//             const response = await handleFetch(url);
//             if(response.data){
//                 setTotalMaintenancePending(response.data?.length);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
    
//     const fetchMaintenances= async () => {
//         let url = `${URLS.INCIDENT_API}/maintenances`;
//         try {
//             const response = await handleFetch(url);
//             if(response.data){
//                 setTotalMaintenance(response.data?.length);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
    
//     const fetchMaintenancesClosed= async () => {
//         let url = `${URLS.INCIDENT_API}/maintenances?status=CLOSED`;
//         try {
//             const response = await handleFetch(url);
//             if(response.data){
//                 setTotalMaintenanceClosed(response.data?.length);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
    
//     const fetchStats= async () => {
//         let url = `${URLS.INCIDENT_API}/incidents/stats`;
//         try {
//             const response = await handleFetch(url);
//             if(response.status === 200){
//                 setIncidentStats(response?.byIncidentType);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
    
//     const fetchOffBridges= async () => {
//         let url = `${URLS.INCIDENT_API}/off-bridges`;
//         try {
//             const response = await handleFetch(url);
//             if(response.data){
//                 setTotalOffBridge(response.total);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const handleOpenDialog=(dialog)=>{
//         setDialogType(dialog);
//         setIsOpenned(true);
//     }

//     useEffect(()=>{
//         fetchIncidentsPending();
//         fetchIncidentsClosed();
//         fetchIncidentsInMaintenance();
//         fetchIncidents();

//         fetchMaintenancesPending();
//         fetchMaintenancesClosed();
//         fetchMaintenances();
//         fetchStats();

//         fetchOffBridges();
//     }, []);

//     return(
//         <>
//             <Header />
//             <div className='px-6 space-y-2'>
//                 {/* Header */}
//                 <div className='overflow-x-auto'>
//                     <Tabs />
//                 </div>
                
//                 {/* ActionHeader pour desktop */}
//                 <div className='p-2 hidden md:block'>
//                     <ActionHeader 
//                         onIncidentClick={()=>handleOpenDialog("INCIDENT")}
//                         onMaintenanceClick={()=>handleOpenDialog("MAINTENANCE")}
//                         onClickOffBridge={()=>handleOpenDialog("OFF_BRIDGE")}
//                         onClickOperationGe={()=>handleOpenDialog("OPERATION_GE")}
//                     />
//                 </div>
                
//                 {/* Stats summary */}
//                 <div className='flex flex-col md:flex-row md:items-center md:gap-3 bg-white shadow p-2 py-4 rounded-lg mx-2'>
//                     <p className='text-md'>Total incident: <span className='font-bold'>{totalIncident}</span></p>
//                     <p className='text-md'>Total maintenance: <span className='font-bold'>{totalMaintenance}</span></p>
//                     <p className='text-md'>Total hors pont: <span className='font-bold'>{totalOffBridge}</span></p>
//                 </div>
                
//                 {/* Cards */}
//                 <div className='p-2 py-[50px] flex flex-col md:flex-row items-center gap-6 md:gap-2'>
//                     <Card 
//                         icon={<ExclamationTriangleIcon className='h-8 w-8 text-white'/>}
//                         title={"Incidents en attente"}
//                         data={totalIncidentPending}
//                         iconBg={"bg-orange-500"}
//                         onClick={() => navigate('/incidents?status=PENDING')}  // ← modifié
//                     />
//                     <Card 
//                         icon={<ExclamationTriangleIcon className='h-8 w-8 text-white'/>}
//                         title={"Incidents cloturé"}
//                         data={totalIncidentClosed}
//                         iconBg={"bg-secondary"}
//                         onClick={() => navigate('/incidents?status=CLOSED')}   // ← modifié
//                     />
//                     <Card 
//                         icon={<WrenchIcon className='h-8 w-8 text-white'/>}
//                         title={"Maintenances en attente"}
//                         data={totalMaintenancePending}
//                         iconBg={"bg-primary"}
//                         onClick={() => navigate('/incidents/maintenance?status=PENDING')}
//                     />
//                     <Card 
//                         icon={<WrenchIcon className='h-8 w-8 text-white'/>}
//                         title={"Maintenances cloturé"}
//                         data={totalMaintenanceClosed}
//                         iconBg={"bg-secondary"}
//                         onClick={() => navigate('/incidents/maintenance?status=CLOSED')}
//                     />
//                     <Card 
//                         icon={<TruckIcon className='h-8 w-8 text-white'/>}
//                         title={"Hors pont"}
//                         data={totalOffBridge}
//                         iconBg={"bg-yellow-500"}
//                         onClick={() => navigate('/incidents/off-bridge')}  // filtre selon le statut désiré
//                     />
//                 </div>
//             </div>

//             {/* Dialog pour les formulaires d'extraction */}
//             <Dialog open={isOpenned} onOpenChange={setIsOpenned}>
//                 <DialogContent>
//                     <DialogHeader>
//                         {dialogType === "INCIDENT" && "Extraction des incidents"}
//                         {dialogType === "MAINTENANCE" && "Extraction des maintenances"}
//                         {dialogType === "OFF_BRIDGE" && "Extraction des hors ponts"}
//                         {dialogType === "OPERATION_GE" && "Extraction des opération GE"}
//                     </DialogHeader>
                    
//                     {dialogType === "INCIDENT" && (
//                         <RapportIncidentForm onSubmit={()=>setIsOpenned(false)}/>
//                     )}
                    
//                     {dialogType === "MAINTENANCE" && (
//                         <RapportMaintenanceForm onSubmit={()=>setIsOpenned(false)}/>
//                     )}
                    
//                     {dialogType === "OFF_BRIDGE" && (
//                         <RapportOffBridgeForm onSubmit={()=>setIsOpenned(false)}/>
//                     )}
                    
//                     {dialogType === "OPERATION_GE" && (
//                         <RapportOffOperatioGeForm onSubmit={()=>setIsOpenned(false)}/>
//                     )}
                    
//                     <DialogFooter>{""}</DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Floating button pour mobile */}
//             <div className='md:hidden'>
//                 <FloatButton.Group
//                     open={openFloatBtn}
//                     trigger="click"
//                     style={{
//                         insetInlineEnd: 24,
//                     }}
//                     icon={<PlusIcon className='text-gray-500 h-4 w-4' />}
//                     onClick={()=>setOpenFloatBtn(!openFloatBtn)}
//                 >
//                     <FloatButton 
//                         onClick={()=>{
//                             setOpenFloatBtn(false);
//                             handleOpenDialog("INCIDENT");
//                         }}
//                         icon={<ExclamationTriangleIcon />}
//                     />
//                     <FloatButton 
//                         onClick={()=>{
//                             setOpenFloatBtn(false);
//                             handleOpenDialog("MAINTENANCE");
//                         }}
//                         icon={<Cog6ToothIcon />}
//                     />
//                     <FloatButton 
//                         onClick={()=>{
//                             setOpenFloatBtn(false);
//                             handleOpenDialog("OFF_BRIDGE");
//                         }}
//                         icon={<TruckIcon />}
//                     />
//                     <FloatButton 
//                         onClick={()=>{
//                             setOpenFloatBtn(false);
//                             handleOpenDialog("OPERATION_GE");
//                         }}
//                         icon={<BuildingOfficeIcon />}
//                     />
//                 </FloatButton.Group>
//             </div>
//         </>
//     );
// };

// export default Dashboard;

import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Tabs from '../../components/incidents/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';

import { 
    Cog6ToothIcon, 
    CursorArrowRaysIcon, 
    ExclamationTriangleIcon, 
    PlusIcon, 
    PrinterIcon, 
    TruckIcon,
    BuildingOfficeIcon // Import ajouté
} from '@heroicons/react/24/outline';
import ActionHeader from '../../components/incidents/Dashboard/ActionHeader';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "../../components/ui/dialog"
import RapportIncidentForm from '../../components/incidents/Dashboard/RapportIncidentForm';
import RapportMaintenanceForm from '../../components/incidents/Dashboard/RapportMaintenanceForm';
import RapportOffBridgeForm from '../../components/incidents/Dashboard/RapportOffBridgeForm';
import RapportOffOperatioGeForm from '../../components/incidents/Dashboard/RapportOffOperatioGeForm';
import RapportReportingCgForm from '../../components/incidents/Dashboard/RapportReportingCgForm';
import RapportWatchReportForm from '../../components/incidents/Dashboard/RapportWatchReportForm';

import { FloatButton } from 'antd';
import Card from '../../components/incidents/Dashboard/Card';
import { WrenchIcon } from 'lucide-react';

const Dashboard = () =>{
    const {handleFetch} = useFetch();
    const [incidents, setIncidents] = useState([]);
    const [incidentStats, setIncidentStats] = useState([]);
    const [maintenanceStats, setMaintenanceStats] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [openFloatBtn, setOpenFloatBtn] = useState(false);
    const [dialogType, setDialogType] = useState("");

    const [totalIncident, setTotalIncident] = useState(0);
    const [totalIncidentPending, setTotalIncidentPending] = useState(0);
    const [totalIncidentClosed, setTotalIncidentClosed] = useState(0);
    const [totalIncidentUnderMaintenance, setTotalIncidentUnderMaintenance] = useState(0);

    const [totalMaintenance, setTotalMaintenance] = useState(0);
    const [totalMaintenanceClosed, setTotalMaintenanceClosed] = useState(0);
    const [totalMaintenancePending, setTotalMaintenancePending] = useState(0);

    const [totalOffBridge, setTotalOffBridge] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);
    
    const navigate = useNavigate();

    const fetchIncidentsPending= async () => {
        let url = `${URLS.INCIDENT_API}/incidents?status=PENDING`;
        try {
            const response = await handleFetch(url);
            if(response.data){
                setTotalIncidentPending(response?.total);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchIncidentsClosed= async () => {
        let url = `${URLS.INCIDENT_API}/incidents?status=CLOSED`;
        try {
            const response = await handleFetch(url);
            if(response.data){
                setTotalIncidentClosed(response?.total);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchIncidentsInMaintenance= async () => {
        let url = `${URLS.INCIDENT_API}/incidents?status=UNDER_MAINTENANCE`;
        try {
            const response = await handleFetch(url);
            if(response.data){
                setTotalIncidentUnderMaintenance(response.data?.length);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchIncidents= async () => {
        let url = `${URLS.INCIDENT_API}/incidents`;
        try {
            const response = await handleFetch(url);
            if(response.data){
                setIncidents(response.data);
                setTotalIncident(response.total);
                setPage(response.page);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchMaintenancesPending= async () => {
        let url = `${URLS.INCIDENT_API}/maintenances?status=PENDING`;
        try {
            const response = await handleFetch(url);
            if(response.data){
                setTotalMaintenancePending(response.data?.length);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchMaintenances= async () => {
        let url = `${URLS.INCIDENT_API}/maintenances`;
        try {
            const response = await handleFetch(url);
            if(response.data){
                setTotalMaintenance(response.data?.length);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchMaintenancesClosed= async () => {
        let url = `${URLS.INCIDENT_API}/maintenances?status=CLOSED`;
        try {
            const response = await handleFetch(url);
            if(response.data){
                setTotalMaintenanceClosed(response.data?.length);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchStats= async () => {
        let url = `${URLS.INCIDENT_API}/incidents/stats`;
        try {
            const response = await handleFetch(url);
            if(response.status === 200){
                setIncidentStats(response?.byIncidentType);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchOffBridges= async () => {
        let url = `${URLS.INCIDENT_API}/off-bridges`;
        try {
            const response = await handleFetch(url);
            if(response.data){
                setTotalOffBridge(response.total);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenDialog=(dialog)=>{
        setDialogType(dialog);
        setIsOpenned(true);
    }

    useEffect(()=>{
        fetchIncidentsPending();
        fetchIncidentsClosed();
        fetchIncidentsInMaintenance();
        fetchIncidents();

        fetchMaintenancesPending();
        fetchMaintenancesClosed();
        fetchMaintenances();
        fetchStats();

        fetchOffBridges();
    }, []);

    return(
        <>
            <Header />
            <div className='px-6 space-y-2'>
                {/* Header */}
                <div className='overflow-x-auto'>
                    <Tabs />
                </div>
                
                {/* ActionHeader pour desktop */}
                <div className='p-2 hidden md:block'>
                    <ActionHeader 
                        onIncidentClick={()=>handleOpenDialog("INCIDENT")}
                        onMaintenanceClick={()=>handleOpenDialog("MAINTENANCE")}
                        onClickOffBridge={()=>handleOpenDialog("OFF_BRIDGE")}
                        onClickOperationGe={()=>handleOpenDialog("OPERATION_GE")}
                        onClickReportingCg={()=>handleOpenDialog("REPORTING_CG")}
                        onClickWatchReport={()=>handleOpenDialog("RAPPORT_DE_QUART")}
                    />
                </div>
                
                {/* Stats summary */}
                <div className='flex flex-col md:flex-row md:items-center md:gap-3 bg-white shadow p-2 py-4 rounded-lg mx-2'>
                    <p className='text-md'>Total incident: <span className='font-bold'>{totalIncident}</span></p>
                    <p className='text-md'>Total maintenance: <span className='font-bold'>{totalMaintenance}</span></p>
                    <p className='text-md'>Total hors pont: <span className='font-bold'>{totalOffBridge}</span></p>
                </div>
                
                {/* Cards */}
                <div className='p-2 py-[50px] flex flex-col md:flex-row items-center gap-6 md:gap-2'>
                    <Card 
                        icon={<ExclamationTriangleIcon className='h-8 w-8 text-white'/>}
                        title={"Incidents en attente"}
                        data={totalIncidentPending}
                        iconBg={"bg-orange-500"}
                        onClick={() => navigate('/incidents?status=PENDING')}  // ← modifié
                    />
                    <Card 
                        icon={<ExclamationTriangleIcon className='h-8 w-8 text-white'/>}
                        title={"Incidents cloturé"}
                        data={totalIncidentClosed}
                        iconBg={"bg-secondary"}
                        onClick={() => navigate('/incidents?status=CLOSED')}   // ← modifié
                    />
                    <Card 
                        icon={<WrenchIcon className='h-8 w-8 text-white'/>}
                        title={"Maintenances en attente"}
                        data={totalMaintenancePending}
                        iconBg={"bg-primary"}
                        onClick={() => navigate('/incidents/maintenance?status=PENDING')}
                    />
                    <Card 
                        icon={<WrenchIcon className='h-8 w-8 text-white'/>}
                        title={"Maintenances cloturé"}
                        data={totalMaintenanceClosed}
                        iconBg={"bg-secondary"}
                        onClick={() => navigate('/incidents/maintenance?status=CLOSED')}
                    />
                    <Card 
                        icon={<TruckIcon className='h-8 w-8 text-white'/>}
                        title={"Hors pont"}
                        data={totalOffBridge}
                        iconBg={"bg-yellow-500"}
                        onClick={() => navigate('/incidents/off-bridge')}  // filtre selon le statut désiré
                    />
                </div>
            </div>

            {/* Dialog pour les formulaires d'extraction */}
            <Dialog open={isOpenned} onOpenChange={setIsOpenned}>
                <DialogContent>
                    <DialogHeader>
                        {dialogType === "INCIDENT" && "Extraction des incidents"}
                        {dialogType === "MAINTENANCE" && "Extraction des maintenances"}
                        {dialogType === "OFF_BRIDGE" && "Extraction des hors ponts"}
                        {dialogType === "OPERATION_GE" && "Extraction des opération GE"}
                        {dialogType === "REPORTING_CG" && "Extraction des rapports CG"}
                        {dialogType === "RAPPORT_DE_QUART" && "Extraction des rapports de quart"}
                    </DialogHeader>
                    
                    {dialogType === "INCIDENT" && (
                        <RapportIncidentForm onSubmit={()=>setIsOpenned(false)}/>
                    )}
                    
                    {dialogType === "MAINTENANCE" && (
                        <RapportMaintenanceForm onSubmit={()=>setIsOpenned(false)}/>
                    )}
                    
                    {dialogType === "OFF_BRIDGE" && (
                        <RapportOffBridgeForm onSubmit={()=>setIsOpenned(false)}/>
                    )}
                    
                    {dialogType === "OPERATION_GE" && (
                        <RapportOffOperatioGeForm onSubmit={()=>setIsOpenned(false)}/>
                    )}
                    {dialogType === "REPORTING_CG" && (
                        <RapportReportingCgForm onSubmit={()=>setIsOpenned(false)}/>
                    )}
                    {dialogType === "RAPPORT_DE_QUART" && (
                        <RapportWatchReportForm onSubmit={()=>setIsOpenned(false)}/>
                    )}
                    
                    <DialogFooter>{""}</DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Floating button pour mobile */}
            <div className='md:hidden'>
                <FloatButton.Group
                    open={openFloatBtn}
                    trigger="click"
                    style={{
                        insetInlineEnd: 24,
                    }}
                    icon={<PlusIcon className='text-gray-500 h-4 w-4' />}
                    onClick={()=>setOpenFloatBtn(!openFloatBtn)}
                >
                    <FloatButton 
                        onClick={()=>{
                            setOpenFloatBtn(false);
                            handleOpenDialog("INCIDENT");
                        }}
                        icon={<ExclamationTriangleIcon />}
                    />
                    <FloatButton 
                        onClick={()=>{
                            setOpenFloatBtn(false);
                            handleOpenDialog("MAINTENANCE");
                        }}
                        icon={<Cog6ToothIcon />}
                    />
                    <FloatButton 
                        onClick={()=>{
                            setOpenFloatBtn(false);
                            handleOpenDialog("OFF_BRIDGE");
                        }}
                        icon={<TruckIcon />}
                    />
                    <FloatButton 
                        onClick={()=>{
                            setOpenFloatBtn(false);
                            handleOpenDialog("OPERATION_GE");
                        }}
                        icon={<BuildingOfficeIcon />}
                    />
                    <FloatButton 
                        onClick={()=>{
                            setOpenFloatBtn(false);
                            handleOpenDialog("REPORTING_CG");
                        }}
                        icon={<BuildingOfficeIcon />}
                    />
                    <FloatButton 
                        onClick={()=>{
                            setOpenFloatBtn(false);
                            handleOpenDialog("REPtWatchReportORTING_CG");
                        }}
                        icon={<BuildingOfficeIcon />}
                    />
                </FloatButton.Group>
            </div>
        </>
    );
};

export default Dashboard;