import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Tabs from '../../components/incidents/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Card from '../../components/incidents/Dashboard/Card';
import { Cog6ToothIcon, Cog8ToothIcon, ExclamationTriangleIcon, PauseIcon, PlusIcon, TruckIcon, WrenchIcon } from '@heroicons/react/24/outline';
import ActionHeader from '../../components/incidents/Dashboard/ActionHeader';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../components/ui/dialog"
import RapportIncidentForm from '../../components/incidents/Dashboard/RapportIncidentForm';
import RapportMaintenanceForm from '../../components/incidents/Dashboard/RapportMaintenanceForm';
import RapportOffBridgeForm from '../../components/incidents/Dashboard/RapportOffBridgeForm';
import { FloatButton } from 'antd';




const Dashboard = () =>{
    const {handleFetch} = useFetch();
    const [incidents, setIncidents] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [openFloatBtn, setOpenFloatBtn] = useState(false);
    const [dialogType, setDialogType] = useState("");

    const [totalIncident, setTotalIncident] = useState(0);
    const [totalIncidentPending, setTotalIncidentPending] = useState(0);
    const [totalIncidentClosed, setTotalIncidentClosed] = useState(0);

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
           console.log(response);
           if(response.data){
            setTotalIncidentPending(response.data?.length);
           }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchIncidentsClosed= async () => {
        let url = `${URLS.INCIDENT_API}/incidents?status=CLOSED`;
        try {
           const response = await handleFetch(url);
           console.log(response);
           if(response.data){
            setTotalIncidentClosed(response.data?.length);
           }
        } catch (error) {
            console.log(error)
        }
    }
    
    const fetchIncidents= async () => {
        let url = `${URLS.INCIDENT_API}/incidents`;
        try {
           const response = await handleFetch(url);
           console.log(response)
           if(response.data){
            setIncidents(response.data);
            setTotalIncident(response.total);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
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
            console.log(error)
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
            console.log(error)
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
            console.log(error)
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
            console.log(error)
        }
    }

    const handleSubmit=()=>{
        fetchIncidentsPending();
        document.getElementById("close-dialog").click();
    }

    const handleOpenDialog=(dialog)=>{
        setDialogType(dialog);
        setIsOpenned(true);
    }

    useEffect(()=>{
        fetchIncidentsPending();
        fetchIncidentsClosed();
        fetchIncidents();

        fetchMaintenancesPending();
        fetchMaintenancesClosed();
        fetchMaintenances();

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
                {/* Dialog */}
                <div className='p-2 hidden md:block'>
                    <ActionHeader 
                        onIncidentClick={()=>handleOpenDialog("INCIDENT")}
                        onMaintenanceClick={()=>handleOpenDialog("MAINTENANCE")}
                        onClickOffBridge={()=>handleOpenDialog("OFF_BRIDGE")}
                    />
                </div>
                <div className='flex flex-col md:flex-row md:items-center md:gap-3 bg-white shadow p-2 py-4 rounded-lg mx-2'>
                    <p className='text-md'>Total incident: <span className='font-bold'>{totalIncident}</span></p>
                    <p className='text-md'>Total maintenance: <span className='font-bold'>{totalMaintenance}</span></p>
                    <p className='text-md'>Total hors pont: <span className='font-bold'>{totalOffBridge}</span></p>
                </div>
                <div className='p-2 py-[50px] flex flex-col md:flex-row  items-center gap-6 md:gap-2'>
                    <Card 
                        icon={<ExclamationTriangleIcon  className='h-8 w-8 text-white'/>}
                        title={"Incidents en attente"}
                        data={totalIncidentPending}
                        iconBg={"bg-orange-500"}
                        onClick={()=>navigate("/incidents")}
                    />
                    <Card 
                        icon={<ExclamationTriangleIcon  className='h-8 w-8 text-white'/>}
                        title={"Incidents cloturé"}
                        data={totalIncidentClosed}
                        iconBg={"bg-orange-500"}
                        onClick={()=>navigate("/incidents")}
                    />
                    <Card 
                        icon={<WrenchIcon  className='h-8 w-8 text-white'/>}
                        title={"Maintenances en attente"}
                        data={totalMaintenancePending}
                        iconBg={"bg-primary"}
                        onClick={()=>navigate("/incidents/maintenance")}
                    />
                    <Card 
                        icon={<WrenchIcon  className='h-8 w-8 text-white'/>}
                        title={"Maintenances cloturé"}
                        data={totalMaintenanceClosed}
                        iconBg={"bg-primary"}
                        onClick={()=>navigate("/incidents/maintenance")}
                    />
                    <Card 
                        icon={<TruckIcon  className='h-8 w-8 text-white'/>}
                        title={"Hors pont"}
                        data={totalOffBridge}
                        iconBg={"bg-yellow-500"}
                        onClick={()=>navigate("/incidents/off-bridge")}
                    />
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={isOpenned} onOpenChange={setIsOpenned}>
                <DialogContent>
                    <DialogHeader>{dialogType === "INCIDENT" && "Generer rapport incident" || 
                                 dialogType === "MAINTENANCE" &&"Generer rapport maintenance"||
                                 dialogType === "OFF_BRIDGE"&& "Generer rapport hors pont"}</DialogHeader>
                    {
                        dialogType === "INCIDENT" &&
                        <RapportIncidentForm onSubmit={()=>setIsOpenned(false)}/>
                    }
                    {
                        dialogType === "MAINTENANCE" &&
                        <RapportMaintenanceForm onSubmit={()=>setIsOpenned(false)}/>
                    }
                    {
                        dialogType === "OFF_BRIDGE" &&
                        <RapportOffBridgeForm onSubmit={()=>setIsOpenned(false)}/>
                    }
                    <DialogFooter>{""}</DialogFooter>
                </DialogContent>
            </Dialog>

            {/* floating button */}
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
                </FloatButton.Group>
            </div>
        </>
    )
}

export default Dashboard