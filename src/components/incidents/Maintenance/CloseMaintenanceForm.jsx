// import React, {useState, useEffect, useRef} from 'react';
// import { useFetch } from '../../../hooks/useFetch';
// import { Dialog, DialogContent, DialogHeader } from '../../ui/dialog';
// import { useForm } from 'react-hook-form';
// import AutoComplete from '../../common/AutoComplete';
// import { URLS } from '../../../../configUrl';
// import { Button } from '../../ui/button';
// import { INCIDENT_STATUS } from '../../../utils/constant.utils';
// import Preloader from '../../Preloader';
// import { CheckCircle } from 'lucide-react';

// const CloseMaintenanceForm = ({isOpen, setIsOpen, selectedMaintenance, onSubmit}) => {
    
//     const {handleSubmit, register, formState:{errors, isSubmitting}, setValue} = useForm({
//         defaultValues:{
//             incidentCauseId:'',
//             supplierId:''
//         }
//     });
//     const {handleFetch} = useFetch();
//     const [type, setType] = useState("");
//     const [typeErr, setTypeErr] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [suppliers, setSuppliers] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [incidentCauses, setIncidentCauses] = useState([]);
//     const typeRef = useRef();

//     const handleFetchSuppliers=async(link)=>{
//         try {
//             let response = await handleFetch(link);     
//             if(response?.status === 200){
//                 let formatedData = response?.data.map(item=>{
//                 return {
//                     name:item?.name,
//                     value: item?.id
//                 }
//                 });
//                 setSuppliers(formatedData);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const handleFetchEmployees=async(link)=>{
//         try {
//             let response = await handleFetch(link);     
//             if(response?.status === 200){
//                 let formatedData = response?.data.map(item=>{
//                 return {
//                     name:item?.name,
//                     value: item?.id
//                 }
//                 });
//                 setEmployees(formatedData);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const handleFetchIncidentCauses=async(link)=>{
//         try {
//             let response = await handleFetch(link);     
//             if(response?.status === 200){
//                 let formatedData = response?.data.map(item=>{
//                 return {
//                     name:item?.name,
//                     value: item?.id
//                 }
//                 });
//                 setIncidentCauses(formatedData);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const closeMaintenance=async(data)=>{
//         // if(type === ""){
//         //     setTypeErr("Ce champ est requis")
//         //     return;
//         // }
//         data.incidentId = selectedMaintenance?.incidentId;
//         setIsLoading(true);
//         let {type, ...others} = data
//         let url = `${URLS.INCIDENT_API}/maintenances/${selectedMaintenance?.id}/close`;
//         let resquestOPtions = {
//             method :"PATCH",
//             headers: {
//                 'Content-Type':'application/json',
//                 'authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             body: JSON.stringify(others)
//         }

//         try {
//             let response = await fetch(url, resquestOPtions);
//             if(!response.error){
//                 onSubmit();
//                 setIsOpen(false);
//                 return;
//             }
//             console.log(response);
//         } catch (error) {
//             alert('Echec de la cloture de la maintenance.');
//             console.log(error);
//         }finally{
//             setIsLoading(false);
//         }
//     }

//     useEffect(()=>{
//         // typeRef.current.focus;
//         handleFetchEmployees(`${URLS.ENTITY_API}/employees`);
//         handleFetchSuppliers(`${URLS.ENTITY_API}/suppliers`);
//         handleFetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
//     }, []);

