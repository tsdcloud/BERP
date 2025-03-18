import React, {useState, useEffect, useRef} from 'react';
import { useFetch } from '../../../hooks/useFetch';
import { Dialog, DialogContent, DialogHeader } from '../../ui/dialog';
import { useForm } from 'react-hook-form';
import AutoComplete from '../../common/AutoComplete';
import { URLS } from '../../../../configUrl';
import { Button } from '../../ui/button';
import { INCIDENT_STATUS } from '../../../utils/constant.utils';

const CloseMaintenanceForm = ({isOpen, setIsOpen, selectedMaintenance, onSubmit}) => {
    
    const {handleSubmit, register, formState:{errors, isSubmitting}, setValue} = useForm({
        defaultValues:{
            incidentCauseId:'',
            supplierId:''
        }
    });
    const {handleFetch} = useFetch();
    const [type, setType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [incidentCauses, setIncidentCauses] = useState([]);
    const typeRef = useRef();

    const handleFetchSuppliers=async(link)=>{
        try {
            let response = await handleFetch(link);     
            if(response?.status === 200){
                let formatedData = response?.data.map(item=>{
                return {
                    name:item?.name,
                    value: item?.id
                }
                });
                setSuppliers(formatedData);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleFetchEmployees=async(link)=>{
        try {
            let response = await handleFetch(link);     
            if(response?.status === 200){
                let formatedData = response?.data.map(item=>{
                return {
                    name:item?.name,
                    value: item?.id
                }
                });
                setEmployees(formatedData);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleFetchIncidentCauses=async(link)=>{
        try {
            let response = await handleFetch(link);     
            if(response?.status === 200){
                let formatedData = response?.data.map(item=>{
                return {
                    name:item?.name,
                    value: item?.id
                }
                });
                setIncidentCauses(formatedData);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const closeMaintenance=async(data)=>{
        data.incidentId = selectedMaintenance?.incidentId
        setIsLoading(true);
        let {type, ...others} = data
        let url = `${URLS.INCIDENT_API}/maintenances/${selectedMaintenance?.id}/close`;
        let resquestOPtions = {
            method :"PATCH",
            headers: {
                'Content-Type':'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(others)
        }

        try {
            let response = await fetch(url, resquestOPtions);
            if(!response.error){
                onSubmit();
                setIsOpen(false);
                return;
            }
            console.log(response);
        } catch (error) {
            alert('Echec de la cloture de la maintenance.');
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        // typeRef.current.focus;
        handleFetchEmployees(`${URLS.ENTITY_API}/employees`);
        handleFetchSuppliers(`${URLS.ENTITY_API}/suppliers`);
        handleFetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
    }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader>{"Cloturer la maintenance"}</DialogHeader>
            <form onSubmit={handleSubmit(closeMaintenance)} className='space-y-4'>
                <div className='flex flex-col'>
                    <label htmlFor="" className='font-bold text-sm mx-2'>Cause d'incident <span className='text-red-500'>*</span></label>
                    <AutoComplete 
                        placeholder={"Choisir la cause incident"}
                        dataList={incidentCauses}
                        register={{...register('incidentCauseId', {required:'Ce champs est requis'})}}
                        onSearch={(input)=>{
                            handleFetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?search=${input}`);
                        }}
                        onSelect={(value)=>{
                            if(value){
                                setValue("incidentCauseId", value?.value);
                            }else{
                                setValue("incidentCauseId",null);
                            }
                        }}
                        errorMessage={<p className='text-sm text-red-500'>{errors.causeId && errors.causeId?.message}</p>}
                    />
                </div>
                <div className='flex flex-col mx-2'>
                    <label htmlFor="" className='text-sm font-bold'>Type d'intervenant <span className='text-red-500'>*</span></label>
                    <select name="" id="" className='p-2 rounded-lg border' ref={typeRef} value={type} onChange={(e)=>setType(e.target.value)}>
                        {/* <option value="">Choisir le type d'intervenant</option> */}
                        <option value="EMPLOYEE">Employé</option>
                        <option value="SUPPLIER">Prestataire</option>
                    </select>
                    {errors.type && <small className='text-sm text-red-500'>{errors.type?.message}</small>}
                </div>
                <div className='flex flex-col'>
                    {
                        type !== "" &&
                        <div className='flex flex-col'>
                            <label htmlFor="" className='font-bold text-sm mx-2'>{type === "SUPPLIER" ? "Choisir le prestataire" : "Choisir l'employé"} <span className='text-red-500'>*</span></label>
                            <AutoComplete 
                                placeholder={type==="SUPPLIER" ? "Choisir le prestataire":"Choisir l'employé"}
                                dataList={type==="SUPPLIER" ? suppliers : employees}
                                register={{...register('supplierId', {required:'Ce champs est requis'})}}
                                onSearch={(input)=>{
                                    type === "SUPPLIER"?
                                    handleFetchSuppliers(`${URLS.ENTITY_API}/suppliers?search=${input}`):
                                    handleFetchEmployees(`${URLS.ENTITY_API}/employees?search=${input}`)
                                }}
                                onSelect={(value)=>{
                                    if(value){
                                        setValue("supplierId", value?.value);
                                    }else{
                                        setValue("supplierId",null);
                                    }
                                }}
                                errorMessage={<p className='text-sm text-red-500'>{errors.supplierId && errors.supplierId?.message}</p>}
                            />
                        </div>
                    }
                </div>
                <div className='flex justify-end'>
                    <button className={`text-white ${isLoading ? 'bg-blue-300 cursor-not-allowed':''} p-2 rounded-lg bg-primary text-sm flex items-center gap-2`} disabled={isLoading}>
                        
                        {isLoading ? 'Encours...' : 'Cloturer la maintenance'}
                    </button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CloseMaintenanceForm