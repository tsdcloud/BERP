import React, {useEffect, useState} from 'react'
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Button } from '../../ui/button';
import { useForm } from 'react-hook-form';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DDThh:mm:ssZ';



const RapportIncidentForm = ({onSubmit}) => {

    const {setValue, handleSubmit} = useForm();
    const {handleFetch, handlePost} = useFetch();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");

    const handleStartDate = (date) =>{
        const formattedDate = date.format(dateFormat);
        setValue("startDate", formattedDate);
        setError("");
    }
    const handleEndDate = (date) =>{
        const formattedDate = date.format(dateFormat);
        setValue("endDate",formattedDate);
        setError("");
    }

    const generateReport=async(data)=>{
        setError("");
        if(!data.startDate || !data.endDate){
            setError("Remplir tous les champs");
            return;
        }

        let {startDate, endDate} = data;
        let url =`${URLS.INCIDENT_API}/incidents/file?start=${startDate}&end=${endDate}`;
        try {
            let response = await fetch(url);
            if(response.status === 200){
                const result = await response.json();
                console.log(result)
                const link = document.getElementById('download');
                link.href = result?.downloadLink;
                link.download = "incidents_report.xlsx";
                link.click();
                onSubmit()
                return;
            }
            setError("Echec du telechargement du rapport")
            
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <form className="space-y-2" onSubmit={handleSubmit(generateReport)}>
        <div className='flex items-center space-x-2 w-full'>
            <div className='flex flex-col w-1/2'>
                <label htmlFor="">Du <span className='text-xs text-red-500'>*</span></label>
                <DatePicker 
                    onChange={handleStartDate} 
                    maxDate={dayjs()}
                    className='p-2'
                    placement={"topLeft"}
                />
            </div>
            <div className='flex flex-col w-1/2'>
                <label htmlFor="" className=''>Au <span className='text-xs text-red-500'>*</span></label>
                <DatePicker 
                    onChange={handleEndDate} 
                    minDate={dayjs()}
                    className='p-2'
                    placement={"topLeft"}
                />
            </div>
        </div>
        <p className='text-xs text-red-500'>{error}</p>
        <div className='flex justify-end'>
            <Button className='rounded-lg bg-primary text-white'>Generer</Button>
        </div>
    </form>
  )
}

export default RapportIncidentForm