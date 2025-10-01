import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import AutoComplete from '../common/AutoComplete';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';
import Preloader from '../Preloader';

const CloseIncidentForm = ({isOpen, setIsOpen, fetchData, selectedRow}) => {

    const {register, handleSubmit, formState:{errors}, setValue, watch} = useForm({
        defaultValues: {
            hasStoppedOperations: false
        }
    });
    const {handleFetch} = useFetch();

    const [employees, setEmployees] = useState([]);
    const [entities, setEntities] = useState([]);
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [error, setError] = useState(""); // Remplacez setErrorMap par setError

    const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
    const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
    const [isLoadingCauses, setIsLoadingCauses] = useState(true);
    const [isLoadingTypes, setIsLoadingTypes] = useState(true);
    
    const hasStoppedOperationsValue = watch("hasStoppedOperations");

    const handleEmployees = async (url) =>{
        setIsLoadingEmployees(true);
        try {
            let response = await handleFetch(url);
            if(response.error){
                // Gérer l'erreur
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
        }finally{
            setIsLoadingEmployees(false);
        }
    }

    const handleEntities = async (url) =>{
        setIsLoadingSuppliers(true);
        try {
            let response = await handleFetch(url);
            if(response.error){
                // Gérer l'erreur
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
        }finally{
            setIsLoadingSuppliers(false);
        }
    }
    
    const handleIncidentCauses = async (url) =>{
        setIsLoadingCauses(true);
        try {
            let response = await handleFetch(url);
            if(response.error){
                // Gérer l'erreur
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
        }finally{
            setIsLoadingCauses(false);
        }
    }
    
    const handleIncidentTypes = async (url) =>{
        setIsLoadingTypes(true);
        try {
            let response = await handleFetch(url);
            if(response.error){
                // Gérer l'erreur
            }
            let result = response?.data;
            let formattedData = result.map(entity=>{
                return {
                    name:  entity?.name,
                    value: entity?.id
                }
            });
            setIncidentTypes(formattedData);
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoadingTypes(false);
        }
    }

    const onSubmit = async (data) =>{
        // Vérifier que selectedRow existe et a un ID
        if (!selectedRow?.id) {
            setError("Aucun incident sélectionné");
            return;
        }

        setIsSubmiting(true);
        setError(""); // Réinitialiser les erreurs
        
        // Nettoyer les données
        Object.keys(data).forEach(key => {
            if (data[key] === null || data[key] === undefined || data[key] === '') {
                delete data[key];
            }
        });
        
        data.status = "CLOSED";
        
        // Nettoyer la valeur si elle est vide
        if (data.closedManuDate === '') {
            delete data.closedManuDate;
        }
        
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
                // Réinitialiser le formulaire
                setValue("technician", "");
                setValue("incidentId", "");
                setValue("incidentCauseId", "");
                setValue("hasStoppedOperations", false);
                setValue("closedManuDate", "");
            } else {
                setError("Erreur lors de la clôture de l'incident");
            }
        } catch (error) {
            console.error(error);
            setError("Erreur lors de la clôture de l'incident");
        }finally{
            setIsSubmiting(false);
        }
    }

    // Réinitialiser le formulaire quand la modal s'ouvre/ferme
    useEffect(() => {
        if (isOpen && selectedRow) {
            // Pré-remplir avec les valeurs de l'incident sélectionné
            setValue("hasStoppedOperations", selectedRow.hasStoppedOperations || false);
            setValue("technician", selectedRow.technician || "");
            setValue("incidentId", selectedRow.incidentId || "");
            setValue("incidentCauseId", selectedRow.incidentCauseId || "");
        }
    }, [isOpen, selectedRow, setValue]);
    
    useEffect(()=>{
        if (isOpen) {
            handleEmployees(`${URLS.ENTITY_API}/employees`);
            handleEntities(`${URLS.ENTITY_API}/suppliers`);
            handleIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
            handleIncidentTypes(`${URLS.INCIDENT_API}/incident-types`);
        }
    },[isOpen]) // Exécuter seulement quand la modal s'ouvre

    return ( 
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Clôturer l'incident</DialogTitle>
                <DialogDescription>
                    Finalisez la résolution de cet incident
                </DialogDescription>
                </DialogHeader>
                
                {error && (
                    <div className="mx-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mx-2'>
                        <label htmlFor="" className='font-semibold text-sm'>Choisir l'intervenant</label>
                        <AutoComplete 
                            dataList={[...employees, ...entities]}
                            placeholder="Choisir l'intervenant"
                            isLoading={isLoadingSuppliers || isLoadingEmployees}
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
                            errorMessage={<p className='text-sm text-red-500'>{errors.technician && errors.technician?.message}</p>}
                            error={errors.technician}
                        />
                    </div>
                    <div className='mx-2'>
                        <label htmlFor="" className='font-semibold text-sm'>Choisir Le type:</label>
                        <AutoComplete 
                            dataList={[...incidentTypes]}
                            placeholder="Choisir le type"
                            isLoading={isLoadingTypes}
                            register={{...register("incidentId", {required:'Ce champ est requis'})}}
                            onSearch={(input)=>{
                                handleIncidentTypes(`${URLS.INCIDENT_API}/incident-types?search=${input}`); // Corrigez l'URL ici
                            }}
                            onSelect={(value)=>{
                                if(value){
                                    setValue("incidentId", value?.value);
                                }else{
                                    setValue("incidentId",null);
                                }
                            }}
                            errorMessage={<p className='text-sm text-red-500'>{errors.incidentId && errors.incidentId?.message}</p>}
                            error={errors.incidentId}
                        />
                    </div>
                    <div className='mx-2'>
                        <label htmlFor="" className='font-semibold text-sm'>Choisir la cause:</label>
                        <AutoComplete 
                            dataList={[...incidentCauses]}
                            placeholder="Choisir la cause"
                            isLoading={isLoadingCauses}
                            register={{...register("incidentCauseId", {required:'Ce champ est requis'})}}
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
                    <div className='mx-2 mb-4'>
                        <label className='flex items-center space-x-2 cursor-pointer'>
                            <input
                                type="checkbox"
                                {...register("hasStoppedOperations")}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                            />
                            <span className='font-semibold text-sm'>L'incident a causé un arrêt des opérations</span>
                        </label>
                        <p className='text-xs text-gray-500 mt-1'>
                            {hasStoppedOperationsValue ? "✓ Arrêt opération enregistré" : "Aucun arrêt opération"}
                        </p>
                    </div>
                    <div className='mx-2'>
                        <label htmlFor="closedManuDate" className='font-semibold text-sm'>
                            Date de clôture (optionnel)
                        </label>
                        <input
                            type="datetime-local"
                            id="closedManuDate"
                            {...register("closedManuDate")}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className='flex justify-end mt-4'>
                        <Button 
                            type="submit"
                            disabled={isSubmiting} 
                            className={`text-sm text-white font-semibold hover:bg-secondary flex items-center gap-2 ${
                                isSubmiting ? "bg-blue-500 cursor-not-allowed" : "bg-primary"
                            }`}
                        >
                            {isSubmiting ? <Preloader size={20}/> : <CheckCircle size={20} />}
                            <span>{isSubmiting ? "Clôture en cours..." : "Clôturer l'incident"}</span>
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CloseIncidentForm;

// import React, { useEffect, useState } from 'react'
// import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
// import { useForm } from 'react-hook-form';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';
// import AutoComplete from '../common/AutoComplete';
// import { Button } from '../ui/button';
// import { CheckCircle } from 'lucide-react';
// import Preloader from '../Preloader';

// const CloseIncidentForm = ({isOpen, setIsOpen, fetchData, selectedRow}) => {

//     const {register, handleSubmit, formState:{errors}, setValue, watch} = useForm({
//         defaultValues: {
//             hasStoppedOperations: false // Valeur par défaut à false
//         }
//     });
//     const {handleFetch} = useFetch();

//     const [employees, setEmployees] = useState([]);
//     const [entities, setEntities] = useState([]);
//     const [incidentCauses, setIncidentCauses] = useState([]);
//     const [incidentTypes, setIncidentTypes] = useState([]);
//     const [isSubmiting, setIsSubmiting] = useState(false);

//     const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
//     const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
//     const [isLoadingCauses, setIsLoadingCauses] = useState(true);
//     const [isLoadingTypes, setIsLoadingTypes] = useState(true);
    
//     // Observer la valeur du checkbox pour debug ou logique conditionnelle
//     const hasStoppedOperationsValue = watch("hasStoppedOperations");

//     const handleEmployees = async (url) =>{
//         setIsLoadingEmployees(true);
//         try {
//             let response = await handleFetch(url);
//             if(response.error){

//             }
//             let result = response?.data;
//             let formattedData = result.map(employee=>{
//                 return {
//                     name:  employee?.name,
//                     value: employee?.id
//                 }
//             });
//             setEmployees(formattedData);
//         } catch (error) {
//             console.log(error);
//         }finally{
//             setIsLoadingEmployees(false);
//         }
//     }

//     const handleEntities = async (url) =>{
//         setIsLoadingSuppliers(true);
//         try {
//             let response = await handleFetch(url);
//             if(response.error){

//             }
//             let result = response?.data;
//             let formattedData = result.map(entity=>{
//                 return {
//                     name:  entity?.name,
//                     value: entity?.id
//                 }
//             });
//             setEntities(formattedData);
//         } catch (error) {
//             console.log(error);
//         }finally{
//             setIsLoadingSuppliers(false);
//         }
//     }
    
//     const handleIncidentCauses = async (url) =>{
//         setIsLoadingCauses(true);
//         try {
//             let response = await handleFetch(url);
//             if(response.error){

//             }
//             let result = response?.data;
//             let formattedData = result.map(entity=>{
//                 return {
//                     name:  entity?.name,
//                     value: entity?.id
//                 }
//             });
//             setIncidentCauses(formattedData);
//         } catch (error) {
//             console.log(error);
//         }finally{
//             setIsLoadingCauses(false);
//         }
//     }
    
//     const handleIncidentTypes = async (url) =>{
//         setIsLoadingTypes(true);
//         try {
//             let response = await handleFetch(url);
//             if(response.error){

//             }
//             let result = response?.data;
//             let formattedData = result.map(entity=>{
//                 return {
//                     name:  entity?.name,
//                     value: entity?.id
//                 }
//             });
//             setIncidentTypes(formattedData);
//         } catch (error) {
//             console.log(error);
//         }finally{
//             setIsLoadingTypes(false);
//         }
//     }

//     const onSubmit = async (data) =>{
//         setIsSubmiting(true);
        
//         try {
//             // Nettoyer les données
//             Object.keys(data).forEach(key => {
//                 if (data[key] === null || data[key] === undefined || data[key] === '') {
//                     delete data[key];
//                 }
//             });
            
//             // Vérifier les champs requis
//             if (!data.incidentId || !data.incidentCauseId) {
//                 alert('Les champs Type et Cause sont obligatoires');
//                 return;
//             }
            
//             // CORRECTION : Formater correctement la date
//             if (data.closedManuDate) {
//                 // Le champ datetime-local retourne "YYYY-MM-DDTHH:mm"
//                 // On doit le convertir en format ISO 8601 complet
//                 const date = new Date(data.closedManuDate);
                
//                 // Vérifier que la date est valide
//                 if (isNaN(date.getTime())) {
//                     alert('Date de clôture invalide');
//                     return;
//                 }
                
//                 // Formater en ISO 8601 avec fuseau horaire
//                 data.closedManuDate = date.toISOString();
//             }
            
//             // Préparer les données finales
//             const payload = {
//                 status: "CLOSED",
//                 incidentId: data.incidentId,
//                 incidentCauseId: data.incidentCauseId,
//                 hasStoppedOperations: Boolean(data.hasStoppedOperations),
//                 // Ajouter l'utilisateur qui met à jour (à adapter selon votre auth)
//                 updatedBy: "user-id-here" // À remplacer par l'ID réel
//             };
            
//             // Ajouter les champs optionnels s'ils existent
//             if (data.technician) payload.technician = data.technician;
//             if (data.closedManuDate) payload.closedManuDate = data.closedManuDate;
            
//             console.log('Payload final:', payload);
            
//             let url = `${URLS.INCIDENT_API}/incidents/${selectedRow.id}`;
//             let response = await fetch(url, {
//                 method: "PATCH",
//                 headers: {
//                     "Content-Type": "application/json",
//                     'authorization': `Bearer ${localStorage.getItem('token')}` || ''
//                 },
//                 body: JSON.stringify(payload)
//             });
            
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 console.error('Erreur serveur:', errorData);
//                 throw new Error(errorData.error_list ? 
//                     errorData.error_list.map(err => err.msg).join(', ') : 
//                     'Erreur lors de la mise à jour'
//                 );
//             }
            
//             const result = await response.json();
//             console.log('Succès:', result);
//             fetchData();
//             setIsOpen(false);
            
//         } catch (error) {
//             console.error('Erreur:', error);
//             alert(`Erreur: ${error.message}`);
//         } finally {
//             setIsSubmiting(false);
//         }
//     }
    
//     useEffect(()=>{
//         handleEmployees(`${URLS.ENTITY_API}/employees`);
//         handleEntities(`${URLS.ENTITY_API}/suppliers`);
//         handleIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
//         handleIncidentTypes(`${URLS.INCIDENT_API}/incident-types`);
        
//         // Pré-remplir avec la valeur actuelle de l'incident si elle existe
//         if (selectedRow?.hasStoppedOperations !== undefined) {
//             setValue("hasStoppedOperations", selectedRow.hasStoppedOperations);
//         }
//     },[selectedRow, setValue])

//     return ( 
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogContent>
//                 <DialogHeader>{"Clôturer l'incident"}</DialogHeader>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     {/* Checkbox pour Arrêt opération */}
//                     <div className='mx-2 mb-4'>
//                         <label className='flex items-center space-x-2 cursor-pointer'>
//                             <input
//                                 type="checkbox"
//                                 {...register("hasStoppedOperations")}
//                                 className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
//                             />
//                             <span className='font-semibold text-sm'>L'incident a causé un arrêt des opérations</span>
//                         </label>
//                         <p className='text-xs text-gray-500 mt-1'>
//                             {hasStoppedOperationsValue ? "✓ Arrêt opération enregistré" : "Aucun arrêt opération"}
//                         </p>
//                     </div>

//                     <div className='mx-2'>
//                         <label htmlFor="" className='font-semibold text-sm'>Choisir l'intervenant</label>
//                         <AutoComplete 
//                             dataList={[...employees, ...entities]}
//                             placeholder="Choisir l'intervenant"
//                             isLoading={isLoadingSuppliers || isLoadingEmployees}
//                             register={{...register("technician")}}
//                             onSearch={(input)=>{
//                                 handleEmployees(`${URLS.ENTITY_API}/employees?search=${input}`);
//                                 handleEntities(`${URLS.ENTITY_API}/suppliers?search=${input}`);
//                             }}
//                             onSelect={(value)=>{
//                                 if(value){
//                                     setValue("technician", value?.value);
//                                 }else{
//                                     setValue("technician",null);
//                                 }
//                             }}
//                             errorMessage={<p className='text-sm text-red-500'>{errors.causeId && errors.causeId?.message}</p>}
//                             error={errors.technician}
//                         />
//                     </div>
//                     <div className='mx-2'>
//                         <label htmlFor="" className='font-semibold text-sm'>Choisir Le type:</label>
//                         <AutoComplete 
//                             dataList={[...incidentTypes]}
//                             placeholder="Choisir le type"
//                             isLoading={isLoadingTypes}
//                             register={{...register("incidentId", {required:'This field is required'})}}
//                             onSearch={(input)=>{
//                                 handleIncidentTypes(`${URLS.INCIDENT_API}/incident-causes?search=${input}`);
//                             }}
//                             onSelect={(value)=>{
//                                 if(value){
//                                     setValue("incidentId", value?.value);
//                                 }else{
//                                     setValue("incidentId",null);
//                                 }
//                             }}
//                             errorMessage={<p className='text-sm text-red-500'>{errors.incidentId && errors.incidentId?.message}</p>}
//                             error={errors.incidentId}
//                         />
//                     </div>
//                     <div className='mx-2'>
//                         <label htmlFor="" className='font-semibold text-sm'>Choisir la cause:</label>
//                         <AutoComplete 
//                             dataList={[...incidentCauses]}
//                             placeholder="Choisir la cause"
//                             isLoading={isLoadingCauses}
//                             register={{...register("incidentCauseId", {required:'This field is required'})}}
//                             onSearch={(input)=>{
//                                 handleIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?search=${input}`);
//                             }}
//                             onSelect={(value)=>{
//                                 if(value){
//                                     setValue("incidentCauseId", value?.value);
//                                 }else{
//                                     setValue("incidentCauseId",null);
//                                 }
//                             }}
//                             errorMessage={<p className='text-sm text-red-500'>{errors.incidentCauseId && errors.incidentCauseId?.message}</p>}
//                             error={errors.incidentCauseId}
//                         />
//                     </div>
//                     <div className='mx-2'>
//                         <label htmlFor="closedManuDate" className='font-semibold text-sm'>
//                             Date de clôture (optionnel)
//                         </label>
//                         <input
//                             type="datetime-local"
//                             id="closedManuDate"
//                             {...register("closedManuDate")}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                         />
//                     </div>
//                     <div className='flex justify-end'>
//                         <Button disabled={isSubmiting} className={`text-sm text-white font-semibold hover:bg-secondary ${isSubmiting ?"bg-blue-500 cursor-not-allowed": "bg-primary"}`}>
//                             {isSubmiting ? <Preloader size={20}/> : <CheckCircle />}
//                             <span>{isSubmiting ? "Clôture encours..." : "Clôturer l'incident"}</span>
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default CloseIncidentForm