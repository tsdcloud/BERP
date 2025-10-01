// import React, {useEffect, useState} from 'react';
// import { useForm } from 'react-hook-form';
// import { useFetch } from '../../hooks/useFetch';
// import AutoComplete from '../common/AutoComplete';
// import { Button } from '../ui/button';
// import { CheckCircle } from 'lucide-react';
// import Preloader from '../Preloader';
// import toast from 'react-hot-toast';
// import { URLS } from '../../../configUrl';

// const InitiateForm = ({onSucess}) => {
//     const {register, handleSubmit, formState:{errors}, setValue, watch} = useForm();
//     const {handleFetch, handlePost} = useFetch();

//     const [isLoading, setIsLoading] = useState(true);
//     // const [incidentCauses, setIncidentCauses] = useState([]);
//     const [incidentTypes, setIncidentTypes] = useState([]);
//     const [consommables, setConsommables] = useState([]);
//     const [equipements, setEquipments] = useState([]);
//     const [shifts, setShifts] = useState([]);
//     const [sites, setSites] = useState([]);
//     const [supplierType, setSupplierType] = useState("");
//     const [isSubmiting, setIsSubmiting] = useState(false);
    

//     // loaders states
//     const [isTypeLoading, setIsTypeLoading] = useState(true);
//     const [isEquipementLoading, setIsEquipementLoading] = useState(true);
//     const [isSiteLoading, setIsSiteLoading] = useState(true);
//     const [isShiftLoading, setIsShiftLoading] = useState(true);
//     const [isConsommableLoading, setIsConsommableLoading] = useState(true);
    

//     const handleSubmitDecleration = async (data) =>{
//       setIsSubmiting(true);
//       try {
//         let url = `${import.meta.env.VITE_INCIDENT_API}/incidents`;
//         let response = await handlePost(url, data);
//         if(response.error){
//           response?.error_list.forEach(error =>toast.error(error.msg));
//           return;
//         }
//         toast.success("Incident déclaré avec succès");
//         onSucess();
//       } catch (error) {
//         console.log(error)
//       }finally{
//         setIsSubmiting(false);
//       }
//     }


//     // Fetch equipements
//     const handleFetchEquipements = async (link) =>{
//       setIsEquipementLoading(true);
//       try {
//         let response = await handleFetch(link);     
//         if(response?.status === 200){
//           let formatedData = response?.data.map(item=>{
//             return {
//               name:item?.title,
//               value: item?.id
//             }
//           });
//           setEquipments(formatedData);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally{
//         setIsEquipementLoading(false);
//       }
//     }

//     // Handle search equipements
//     const handleSearchEquipements=async(searchInput)=>{
//       try{
//         handleFetchEquipements(`${import.meta.env.VITE_INCIDENT_API}/equipements?search=${searchInput}`);
//       }catch(error){
//         console.log(error);
//       }
//     }

//     // Handle select equipement
//     const handleSelectEquipement = (item) => {
//       if(item){
//         setValue("equipementId", item.value);
//       }else{
//         setValue("equipementId", null);
//       }
//     };

//     // Incident causes
//     const handleFetchCauses = async (link) =>{
//       setIsTypeLoading(true);
//       try {
//         let response = await handleFetch(link);     
//         if(response?.status === 200){
//           let formatedData = response?.data.map(item=>{
//             return {
//               name:item?.name,
//               value: item?.id
//             }
//           });
//           setIncidentCauses(formatedData);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally{
//         setIsTypeLoading(false);
//       }
//     }

//     // Handle search causes
//     const handleSearchCauses=async(searchInput)=>{
//       try{
//         handleFetchCauses(`${import.meta.env.VITE_INCIDENT_API}/incident-causes?search=${searchInput}`);
//       }catch(error){
//         console.log(error);
//       }
//     }

//     // Handle select cause
//     const handleSelectCause = (item) => {
//       setValue("incidentCauseId", item.value);
//     };

//     // Fetch incident types
//     const handleFetchTypes = async (link) =>{
//       setIsTypeLoading(true);
//       try {
//         let response = await handleFetch(link);     
//         if(response?.status === 200){
//           let formatedData = response?.data.map(item=>{
//             return {
//               name:item?.name,
//               value: item?.id
//             }
//           });
//           setIncidentTypes(formatedData);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally{
//         setIsTypeLoading(false);
//       }
//     }

