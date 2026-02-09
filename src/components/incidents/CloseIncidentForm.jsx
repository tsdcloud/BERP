// import React, { useEffect, useState, useCallback, useRef } from 'react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
// import { useForm } from 'react-hook-form';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';
// import AutoComplete from '../common/AutoComplete';
// import { Button } from '../ui/button';
// import { CheckCircle } from 'lucide-react';
// import Preloader from '../Preloader';
// import { getEquipmentDomain } from '../../utils/equipment.utils';
// import toast from 'react-hot-toast';

// const CloseIncidentForm = ({isOpen, setIsOpen, fetchData, selectedRow}) => {
//     const {register, handleSubmit, formState:{errors}, setValue, watch, reset} = useForm({
//         defaultValues: {
//             hasStoppedOperations: false
//         }
//     });
    
//     const {handleFetch, handlePatch} = useFetch();

//     const [employees, setEmployees] = useState([]);
//     const [entities, setEntities] = useState([]);
//     const [incidentCauses, setIncidentCauses] = useState([]);
//     const [incidentTypes, setIncidentTypes] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState("");

//     const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
//     const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
//     const [isLoadingCauses, setIsLoadingCauses] = useState(false);
//     const [isLoadingTypes, setIsLoadingTypes] = useState(false);
    
//     const hasStoppedOperationsValue = watch("hasStoppedOperations");
    
//     // Références pour éviter les re-renders inutiles
//     const technicianRef = useRef(null);
//     const incidentTypeRef = useRef(null);
//     const incidentCauseRef = useRef(null);
//     const hasLoadedInitialDataRef = useRef(false);

//     // Fonction pour trouver un item par sa valeur - stable
//     const findItemByValue = useCallback((list, value) => {
//         return list.find(item => item.value === value) || null;
//     }, []);

//     // Fonctions de chargement des données - stabilisées
//     const handleEmployees = useCallback(async (searchInput = "") => {
//         setIsLoadingEmployees(true);
//         try {
//             const url = searchInput 
//                 ? `${URLS.ENTITY_API}/employees?search=${searchInput}`
//                 : `${URLS.ENTITY_API}/employees`;
            
//             let response = await handleFetch(url);
//             if(response?.status === 200) {
//                 let formattedData = response.data.map(employee => ({
//                     name: employee?.name || "",
//                     value: employee?.id
//                 }));
//                 setEmployees(formattedData);
//             }
//         } catch (error) {
//             console.error("Erreur chargement employés:", error);
//         } finally {
//             setIsLoadingEmployees(false);
//         }
//     }, [handleFetch]);

//     const handleEntities = useCallback(async (searchInput = "") => {
//         setIsLoadingSuppliers(true);
//         try {
//             const url = searchInput 
//                 ? `${URLS.ENTITY_API}/suppliers?search=${searchInput}`
//                 : `${URLS.ENTITY_API}/suppliers`;
            
//             let response = await handleFetch(url);
//             if(response?.status === 200) {
//                 let formattedData = response.data.map(entity => ({
//                     name: entity?.name || "",
//                     value: entity?.id
//                 }));
//                 setEntities(formattedData);
//             }
//         } catch (error) {
//             console.error("Erreur chargement entités:", error);
//         } finally {
//             setIsLoadingSuppliers(false);
//         }
//     }, [handleFetch]);

//     const handleIncidentTypes = useCallback(async (searchInput = "", equipmentDomain = null) => {
//         setIsLoadingTypes(true);
//         try {
//             let baseUrl = `${URLS.INCIDENT_API}/incident-types`;
//             let queryParams = [];
            
//             if (searchInput) queryParams.push(`search=${searchInput}`);
//             if (equipmentDomain) queryParams.push(`domain=${equipmentDomain}`);
            
//             const url = queryParams.length > 0 
//                 ? `${baseUrl}?${queryParams.join('&')}`
//                 : baseUrl;
            
//             let response = await handleFetch(url);
//             if(response?.status === 200) {
//                 let formattedData = response.data.map(entity => ({
//                     name: entity?.name || "",
//                     value: entity?.id
//                 }));
//                 setIncidentTypes(formattedData);
//             }
//         } catch (error) {
//             console.error("Erreur chargement types:", error);
//         } finally {
//             setIsLoadingTypes(false);
//         }
//     }, [handleFetch]);

