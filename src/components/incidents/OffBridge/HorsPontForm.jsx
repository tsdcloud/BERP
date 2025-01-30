import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { DECLARATION_TYPES, OPERATIONS, SITE_TYPE } from '../../../utils/constant.utils';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import AutoComplete from '../../common/AutoComplete';


const HorsPontForm = ({onSucess}) =>{
    // Hooks
    const {handleSubmit, formState:{errors}, register, setValue, getValues} = useForm();
    const {handleFetch, handlePost} = useFetch();

    // States
    const [declarationType, setDeclarationType] = useState("")
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [sites, setSites] = useState([]);


    // Handles
    const fetchIncidentCauses = async(url)=>{
        try {
            let response = await handleFetch(url);
            if(response?.status === 200){
                setIncidentCauses(response?.data)
            }
        } catch (error) {
            console.error(error);
        }
    }
    const fetchSites = async(url)=>{
        try {
            let response = await handleFetch(url);
            if(response?.status === 200){
                setSites(response?.data)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmitForm=async(data)=>{
        let url = `${URLS.INCIDENT_API}/off-bridges`
        try {
            data.createdBy= "878c6bae-b754-4577-b614-69e15821dac8";
            let response = await handlePost(url, data);
            if(response.status === 201){
                onSucess();
                return
            }
            alert("Echec de creation du hors pont");
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(()=>{
        fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
        fetchSites(`${URLS.ENTITY_API}/sites?typeSite=${SITE_TYPE.FIELD}`);
    },[]);

    return(
        <form onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col space-y-2'>
            <div className='overflow-y-scroll max-h-[300px] space-y-3'>
                <div className='flex items-center space-x-2 w-full px-2'>
                    <div className='w-full'>
                        <label htmlFor="operation" className='text-sm font-semibold'>Type d'operation <span className='text-red-500'>*</span></label>
                        <select id="operation" className='w-full border p-2 rounded-lg text-sm' {...register("operation", {required:"Ce champ est requis"})}>
                            <option value="">Choisir l'operation *</option>
                            {
                                OPERATIONS.map((operation, index)=><option value={operation.value} key={index}>{operation.name}</option>)
                            }
                        </select>
                        {errors.operation && <small className='text-xs text-red-500'>{errors.operation.message}</small>}
                    </div>
                    <div className='w-full'>
                        <label htmlFor="declaration-type" className='text-sm font-semibold' >Type de declaration <span className='text-red-500'>*</span></label>
                        <select id='declaration-type' className='w-full border p-2 rounded-lg text-sm' {...register("declarationType", {required:"Ce champ est requis"})}>
                            <option value="">Choisir le type de declaration *</option>
                            {
                                DECLARATION_TYPES.map((operation, index)=><option value={operation.value} key={index}>{operation.name}</option>)
                            }
                        </select>
                        {errors.declarationType && <small className='text-xs text-red-500'>{errors.declarationType.message}</small>}
                    </div>
                </div>
                <div className='w-full'>
                    <label htmlFor="incidentCausesid" className='text-sm font-semibold px-2'>Cause de l'incident <span className='text-red-500'>*</span></label>
                    <AutoComplete 
                        dataList={incidentCauses}
                        onSearch={(value)=>fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?search=${value}`)}
                        onSelect={(value)=>{
                            if(value){
                                setValue("incidentCauseId", value?.id)
                            }else{
                                setValue("incidentCauseId",null)
                            }
                        }}
                        register={{...register("incidentCauseId", {required:"Ce champ est requis"})}}
                        validation={{required:"Ce champs est requis"}}
                        placeholder="Cause de l'incident"
                        name={"incidentCauseId"}
                        errorMessage={errors.incidentCauseId && <small className='text-red-500 px-2 text-xs'>{errors.incidentCauseId.message}</small>}
                    />
                    
                </div>
                <div className='w-full'>
                    <label htmlFor="incidentCausesid" className='text-sm font-semibold px-2'>Choisir le site <span className='text-red-500'>*</span></label>
                    <AutoComplete 
                        dataList={sites}
                        onSearch={(value)=>fetchIncidentCauses(`${URLS.ENTITY_API}/sites?search=${value}`)}
                        onSelect={(value)=>{
                            if(value){
                                setValue("siteId", value?.id)
                            }else{
                                setValue("siteId",null)
                            }
                        }}
                        register={{...register("incidentCauseId", {required:"Ce champ est requis"})}}
                        validation={{required:"Ce champs est requis"}}
                        placeholder="Sites"
                        name={"siteId"}
                        errorMessage={errors.incidentCauseId && <small className='text-red-500 px-2 text-xs'>{errors.incidentCauseId.message}</small>}
                    />
                    
                </div>
                <div className='flex flex-col w-full px-2'>
                    <label htmlFor="" className='text-sm font-semibold'>Tier <span className='text-red-500'>*</span></label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("tier", {required:"Ce champ est requis"})}/>
                    {errors.tier && <small className='text-xs text-red-500'>{errors.tier.message}</small>}
                </div>
                {
                    getValues(["declarationType"]) === "CONTAINER" &&
                    <>
                        <div className='flex flex-col w-full px-2'>
                            <label htmlFor="" className='text-sm font-semibold'>Conteneur 1 <span className='text-red-500'>*</span>:</label>
                            <input type="text" className='border rounded-lg p-2 text-sm' {...register("container1", {required:"Ce champ est requis"})}/>
                            {errors.container1 && <small className='text-xs text-red-500'>{errors.container1.message}</small>}
                        </div>
                        <div className='flex flex-col w-full px-2'>
                            <label htmlFor="" className='text-sm font-semibold'>Conteneur 2 :</label>
                            <input type="text" className='border rounded-lg p-2 text-sm' {...register("container2")}/>
                            {errors.container2 && <small className='text-xs text-red-500'>{errors.container2.message}</small>}
                        </div> 
                    </>
                }               
                <div className='flex flex-col w-full px-2'>
                    <label htmlFor="" className='text-sm font-semibold'>Plomb 1 <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("plomb1", {required:"Ce champ est requis"})}/>
                    {errors.plomb1 && <small className='text-xs text-red-500'>{errors.plomb1.message}</small>}
                </div>
                <div className='flex flex-col w-full px-2'>
                    <label htmlFor="" className='text-sm font-semibold'>Plomb 2 :</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("plomb2")}/>
                    {errors.plomb2 && <small className='text-xs text-red-500'>{errors.plomb2.message}</small>}
                </div>
                <div className='flex flex-col w-full px-2'>
                    <label htmlFor="" className='text-sm font-semibold'>Chargeur <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("loader", {required:"Ce champ est requis"})}/>
                    {errors.loader && <small className='text-xs text-red-500'>{errors.loader.message}</small>}
                </div>
                <div className='flex flex-col w-full px-2'>
                    <label htmlFor="" className='text-sm font-semibold'>Produit <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("product", {required:"Ce champ est requis"})}/>
                    {errors.product && <small className='text-xs text-red-500'>{errors.product.message}</small>}
                </div>
                <div className='flex flex-col w-full px-2'>
                    <label htmlFor="" className='text-sm font-semibold'>Transporteur <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("transporter", {required:"Ce champ est requis"})}/>
                    {errors.transporter && <small className='text-xs text-red-500'>{errors.transporter.message}</small>}
                </div>
                <div className='flex flex-col w-full px-2'>
                    <label htmlFor="" className='text-sm font-semibold'>Vehicule <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("vehicle", {required:"Ce champ est requis"})}/>
                    {errors.vehicle && <small className='text-xs text-red-500'>{errors.vehicle.message}</small>}
                </div>
                <div className='flex flex-col w-full px-2'>
                    <label htmlFor="" className='text-sm font-semibold'>Chauffeur <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("driver", {required:"Ce champ est requis"})}/>
                    {errors.driver && <small className='text-xs text-red-500'>{errors.driver.message}</small>}
                </div>
                <div className='flex flex-col w-full px-2'>
                    <label htmlFor="" className='text-sm font-semibold'>Remorque <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("trailer", {required:"Ce champ est requis"})}/>
                    {errors.trailer && <small className='text-xs text-red-500'>{errors.trailer.message}</small>}
                </div>
            </div>

            <div className='flex justify-end'>
                <Button className='p-2 rounded-lg bg-primary text-sm text-white'>Créer hors pont</Button>
            </div>
        </form>
    )
}


export default HorsPontForm;