//     // Handle search types
//     const handleSearchTypes=async(searchInput)=>{
//       try{
//         handleFetchTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types?search=${searchInput}`);
//       }catch(error){
//         console.log(error);
//       }
//     }

//     const handleSelectTypes = (item) => {
//       if(item){
//         setValue("incidentId", item?.value);
//       }else{
//           setValue("incidentId",null);
//       }
//     };


//     // Site handlers
//     const handleFetchSites = async (link) =>{
//       setIsSiteLoading(true)
//         try {
//           let response = await handleFetch(link);     
//           if(response?.status === 200){
//             let formatedData = response?.data.map(item=>{
//               return {
//                 name:item?.name,
//                 value: item?.id
//               }
//             });
//             setSites(formatedData);
//           }
//         } catch (error) {
//           console.error(error);
//           toast.error("Échec de l'essai de récupération des sites");
//         }finally{
//           setIsSiteLoading(false);
//         }
//     }

//     const handleSearchSites=async(searchInput)=>{
//       try{
//         handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites?search=${searchInput}`);
//       }catch(error){
//         console.log(error);
//       }
//     }

//     const handleSelectSites = async (item) => {
//         setValue("equipementId", null);
//         if(item){
//           console.log("selected sites")
//             setValue("siteId", item.value);
//             await handleFetchEquipements(`${URLS.INCIDENT_API}/equipements/site/${item.value}`);
//         }else{
//             setValue("siteId", null);
//             setEquipments([]);
//         }
//     }

//     // shifts
//     const handleFetchShifts = async (link) =>{
//       setIsShiftLoading(true);
//       try {
//         let response = await handleFetch(link);     
//         if(response?.status === 200){
//           let formatedData = response?.data.map(item=>{
//             return {
//               name:item?.name,
//               value: item?.id
//             }
//           });
//           setShifts(formatedData);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally{
//         setIsShiftLoading(false);
//       }
//     }

//     const handleSearchShifts=async(searchInput)=>{
//       try{
//         handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/shifts?search=${searchInput}`);
//       }catch(error){
//         console.log(error);
//       }
//     }

//     const handleSelectShifts = (item) => {
//       if(item){
//         setValue("shiftId", item.value);
//       }else{
//         setValue("shiftId", null);
//       }
//     }

//     useEffect(()=>{
//       // handleFetchEquipements(`${import.meta.env.VITE_INCIDENT_API}/equipements`);
//       handleFetchTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types`);
//       handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
//       handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts`);
//     },[]);

//   return (
//     <form className='h-[350px] p-2' onSubmit={handleSubmit(handleSubmitDecleration)}>
//       <div className='h-[300px] overflow-y-scroll overflow-x-hidden'>
//         {/* incident type selection */}
//         {/* <div className='flex flex-col my-2'>
//           <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le type d'incident <span className='text-red-500'>*</span>:</label>
//           <AutoComplete
//             placeholder="Choisir un type d'incident"
//             isLoading={isTypeLoading}
//             dataList={incidentTypes}
//             onSearch={handleSearchTypes}
//             onSelect={handleSelectTypes}
//             register={{...register('incidentId', {required:'Ce champ est requis'})}}
//             error={errors.incidentId}
//           />
//           {errors.incidentId && <small className='text-xs text-red-500 mx-4'>{errors.incidentId.message}</small>}
//         </div> */}

//         {/* site selection */}
//         <div className='flex flex-col'>
//           <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le site <span className='text-red-500'>*</span>:</label>
//           <AutoComplete
//             placeholder="Choisir un site"
//             isLoading={isSiteLoading}
//             dataList={sites}
//             onSearch={handleSearchSites}
//             onSelect={handleSelectSites}
//             register={{...register('siteId', {required:'Ce champ est requis'})}}
//             error={errors.siteId}
//           />
//           {errors.siteId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.siteId.message}</small>}
//         </div>

//         {/* Equipement selection */}
//         {
//           watch("siteId") &&
//           <div className='flex flex-col'>
//             <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir l'equipement <span className='text-red-500'>*</span>:</label>
//             <AutoComplete
//               placeholder="Choisir un equipment"
//               isLoading={isEquipementLoading}
//               dataList={equipements}
//               onSearch={handleSearchEquipements}
//               onSelect={handleSelectEquipement}
//               register={{...register('equipementId', {required:'Ce champ est requis'})}}
//               error={errors.equipementId}
//             />
//             {errors.equipementId && <small className='text-xs text-red-500 mx-4'>{errors.equipementId.message}</small>}
//           </div>
//         }

