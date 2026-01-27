// import React, { useState, useEffect } from 'react'
// import { useForm } from 'react-hook-form';
// import { Input } from '../../ui/input';
// import { Button } from '../../ui/button';
// import { useFetch } from '../../../hooks/useFetch';
// import { URLS } from '../../../../configUrl';
// import toast from 'react-hot-toast';
// import AutoComplete from '../../common/AutoComplete';

// const EditForm = ({ cause, onSucess, onCancel }) => {
//     const { register, handleSubmit, formState: { errors }, setValue } = useForm();
//     const { handlePatch } = useFetch();
//     const [incidentTypes, setIncidentTypes] = useState([]);
//     const [isLoadingTypes, setIsLoadingTypes] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [initialIncidentType, setInitialIncidentType] = useState(null);

//     useEffect(() => {
//         if (cause) {
//             // Initialiser les valeurs du formulaire
//             setValue('name', cause.name || '');
            
//             // Préparer la valeur initiale pour l'AutoComplete
//             if (cause.incidentType) {
//                 const initialValue = {
//                     name: cause.incidentType.name,
//                     value: cause.incidentType.id
//                 };
//                 setInitialIncidentType(initialValue);
//                 setValue('incidentTypeId', cause.incidentType.id);
//             }
//         }
//     }, [cause, setValue]);

//     const handleSearchIncidentTypes = async (searchInput) => {
//         try {
//             setIsLoadingTypes(true);
            
//             // Construire l'URL correctement
//             const url = `${URLS.INCIDENT_API}/incident-types${
//                 searchInput ? `?search=${encodeURIComponent(searchInput)}` : ''
//             }`;
            
//             const response = await fetch(url, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
            
//             if (response.ok) {
//                 const data = await response.json();
//                 const formattedTypes = data.data.map(type => ({
//                     name: type.name,
//                     value: type.id
//                 }));
//                 setIncidentTypes(formattedTypes);
//             } else {
//                 console.error('Erreur de chargement des types');
//                 setIncidentTypes([]);
//             }
//         } catch (error) {
//             console.error('Erreur:', error);
//             setIncidentTypes([]);
//         } finally {
//             setIsLoadingTypes(false);
//         }
//     };

//     const handleSelectIncidentType = (item) => {
//         if (item) {
//             setValue('incidentTypeId', item.value);
//         } else {
//             setValue('incidentTypeId', '');
//         }
//     };

//     const submitForm = async (data) => {
//         setIsSubmitting(true);
//         try {
//             const url = `${URLS.INCIDENT_API}/incident-causes/${cause.id}`;
//             const response = await handlePatch(url, data);
            
//             if (response.error) {
//                 toast.error("Erreur lors de la mise à jour");
//                 return;
//             }
            
//             toast.success("Mis à jour avec succès");
//             onSucess();
//         } catch (error) {
//             console.log(error);
//             toast.error("Erreur lors de la mise à jour");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (!cause) {
//         return <div className="p-4 text-center">Chargement...</div>;
//     }

//     return (
//         <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
//             <div className='flex flex-col'>
//                 <label className="block text-sm font-medium mb-1">
//                     Nom de la cause <span className="text-red-500">*</span>
//                 </label>
//                 <Input 
//                     {...register("name", { 
//                         required: "Ce champ est requis"
//                     })} 
//                     className="outline-none" 
//                     placeholder="Entrer le nom de la cause"
//                 />
//                 {errors.name && (
//                     <small className='text-xs mt-1 text-red-500'>{errors.name.message}</small>
//                 )}
//             </div>

//             <div className='flex flex-col'>
//                 <label className="block text-sm font-medium mb-1">
//                     Type d'incident associé
//                 </label>
//                 <AutoComplete
//                     placeholder="Rechercher un type d'incident..."
//                     isLoading={isLoadingTypes}
//                     dataList={incidentTypes}
//                     onSearch={handleSearchIncidentTypes}
//                     onSelect={handleSelectIncidentType}
//                     register={{...register('incidentTypeId')}}
//                     initialValue={initialIncidentType} // Utiliser la valeur initiale
//                 />
//             </div>

//             <div className="flex gap-2 pt-4">
//                 <Button 
//                     type="button" 
//                     variant="outline" 
//                     onClick={onCancel}
//                     className="flex-1"
//                 >
//                     Annuler
//                 </Button>
//                 <Button 
//                     type="submit" 
//                     className="bg-primary text-white font-normal py-2 flex-1"
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? "Enregistrement..." : "Enregistrer"}
//                 </Button>
//             </div>
//         </form>
//     )
// }

// export default EditForm;

