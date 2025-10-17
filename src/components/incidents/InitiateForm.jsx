// // export default InitiateForm
// import React, {useEffect, useState} from 'react';
// import { useForm } from 'react-hook-form';
// import { useFetch } from '../../hooks/useFetch';
// import AutoComplete from '../common/AutoComplete';
// import { Button } from '../ui/button';
// import { CheckCircle, Upload, X } from 'lucide-react';
// import Preloader from '../Preloader';
// import toast from 'react-hot-toast';
// import { URLS } from '../../../configUrl';

// const InitiateForm = ({onSucess}) => {
//     const { register, handleSubmit, formState:{errors}, setValue, watch, reset } = useForm();
//     const {handleFetch, handlePost} = useFetch();

//     const [isLoading, setIsLoading] = useState(true);
//     const [incidentTypes, setIncidentTypes] = useState([]);
//     const [consommables, setConsommables] = useState([]);
//     const [equipements, setEquipments] = useState([]);
//     const [shifts, setShifts] = useState([]);
//     const [sites, setSites] = useState([]);
//     const [supplierType, setSupplierType] = useState("");
//     const [isSubmiting, setIsSubmiting] = useState(false);
//     const [selectedFiles, setSelectedFiles] = useState([]);
    
//     // loaders states
//     const [isTypeLoading, setIsTypeLoading] = useState(true);
//     const [isEquipementLoading, setIsEquipementLoading] = useState(true);
//     const [isSiteLoading, setIsSiteLoading] = useState(true);
//     const [isShiftLoading, setIsShiftLoading] = useState(true);
//     const [isConsommableLoading, setIsConsommableLoading] = useState(true);

//     // Surveiller les valeurs des champs pour le reset
//     const currentSiteId = watch("siteId");
//     const currentEquipementId = watch("equipementId");
//     const currentShiftId = watch("shiftId");

//     // Fonction pour uploader les fichiers vers le serveur
//     const uploadFilesToServer = async (files) => {
//         try {
//             const formData = new FormData();
//             Array.from(files).forEach(file => {
//                 formData.append('files', file);
//             });

//             const response = await fetch(`${import.meta.env.VITE_INCIDENT_API}/files/upload`, {
//                 method: 'POST',
//                 body: formData,
//             });

//             const result = await response.json();
            
//             if (result.success) {
//                 return result.data.map(file => ({
//                     filename: file.filename,
//                     url: file.url,
//                     originalName: file.originalName
//                 }));
//             } else {
//                 throw new Error('Erreur lors de l\'upload des fichiers');
//             }
//         } catch (error) {
//             console.error('Upload error:', error);
//             throw error;
//         }
//     };

//     // Gestion du drop de fichiers
//     const handleDrop = (e) => {
//         e.preventDefault();
//         const files = e.dataTransfer.files;
//         addFiles(files);
//     };

//     // Gestion du click sur input file
//     const handleFileSelect = (e) => {
//         const files = e.target.files;
//         addFiles(files);
//         e.target.value = ''; // Reset input
//     };

//     // Ajouter des fichiers à la liste des sélectionnés
//     const addFiles = (files) => {
//         const newFiles = Array.from(files).map(file => ({
//             file: file,
//             originalName: file.name,
//             size: file.size,
//             type: file.type
//         }));
        
//         setSelectedFiles(prev => [...prev, ...newFiles]);
//         toast.success(`${newFiles.length} fichier(s) ajouté(s)`);
//     };

//     // Supprimer un fichier de la liste
//     const removeFile = (index) => {
//         setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//         toast.success('Fichier retiré');
//     };

//     const handleSubmitDecleration = async (data) => {
//         setIsSubmiting(true);
        
//         try {
//             let uploadedPhotos = [];
    
//             // Étape 1: Upload fichiers
//             if (selectedFiles.length > 0) {
//                 try {
//                     const filesToUpload = selectedFiles.map(item => item.file);
//                     uploadedPhotos = await uploadFilesToServer(filesToUpload);
//                     toast.success('Fichiers uploadés avec succès');
//                 } catch (error) {
//                     toast.error('Erreur lors de l\'upload des fichiers');
//                     setIsSubmiting(false);
//                     return;
//                 }
//             }
    
