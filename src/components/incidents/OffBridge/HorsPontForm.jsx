// import React, {useState, useEffect} from 'react';
// import {useForm} from 'react-hook-form';
// import { useFetch } from '../../../hooks/useFetch';
// import { DECLARATION_TYPES, OPERATIONS, SITE_TYPE, FACTURATION_TYPES } from '../../../utils/constant.utils';
// import { Button } from '../../ui/button';
// import { URLS } from '../../../../configUrl';
// import AutoComplete from '../../common/AutoComplete';


// const HorsPontForm = ({onSucess}) =>{
//     // Hooks
//     const {handleSubmit, formState:{errors}, register, setValue, getValues, watch} = useForm();
//     const {handleFetch, handlePost} = useFetch();

//     // States
//     // const [declarationType, setDeclarationType] = useState("")
//     const [incidentCauses, setIncidentCauses] = useState([]);
//     const [sites, setSites] = useState([]);
//     const [suppliers, setSuppliers] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const [isLoadingCauses, setIsLoadingCauses] = useState(true)

//     const declarationType = watch("declarationType");
//     const paymentMode = watch("paymentMode");

//     // Handles
//     const fetchIncidentCauses = async(url)=>{
//         try {
//             let response = await handleFetch(url);
//             if(response?.status === 200){
//                 setIncidentCauses(response?.data)
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }
//     const fetchSites = async(url)=>{
//         try {
//             let response = await handleFetch(url);
//             if(response?.status === 200){
//                 setSites(response?.data)
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }
//     const fetchSuppliers = async(url)=>{
//         try {
//             let response = await handleFetch(url);
//             if(response?.status === 200){
//                 setSuppliers(response?.data)
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }
//     const fetchProducts = async(url)=>{
//         try {
//             let response = await handleFetch(url);
//             if(response?.status === 200){
//                 setProducts(response?.data)
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     const handleSubmitForm=async(data)=>{
//         let url = `${URLS.INCIDENT_API}/off-bridges`;
//         setIsLoading(true);
//         try {
//             let response = await handlePost(url, data);
//             if(response.status === 201){
//                 onSucess();
//                 return
//             }
//             alert("Echec de creation du hors pont");
//         } catch (error) {
//             console.error(error)
//             toast.error("Erreur lors de la déclaration de l'incident");
//         }finally{
//             setIsLoading(false)
//         }
//     }


//     useEffect(()=>{
//         fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
//         fetchSites(`${URLS.ENTITY_API}/sites?typeSite=${SITE_TYPE.FIELD}`);
//         fetchSuppliers(`${URLS.ENTITY_API}/suppliers`);
//         fetchProducts(`${URLS.ENTITY_API}/articles`);
//     },[]);

//     return(
//         <form onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col space-y-2'>
//             <div className='overflow-y-scroll max-h-[300px] space-y-3'>
//                 <div className='flex items-center space-x-2 w-full px-2'>
//                     <div className='w-full'>
//                         <label htmlFor="operation" className='text-sm font-semibold'>Type d'operation <span className='text-red-500'>*</span></label>
//                         <select id="operation" className='w-full border p-2 rounded-lg text-sm' {...register("operation", {required:"Ce champ est requis"})}>
//                             <option value="">Choisir l'operation *</option>
//                             {
//                                 OPERATIONS.map((operation, index)=><option value={operation.value} key={index}>{operation.name}</option>)
//                             }
//                         </select>
//                         {errors.operation && <small className='text-xs text-red-500'>{errors.operation.message}</small>}
//                     </div>
//                     <div className='w-full'>
//                         <label htmlFor="declaration-type" className='text-sm font-semibold' >Type de declaration <span className='text-red-500'>*</span></label>
//                         <select id='declaration-type' className='w-full border p-2 rounded-lg text-sm' {...register("declarationType", {required:"Ce champ est requis"})}>
//                             <option value="">Choisir le type de declaration *</option>
//                             {
//                                 DECLARATION_TYPES.map((operation, index)=><option value={operation.value} key={index}>{operation.name}</option>)
//                             }
//                         </select>
//                         {errors.declarationType && <small className='text-xs text-red-500'>{errors.declarationType.message}</small>}
//                     </div>
//                     <div className='w-full'>
//                         <label htmlFor="declaration-type" className='text-sm font-semibold' >Type de facturation <span className='text-red-500'>*</span></label>
//                         <select id='declaration-type' className='w-full border p-2 rounded-lg text-sm' {...register("paymentMode", {required:"Ce champ est requis"})}>
//                             <option value="">Choisir le type de facturation *</option>
//                             {
//                                 FACTURATION_TYPES.map((operation, index)=><option value={operation.value} key={index}>{operation.name}</option>)
//                             }
//                         </select>
//                         {errors.paymentMode && <small className='text-xs text-red-500'>{errors.paymentMode.message}</small>}
//                     </div>
//                 </div>
//                 <div className='w-full'>
//                     <label htmlFor="incidentCausesid" className='text-sm font-semibold px-2'>Cause de l'incident <span className='text-red-500'>*</span></label>
//                     <AutoComplete 
//                         dataList={incidentCauses}
//                         isLoading={false}
//                         onSearch={(value)=>fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?search=${value}`)}
//                         onSelect={(value)=>{
//                             if(value){
//                                 setValue("incidentCauseId", value?.id)
//                             }else{
//                                 setValue("incidentCauseId",null)
//                             }
//                         }}
//                         register={{...register("incidentCauseId", {required:"Ce champ est requis"})}}
//                         validation={{required:"Ce champs est requis"}}
//                         placeholder="Cause de l'incident"
//                         name={"incidentCauseId"}
//                         errorMessage={errors.incidentCauseId && <small className='text-red-500 px-2 text-xs'>{errors.incidentCauseId.message}</small>}
//                     />
                    
//                 </div>
//                 <div className='w-full'>
//                     <label htmlFor="incidentCausesid" className='text-sm font-semibold px-2'>Choisir le site <span className='text-red-500'>*</span></label>
//                     <AutoComplete 
//                         dataList={sites}
//                         isLoading={false}
//                         onSearch={(value)=>fetchSites(`${URLS.ENTITY_API}/sites?search=${value}`)}
//                         onSelect={(value)=>{
//                             if(value){
//                                 setValue("siteId", value?.id)
//                             }else{
//                                 setValue("siteId",null)
//                             }
//                         }}
//                         register={{...register("incidentCauseId", {required:"Ce champ est requis"})}}
//                         validation={{required:"Ce champs est requis"}}
//                         placeholder="Sites"
//                         name={"siteId"}
//                         errorMessage={errors.incidentCauseId && <small className='text-red-500 px-2 text-xs'>{errors.incidentCauseId.message}</small>}
//                     />
                    
//                 </div>
//                 <div className='flex flex-col w-full px-2'>
//                     <label htmlFor="" className='text-sm font-semibold'>Tier <span className='text-red-500'>*</span></label>
//                     <AutoComplete 
//                         dataList={suppliers}
//                         isLoading={false}
//                         onSearch={(value)=>fetchSuppliers(`${URLS.ENTITY_API}/suppliers?search=${value}`)}
//                         onSelect={(value)=>{
//                             if(value){
//                                 setValue("tier", value?.id)
//                             }else{
//                                 setValue("tier",null)
//                             }
//                         }}
//                         register={{...register("tier", {required:"Ce champ est requis"})}}
//                         validation={{required:"Ce champs est requis"}}
//                         placeholder="Tier"
//                         name={"tier"}
//                         errorMessage={errors.incidentCauseId && <small className='text-red-500 px-2 text-xs'>{errors.incidentCauseId.message}</small>}
//                     />
//                     {errors.tier && <small className='text-xs text-red-500'>{errors.tier.message}</small>}
//                 </div>
//                 {
//                     declarationType === "CONTAINER" &&
//                     <>
//                         <div className='flex flex-col w-full px-2'>
//                             <label htmlFor="" className='text-sm font-semibold'>Conteneur 1 <span className='text-red-500'>*</span>:</label>
//                             <input type="text" className='border rounded-lg p-2 text-sm' {...register("container1", {required:"Ce champ est requis"})}/>
//                             {errors.container1 && <small className='text-xs text-red-500'>{errors.container1.message}</small>}
//                         </div>
//                         <div className='flex flex-col w-full px-2'>
//                             <label htmlFor="" className='text-sm font-semibold'>Conteneur 2 :</label>
//                             <input type="text" className='border rounded-lg p-2 text-sm' {...register("container2")}/>
//                             {errors.container2 && <small className='text-xs text-red-500'>{errors.container2.message}</small>}
//                         </div> 
//                     </>
//                 }               
//                 <div className='flex flex-col w-full px-2'>
//                     <label htmlFor="" className='text-sm font-semibold'>Plomb 1 <span className='text-red-500'>*</span>:</label>
//                     <input type="text" className='border rounded-lg p-2 text-sm' {...register("plomb1", {required:"Ce champ est requis"})}/>
//                     {errors.plomb1 && <small className='text-xs text-red-500'>{errors.plomb1.message}</small>}
//                 </div>
//                 <div className='flex flex-col w-full px-2'>
//                     <label htmlFor="" className='text-sm font-semibold'>Plomb 2 :</label>
//                     <input type="text" className='border rounded-lg p-2 text-sm' {...register("plomb2")}/>
//                     {errors.plomb2 && <small className='text-xs text-red-500'>{errors.plomb2.message}</small>}
//                 </div>
//                 <div className='flex flex-col w-full px-2'>
//                     <label htmlFor="" className='text-sm font-semibold'>Chargeur <span className='text-red-500'>*</span>:</label>
//                     <AutoComplete 
//                         dataList={suppliers}
//                         isLoading={false}
//                         onSearch={(value)=>fetchSuppliers(`${URLS.ENTITY_API}/suppliers?search=${value}`)}
//                         onSelect={(value)=>{
//                             if(value){
//                                 setValue("loader", value?.id)
//                             }else{
//                                 setValue("loader",null)
//                             }
//                         }}
//                         register={{...register("loader", {required:"Ce champ est requis"})}}
//                         validation={{required:"Ce champs est requis"}}
//                         placeholder="Chargeur"
//                         name={"loader"}
//                         errorMessage={errors.loader && <small className='text-red-500 px-2 text-xs'>{errors.loader.message}</small>}
//                     />
//                     {errors.loader && <small className='text-xs text-red-500'>{errors.loader.message}</small>}
//                 </div>
//                 <div className='flex flex-col w-full px-2'>
//                     <label htmlFor="" className='text-sm font-semibold'>Produit <span className='text-red-500'>*</span>:</label>
//                     <AutoComplete 
//                         dataList={products}
//                         isLoading={false}
//                         onSearch={(value)=>fetchProducts(`${URLS.ENTITY_API}/articles?search=${value}`)}
//                         onSelect={(value)=>{
//                             if(value){
//                                 setValue("product", value?.id)
//                             }else{
//                                 setValue("product",null)
//                             }
//                         }}
//                         register={{...register("product", {required:"Ce champ est requis"})}}
//                         validation={{required:"Ce champs est requis"}}
//                         placeholder="Produit"
//                         name={"product"}
//                         errorMessage={errors.product && <small className='text-red-500 px-2 text-xs'>{errors.product.message}</small>}
//                     />
//                     {errors.product && <small className='text-xs text-red-500'>{errors.product.message}</small>}
//                 </div>
//                 <div className='flex flex-col w-full px-2'>
//                     <label htmlFor="" className='text-sm font-semibold'>Transporteur <span className='text-red-500'>*</span>:</label>
//                     <AutoComplete 
//                         dataList={suppliers}
//                         isLoading={false}
//                         onSearch={(value)=>fetchSites(`${URLS.ENTITY_API}/suppliers?search=${value}`)}
//                         onSelect={(value)=>{
//                             if(value){
//                                 setValue("transporter", value?.id)
//                             }else{
//                                 setValue("transporter",null)
//                             }
//                         }}
//                         register={{...register("transporter", {required:"Ce champ est requis"})}}
//                         validation={{required:"Ce champs est requis"}}
//                         placeholder="Transporteur"
//                         name={"transporter"}
//                         errorMessage={errors.transporter && <small className='text-red-500 px-2 text-xs'>{errors.transporter.message}</small>}
//                     />
//                     {errors.transporter && <small className='text-xs text-red-500'>{errors.transporter.message}</small>}
//                 </div>
//                 <div className='flex flex-col w-full px-2'>
//                     <label htmlFor="" className='text-sm font-semibold'>Vehicule <span className='text-red-500'>*</span>:</label>
//                     <input type="text" className='border rounded-lg p-2 text-sm' {...register("vehicle", {required:"Ce champ est requis"})}/>
//                     {errors.vehicle && <small className='text-xs text-red-500'>{errors.vehicle.message}</small>}
//                 </div>
//                 <div className='flex flex-col w-full px-2'>
//                     <label htmlFor="" className='text-sm font-semibold'>Chauffeur <span className='text-red-500'>*</span>:</label>
//                     <input type="text" className='border rounded-lg p-2 text-sm' {...register("driver", {required:"Ce champ est requis"})}/>
//                     {errors.driver && <small className='text-xs text-red-500'>{errors.driver.message}</small>}
//                 </div>
//                 <div className='flex flex-col w-full px-2'>
//                     <label htmlFor="" className='text-sm font-semibold'>Remorque <span className='text-red-500'>*</span>:</label>
//                     <input type="text" className='border rounded-lg p-2 text-sm' {...register("trailer", {required:"Ce champ est requis"})}/>
//                     {errors.trailer && <small className='text-xs text-red-500'>{errors.trailer.message}</small>}
//                 </div>
//             </div>

//             <div className='flex justify-end'>
//                 <Button className='p-2 rounded-lg bg-primary text-sm text-white' disabled={isLoading}>{isLoading ? "Creation ... " :'Créer hors pont'}</Button>
//             </div>
//         </form>
//     )
// }


// export default HorsPontForm;
// export default HorsPontForm;
import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { DECLARATION_TYPES, OPERATIONS, SITE_TYPE, FACTURATION_TYPES } from '../../../utils/constant.utils';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import AutoComplete from '../../common/AutoComplete';
import toast from 'react-hot-toast';

const HorsPontForm = ({onSucess}) => {
    // ===== HOOKS =====
    const {handleSubmit, formState:{errors}, register, setValue, watch, reset} = useForm();
    const {handleFetch, handlePost} = useFetch();

    // ===== ÉTATS =====
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [sites, setSites] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const declarationType = watch("declarationType");
    const currentSiteId = watch("siteId"); // Surveiller la valeur du site

    // ===== FONCTIONS DE FETCH =====
    const fetchIncidentCauses = async(url) => {
        try {
            let response = await handleFetch(url);
            if(response?.status === 200){
                setIncidentCauses(response?.data)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchSites = async(url) => {
        try {
            let response = await handleFetch(url);
            if(response?.status === 200){
                setSites(response?.data)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchSuppliers = async(url) => {
        try {
            let response = await handleFetch(url);
            if(response?.status === 200){
                setSuppliers(response?.data)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchProducts = async(url) => {
        try {
            let response = await handleFetch(url);
            if(response?.status === 200){
                setProducts(response?.data)
            }
        } catch (error) {
            console.error(error);
        }
    }

    // ===== SOUMISSION DU FORMULAIRE =====
    const handleSubmitForm = async(data) => {
        let url = `${URLS.INCIDENT_API}/off-bridges`;
        setIsLoading(true);
        try {
            let response = await handlePost(url, data);
            if(response.status === 201){
                toast.success("Hors pont créé avec succès");
                onSucess();
                resetForm();
                return;
            }
            toast.error("Échec de création du hors pont");
        } catch (error) {
            console.error(error);
            // toast.error("Erreur lors de la déclaration de l'incident");
        } finally {
            setIsLoading(false);
        }
    }

    // ===== RÉINITIALISATION DU FORMULAIRE =====
    const resetForm = () => {
        // Sauvegarder la valeur actuelle du site
        const savedSiteId = currentSiteId;

        // Réinitialiser tous les champs SAUF le site
        reset({
            operation: "",
            declarationType: "",
            paymentMode: "",
            incidentCauseId: "",
            siteId: savedSiteId, // Garder la valeur du site
            tier: "",
            container1: "",
            container2: "",
            plomb1: "",
            plomb2: "",
            loader: "",
            product: "",
            transporter: "",
            vehicle: "",
            driver: "",
            trailer: ""
        });

        setTimeout(() => {
            // Réinitialiser manuellement tous les champs SAUF le site
            setValue("operation", "");
            setValue("declarationType", "");
            setValue("paymentMode", "");
            setValue("incidentCauseId", "");
            setValue("siteId", savedSiteId); // Garder la valeur du site
            setValue("tier", "");
            setValue("container1", "");
            setValue("container2", "");
            setValue("plomb1", "");
            setValue("plomb2", "");
            setValue("loader", "");
            setValue("product", "");
            setValue("transporter", "");
            setValue("vehicle", "");
            setValue("driver", "");
            setValue("trailer", "");

            console.log("✅ Formulaire réinitialisé - Site conservé:", savedSiteId);
        }, 100);
    };

    // ===== EFFET INITIAL =====
    useEffect(() => {
        fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
        fetchSites(`${URLS.ENTITY_API}/sites?typeSite=${SITE_TYPE.FIELD}`);
        fetchSuppliers(`${URLS.ENTITY_API}/suppliers`);
        fetchProducts(`${URLS.ENTITY_API}/articles`);
    }, []);

    return (
        <form onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col space-y-2'>
            <div className='overflow-y-scroll max-h-[300px] space-y-3'>
                
                {/* LIGNE 1: OPERATION, TYPE DECLARATION, TYPE FACTURATION */}
                <div className='flex items-center space-x-2 w-full px-2'>
                    <div className='w-full'>
                        <label htmlFor="operation" className='text-sm font-semibold'>Type d'operation <span className='text-red-500'>*</span></label>
                        <select id="operation" className='w-full border p-2 rounded-lg text-sm' {...register("operation", {required:"Ce champ est requis"})}>
                            <option value="">Choisir l'operation *</option>
                            {OPERATIONS.map((operation, index) => (
                                <option value={operation.value} key={index}>{operation.name}</option>
                            ))}
                        </select>
                        {errors.operation && <small className='text-xs text-red-500'>{errors.operation.message}</small>}
                    </div>
                    <div className='w-full'>
                        <label htmlFor="declaration-type" className='text-sm font-semibold'>Type de declaration <span className='text-red-500'>*</span></label>
                        <select id='declaration-type' className='w-full border p-2 rounded-lg text-sm' {...register("declarationType", {required:"Ce champ est requis"})}>
                            <option value="">Choisir le type de declaration *</option>
                            {DECLARATION_TYPES.map((operation, index) => (
                                <option value={operation.value} key={index}>{operation.name}</option>
                            ))}
                        </select>
                        {errors.declarationType && <small className='text-xs text-red-500'>{errors.declarationType.message}</small>}
                    </div>
                    <div className='w-full'>
                        <label htmlFor="payment-mode" className='text-sm font-semibold'>Type de facturation <span className='text-red-500'>*</span></label>
                        <select id='payment-mode' className='w-full border p-2 rounded-lg text-sm' {...register("paymentMode", {required:"Ce champ est requis"})}>
                            <option value="">Choisir le type de facturation *</option>
                            {FACTURATION_TYPES.map((operation, index) => (
                                <option value={operation.value} key={index}>{operation.name}</option>
                            ))}
                        </select>
                        {errors.paymentMode && <small className='text-xs text-red-500'>{errors.paymentMode.message}</small>}
                    </div>
                </div>

                {/* CAUSE INCIDENT */}
                <div className='w-full'>
                    <label className='text-sm font-semibold px-2'>Cause de l'incident <span className='text-red-500'>*</span></label>
                    <AutoComplete 
                        dataList={incidentCauses}
                        isLoading={false}
                        onSearch={(value) => fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?search=${value}`)}
                        onSelect={(value) => {
                            if(value){
                                setValue("incidentCauseId", value?.id);
                            } else {
                                setValue("incidentCauseId", null);
                            }
                        }}
                        // register={{...register("incidentCauseId", {required:"Ce champ est requis"})}}
                        validation={{required:"Ce champs est requis"}}
                        placeholder="Cause de l'incident"
                        name={"incidentCauseId"}
                        errorMessage={errors.incidentCauseId && <small className='text-red-500 px-2 text-xs'>{errors.incidentCauseId.message}</small>}
                    />
                </div>

                {/* SITE */}
                <div className='w-full'>
                    <label className='text-sm font-semibold px-2'>Choisir le site <span className='text-red-500'>*</span></label>
                    <AutoComplete 
                        dataList={sites}
                        isLoading={false}
                        onSearch={(value) => fetchSites(`${URLS.ENTITY_API}/sites?search=${value}`)}
                        onSelect={(value) => {
                            if(value){
                                setValue("siteId", value?.id);
                            } else {
                                setValue("siteId", null);
                            }
                        }}
                        // register={{...register("siteId", {required:"Ce champ est requis"})}}
                        validation={{required:"Ce champs est requis"}}
                        placeholder="Sites"
                        name={"siteId"}
                        errorMessage={errors.siteId && <small className='text-red-500 px-2 text-xs'>{errors.siteId.message}</small>}
                    />
                </div>

                {/* TIER */}
                <div className='flex flex-col w-full px-2'>
                    <label className='text-sm font-semibold'>Tier <span className='text-red-500'>*</span></label>
                    <AutoComplete 
                        dataList={suppliers}
                        isLoading={false}
                        onSearch={(value) => fetchSuppliers(`${URLS.ENTITY_API}/suppliers?search=${value}`)}
                        onSelect={(value) => {
                            if(value){
                                setValue("tier", value?.id);
                            } else {
                                setValue("tier", null);
                            }
                        }}
                        // register={{...register("tier", {required:"Ce champ est requis"})}}
                        validation={{required:"Ce champs est requis"}}
                        placeholder="Tier"
                        name={"tier"}
                        errorMessage={errors.tier && <small className='text-red-500 px-2 text-xs'>{errors.tier.message}</small>}
                    />
                    {errors.tier && <small className='text-xs text-red-500'>{errors.tier.message}</small>}
                </div>

                {/* CONTENEURS (conditionnel) */}
                {declarationType === "CONTAINER" && (
                    <>
                        <div className='flex flex-col w-full px-2'>
                            <label className='text-sm font-semibold'>Conteneur 1 <span className='text-red-500'>*</span>:</label>
                            <input type="text" className='border rounded-lg p-2 text-sm' {...register("container1", {required:"Ce champ est requis"})}/>
                            {errors.container1 && <small className='text-xs text-red-500'>{errors.container1.message}</small>}
                        </div>
                        <div className='flex flex-col w-full px-2'>
                            <label className='text-sm font-semibold'>Conteneur 2 :</label>
                            <input type="text" className='border rounded-lg p-2 text-sm' {...register("container2")}/>
                            {errors.container2 && <small className='text-xs text-red-500'>{errors.container2.message}</small>}
                        </div> 
                    </>
                )}

                {/* PLOMBS */}
                <div className='flex flex-col w-full px-2'>
                    <label className='text-sm font-semibold'>Plomb 1 <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("plomb1", {required:"Ce champ est requis"})}/>
                    {errors.plomb1 && <small className='text-xs text-red-500'>{errors.plomb1.message}</small>}
                </div>
                <div className='flex flex-col w-full px-2'>
                    <label className='text-sm font-semibold'>Plomb 2 :</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("plomb2")}/>
                    {errors.plomb2 && <small className='text-xs text-red-500'>{errors.plomb2.message}</small>}
                </div>

                {/* CHARGEUR */}
                <div className='flex flex-col w-full px-2'>
                    <label className='text-sm font-semibold'>Chargeur <span className='text-red-500'>*</span>:</label>
                    <AutoComplete 
                        dataList={suppliers}
                        isLoading={false}
                        onSearch={(value) => fetchSuppliers(`${URLS.ENTITY_API}/suppliers?search=${value}`)}
                        onSelect={(value) => {
                            if(value){
                                setValue("loader", value?.id);
                            } else {
                                setValue("loader", null);
                            }
                        }}
                        // register={{...register("loader", {required:"Ce champ est requis"})}}
                        validation={{required:"Ce champs est requis"}}
                        placeholder="Chargeur"
                        name={"loader"}
                        errorMessage={errors.loader && <small className='text-red-500 px-2 text-xs'>{errors.loader.message}</small>}
                    />
                    {errors.loader && <small className='text-xs text-red-500'>{errors.loader.message}</small>}
                </div>

                {/* PRODUIT */}
                <div className='flex flex-col w-full px-2'>
                    <label className='text-sm font-semibold'>Produit <span className='text-red-500'>*</span>:</label>
                    <AutoComplete 
                        dataList={products}
                        isLoading={false}
                        onSearch={(value) => fetchProducts(`${URLS.ENTITY_API}/articles?search=${value}`)}
                        onSelect={(value) => {
                            if(value){
                                setValue("product", value?.id);
                            } else {
                                setValue("product", null);
                            }
                        }}
                        // register={{...register("product", {required:"Ce champ est requis"})}}
                        validation={{required:"Ce champs est requis"}}
                        placeholder="Produit"
                        name={"product"}
                        errorMessage={errors.product && <small className='text-red-500 px-2 text-xs'>{errors.product.message}</small>}
                    />
                    {errors.product && <small className='text-xs text-red-500'>{errors.product.message}</small>}
                </div>

                {/* TRANSPORTEUR */}
                <div className='flex flex-col w-full px-2'>
                    <label className='text-sm font-semibold'>Transporteur <span className='text-red-500'>*</span>:</label>
                    <AutoComplete 
                        dataList={suppliers}
                        isLoading={false}
                        onSearch={(value) => fetchSuppliers(`${URLS.ENTITY_API}/suppliers?search=${value}`)}
                        onSelect={(value) => {
                            if(value){
                                setValue("transporter", value?.id);
                            } else {
                                setValue("transporter", null);
                            }
                        }}
                        // register={{...register("transporter", {required:"Ce champ est requis"})}}
                        validation={{required:"Ce champs est requis"}}
                        placeholder="Transporteur"
                        name={"transporter"}
                        errorMessage={errors.transporter && <small className='text-red-500 px-2 text-xs'>{errors.transporter.message}</small>}
                    />
                    {errors.transporter && <small className='text-xs text-red-500'>{errors.transporter.message}</small>}
                </div>

                {/* VÉHICULE */}
                <div className='flex flex-col w-full px-2'>
                    <label className='text-sm font-semibold'>Vehicule <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("vehicle", {required:"Ce champ est requis"})}/>
                    {errors.vehicle && <small className='text-xs text-red-500'>{errors.vehicle.message}</small>}
                </div>

                {/* CHAUFFEUR */}
                <div className='flex flex-col w-full px-2'>
                    <label className='text-sm font-semibold'>Chauffeur <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("driver", {required:"Ce champ est requis"})}/>
                    {errors.driver && <small className='text-xs text-red-500'>{errors.driver.message}</small>}
                </div>

                {/* REMORQUE */}
                <div className='flex flex-col w-full px-2'>
                    <label className='text-sm font-semibold'>Remorque <span className='text-red-500'>*</span>:</label>
                    <input type="text" className='border rounded-lg p-2 text-sm' {...register("trailer", {required:"Ce champ est requis"})}/>
                    {errors.trailer && <small className='text-xs text-red-500'>{errors.trailer.message}</small>}
                </div>
            </div>

            {/* BOUTON DE SOUMISSION */}
            <div className='flex justify-end'>
                <Button 
                    className='p-2 rounded-lg bg-primary text-sm text-white' 
                    disabled={isLoading}
                    type="submit"
                >
                    {isLoading ? "Création en cours..." : 'Créer hors pont'}
                </Button>
            </div>
        </form>
    );
}

export default HorsPontForm;    