import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import AutoComplete from '../common/AutoComplete';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';
import Preloader from '../Preloader';

const CloseIncidentForm = ({isOpen, setIsOpen, fetchData, selectedRow}) => {

    const {register, handleSubmit, formState:{errors}, setValue} = useForm();
    const {handleFetch} = useFetch();

    const [employees, setEmployees] = useState([]);
    const [entities, setEntities] = useState([]);
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [isSubmiting, setIsSubmiting] = useState(false);

    const handleEmployees = async (url) =>{
        try {
            let response = await handleFetch(url);
            if(response.error){

            }
            let result = response?.data;
            let formattedData = result.map(employee=>{
                return {
                    name:  employee?.name,
                    value: employee?.id
                }
            });
            setEmployees(formattedData);
        } catch (error) {
            console.log(error);
        }
    }

    const handleEntities = async (url) =>{
        try {
            let response = await handleFetch(url);
            if(response.error){

            }
            let result = response?.data;
            let formattedData = result.map(entity=>{
                return {
                    name:  entity?.name,
                    value: entity?.id
                }
            });
            setEntities(formattedData);
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleIncidentCauses = async (url) =>{
        try {
            let response = await handleFetch(url);
            if(response.error){

            }
            let result = response?.data;
            let formattedData = result.map(entity=>{
                return {
                    name:  entity?.name,
                    value: entity?.id
                }
            });
            setIncidentCauses(formattedData);
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmit = async (data) =>{
        setIsSubmiting(true);
        data.status = "CLOSED";
        try {
            let url = `${URLS.INCIDENT_API}/incidents/${selectedRow.id}`;
            let response = await fetch(url, {
                method:"PATCH",
                headers:{
                "Content-Type":"application/json",
                'authorization': `Bearer ${localStorage.getItem('token')}` || ''
                },
                body:JSON.stringify(data)
            });
            if(response.status === 200){
                fetchData();
                setIsOpen(false);
            }
        } catch (error) {
            console.error(error);
            setErrorMap("");
        }finally{
            setIsSubmiting(false);
        }
    }
    
    useEffect(()=>{
        handleEmployees(`${URLS.ENTITY_API}/employees`);
        handleEntities(`${URLS.ENTITY_API}/suppliers`);
        handleIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
    },[])

  return ( 
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader>{"Choisir l'intervenant"}</DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mx-2'>
                    <label htmlFor="" className='font-semibold text-sm'>Choisir l'intervenant</label>
                    <AutoComplete 
                        dataList={[...employees, ...entities]}
                        placeholder="Choisir l'intervenant"
                        register={{...register("technician")}}
                        onSearch={(input)=>{
                            handleEmployees(`${URLS.ENTITY_API}/employees?search=${input}`);
                            handleEntities(`${URLS.ENTITY_API}/suppliers?search=${input}`);
                        }}
                        onSelect={(value)=>{
                            if(value){
                                setValue("technician", value?.value);
                            }else{
                                setValue("technician",null);
                            }
                        }}
                        errorMessage={<p className='text-sm text-red-500'>{errors.causeId && errors.causeId?.message}</p>}
                        error={errors.technician}
                    />
                </div>
                <div className='mx-2'>
                    <label htmlFor="" className='font-semibold text-sm'>Choisir la cause:</label>
                    <AutoComplete 
                        dataList={[...incidentCauses]}
                        placeholder="Choisir la cause"
                        register={{...register("incidentCauseId")}}
                        onSearch={(input)=>{
                            handleIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?search=${input}`);
                        }}
                        onSelect={(value)=>{
                            if(value){
                                setValue("incidentCauseId", value?.value);
                            }else{
                                setValue("incidentCauseId",null);
                            }
                        }}
                        errorMessage={<p className='text-sm text-red-500'>{errors.incidentCauseId && errors.incidentCauseId?.message}</p>}
                        error={errors.incidentCauseId}
                    />
                </div>
                <div className='flex justify-end'>
                    <Button disabled={isSubmiting} className={`text-sm text-white font-semibold hover:bg-secondary ${isSubmiting ?"bg-blue-500 cursor-not-allowed": "bg-primary"}`}>
                        {isSubmiting ? <Preloader size={20}/> : <CheckCircle />}
                        <span>{isSubmiting ? "Clôture encours..." : "Clôturer l'incident"}</span>
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CloseIncidentForm