//     const handleIncidentCauses = useCallback(async (searchInput = "", incidentTypeId = null) => {
//         setIsLoadingCauses(true);
//         try {
//             let baseUrl = `${URLS.INCIDENT_API}/incident-causes`;
//             let queryParams = [];
            
//             if (searchInput) queryParams.push(`search=${searchInput}`);
//             if (incidentTypeId) queryParams.push(`incidentTypeId=${incidentTypeId}`);
            
//             const url = queryParams.length > 0 
//                 ? `${baseUrl}?${queryParams.join('&')}`
//                 : baseUrl;
            
//             let response = await handleFetch(url);
//             if(response?.status === 200) {
//                 let formattedData = response.data.map(entity => ({
//                     name: entity?.name || "",
//                     value: entity?.id
//                 }));
//                 setIncidentCauses(formattedData);
//             }
//         } catch (error) {
//             console.error("Erreur chargement causes:", error);
//         } finally {
//             setIsLoadingCauses(false);
//         }
//     }, [handleFetch]);

//     const handleIncidentTypeSelect = useCallback((item) => {
//         if (item) {
//             setValue("incidentId", item.value, { shouldValidate: true });
//             // Recharger les causes avec le filtre du type sélectionné
//             handleIncidentCauses("", item.value);
//         } else {
//             setValue("incidentId", "");
//             // Recharger toutes les causes
//             handleIncidentCauses();
//         }
//     }, [setValue, handleIncidentCauses]);

//     const handleIntervenantSelect = useCallback((item) => {
//         if (item) {
//             setValue("technician", item.value, { shouldValidate: true });
//         } else {
//             setValue("technician", "");
//         }
//     }, [setValue]);

//     const handleCauseSelect = useCallback((item) => {
//         if (item) {
//             setValue("incidentCauseId", item.value, { shouldValidate: true });
//         } else {
//             setValue("incidentCauseId", "");
//         }
//     }, [setValue]);

//     const onSubmit = async (data) => {
//         if (!selectedRow?.id) {
//             toast.error("Aucun incident sélectionné");
//             return;
//         }

//         // Validation des champs requis
//         if (!data.incidentId) {
//             toast.error("Le type d'incident est requis");
//             return;
//         }

//         if (!data.incidentCauseId) {
//             toast.error("La cause de l'incident est requise");
//             return;
//         }

//         setIsSubmitting(true);
//         setError("");

//         try {
//             const payload = {
//                 status: "CLOSED",
//                 technician: data.technician || null,
//                 incidentId: data.incidentId,
//                 incidentCauseId: data.incidentCauseId,
//                 hasStoppedOperations: Boolean(data.hasStoppedOperations),
//             };

//             // Ajouter la date de clôture manuelle si fournie
//             if (data.closedManuDate) {
//                 const date = new Date(data.closedManuDate);
//                 if (!isNaN(date.getTime())) {
//                     payload.closedManuDate = date.toISOString();
//                 }
//             }
//             console.log("Payload envoyé:", JSON.stringify(payload, null, 2));

//             const response = await handlePatch(
//                 `${URLS.INCIDENT_API}/incidents/${selectedRow.id}`,
//                 payload
//             );

//             if (response?.error) {
//                 toast.error("Erreur: " + response.error);
//                 return;
//             }

//             toast.success("Incident clôturé avec succès");
//             fetchData();
//             handleClose();
            
//         } catch (error) {
//             console.error("Erreur clôture:", error);
//             toast.error("Erreur lors de la clôture de l'incident");
//             setError(error.message || "Une erreur est survenue");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleClose = useCallback(() => {
//         setIsOpen(false);
//         reset({
//             hasStoppedOperations: false,
//             technician: "",
//             incidentId: "",
//             incidentCauseId: "",
//             closedManuDate: ""
//         });
        
//         // Réinitialiser les AutoComplete
//         if (technicianRef.current) technicianRef.current.clear();
//         if (incidentTypeRef.current) incidentTypeRef.current.clear();
//         if (incidentCauseRef.current) incidentCauseRef.current.clear();
        
//         // Réinitialiser les états
//         setEmployees([]);
//         setEntities([]);
//         setIncidentTypes([]);
//         setIncidentCauses([]);
//         setError("");
//         hasLoadedInitialDataRef.current = false;
//     }, [setIsOpen, reset]);

