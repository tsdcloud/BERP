import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Tabs from '../../components/incidents/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Card from '../../components/incidents/Dashboard/Card';
import { Cog8ToothIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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




const Dashboard = () =>{
    const {handleFetch} = useFetch();
    const [incidents, setIncidents] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [totalIncident, setTotalIncident] = useState(0);
    const [totalMaintenance, setTotalMaintenance] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);

    const navigate = useNavigate();

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
            console.log(error)
        }
    }

    const fetchMaintenances= async () => {
        let url = `${URLS.INCIDENT_API}/maintenances`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            setIncidents(response.data);
            setTotalMaintenance(response.total);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit=()=>{
        fetchIncidents();
        document.getElementById("close-dialog").click();
    }

    const handleOpenDialog=(dialog)=>{
        setDialogType(dialog);
        setIsOpenned(true);
    }

    useEffect(()=>{
        fetchIncidents();
        fetchMaintenances();
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
                <div className='p-2'>
                    <ActionHeader 
                        onIncidentClick={()=>handleOpenDialog("INCIDENT")}
                        onMaintenanceClick={()=>handleOpenDialog("MAINTENANCE")}
                    />
                </div>
                <div className='p-2 py-[50px] flex items-center space-x-2'>
                    <Card 
                        icon={<ExclamationTriangleIcon  className='h-8 w-8 text-white'/>}
                        title={"Incidents"}
                        data={totalIncident}
                        iconBg={"bg-red-500"}
                        onClick={()=>navigate("/incidents")}
                    />
                    <Card 
                        icon={<Cog8ToothIcon  className='h-8 w-8 text-white'/>}
                        title={"Maintenances"}
                        data={totalMaintenance}
                        iconBg={"bg-blue-500"}
                        onClick={()=>navigate("/incidents/maintenance")}
                    />
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={isOpenned} onOpenChange={setIsOpenned}>
                <DialogContent>
                    <DialogHeader>{dialogType === "INCIDENT"?"Generer rapport incident":"Generer rapport maintenance"}</DialogHeader>
                    {
                        dialogType === "INCIDENT" &&
                        <RapportIncidentForm onSubmit={()=>setIsOpenned(false)}/>
                    }
                    {
                        dialogType === "MAINTENANCE" &&
                        <RapportMaintenanceForm onSubmit={()=>setIsOpenned(false)}/>
                    }
                    <DialogFooter>{""}</DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Dashboard