//         {/* Shift selection */}
//         <div className='flex flex-col'>
//           <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le quart <span className='text-red-500'>*</span>:</label>
//           <AutoComplete
//             placeholder="Choisir un shift"
//             isLoading={isShiftLoading}
//             dataList={shifts}
//             onSearch={handleSearchShifts}
//             onSelect={handleSelectShifts}
//             register={{...register('shiftId', {required:'Ce champ est requis'})}}
//             error={errors.shiftId}
//           />
//           {errors.shiftId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.shiftId.message}</small>}
//         </div>

//         {/* Description */}
//         <div className='flex flex-col px-2'>
//           <label htmlFor="" className='text-sm px-2 font-semibold'>Description :</label>
//           <textarea {...register("description", {required:false})} className='p-2 rounded-lg tetx-sm w-full border' placeholder='Description'></textarea>
//         </div>

//       </div>
//       <div className='flex justify-end p-2'>
//         <Button className="bg-primary text-white my-2 text-sm w-1/3 hover:bg-secondary" disabled={isSubmiting}>
//           {isSubmiting ? <Preloader size={20}/> : <CheckCircle className='text-white'/> }
//           <span>{isSubmiting ? "En cours..."  :"Déclarer"}</span>
//         </Button>
//       </div>
//     </form>
//   )
// }

// export default InitiateForm
import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../hooks/useFetch';
import AutoComplete from '../common/AutoComplete';
import { Button } from '../ui/button';
import { CheckCircle, Upload, X } from 'lucide-react';
import Preloader from '../Preloader';
import toast from 'react-hot-toast';
import { URLS } from '../../../configUrl';