//     // Recherche combinée employés/suppliers
//     const handleSearchIntervenant = useCallback(async (searchInput) => {
//         await handleEmployees(searchInput);
//         await handleEntities(searchInput);
//     }, [handleEmployees, handleEntities]);

//     // Effet principal pour charger les données initiales
//     useEffect(() => {
//         if (isOpen && selectedRow && !hasLoadedInitialDataRef.current) {
//             hasLoadedInitialDataRef.current = true;
            
//             const equipmentDomain = selectedRow?.equipement ? 
//                 getEquipmentDomain(selectedRow.equipement) : null;

//             // Charger les données initiales
//             const loadInitialData = async () => {
//                 try {
//                     await Promise.all([
//                         handleEmployees(),
//                         handleEntities(),
//                         handleIncidentTypes("", equipmentDomain),
//                         selectedRow?.incidentId 
//                             ? handleIncidentCauses("", selectedRow.incidentId)
//                             : handleIncidentCauses()
//                     ]);
//                 } catch (error) {
//                     console.error("Erreur chargement données initiales:", error);
//                 }
//             };

//             loadInitialData();
//         }
//     }, [isOpen, selectedRow, handleEmployees, handleEntities, handleIncidentTypes, handleIncidentCauses]);

//     // Effet pour pré-remplir les champs quand les données sont chargées
//     useEffect(() => {
//         if (isOpen && selectedRow && incidentTypes.length > 0 && incidentCauses.length > 0) {
//             // Pré-remplir les valeurs du formulaire
//             const setInitialValues = () => {
//                 if (selectedRow.hasStoppedOperations !== undefined) {
//                     setValue("hasStoppedOperations", selectedRow.hasStoppedOperations);
//                 }

//                 // Mettre à jour les AutoComplete après un court délai
//                 setTimeout(() => {
//                     if (selectedRow.technician) {
//                         const technicianItem = findItemByValue([...employees, ...entities], selectedRow.technician);
//                         if (technicianItem && technicianRef.current) {
//                             technicianRef.current.setValue(technicianItem);
//                         }
//                     }
                    
//                     if (selectedRow.incidentId) {
//                         const incidentTypeItem = findItemByValue(incidentTypes, selectedRow.incidentId);
//                         if (incidentTypeItem && incidentTypeRef.current) {
//                             incidentTypeRef.current.setValue(incidentTypeItem);
//                         }
//                     }
                    
//                     if (selectedRow.incidentCauseId) {
//                         const causeItem = findItemByValue(incidentCauses, selectedRow.incidentCauseId);
//                         if (causeItem && incidentCauseRef.current) {
//                             incidentCauseRef.current.setValue(causeItem);
//                         }
//                     }
//                 }, 100);
//             };

//             setInitialValues();
//         }
//     }, [isOpen, selectedRow, incidentTypes, incidentCauses, employees, entities, findItemByValue, setValue]);

//     // Nettoyer le ref quand le modal se ferme
//     useEffect(() => {
//         if (!isOpen) {
//             hasLoadedInitialDataRef.current = false;
//         }
//     }, [isOpen]);

//     return ( 
//         <Dialog open={isOpen} onOpenChange={handleClose}>
//             <DialogContent className="max-w-md">
//                 <DialogHeader>
//                     <DialogTitle className="text-lg font-semibold">
//                         Clôturer l'incident #{selectedRow?.numRef || ""}
//                     </DialogTitle>
//                     <DialogDescription>
//                         Finalisez la résolution de cet incident
//                     </DialogDescription>
//                 </DialogHeader>
                
//                 {error && (
//                     <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
//                         {error}
//                     </div>
//                 )}
                
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                     {/* Intervenant */}
//                     <div>
//                         <label className="block text-sm font-medium mb-1">
//                             Intervenant (optionnel)
//                         </label>
//                         <AutoComplete 
//                             ref={technicianRef}
//                             dataList={[...employees, ...entities]}
//                             placeholder="Sélectionner un intervenant..."
//                             isLoading={isLoadingSuppliers || isLoadingEmployees}
//                             onSearch={handleSearchIntervenant}
//                             onSelect={handleIntervenantSelect}
//                             clearDependency={[isOpen]}
//                         />
//                     </div>