// import React, { useState, useEffect, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { Input } from '../../ui/input';
// import { Button } from '../../ui/button';
// import { useFetch } from '../../../hooks/useFetch';
// import { URLS } from '../../../../configUrl';
// import toast from 'react-hot-toast';
// import AutoComplete from '../../common/AutoComplete';

// const EditForm = ({ cause, onSucess, onCancel }) => {
//     const { register, handleSubmit, formState: { errors }, setValue } = useForm();
//     const { handlePatch } = useFetch();
//     const [incidentTypes, setIncidentTypes] = useState([]);
//     const [isLoadingTypes, setIsLoadingTypes] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [initialIncidentType, setInitialIncidentType] = useState(null);

//     // Enregistrer manuellement le champ caché pour l'ID
//     useEffect(() => {
//         register('incidentTypeId'); 
//     }, [register]);

//     useEffect(() => {
//         if (cause) {
//             setValue('name', cause.name || '');
//             if (cause.incidentType) {
//                 const initialValue = {
//                     name: cause.incidentType.name,
//                     value: cause.incidentType.id
//                 };
//                 setInitialIncidentType(initialValue);
//                 setValue('incidentTypeId', cause.incidentType.id);
//             }
//         }
//     }, [cause, setValue]);

//     // Ajout d'un Debounce pour éviter de bloquer l'UI
//     const handleSearchIncidentTypes = useCallback(async (searchInput) => {
//         if (!searchInput) return;
        
//         setIsLoadingTypes(true);
//         try {
//             const url = `${URLS.INCIDENT_API}/incident-types?search=${encodeURIComponent(searchInput)}`;
//             const response = await fetch(url, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
            
//             if (response.ok) {
//                 const data = await response.json();
//                 const formattedTypes = data.data.map(type => ({
//                     name: type.name,
//                     value: type.id
//                 }));
//                 setIncidentTypes(formattedTypes);
//             }
//         } catch (error) {
//             console.error('Erreur:', error);
//         } finally {
//             setIsLoadingTypes(false);
//         }
//     }, []);

//     const handleSelectIncidentType = (item) => {
//         // On met à jour la valeur "cachée" du formulaire
//         setValue('incidentTypeId', item ? item.value : '');
//     };

//     const submitForm = async (data) => {
//         setIsSubmitting(true);
//         try {
//             const url = `${URLS.INCIDENT_API}/incident-causes/${cause.id}`;
//             const response = await handlePatch(url, data);
            
//             if (response.error) {
//                 toast.error("Erreur lors de la mise à jour");
//                 return;
//             }
            
//             toast.success("Mis à jour avec succès");
//             onSucess();
//         } catch (error) {
//             console.log(error);
//             toast.error("Erreur lors de la mise à jour");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (!cause) {
//         return <div className="p-4 text-center">Chargement...</div>;
//     }

//     return (
//         <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
//             {/* Champ Nom */}
//             <div className='flex flex-col'>
//                 <label className="text-sm font-medium mb-1">Nom de la cause</label>
//                 <Input {...register("name", { required: "Requis" })} />
//             </div>

//             {/* AutoComplete - SANS le spread du register ici */}
//             <div className='flex flex-col'>
//                 <label className="text-sm font-medium mb-1">Type d'incident</label>
//                 <AutoComplete
//                     placeholder="Rechercher un type d'incident..."
//                     isLoading={isLoadingTypes}
//                     dataList={incidentTypes}
//                     onSearch={handleSearchIncidentTypes}
//                     onSelect={handleSelectIncidentType}
//                     initialValue={initialIncidentType}
//                 />
//             </div>
//             <div className="flex gap-2 pt-4">
//                 <Button 
//                     type="button" 
//                     variant="outline" 
//                     onClick={onCancel}
//                     className="flex-1"
//                 >
//                     Annuler
//                 </Button>
//                 <Button 
//                     type="submit" 
//                     className="bg-primary text-white font-normal py-2 flex-1"
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? "Enregistrement..." : "Enregistrer"}
//                 </Button>
//             </div>
//         </form>
//     );
// };
// export default EditForm;

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import toast from 'react-hot-toast';
import AutoComplete from '../../common/AutoComplete';
import { CheckCircle, XCircle } from 'lucide-react';
import Preloader from "../../Preloader";
import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';