//     useEffect(()=>{
//         if(type !== ""){
//             setTypeErr("");
//         }
//     }, [type])

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent>
//             <DialogHeader>{"Cloturer la maintenance"}</DialogHeader>
//             <form onSubmit={handleSubmit(closeMaintenance)} className='space-y-4'>
//                 <div className='flex flex-col'>
//                     <label htmlFor="" className='font-bold text-sm mx-2'>Cause d'incident <span className='text-red-500'>*</span></label>
//                     <AutoComplete 
//                         isLoading={false}
//                         placeholder={"Choisir la cause incident"}
//                         dataList={incidentCauses}
//                         register={{...register('incidentCauseId', {required:'Ce champs est requis'})}}
//                         onSearch={(input)=>{
//                             handleFetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?search=${input}`);
//                         }}
//                         onSelect={(value)=>{
//                             if(value){
//                                 setValue("incidentCauseId", value?.value);
//                             }else{
//                                 setValue("incidentCauseId",null);
//                             }
//                         }}
//                         errorMessage={<p className='text-sm text-red-500'>{errors.causeId && errors.causeId?.message}</p>}
//                     />
//                 </div>
//                 <div className='flex flex-col mx-2'>
//                     <label htmlFor="" className='text-sm font-bold'>Type d'intervenant <span className='text-red-500'>*</span></label>
//                     <select name="" id="" className='p-2 rounded-lg border' ref={typeRef} value={type} onChange={(e)=>setType(e.target.value)}>
//                         <option value="">Choisir le type d'intervenant</option>
//                         <option value="EMPLOYEE">Employé</option>
//                         <option value="SUPPLIER">Prestataire</option>
//                     </select>
//                     {typeErr === "" && <small className='text-sm text-red-500'>{typeErr}</small>}
//                 </div>
//                 <div className='flex flex-col'>
//                     {
//                         type !== "" &&
//                         <div className='flex flex-col'>
//                             <label htmlFor="" className='font-bold text-sm mx-2'>{type === "SUPPLIER" ? "Choisir le prestataire" : "Choisir l'employé"} <span className='text-red-500'>*</span></label>
//                             <AutoComplete 
//                             isLoading={false}
//                                 placeholder={type === "SUPPLIER" ? "Choisir le prestataire":"Choisir l'employé"}
//                                 dataList={type==="SUPPLIER" ? suppliers : employees}
//                                 register={{...register('supplierId', {required:'Ce champs est requis'})}}
//                                 onSearch={(input)=>{
//                                     type === "SUPPLIER"?
//                                     handleFetchSuppliers(`${URLS.ENTITY_API}/suppliers?search=${input}`):
//                                     handleFetchEmployees(`${URLS.ENTITY_API}/employees?search=${input}`)
//                                 }}
//                                 onSelect={(value)=>{
//                                     if(value){
//                                         setValue("supplierId", value?.value);
//                                     }else{
//                                         setValue("supplierId",null);
//                                     }
//                                 }}
//                                 errorMessage={<p className='text-sm text-red-500'>{errors.supplierId && errors.supplierId?.message}</p>}
//                             />
//                         </div>
//                     }
//                 </div>
//                 <div className='flex justify-end'>
//                     <button className={`text-white ${isLoading ? 'bg-blue-300 cursor-not-allowed':''} p-2 rounded-lg bg-primary text-sm flex items-center gap-2`} disabled={isLoading}>
//                         {isLoading ? <Preloader size={20}/> : <CheckCircle />}
//                         {isLoading ? 'Encours...' : 'Cloturer la maintenance'}
//                     </button>
//                 </div>
//             </form>
//         </DialogContent>
//     </Dialog>
//   )
// }

// export default CloseMaintenanceForm

import React, {useState, useEffect, useRef} from 'react';
import { useFetch } from '../../../hooks/useFetch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { useForm } from 'react-hook-form';
import AutoComplete from '../../common/AutoComplete';
import { URLS } from '../../../../configUrl';
import { Button } from '../../ui/button';
import { INCIDENT_STATUS } from '../../../utils/constant.utils';
import Preloader from '../../Preloader';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // Ajouter l'import toast