const InitiateForm = ({onSucess}) => {
    // const {register, handleSubmit, formState:{errors}, setValue, watch} = useForm();
    const { register, handleSubmit, formState:{errors}, setValue, watch, reset } = useForm();
    const {handleFetch, handlePost} = useFetch();

    const [isLoading, setIsLoading] = useState(true);
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [consommables, setConsommables] = useState([]);
    const [equipements, setEquipments] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [sites, setSites] = useState([]);
    const [supplierType, setSupplierType] = useState("");
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]); // Fichiers sélectionnés (pas encore uploadés)
    
    // loaders states
    const [isTypeLoading, setIsTypeLoading] = useState(true);
    const [isEquipementLoading, setIsEquipementLoading] = useState(true);
    const [isSiteLoading, setIsSiteLoading] = useState(true);
    const [isShiftLoading, setIsShiftLoading] = useState(true);
    const [isConsommableLoading, setIsConsommableLoading] = useState(true);

    // Fonction pour uploader les fichiers vers le serveur
    const uploadFilesToServer = async (files) => {
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch(`${import.meta.env.VITE_INCIDENT_API}/files/upload`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            
            if (result.success) {
                return result.data.map(file => ({
                    filename: file.filename,
                    url: file.url,
                    originalName: file.originalName
                }));
            } else {
                throw new Error('Erreur lors de l\'upload des fichiers');
            }
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    // Gestion du drop de fichiers
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        addFiles(files);
    };

    // Gestion du click sur input file
    const handleFileSelect = (e) => {
        const files = e.target.files;
        addFiles(files);
        e.target.value = ''; // Reset input
    };

    // Ajouter des fichiers à la liste des sélectionnés
    const addFiles = (files) => {
        const newFiles = Array.from(files).map(file => ({
            file: file,
            originalName: file.name,
            size: file.size,
            type: file.type
        }));
        
        setSelectedFiles(prev => [...prev, ...newFiles]);
        toast.success(`${newFiles.length} fichier(s) ajouté(s)`);
    };

    // Supprimer un fichier de la liste
    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        toast.success('Fichier retiré');
    };

    const handleSubmitDecleration = async (data) => {
        setIsSubmiting(true);
        
        try {
            let uploadedPhotos = [];
    
            // Étape 1: Upload fichiers
            if (selectedFiles.length > 0) {
                try {
                    const filesToUpload = selectedFiles.map(item => item.file);
                    uploadedPhotos = await uploadFilesToServer(filesToUpload);
                    toast.success('Fichiers uploadés avec succès');
                } catch (error) {
                    toast.error('Erreur lors de l\'upload des fichiers');
                    setIsSubmiting(false);
                    return;
                }
            }
    
            // Étape 2: Création incident
            const requestData = {
                ...data,
                photos: uploadedPhotos.map(photo => ({
                    url: photo.url,
                    filename: photo.originalName
                }))
            };
    
            let url = `${import.meta.env.VITE_INCIDENT_API}/incidents`;
            let response = await handlePost(url, requestData);
            
            if(response.error){
                response?.error_list.forEach(error => toast.error(error.msg));
                return;
            }
            
            toast.success("Incident déclaré avec succès");
            onSucess();
    
            // ✅ Vider le formulaire après succès
            reset();
            setSelectedFiles([]); // vider les fichiers uploadés
            
        } catch (error) {
            console.log(error);
            // toast.error("Erreur lors de la déclaration de l'incident");
        } finally {
            setIsSubmiting(false);
        }
    };
    

    // Fetch equipements
    const handleFetchEquipements = async (link) => {
        setIsEquipementLoading(true);
        try {
            let response = await handleFetch(link);     
            if(response?.status === 200){
                let formatedData = response?.data.map(item => {
                    return {
                        name: item?.title,
                        value: item?.id
                    }
                });
                setEquipments(formatedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsEquipementLoading(false);
        }
    }

    // Handle search equipements
    const handleSearchEquipements = async (searchInput) => {
        try {
            handleFetchEquipements(`${import.meta.env.VITE_INCIDENT_API}/equipements?search=${searchInput}`);
        } catch (error) {
            console.log(error);
        }
    }

    // Handle select equipement
    const handleSelectEquipement = (item) => {
        if(item){
            setValue("equipementId", item.value);
        } else {
            setValue("equipementId", null);
        }
    };

    // Incident causes
    const handleFetchCauses = async (link) => {
        setIsTypeLoading(true);
        try {
            let response = await handleFetch(link);     
            if(response?.status === 200){
                let formatedData = response?.data.map(item => {
                    return {
                        name: item?.name,
                        value: item?.id
                    }
                });
                // setIncidentCauses(formatedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsTypeLoading(false);
        }
    }

    // Handle search causes
    const handleSearchCauses = async (searchInput) => {
        try {
            handleFetchCauses(`${import.meta.env.VITE_INCIDENT_API}/incident-causes?search=${searchInput}`);
        } catch (error) {
            console.log(error);
        }
    }

    // Handle select cause
    const handleSelectCause = (item) => {
        setValue("incidentCauseId", item.value);
    };

    // Fetch incident types
    const handleFetchTypes = async (link) => {
        setIsTypeLoading(true);
        try {
            let response = await handleFetch(link);     
            if(response?.status === 200){
                let formatedData = response?.data.map(item => {
                    return {
                        name: item?.name,
                        value: item?.id
                    }
                });
                setIncidentTypes(formatedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsTypeLoading(false);
        }
    }

    // Handle search types
    const handleSearchTypes = async (searchInput) => {
        try {
            handleFetchTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types?search=${searchInput}`);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectTypes = (item) => {
        if(item){
            setValue("incidentId", item?.value);
        } else {
            setValue("incidentId", null);
        }
    };

    // Site handlers
    const handleFetchSites = async (link) => {
        setIsSiteLoading(true);
        try {
            let response = await handleFetch(link);     
            if(response?.status === 200){
                let formatedData = response?.data.map(item => {
                    return {
                        name: item?.name,
                        value: item?.id
                    }
                });
                setSites(formatedData);
            }
        } catch (error) {
            console.error(error);
            toast.error("Échec de l'essai de récupération des sites");
        } finally {
            setIsSiteLoading(false);
        }
    }

    const handleSearchSites = async (searchInput) => {
        try {
            handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites?search=${searchInput}`);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectSites = async (item) => {
        setValue("equipementId", null);
        if(item){
            console.log("selected sites");
            setValue("siteId", item.value);
            await handleFetchEquipements(`${URLS.INCIDENT_API}/equipements/site/${item.value}`);
        } else {
            setValue("siteId", null);
            setEquipments([]);
        }
    }

    // shifts
    const handleFetchShifts = async (link) => {
        setIsShiftLoading(true);
        try {
            let response = await handleFetch(link);     
            if(response?.status === 200){
                let formatedData = response?.data.map(item => {
                    return {
                        name: item?.name,
                        value: item?.id
                    }
                });
                setShifts(formatedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsShiftLoading(false);
        }
    }

    const handleSearchShifts = async (searchInput) => {
        try {
            handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts?search=${searchInput}`);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectShifts = (item) => {
        if(item){
            setValue("shiftId", item.value);
        } else {
            setValue("shiftId", null);
        }
    }

    useEffect(() => {
        handleFetchTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types`);
        handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
        handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts`);
    }, []);

    return (
        <form className='h-[450px] p-2' onSubmit={handleSubmit(handleSubmitDecleration)}>
            <div className='h-[400px] overflow-y-scroll overflow-x-hidden'>
                     {/* incident type selection */}
            {/* <div className='flex flex-col my-2'>
                <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le type d'incident <span className='text-red-500'>*</span>:</label>
                <AutoComplete
                    placeholder="Choisir un type d'incident"
                    isLoading={isTypeLoading}
                    dataList={incidentTypes}
                    onSearch={handleSearchTypes}
                    onSelect={handleSelectTypes}
                    register={{...register('incidentId', {required:'Ce champ est requis'})}}
                    error={errors.incidentId}
                />
                {errors.incidentId && <small className='text-xs text-red-500 mx-4'>{errors.incidentId.message}</small>}
                </div> */}
                {/* site selection */}
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le site <span className='text-red-500'>*</span>:</label>
                    <AutoComplete
                        placeholder="Choisir un site"
                        isLoading={isSiteLoading}
                        dataList={sites}
                        onSearch={handleSearchSites}
                        onSelect={handleSelectSites}
                        register={{...register('siteId', {required:'Ce champ est requis'})}}
                        error={errors.siteId}
                    />
                    {errors.siteId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.siteId.message}</small>}
                </div>

                {/* Equipement selection */}
                {watch("siteId") && (
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir l'equipement <span className='text-red-500'>*</span>:</label>
                        <AutoComplete
                            placeholder="Choisir un equipment"
                            isLoading={isEquipementLoading}
                            dataList={equipements}
                            onSearch={handleSearchEquipements}
                            onSelect={handleSelectEquipement}
                            register={{...register('equipementId', {required:'Ce champ est requis'})}}
                            error={errors.equipementId}
                        />
                        {errors.equipementId && <small className='text-xs text-red-500 mx-4'>{errors.equipementId.message}</small>}
                    </div>
                )}

                {/* Shift selection */}
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le quart <span className='text-red-500'>*</span>:</label>
                    <AutoComplete
                        placeholder="Choisir un shift"
                        isLoading={isShiftLoading}
                        dataList={shifts}
                        onSearch={handleSearchShifts}
                        onSelect={handleSelectShifts}
                        register={{...register('shiftId', {required:'Ce champ est requis'})}}
                        error={errors.shiftId}
                    />
                    {errors.shiftId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.shiftId.message}</small>}
                </div>

                {/* Description */}
                <div className='flex flex-col px-2'>
                    <label htmlFor="" className='text-sm px-2 font-semibold'>Description :</label>
                    <textarea 
                        {...register("description", {required:false})} 
                        className='p-2 rounded-lg text-sm w-full border' 
                        placeholder='Description'
                        rows={3}
                    ></textarea>
                </div>

                {/* Section pièces jointes */}
                <div className='flex flex-col px-2 mt-4'>
                    <label htmlFor="" className='text-sm px-2 font-semibold mb-2'>
                        Pièces jointes (photos, documents) :
                    </label>
                    
                    {/* Zone de drop */}
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600">
                            Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                        </p>
                        <small className="text-xs text-gray-500">
                            Formats acceptés: images, PDF, Word
                        </small>
                        <input 
                            id="file-input"
                            type="file" 
                            multiple 
                            className="hidden" 
                            onChange={handleFileSelect}
                            accept="image/*,.pdf,.doc,.docx"
                        />
                    </div>

                    {/* Liste des fichiers sélectionnés */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-3">
                            <p className="text-sm font-medium mb-2">
                                Fichiers à uploader ({selectedFiles.length}) :
                            </p>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                                            <span className="text-sm truncate flex-1">
                                                {file.originalName}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
            <div className='flex justify-end p-2'>
                <Button 
                    className="bg-primary text-white my-2 text-sm w-1/3 hover:bg-secondary" 
                    disabled={isSubmiting}
                >
                    {isSubmiting ? (
                        <>
                            <Preloader size={20}/>
                            <span>En cours...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className='text-white'/>
                            <span>Déclarer</span>
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

export default InitiateForm;