//             // Étape 2: Création incident
//             const requestData = {
//                 ...data,
//                 photos: uploadedPhotos.map(photo => ({
//                     url: photo.url,
//                     filename: photo.originalName
//                 }))
//             };
    
//             let url = `${import.meta.env.VITE_INCIDENT_API}/incidents`;
//             let response = await handlePost(url, requestData);
            
//             if(response.error){
//                 response?.error_list.forEach(error => toast.error(error.msg));
//                 return;
//             }
            
//             toast.success("Incident déclaré avec succès");
//             onSucess();
    
//             // ✅ Vider le formulaire après succès
//             resetForm();
            
//         } catch (error) {
//             console.log(error);
//             // toast.error("Erreur lors de la déclaration de l'incident");
//         } finally {
//             setIsSubmiting(false);
//         }
//     };

//     // Fonction pour réinitialiser le formulaire
//     const resetForm = () => {
//         reset({
//             description: "",
//             siteId: "",
//             equipementId: "",
//             shiftId: ""
//         });
//         setSelectedFiles([]); // vider les fichiers uploadés
//         setEquipments([]); // vider la liste des équipements
//     };

//     // Fetch equipements avec filtre par site - MODIFIÉ
//     const handleFetchEquipements = async (siteId, searchQuery = "") => {
//         if (!siteId) {
//             setEquipments([]);
//             return;
//         }

//         setIsEquipementLoading(true);
//         try {
//             // Construire l'URL avec le siteId et éventuellement le search
//             let url = `${import.meta.env.VITE_INCIDENT_API}/equipements`;
//             const params = new URLSearchParams();
            
//             // Toujours inclure le siteId
//             params.append('siteId', siteId);
            
//             if (searchQuery) {
//                 params.append('search', searchQuery);
//             }
            
//             url += `?${params.toString()}`;
            
//             console.log("Fetching equipements with URL:", url); // Pour debug
            
//             let response = await handleFetch(url);     
//             if(response?.status === 200){
//                 let dataArray = response?.data;
                
//                 // Gérer différentes structures de réponse
//                 if (dataArray && typeof dataArray === 'object' && dataArray.data && Array.isArray(dataArray.data)) {
//                     dataArray = dataArray.data;
//                 }
                
//                 if (Array.isArray(dataArray)) {
//                     let formatedData = dataArray.map(item => {
//                         return {
//                             name: item?.title || item?.name,
//                             value: item?.id
//                         }
//                     });
//                     setEquipments(formatedData);
//                 } else {
//                     console.error('Expected array for equipements but got:', dataArray);
//                     setEquipments([]);
//                 }
//             } else {
//                 console.error('Failed to fetch equipements:', response);
//                 setEquipments([]);
//             }
//         } catch (error) {
//             console.error('Error fetching equipements:', error);
//             toast.error("Erreur lors de la récupération des équipements");
//             setEquipments([]);
//         } finally {
//             setIsEquipementLoading(false);
//         }
//     }

//     // Handle search equipements - MODIFIÉ
//     const handleSearchEquipements = async (searchInput) => {
//         try {
//             if (!currentSiteId) {
//                 toast.error("Veuillez d'abord sélectionner un site");
//                 return;
//             }
//             await handleFetchEquipements(currentSiteId, searchInput);
//         } catch (error) {
//             console.log(error);
//             toast.error("Erreur lors de la recherche des équipements");
//         }
//     }

//     // Handle select equipement
//     const handleSelectEquipement = (item) => {
//         if(item){
//             setValue("equipementId", item.value);
//         } else {
//             setValue("equipementId", null);
//         }
//     };

//     // Incident causes
//     const handleFetchCauses = async (link) => {
//         setIsTypeLoading(true);
//         try {
//             let response = await handleFetch(link);     
//             if(response?.status === 200){
//                 let formatedData = response?.data.map(item => {
//                     return {
//                         name: item?.name,
//                         value: item?.id
//                     }
//                 });
//                 // setIncidentCauses(formatedData);
//             }
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setIsTypeLoading(false);
//         }
//     }