//                     {/* Type d'incident */}
//                     <div>
//                         <label className="block text-sm font-medium mb-1">
//                             Type d'incident <span className="text-red-500">*</span>
//                         </label>
//                         <AutoComplete 
//                             ref={incidentTypeRef}
//                             dataList={incidentTypes}
//                             placeholder="Sélectionner un type d'incident..."
//                             isLoading={isLoadingTypes}
//                             onSearch={(input) => {
//                                 const equipmentDomain = selectedRow?.equipement ? 
//                                     getEquipmentDomain(selectedRow.equipement) : null;
//                                 handleIncidentTypes(input, equipmentDomain);
//                             }}
//                             onSelect={handleIncidentTypeSelect}
//                             clearDependency={[isOpen]}
//                         />
//                         {errors.incidentId && (
//                             <p className="text-xs text-red-500 mt-1">Ce champ est requis</p>
//                         )}
//                     </div>

//                     {/* Cause d'incident */}
//                     <div>
//                         <label className="block text-sm font-medium mb-1">
//                             Cause d'incident <span className="text-red-500">*</span>
//                         </label>
//                         <AutoComplete 
//                             ref={incidentCauseRef}
//                             dataList={incidentCauses}
//                             placeholder="Sélectionner une cause..."
//                             isLoading={isLoadingCauses}
//                             onSearch={(input) => {
//                                 const incidentId = watch("incidentId");
//                                 handleIncidentCauses(input, incidentId);
//                             }}
//                             onSelect={handleCauseSelect}
//                             clearDependency={[isOpen]}
//                         />
//                         {errors.incidentCauseId && (
//                             <p className="text-xs text-red-500 mt-1">Ce champ est requis</p>
//                         )}
//                     </div>

//                     {/* Arrêt opération */}
//                     <div className="p-3 bg-gray-50 rounded-lg">
//                         <label className="flex items-center space-x-2 cursor-pointer">
//                             <input
//                                 type="checkbox"
//                                 {...register("hasStoppedOperations")}
//                                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                             />
//                             <span className="font-medium text-sm">
//                                 L'incident a causé un arrêt des opérations
//                             </span>
//                         </label>
//                         <p className="text-xs text-gray-500 mt-1">
//                             {hasStoppedOperationsValue ? 
//                                 "✓ Arrêt opération enregistré" : 
//                                 "Aucun arrêt opération"}
//                         </p>
//                     </div>

//                     {/* Date de clôture optionnelle */}
//                     <div>
//                         <label htmlFor="closedManuDate" className="block text-sm font-medium mb-1">
//                             Date de clôture (optionnel)
//                         </label>
//                         <input
//                             type="datetime-local"
//                             id="closedManuDate"
//                             {...register("closedManuDate")}
//                             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//                         />
//                     </div>

//                     {/* Bouton de soumission */}
//                     <div className="flex justify-end pt-4 space-x-2">
//                         <Button 
//                             type="button"
//                             variant="outline"
//                             onClick={handleClose}
//                             disabled={isSubmitting}
//                         >
//                             Annuler
//                         </Button>
//                         <Button 
//                             type="submit"
//                             disabled={isSubmitting} 
//                             className="flex items-center gap-2 bg-primary text-white hover:bg-secondary"
//                         >
//                             {isSubmitting ? (
//                                 <>
//                                     <Preloader size={16} />
//                                     <span>Clôture en cours...</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <CheckCircle className="h-4 w-4" />
//                                     <span>Clôturer</span>
//                                 </>
//                             )}
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }

// export default CloseIncidentForm;

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import AutoComplete from '../common/AutoComplete';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';
import Preloader from '../Preloader';
import { getEquipmentDomain } from '../../utils/equipment.utils';
import toast from 'react-hot-toast';