const CloseMaintenanceForm = ({isOpen, setIsOpen, selectedMaintenance, onSubmit}) => {
    
    const {handleSubmit, register, formState:{errors}, setValue} = useForm({
        defaultValues:{
            incidentCauseId:'',
            supplierId:'',
            closedManuDate: ''
        }
    });
    const {handleFetch} = useFetch();
    const [type, setType] = useState("");
    const [typeErr, setTypeErr] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [error, setError] = useState("");
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

    const closeMaintenance = async(data) => {
        // Vérifier que selectedMaintenance existe
        if (!selectedMaintenance?.id) {
            setError("Aucune maintenance sélectionnée");
            return;
        }
    
        if(type === "") {
            setTypeErr("Ce champ est requis")
            return;
        }
    
        setIsLoading(true);
        setError("");
    
        // Préparer les données pour l'API
        const requestData = {
            incidentCauseId: data.incidentCauseId,
            supplierId: data.supplierId,
            incidentId: selectedMaintenance?.incidentId
        };
    
        // CORRECTION: Gestion spéciale pour la date
        if (data.closedManuDate) {
            const date = new Date(data.closedManuDate);
            if (!isNaN(date.getTime())) {
                // FORMAT CORRECT: YYYY-MM-DDTHH:mm (sans secondes, millisecondes ni Z)
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                
                requestData.closedManuDate = `${year}-${month}-${day}T${hours}:${minutes}`;
            }
        }
    
        // CORRECTION: Vérifier que les champs requis sont présents
        if (!requestData.incidentCauseId || !requestData.supplierId || !requestData.incidentId) {
            setError("Tous les champs obligatoires doivent être remplis");
            setIsLoading(false);
            return;
        }
    
        let url = `${URLS.INCIDENT_API}/maintenances/${selectedMaintenance?.id}/close`;
        let requestOptions = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(requestData)
        }
    
        // DEBUG: Afficher les données avant envoi
        console.log("Données envoyées au serveur:", requestData);
    
        try {
            let response = await fetch(url, requestOptions);
            
            if(response.ok) {
                toast.success("Maintenance clôturée avec succès");
                onSubmit();
                setIsOpen(false);
                // Réinitialiser le formulaire
                setValue("incidentCauseId", "");
                setValue("supplierId", "");
                setValue("closedManuDate", "");
                setType("");
            } else {
                const errorData = await response.json();
                console.log("Erreur serveur:", errorData);
                const errorMessage = errorData.error_list?.[0]?.msg || errorData.message || "Erreur lors de la clôture de la maintenance";
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
            const errorMessage = "Erreur de connexion au serveur";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    // Réinitialiser le formulaire quand la modal s'ouvre/ferme
    useEffect(() => {
        if (isOpen && selectedMaintenance) {
            // Réinitialiser les valeurs
            setValue("incidentCauseId", "");
            setValue("supplierId", "");
            setValue("closedManuDate", "");
            setType("");
            setError("");
        }
    }, [isOpen, selectedMaintenance, setValue]);

    useEffect(()=>{
        if (isOpen) {
            handleFetchEmployees(`${URLS.ENTITY_API}/employees`);
            handleFetchSuppliers(`${URLS.ENTITY_API}/suppliers`);
            handleFetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
        }
    }, [isOpen]);

    useEffect(()=>{
        if(type !== ""){
            setTypeErr("");
        }
    }, [type])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Clôturer la maintenance</DialogTitle>
                    <DialogDescription>
                        Finalisez la clôture de cette maintenance
                    </DialogDescription>
                </DialogHeader>
                
                {error && (
                    <div className="mx-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit(closeMaintenance)} className='space-y-4'>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='font-bold text-sm mx-2'>Cause d'incident <span className='text-red-500'>*</span></label>
                        <AutoComplete 
                            isLoading={false}
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
                            errorMessage={<p className='text-sm text-red-500'>{errors.incidentCauseId && errors.incidentCauseId?.message}</p>}
                        />
                    </div>
                    
                    <div className='flex flex-col mx-2'>
                        <label htmlFor="" className='text-sm font-bold'>Type d'intervenant <span className='text-red-500'>*</span></label>
                        <select 
                            name="" 
                            id="" 
                            className='p-2 rounded-lg border' 
                            ref={typeRef} 
                            value={type} 
                            onChange={(e)=>setType(e.target.value)}
                        >
                            <option value="">Choisir le type d'intervenant</option>
                            <option value="EMPLOYEE">Employé</option>
                            <option value="SUPPLIER">Prestataire</option>
                        </select>
                        {typeErr && <small className='text-sm text-red-500'>{typeErr}</small>}
                    </div>
                    
                    <div className='flex flex-col'>
                        {
                            type !== "" &&
                            <div className='flex flex-col'>
                                <label htmlFor="" className='font-bold text-sm mx-2'>{type === "SUPPLIER" ? "Choisir le prestataire" : "Choisir l'employé"} <span className='text-red-500'>*</span></label>
                                <AutoComplete 
                                    isLoading={false}
                                    placeholder={type === "SUPPLIER" ? "Choisir le prestataire":"Choisir l'employé"}
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

                    {/* Nouveau champ : Date de clôture */}
                    <div className='flex flex-col mx-2'>
                        <label htmlFor="closedManuDate" className='font-bold text-sm'>
                            Date de clôture (optionnel)
                        </label>
                        <input
                            type="datetime-local"
                            id="closedManuDate"
                            {...register("closedManuDate")}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    <div className='flex justify-end'>
                        <Button 
                            type="submit"
                            disabled={isLoading} 
                            className={`text-white flex items-center gap-2 ${
                                isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-primary'
                            } p-2 rounded-lg text-sm`}
                        >
                            {isLoading ? <Preloader size={20}/> : <CheckCircle />}
                            {isLoading ? 'En cours...' : 'Clôturer la maintenance'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CloseMaintenanceForm