//     // Handle search causes
//     const handleSearchCauses = async (searchInput) => {
//         try {
//             handleFetchCauses(`${import.meta.env.VITE_INCIDENT_API}/incident-causes?search=${searchInput}`);
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     // Handle select cause
//     const handleSelectCause = (item) => {
//         setValue("incidentCauseId", item.value);
//     };

//     // Fetch incident types
//     const handleFetchTypes = async (link) => {
//         setIsTypeLoading(true);
//         try {
//             let response = await handleFetch(link);     
//             if(response?.status === 200){
//                 let formatedData = response?.data.map(item => {
//                     return {
//                         name: item?.name,
//                         value: item?.id
//                     }
//                 });
//                 setIncidentTypes(formatedData);
//             }
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setIsTypeLoading(false);
//         }
//     }

//     // Handle search types
//     const handleSearchTypes = async (searchInput) => {
//         try {
//             handleFetchTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types?search=${searchInput}`);
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const handleSelectTypes = (item) => {
//         if(item){
//             setValue("incidentId", item?.value);
//         } else {
//             setValue("incidentId", null);
//         }
//     };

//     // Site handlers
//     const handleFetchSites = async (link) => {
//         setIsSiteLoading(true);
//         try {
//             let response = await handleFetch(link);     
//             if(response?.status === 200){
//                 let dataArray = response?.data;
                
//                 if (dataArray && typeof dataArray === 'object' && dataArray.data && Array.isArray(dataArray.data)) {
//                     dataArray = dataArray.data;
//                 }
                
//                 if (Array.isArray(dataArray)) {
//                     let formatedData = dataArray.map(item => {
//                         return {
//                             name: item?.name,
//                             value: item?.id
//                         }
//                     });
//                     setSites(formatedData);
//                 } else {
//                     console.error('Expected array for sites but got:', dataArray);
//                     setSites([]);
//                 }
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error("Échec de l'essai de récupération des sites");
//         } finally {
//             setIsSiteLoading(false);
//         }
//     }

//     const handleSearchSites = async (searchInput) => {
//         try {
//             handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites?search=${searchInput}`);
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const handleSelectSites = async (item) => {
//         setValue("equipementId", null); // Réinitialiser l'équipement sélectionné
//         setEquipments([]); // Vider la liste des équipements
        
//         if(item){
//             setValue("siteId", item.value);
//             // Charger les équipements du site sélectionné
//             await handleFetchEquipements(item.value);
//         } else {
//             setValue("siteId", null);
//             setEquipments([]);
//         }
//     }

//     // shifts
//     const handleFetchShifts = async (link) => {
//         setIsShiftLoading(true);
//         try {
//             let response = await handleFetch(link);     
//             if(response?.status === 200){
//                 let dataArray = response?.data;
                
//                 if (dataArray && typeof dataArray === 'object' && dataArray.data && Array.isArray(dataArray.data)) {
//                     dataArray = dataArray.data;
//                 }
                
//                 if (Array.isArray(dataArray)) {
//                     let formatedData = dataArray.map(item => {
//                         return {
//                             name: item?.name,
//                             value: item?.id
//                         }
//                     });
//                     setShifts(formatedData);
//                 } else {
//                     console.error('Expected array for shifts but got:', dataArray);
//                     setShifts([]);
//                 }
//             }
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setIsShiftLoading(false);
//         }
//     }

//     const handleSearchShifts = async (searchInput) => {
//         try {
//             handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts?search=${searchInput}`);
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const handleSelectShifts = (item) => {
//         if(item){
//             setValue("shiftId", item.value);
//         } else {
//             setValue("shiftId", null);
//         }
//     }

//     // Recharger les équipements quand le site change
//     useEffect(() => {
//         if (currentSiteId) {
//             handleFetchEquipements(currentSiteId);
//         }
//     }, [currentSiteId]);

//     useEffect(() => {
//         handleFetchTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types`);
//         handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
//         handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts`);
//     }, []);

//     return (
//         <form className='h-[450px] p-2' onSubmit={handleSubmit(handleSubmitDecleration)}>
//             <div className='h-[400px] overflow-y-scroll overflow-x-hidden'>
//                 {/* Description */}
//                 <div className='flex flex-col px-2'>
//                     <label htmlFor="" className='text-sm px-2 font-semibold'>Description :</label>
//                     <textarea 
//                         {...register("description", {required:false})} 
//                         className='p-2 rounded-lg text-sm w-full border' 
//                         placeholder='Description'
//                         rows={3}
//                     ></textarea>
//                 </div>
//                 {/* site selection */}
//                 <div className='flex flex-col'>
//                     <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le site <span className='text-red-500'>*</span>:</label>
//                     <AutoComplete
//                         placeholder="Choisir un site"
//                         isLoading={isSiteLoading}
//                         dataList={sites}
//                         onSearch={handleSearchSites}
//                         onSelect={handleSelectSites}
//                         register={{...register('siteId', {required:'Ce champ est requis'})}}
//                         error={errors.siteId}
//                     />
//                     {errors.siteId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.siteId.message}</small>}
//                 </div>

//                 {/* Equipement selection */}
//                 {watch("siteId") && (
//                     <div className='flex flex-col'>
//                         <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir l'equipement <span className='text-red-500'>*</span>:</label>
//                         <AutoComplete
//                             placeholder="Choisir un equipment"
//                             isLoading={isEquipementLoading}
//                             dataList={equipements}
//                             onSearch={handleSearchEquipements}
//                             onSelect={handleSelectEquipement}
//                             register={{...register('equipementId', {required:'Ce champ est requis'})}}
//                             error={errors.equipementId}
//                         />
//                         {errors.equipementId && <small className='text-xs text-red-500 mx-4'>{errors.equipementId.message}</small>}
//                         {equipements.length === 0 && !isEquipementLoading && (
//                             <small className='text-xs text-gray-500 mx-4'>
//                                 Aucun équipement trouvé pour ce site
//                             </small>
//                         )}
//                     </div>
//                 )}

//                 {/* Shift selection */}
//                 <div className='flex flex-col'>
//                     <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le quart <span className='text-red-500'>*</span>:</label>
//                     <AutoComplete
//                         placeholder="Choisir un shift"
//                         isLoading={isShiftLoading}
//                         dataList={shifts}
//                         onSearch={handleSearchShifts}
//                         onSelect={handleSelectShifts}
//                         register={{...register('shiftId', {required:'Ce champ est requis'})}}
//                         error={errors.shiftId}
//                     />
//                     {errors.shiftId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.shiftId.message}</small>}
//                 </div>

//                 {/* Section pièces jointes */}
//                 <div className='flex flex-col px-2 mt-4'>
//                     <label htmlFor="" className='text-sm px-2 font-semibold mb-2'>
//                         Pièces jointes (photos, documents) :
//                     </label>
                    
//                     {/* Zone de drop */}
//                     <div 
//                         className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
//                         onDrop={handleDrop}
//                         onDragOver={(e) => e.preventDefault()}
//                         onClick={() => document.getElementById('file-input').click()}
//                     >
//                         <Upload className="mx-auto h-8 w-8 text-gray-400" />
//                         <p className="text-sm text-gray-600">
//                             Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
//                         </p>
//                         <small className="text-xs text-gray-500">
//                             Formats acceptés: images, PDF, Word
//                         </small>
//                         <input 
//                             id="file-input"
//                             type="file" 
//                             multiple 
//                             className="hidden" 
//                             onChange={handleFileSelect}
//                             accept="image/*,.pdf,.doc,.docx"
//                         />
//                     </div>

//                     {/* Liste des fichiers sélectionnés */}
//                     {selectedFiles.length > 0 && (
//                         <div className="mt-3">
//                             <p className="text-sm font-medium mb-2">
//                                 Fichiers à uploader ({selectedFiles.length}) :
//                             </p>
//                             <div className="space-y-2 max-h-32 overflow-y-auto">
//                                 {selectedFiles.map((file, index) => (
//                                     <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
//                                         <div className="flex items-center space-x-2 flex-1 min-w-0">
//                                             <span className="text-sm truncate flex-1">
//                                                 {file.originalName}
//                                             </span>
//                                             <span className="text-xs text-gray-500">
//                                                 ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                                             </span>
//                                         </div>
//                                         <button 
//                                             type="button"
//                                             onClick={() => removeFile(index)}
//                                             className="text-red-500 hover:text-red-700 ml-2"
//                                         >
//                                             <X size={16} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//             </div>
//             <div className='flex justify-end p-2'>
//                 <Button 
//                     className="bg-primary text-white my-2 text-sm w-1/3 hover:bg-secondary" 
//                     disabled={isSubmiting}
//                 >
//                     {isSubmiting ? (
//                         <>
//                             <Preloader size={20}/>
//                             <span>En cours...</span>
//                         </>
//                     ) : (
//                         <>
//                             <CheckCircle className='text-white'/>
//                             <span>Déclarer</span>
//                         </>
//                     )}
//                 </Button>
//             </div>
//         </form>
//     )
// }

// export default InitiateForm;

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
    // ===== HOOKS REACT-HOOK-FORM =====
    const { register, handleSubmit, formState:{errors}, setValue, watch, reset } = useForm();
    const {handleFetch, handlePost} = useFetch();

    // ===== ÉTATS DU COMPOSANT =====
    const [isLoading, setIsLoading] = useState(true);
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [consommables, setConsommables] = useState([]);
    const [equipements, setEquipments] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [sites, setSites] = useState([]);
    const [supplierType, setSupplierType] = useState("");
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    // ===== ÉTATS DE CHARGEMENT =====
    const [isTypeLoading, setIsTypeLoading] = useState(true);
    const [isEquipementLoading, setIsEquipementLoading] = useState(true);
    const [isSiteLoading, setIsSiteLoading] = useState(true);
    const [isShiftLoading, setIsShiftLoading] = useState(true);
    const [isConsommableLoading, setIsConsommableLoading] = useState(true);

    // ===== SURVEILLANCE DES CHAMPS POUR LE RESET =====
    const currentSiteId = watch("siteId");
    const currentEquipementId = watch("equipementId");
    const currentShiftId = watch("shiftId");

    // ===== FONCTIONS DE GESTION DES FICHIERS =====

    /**
     * Upload les fichiers vers le serveur
     * @param {FileList} files - Liste des fichiers à uploader
     * @returns {Promise<Array>} Liste des fichiers uploadés avec leurs métadonnées
     */
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

    /**
     * Gestion du drop de fichiers
     * @param {React.DragEvent} e - Événement de drop
     */
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        addFiles(files);
    };

    /**
     * Gestion de la sélection de fichiers via input
     * @param {React.ChangeEvent} e - Événement de changement
     */
    const handleFileSelect = (e) => {
        const files = e.target.files;
        addFiles(files);
        e.target.value = ''; // Reset input pour permettre la sélection des mêmes fichiers
    };

    /**
     * Ajoute des fichiers à la liste des sélectionnés
     * @param {FileList} files - Fichiers à ajouter
     */
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

    /**
     * Supprime un fichier de la liste
     * @param {number} index - Index du fichier à supprimer
     */
    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        toast.success('Fichier retiré');
    };

    // ===== SOUMISSION DU FORMULAIRE =====

    /**
     * Gère la soumission du formulaire de déclaration d'incident
     * @param {Object} data - Données du formulaire
     */
    const handleSubmitDecleration = async (data) => {
        setIsSubmiting(true);
        
        try {
            let uploadedPhotos = [];
    
            // ÉTAPE 1: Upload des fichiers
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
    
            // ÉTAPE 2: Création de l'incident
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
    
            // ÉTAPE 3: Réinitialisation complète du formulaire
            resetFormComplete();
            
        } catch (error) {
            console.log(error);
            // toast.error("Erreur lors de la déclaration de l'incident");
        } finally {
            setIsSubmiting(false);
        }
    };

    // ===== FONCTIONS DE RÉINITIALISATION =====

    /**
     * Réinitialise complètement le formulaire après soumission
     */
    const resetFormComplete = () => {
        // 1. Réinitialiser les valeurs du formulaire react-hook-form
        reset({
            description: "",
            siteId: "",
            equipementId: "",
            shiftId: ""
        });
        
        // 2. Vider les états locaux
        setSelectedFiles([]);
        setEquipments([]);
        
        // 3. Utiliser setTimeout pour s'assurer que la réinitialisation se fait après le cycle de rendu
        setTimeout(() => {
            // Réinitialiser manuellement les valeurs pour forcer la mise à jour des AutoComplete
            setValue("siteId", "");
            setValue("equipementId", "");
            setValue("shiftId", "");
            
            // Vider à nouveau la liste des équipements pour être certain
            setEquipments([]);
            
            console.log("✅ Formulaire complètement réinitialisé");
        }, 100);
    };

    // ===== FONCTIONS DE GESTION DES ÉQUIPEMENTS =====

    /**
     * Récupère les équipements filtrés par site et recherche
     * @param {string} siteId - ID du site pour le filtrage
     * @param {string} searchQuery - Terme de recherche (optionnel)
     */
    const handleFetchEquipements = async (siteId, searchQuery = "") => {
        if (!siteId) {
            setEquipments([]);
            return;
        }

        setIsEquipementLoading(true);
        try {
            // Construire l'URL avec les paramètres
            let url = `${import.meta.env.VITE_INCIDENT_API}/equipements`;
            const params = new URLSearchParams();
            
            // Toujours inclure le siteId pour le filtrage
            params.append('siteId', siteId);
            
            // Ajouter la recherche si fournie
            if (searchQuery) {
                params.append('search', searchQuery);
            }
            
            url += `?${params.toString()}`;
            
            console.log("🔍 Fetching equipements with URL:", url);
            
            let response = await handleFetch(url);     
            if(response?.status === 200){
                let dataArray = response?.data;
                
                // Gérer différentes structures de réponse de l'API
                if (dataArray && typeof dataArray === 'object' && dataArray.data && Array.isArray(dataArray.data)) {
                    dataArray = dataArray.data;
                }
                
                if (Array.isArray(dataArray)) {
                    // Formater les données pour l'AutoComplete
                    let formatedData = dataArray.map(item => {
                        return {
                            name: item?.title || item?.name,
                            value: item?.id
                        }
                    });
                    setEquipments(formatedData);
                    console.log(`✅ Found ${formatedData.length} equipments for site ${siteId}`);
                } else {
                    console.error('❌ Expected array for equipements but got:', dataArray);
                    setEquipments([]);
                }
            } else {
                console.error('❌ Failed to fetch equipements:', response);
                setEquipments([]);
            }
        } catch (error) {
            console.error('❌ Error fetching equipements:', error);
            toast.error("Erreur lors de la récupération des équipements");
            setEquipments([]);
        } finally {
            setIsEquipementLoading(false);
        }
    }

    /**
     * Gère la recherche d'équipements avec validation du site
     * @param {string} searchInput - Terme de recherche
     */
    const handleSearchEquipements = async (searchInput) => {
        try {
            if (!currentSiteId) {
                toast.error("Veuillez d'abord sélectionner un site");
                return;
            }
            await handleFetchEquipements(currentSiteId, searchInput);
        } catch (error) {
            console.log(error);
            toast.error("Erreur lors de la recherche des équipements");
        }
    }

    /**
     * Gère la sélection d'un équipement
     * @param {Object} item - Équipement sélectionné
     */
    const handleSelectEquipement = (item) => {
        if(item){
            setValue("equipementId", item.value);
        } else {
            setValue("equipementId", null);
        }
    };

    // ===== FONCTIONS DE GESTION DES SITES =====

    /**
     * Récupère la liste des sites
     * @param {string} link - URL de l'API
     */
    const handleFetchSites = async (link) => {
        setIsSiteLoading(true);
        try {
            let response = await handleFetch(link);     
            if(response?.status === 200){
                let dataArray = response?.data;
                
                // Gérer la structure de réponse
                if (dataArray && typeof dataArray === 'object' && dataArray.data && Array.isArray(dataArray.data)) {
                    dataArray = dataArray.data;
                }
                
                if (Array.isArray(dataArray)) {
                    let formatedData = dataArray.map(item => {
                        return {
                            name: item?.name,
                            value: item?.id
                        }
                    });
                    setSites(formatedData);
                } else {
                    console.error('Expected array for sites but got:', dataArray);
                    setSites([]);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Échec de l'essai de récupération des sites");
        } finally {
            setIsSiteLoading(false);
        }
    }

    /**
     * Gère la recherche de sites
     * @param {string} searchInput - Terme de recherche
     */
    const handleSearchSites = async (searchInput) => {
        try {
            handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites?search=${searchInput}`);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Gère la sélection d'un site et charge ses équipements
     * @param {Object} item - Site sélectionné
     */
    const handleSelectSites = async (item) => {
        // Réinitialiser l'équipement sélectionné et la liste
        setValue("equipementId", null);
        setEquipments([]);
        
        if(item){
            setValue("siteId", item.value);
            // Charger les équipements du site sélectionné
            await handleFetchEquipements(item.value);
        } else {
            setValue("siteId", null);
            setEquipments([]);
        }
    }

    // ===== FONCTIONS DE GESTION DES SHIFTS =====

    /**
     * Récupère la liste des shifts
     * @param {string} link - URL de l'API
     */
    const handleFetchShifts = async (link) => {
        setIsShiftLoading(true);
        try {
            let response = await handleFetch(link);     
            if(response?.status === 200){
                let dataArray = response?.data;
                
                if (dataArray && typeof dataArray === 'object' && dataArray.data && Array.isArray(dataArray.data)) {
                    dataArray = dataArray.data;
                }
                
                if (Array.isArray(dataArray)) {
                    let formatedData = dataArray.map(item => {
                        return {
                            name: item?.name,
                            value: item?.id
                        }
                    });
                    setShifts(formatedData);
                } else {
                    console.error('Expected array for shifts but got:', dataArray);
                    setShifts([]);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsShiftLoading(false);
        }
    }

    /**
     * Gère la recherche de shifts
     * @param {string} searchInput - Terme de recherche
     */
    const handleSearchShifts = async (searchInput) => {
        try {
            handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts?search=${searchInput}`);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Gère la sélection d'un shift
     * @param {Object} item - Shift sélectionné
     */
    const handleSelectShifts = (item) => {
        if(item){
            setValue("shiftId", item.value);
        } else {
            setValue("shiftId", null);
        }
    }

    // ===== EFFETS =====

    /**
     * Recharge les équipements quand le site change
     */
    useEffect(() => {
        if (currentSiteId) {
            handleFetchEquipements(currentSiteId);
        }
    }, [currentSiteId]);

    /**
     * Charge les données initiales au montage du composant
     */
    useEffect(() => {
        handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
        handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts`);
    }, []);

    // ===== RENDU DU COMPOSANT =====
    return (
        <form className='h-[450px] p-2' onSubmit={handleSubmit(handleSubmitDecleration)}>
            <div className='h-[400px] overflow-y-scroll overflow-x-hidden'>
                
                {/* CHAMP DESCRIPTION */}
                <div className='flex flex-col px-2'>
                    <label htmlFor="" className='text-sm px-2 font-semibold'>Description :</label>
                    <textarea 
                        {...register("description", {required:false})} 
                        className='p-2 rounded-lg text-sm w-full border' 
                        placeholder='Description'
                        rows={3}
                    ></textarea>
                </div>

                {/* SELECTION DU SITE */}
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

                {/* SELECTION DE L'ÉQUIPEMENT (visible seulement si un site est sélectionné) */}
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
                        {equipements.length === 0 && !isEquipementLoading && (
                            <small className='text-xs text-gray-500 mx-4'>
                                Aucun équipement trouvé pour ce site
                            </small>
                        )}
                    </div>
                )}

                {/* SELECTION DU SHIFT */}
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

                {/* SECTION PIÈCES JOINTES */}
                <div className='flex flex-col px-2 mt-4'>
                    <label htmlFor="" className='text-sm px-2 font-semibold mb-2'>
                        Pièces jointes (photos, documents) :
                    </label>
                    
                    {/* ZONE DE DROP */}
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

                    {/* LISTE DES FICHIERS SÉLECTIONNÉS */}
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

            {/* BOUTON DE SOUMISSION */}
            <div className='flex justify-end p-2'>
                <Button 
                    className="bg-primary text-white my-2 text-sm w-1/3 hover:bg-secondary" 
                    disabled={isSubmiting}
                    type="submit"
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