const EditForm = ({ cause, onSucess, onCancel, userDomain = "PRIVILEGED" }) => {
    const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm({
        // Configuration par défaut pour permettre les champs vides
        defaultValues: {
            name: '',
            description: '',
            incidentTypeId: ''
        }
    });
    const { handlePatch } = useFetch();
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [isLoadingTypes, setIsLoadingTypes] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialIncidentType, setInitialIncidentType] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(false);
    
    // Surveiller la valeur de incidentTypeId
    const incidentTypeId = watch("incidentTypeId");

    // Enregistrer les champs - description optionnelle
    useEffect(() => {
        register('name', { required: "Le nom de la cause est requis" });
        register('description'); // Champ optionnel, pas de validation required
        register('incidentTypeId'); // Champ optionnel
    }, [register]);

    useEffect(() => {
        if (cause) {
            console.log("Cause reçue pour édition:", cause);
            
            // Initialiser les valeurs du formulaire
            setValue('name', cause.name || '');
            setValue('description', cause.description || '');
            
            // Préparer la valeur initiale pour l'AutoComplete
            if (cause.incidentType) {
                const initialValue = {
                    name: cause.incidentType.name,
                    value: cause.incidentType.id,
                    domain: cause.incidentType.domain
                };
                setInitialIncidentType(initialValue);
                // Utiliser le bon nom de champ: incidentTypeId
                setValue('incidentTypeId', cause.incidentType.id);
                
                // Vérifier si l'utilisateur peut modifier ce type d'incident
                // if (userDomain !== "PRIVILEGED" && cause.incidentType.domain !== userDomain) {
                //     setIsReadOnly(true);
                //     toast.error("Vous ne pouvez modifier que les causes de votre domaine");
                // }
            } else {
                // Si pas de type d'incident, effacer la valeur
                setValue('incidentTypeId', '');
            }
        }
    }, [cause, setValue, userDomain]);

    // Recherche des types d'incident avec filtrage par domaine
    const handleSearchIncidentTypes = useCallback(async (searchInput) => {
        // if (!searchInput || isReadOnly) return;
        
        setIsLoadingTypes(true);
        try {
            let url = `${URLS.INCIDENT_API}/incident-types?search=${encodeURIComponent(searchInput)}`;
            
            // Ajouter le filtre par domaine si l'utilisateur n'est pas privilégié
            // if (userDomain && userDomain !== "PRIVILEGED") {
            //     url += `&domain=${userDomain}`;
            // }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const formattedTypes = data.data.map(type => ({
                    name: type.name,
                    value: type.id,
                    domain: type.domain
                }));
                setIncidentTypes(formattedTypes);
            } else {
                console.error('Erreur API:', response.status);
                setIncidentTypes([]);
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            setIncidentTypes([]);
        } finally {
            setIsLoadingTypes(false);
        }
    }, [userDomain, isReadOnly]);

    const handleSelectIncidentType = (item) => {
        if (isReadOnly) return;
        
        // Vérifier si le type sélectionné est autorisé

        // if (item && userDomain !== "PRIVILEGED" && item.domain !== userDomain) {
        //     toast.error("Vous ne pouvez sélectionner que des types d'incident de votre domaine");
        //     return;
        // }
        
        setValue('incidentTypeId', item ? item.value : '');
        console.log("Type d'incident sélectionné:", item ? item.value : 'null');
    };

    const submitForm = async (data) => {
        // if (isReadOnly) {
        //     toast.error("Vous n'avez pas la permission de modifier cette cause");
        //     return;
        // }

        setIsSubmitting(true);
        try {
            console.log("Données reçues du formulaire:", data);
            
            // Vérifier les données requises
            if (!data.name || data.name.trim() === '') {
                toast.error("Le nom de la cause est requis");
                setIsSubmitting(false);
                return;
            }
            
            // Vérifier si l'utilisateur a sélectionné un type d'incident d'un domaine non autorisé
            
            // if (data.incidentTypeId && data.incidentTypeId.trim() !== '') {
            //     const selectedType = incidentTypes.find(type => type.value === data.incidentTypeId);
            //     if (selectedType && userDomain !== "PRIVILEGED" && selectedType.domain !== userDomain) {
            //         toast.error("Vous ne pouvez sélectionner que des types d'incident de votre domaine");
            //         setIsSubmitting(false);
            //         return;
            //     }
            // }

            // Préparer les données pour l'API
            const payload = {
                name: data.name.trim()
            };
            
            // Ajouter description si elle existe (peut être vide)
            if (data.description !== undefined) {
                // Si description est une chaîne vide, l'envoyer comme chaîne vide
                payload.description = data.description !== null ? String(data.description) : '';
            }
            
            // Ajouter incidentTypeId seulement si une valeur est sélectionnée
            if (data.incidentTypeId && data.incidentTypeId.trim() !== '') {
                payload.incidentTypeId = data.incidentTypeId;
            } else {
                // Si pas de type d'incident sélectionné, envoyer null pour dissocier
                payload.incidentTypeId = null;
            }
            
            console.log("Payload envoyé à l'API:", payload);
            
            const url = `${URLS.INCIDENT_API}/incident-causes/${cause.id}`;
            const response = await handlePatch(url, payload, true);
            
            console.log("Réponse API:", response);
            
            if (response.error) {
                if (response.errors && Array.isArray(response.errors)) {
                    // Afficher les erreurs de validation
                    response.errors.forEach(err => {
                        toast.error(`${err.param}: ${err.msg}`);
                    });
                } else {
                    toast.error("Erreur lors de la mise à jour");
                }
                console.log("Erreur détaillée:", response);
                setIsSubmitting(false);
                return;
            }
            
            toast.success("Mis à jour avec succès");
            onSucess();
            
        } catch (error) {
            console.error("Erreur catch:", error);
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!cause) {
        return (
            <div className="p-6 text-center">
                <Preloader size={32} />
                <p className="mt-2 text-gray-600">Chargement des données...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
            {/* Champ Nom (obligatoire) */}
            <div className='flex flex-col'>
                <label className="text-sm font-medium mb-1">
                    Nom de la cause <span className="text-red-500">*</span>
                </label>
                <Input 
                    {...register("name")} // La validation est faite dans le submit
                    className="outline-none"
                    placeholder="Entrer le nom de la cause"
                    disabled={isReadOnly}
                />
                {errors.name && (
                    <small className='text-xs mt-1 text-red-500'>{errors.name.message}</small>
                )}
            </div>

            {/* Type d'incident associé (optionnel) */}
            <div className='flex flex-col'>
                <label className="text-sm font-medium mb-1">
                    Type d'incident
                </label>
                <AutoComplete
                    placeholder="Rechercher un type d'incident..."
                    isLoading={isLoadingTypes}
                    dataList={incidentTypes}
                    onSearch={handleSearchIncidentTypes}
                    onSelect={handleSelectIncidentType}
                    initialValue={initialIncidentType}
                    // disabled={isReadOnly}
                    allowClear={true}
                />
                
                {/* Afficher le domaine actuel */}
                {cause.incidentType?.domain && (
                    <div className="mt-1">
                        <span className="text-xs text-gray-500">Domaine actuel : </span>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                            cause.incidentType.domain === "IT" ? "bg-blue-100 text-blue-800" :
                            cause.incidentType.domain === "HSE" ? "bg-red-100 text-red-800" :
                            cause.incidentType.domain === "OPERATIONS" ? "bg-green-100 text-green-800" :
                            cause.incidentType.domain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                        }`}>
                            {EQUIPMENT_DOMAIN.find(d => d.value === cause.incidentType.domain)?.label || cause.incidentType.domain}
                        </span>
                    </div>
                )}
                
                {/* Champ caché pour incidentTypeId */}
                <input 
                    type="hidden"
                    {...register("incidentTypeId")}
                />
                
                {/* Debug: Afficher la valeur actuelle */}
                {/* <div className="text-xs text-gray-400 mt-1">
                    ID sélectionné: {incidentTypeId || 'Aucun'}
                </div>
                
                {isReadOnly && (
                    <small className="text-xs text-red-500 mt-1 block">
                        Vous ne pouvez modifier que les causes de votre domaine
                    </small>
                )} */}
            </div>

            {/* Description (optionnelle - peut être vide) */}
            <div className='flex flex-col'>
                <label className="text-sm font-medium mb-1">
                    Description <span className="text-gray-400 text-xs">(optionnel)</span>
                </label>
                <textarea 
                    {...register("description", {
                        maxLength: {
                            value: 500,
                            message: "La description ne doit pas dépasser 500 caractères"
                        }
                    })} 
                    className="outline-none border rounded p-2 text-sm min-h-[80px]"
                    placeholder="Description optionnelle..."
                    disabled={isReadOnly}
                />
                {errors.description && (
                    <small className='text-xs mt-1 text-red-500'>{errors.description.message}</small>
                )}
            </div>

            {/* Indicateur de domaine utilisateur */}
            {/* <div className="p-2 bg-gray-50 rounded border text-sm">
                <span className="font-medium">Domaine utilisateur : </span>
                <span className={userDomain === "PRIVILEGED" ? "text-purple-600" : "text-blue-600"}>
                    {userDomain === "PRIVILEGED" ? "Privilégié (tous domaines)" : userDomain}
                </span>
                {isReadOnly && (
                    <div className="mt-1 text-xs text-red-500">
                        ⚠️ Modification restreinte à votre domaine
                    </div>
                )}
            </div> */}

            {/* Boutons d'action */}
            <div className="flex gap-2 pt-4">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    className="flex-1 text-sm flex gap-2"
                >
                    <XCircle className="h-4 w-4" />
                    <span>Annuler</span>
                </Button>
                
                <Button 
                    type="submit" 
                    className="flex-1 text-sm flex gap-2"
                    disabled={isSubmitting || isReadOnly}
                >
                    {isSubmitting ? (
                        <>
                            <Preloader size={16} />
                            <span>Enregistrement...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Enregistrer</span>
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default EditForm;