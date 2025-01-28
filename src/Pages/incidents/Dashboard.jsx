import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Tabs from '../../components/incidents/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Card from '../../components/incidents/Dashboard/Card';
import { Cog8ToothIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ActionHeader from '../../components/incidents/Dashboard/ActionHeader';
const Dashboard = () =>{
    const {handleFetch} = useFetch();
    const [incidents, setIncidents] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);


    const fetchIncidents= async () => {
        let url = `${URLS.INCIDENT_API}/incidents`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            setIncidents(response.data);
            setTotalPages(response.totalPages);
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

    useEffect(()=>{
        fetchIncidents();
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
                    <ActionHeader />
                </div>
                <div className='p-2 py-[50px] flex items-center space-x-2'>
                    <Card 
                        icon={<ExclamationTriangleIcon  className='h-8 w-8 text-white'/>}
                        title={"Incidents"}
                        data={"2000"}
                        iconBg={"bg-red-500"}
                    />
                    <Card 
                        icon={<Cog8ToothIcon  className='h-8 w-8 text-white'/>}
                        title={"Maintenances"}
                        data={"2000"}
                        iconBg={"bg-blue-500"}
                    />
                </div>
            </div>
        </>
    )
}

export default Dashboard;