const CloseIncidentForm = ({isOpen, setIsOpen, fetchData, selectedRow}) => {
    const {register, handleSubmit, formState:{errors}, setValue, watch, reset} = useForm({
        defaultValues: {
            hasStoppedOperations: false,
            technician: "",
            incidentId: "",
            incidentCauseId: "",
            closedManuDate: ""
        }
    });
    
    const {handleFetch, handlePatch} = useFetch();

    const [employees, setEmployees] = useState([]);
    const [entities, setEntities] = useState([]);
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
    const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
    const [isLoadingCauses, setIsLoadingCauses] = useState(false);
    const [isLoadingTypes, setIsLoadingTypes] = useState(false);
    
    const hasStoppedOperationsValue = watch("hasStoppedOperations");
    const selectedIncidentTypeId = watch("incidentId");
    
    // Références pour les AutoComplete
    const technicianRef = useRef(null);
    const incidentTypeRef = useRef(null);
    const incidentCauseRef = useRef(null);
    
    // Flag pour éviter les chargements multiples
    const isInitializedRef = useRef(false);

    // Enregistrer manuellement les champs pour react-hook-form
    useEffect(() => {
        register("technician");
        register("incidentId", { required: "Le type d'incident est requis" });
        register("incidentCauseId", { required: "La cause est requise" });
    }, [register]);

    // Fonctions de chargement - stabilisées avec useCallback
    const handleEmployees = useCallback(async (searchInput = "") => {
        setIsLoadingEmployees(true);
        try {
            let url = `${URLS.ENTITY_API}/employees`;
            if (searchInput) {
                url += `?search=${encodeURIComponent(searchInput)}`;
            }
            url += `${searchInput ? '&' : '?'}limit=50`;
            
            let response = await handleFetch(url);
            if(response?.status === 200) {
                let formattedData = response.data.map(employee => ({
                    name: employee?.name || "",
                    value: employee?.id
                }));
                setEmployees(formattedData);
                return formattedData;
            }
            return [];
        } catch (error) {
            console.error("Erreur chargement employés:", error);
            return [];
        } finally {
            setIsLoadingEmployees(false);
        }
    }, [handleFetch]);

    const handleEntities = useCallback(async (searchInput = "") => {
        setIsLoadingSuppliers(true);
        try {
            let url = `${URLS.ENTITY_API}/suppliers`;
            if (searchInput) {
                url += `?search=${encodeURIComponent(searchInput)}`;
            }
            url += `${searchInput ? '&' : '?'}limit=50`;
            
            let response = await handleFetch(url);
            if(response?.status === 200) {
                let formattedData = response.data.map(entity => ({
                    name: entity?.name || "",
                    value: entity?.id
                }));
                setEntities(formattedData);
                return formattedData;
            }
            return [];
        } catch (error) {
            console.error("Erreur chargement entités:", error);
            return [];
        } finally {
            setIsLoadingSuppliers(false);
        }
    }, [handleFetch]);

    const handleIncidentTypes = useCallback(async (searchInput = "", equipmentDomain = null) => {
        setIsLoadingTypes(true);
        try {
            let url = `${URLS.INCIDENT_API}/incident-types?`;
            let queryParams = [];
            
            if (searchInput) queryParams.push(`search=${encodeURIComponent(searchInput)}`);
            if (equipmentDomain) queryParams.push(`domain=${equipmentDomain}`);
            queryParams.push('limit=50');
            
            url += queryParams.join('&');
            
            let response = await handleFetch(url);
            if(response?.status === 200) {
                let formattedData = response.data.map(entity => ({
                    name: entity?.name || "",
                    value: entity?.id
                }));
                setIncidentTypes(formattedData);
                return formattedData;
            }
            return [];
        } catch (error) {
            console.error("Erreur chargement types:", error);
            return [];
        } finally {
            setIsLoadingTypes(false);
        }
    }, [handleFetch]);

    const handleIncidentCauses = useCallback(async (searchInput = "", incidentTypeId = null) => {
        setIsLoadingCauses(true);
        try {
            let url = `${URLS.INCIDENT_API}/incident-causes?`;
            let queryParams = [];
            
            if (searchInput) queryParams.push(`search=${encodeURIComponent(searchInput)}`);
            if (incidentTypeId) queryParams.push(`incidentTypeId=${incidentTypeId}`);
            queryParams.push('limit=50');
            
            url += queryParams.join('&');
            
            let response = await handleFetch(url);
            if(response?.status === 200) {
                let formattedData = response.data.map(entity => ({
                    name: entity?.name || "",
                    value: entity?.id
                }));
                setIncidentCauses(formattedData);
                return formattedData;
            }
            return [];
        } catch (error) {
            console.error("Erreur chargement causes:", error);
            return [];
        } finally {
            setIsLoadingCauses(false);
        }
    }, [handleFetch]);

    // Handlers de sélection
    const handleIncidentTypeSelect = useCallback((item) => {
        const value = item ? item.value : "";
        setValue("incidentId", value, { shouldValidate: true });
        
        // Réinitialiser la cause quand on change le type
        setValue("incidentCauseId", "", { shouldValidate: false });
        if (incidentCauseRef.current) {
            incidentCauseRef.current.clear();
        }
        
        // Recharger les causes filtrées par le nouveau type
        if (value) {
            handleIncidentCauses("", value);
        } else {
            handleIncidentCauses();
        }
    }, [setValue, handleIncidentCauses]);

    const handleIntervenantSelect = useCallback((item) => {
        setValue("technician", item ? item.value : "", { shouldValidate: false });
    }, [setValue]);

    const handleCauseSelect = useCallback((item) => {
        setValue("incidentCauseId", item ? item.value : "", { shouldValidate: true });
    }, [setValue]);

    // Recherche combinée employés/suppliers
    const handleSearchIntervenant = useCallback(async (searchInput) => {
        const [employeesData, entitiesData] = await Promise.all([
            handleEmployees(searchInput),
            handleEntities(searchInput)
        ]);
        return [...employeesData, ...entitiesData];
    }, [handleEmployees, handleEntities]);

    // Effet principal - chargement initial et pré-remplissage
    useEffect(() => {
        if (!isOpen) {
            isInitializedRef.current = false;
            return;
        }

        if (isInitializedRef.current) return;
        isInitializedRef.current = true;

        const equipmentDomain = selectedRow?.equipement ? 
            getEquipmentDomain(selectedRow.equipement) : null;

        // Charger toutes les données en parallèle
        const loadData = async () => {
            try {
                const [employeesData, entitiesData, typesData, causesData] = await Promise.all([
                    handleEmployees(),
                    handleEntities(),
                    handleIncidentTypes("", equipmentDomain),
                    selectedRow?.incidentId 
                        ? handleIncidentCauses("", selectedRow.incidentId)
                        : handleIncidentCauses()
                ]);

                // Pré-remplir les valeurs après chargement
                if (selectedRow) {
                    // Valeurs simples
                    if (selectedRow.hasStoppedOperations !== undefined) {
                        setValue("hasStoppedOperations", selectedRow.hasStoppedOperations);
                    }

                    // AutoComplete - avec un délai pour s'assurer que les refs sont prêts
                    setTimeout(() => {
                        // Intervenant
                        if (selectedRow.technician) {
                            setValue("technician", selectedRow.technician);
                            const allIntervenants = [...employeesData, ...entitiesData];
                            const technicianItem = allIntervenants.find(
                                item => item.value === selectedRow.technician
                            );
                            if (technicianItem && technicianRef.current) {
                                technicianRef.current.setValue(technicianItem);
                            }
                        }
                        
                        // Type d'incident
                        if (selectedRow.incidentId) {
                            setValue("incidentId", selectedRow.incidentId);
                            const incidentTypeItem = typesData.find(
                                item => item.value === selectedRow.incidentId
                            );
                            if (incidentTypeItem && incidentTypeRef.current) {
                                incidentTypeRef.current.setValue(incidentTypeItem);
                            }
                        }
                        
                        // Cause
                        if (selectedRow.incidentCauseId) {
                            setValue("incidentCauseId", selectedRow.incidentCauseId);
                            const causeItem = causesData.find(
                                item => item.value === selectedRow.incidentCauseId
                            );
                            if (causeItem && incidentCauseRef.current) {
                                incidentCauseRef.current.setValue(causeItem);
                            }
                        }
                    }, 150);
                }
            } catch (error) {
                console.error("Erreur chargement données:", error);
                toast.error("Erreur lors du chargement des données");
            }
        };

        loadData();
    }, [
        isOpen, 
        selectedRow, 
        handleEmployees, 
        handleEntities, 
        handleIncidentTypes, 
        handleIncidentCauses,
        setValue
    ]);

    // Recharger les causes quand le type d'incident change
    useEffect(() => {
        if (selectedIncidentTypeId && isOpen) {
            handleIncidentCauses("", selectedIncidentTypeId);
        }
    }, [selectedIncidentTypeId, isOpen, handleIncidentCauses]);

    const onSubmit = async (data) => {
        if (!selectedRow?.id) {
            toast.error("Aucun incident sélectionné");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const payload = {
                status: "CLOSED",
                technician: data.technician || null,
                incidentId: data.incidentId,
                incidentCauseId: data.incidentCauseId,
                hasStoppedOperations: Boolean(data.hasStoppedOperations),
            };

            if (data.closedManuDate) {
                const date = new Date(data.closedManuDate);
                if (!isNaN(date.getTime())) {
                    payload.closedManuDate = date.toISOString();
                }
            }

            const response = await handlePatch(
                `${URLS.INCIDENT_API}/incidents/${selectedRow.id}`,
                payload
            );

            if (response?.error) {
                toast.error("Erreur: " + response.error);
                return;
            }

            toast.success("Incident clôturé avec succès");
            fetchData();
            handleClose();
            
        } catch (error) {
            console.error("Erreur clôture:", error);
            toast.error("Erreur lors de la clôture de l'incident");
            setError(error.message || "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = useCallback(() => {
        setIsOpen(false);
        
        // Nettoyer les AutoComplete
        if (technicianRef.current) technicianRef.current.clear();
        if (incidentTypeRef.current) incidentTypeRef.current.clear();
        if (incidentCauseRef.current) incidentCauseRef.current.clear();
        
        // Reset du formulaire
        reset({
            hasStoppedOperations: false,
            technician: "",
            incidentId: "",
            incidentCauseId: "",
            closedManuDate: ""
        });
        
        // Réinitialiser les états
        setEmployees([]);
        setEntities([]);
        setIncidentTypes([]);
        setIncidentCauses([]);
        setError("");
        isInitializedRef.current = false;
    }, [setIsOpen, reset]);

    return ( 
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Clôturer l'incident #{selectedRow?.numRef || ""}
                    </DialogTitle>
                    <DialogDescription>
                        Finalisez la résolution de cet incident
                    </DialogDescription>
                </DialogHeader>
                
                {error && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Intervenant */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Intervenant (optionnel)
                        </label>
                        <AutoComplete 
                            ref={technicianRef}
                            dataList={[...employees, ...entities]}
                            placeholder="Sélectionner un intervenant..."
                            isLoading={isLoadingSuppliers || isLoadingEmployees}
                            onSearch={handleSearchIntervenant}
                            onSelect={handleIntervenantSelect}
                        />
                    </div>

                    {/* Type d'incident */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Type d'incident <span className="text-red-500">*</span>
                        </label>
                        <AutoComplete 
                            ref={incidentTypeRef}
                            dataList={incidentTypes}
                            placeholder="Sélectionner un type d'incident..."
                            isLoading={isLoadingTypes}
                            onSearch={(input) => {
                                const equipmentDomain = selectedRow?.equipement ? 
                                    getEquipmentDomain(selectedRow.equipement) : null;
                                handleIncidentTypes(input, equipmentDomain);
                            }}
                            onSelect={handleIncidentTypeSelect}
                        />
                        {errors.incidentId && (
                            <p className="text-xs text-red-500 mt-1">{errors.incidentId.message}</p>
                        )}
                    </div>

                    {/* Cause d'incident */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Cause d'incident <span className="text-red-500">*</span>
                        </label>
                        <AutoComplete 
                            ref={incidentCauseRef}
                            dataList={incidentCauses}
                            placeholder="Sélectionner une cause..."
                            isLoading={isLoadingCauses}
                            onSearch={(input) => {
                                const incidentId = watch("incidentId");
                                handleIncidentCauses(input, incidentId);
                            }}
                            onSelect={handleCauseSelect}
                        />
                        {errors.incidentCauseId && (
                            <p className="text-xs text-red-500 mt-1">{errors.incidentCauseId.message}</p>
                        )}
                    </div>

                    {/* Arrêt opération */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register("hasStoppedOperations")}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="font-medium text-sm">
                                L'incident a causé un arrêt des opérations
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            {hasStoppedOperationsValue ? 
                                "✓ Arrêt opération enregistré" : 
                                "Aucun arrêt opération"}
                        </p>
                    </div>

                    {/* Date de clôture optionnelle */}
                    <div>
                        <label htmlFor="closedManuDate" className="block text-sm font-medium mb-1">
                            Date de clôture (optionnel)
                        </label>
                        <input
                            type="datetime-local"
                            id="closedManuDate"
                            {...register("closedManuDate")}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end pt-4 space-x-2">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isSubmitting} 
                            className="flex items-center gap-2 bg-primary text-white hover:bg-secondary"
                        >
                            {isSubmitting ? (
                                <>
                                    <Preloader size={16} />
                                    <span>Clôture en cours...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Clôturer</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CloseIncidentForm;