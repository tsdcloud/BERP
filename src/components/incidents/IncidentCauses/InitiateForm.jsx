// // export default InitiateForm;

// import React, { useState, useEffect, useCallback } from 'react'
// import { useForm } from 'react-hook-form';
// import { Input } from '../../ui/input';
// import { Button } from '../../ui/button';
// import { useFetch } from '../../../hooks/useFetch';
// import { URLS } from '../../../../configUrl';
// import toast from 'react-hot-toast';
// import AutoComplete from '../../common/AutoComplete';
// import { CheckCircle, XCircle } from 'lucide-react';
// import Preloader from "../../Preloader";
// import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';

// const InitiateForm = ({ onSucess, userDomain = "PRIVILEGED" }) => {
//     const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
//     const { handlePost } = useFetch();
//     const [isLoadingTypes, setIsLoadingTypes] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [incidentTypes, setIncidentTypes] = useState([]);

//     // Enregistrement manuel du champ incidentTypeId
//     useEffect(() => {
//         register('incidentTypeId');
//     }, [register]);

//     // Recherche des types d'incident avec filtrage par domaine
//     // const handleSearchIncidentTypes = useCallback(async (searchInput) => {
//     //     if (!searchInput) return;
        
//     //     try {
//     //         setIsLoadingTypes(true);
            
//     //         // Construire l'URL avec recherche et filtrage par domaine
//     //         let url = `${URLS.INCIDENT_API}/incident-types?search=${encodeURIComponent(searchInput)}`;
            
//     //         // Ajouter le filtre par domaine si l'utilisateur n'est pas privilégié
//     //         if (userDomain && userDomain !== "PRIVILEGED") {
//     //             url += `&domain=${userDomain}`;
//     //         }
            
//     //         const response = await fetch(url, {
//     //             headers: {
//     //                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//     //                 'Content-Type': 'application/json'
//     //             }
//     //         });
            
//     //         if (response.ok) {
//     //             const data = await response.json();
//     //             const formattedTypes = data.data.map(type => ({
//     //                 name: type.name,
//     //                 value: type.id,
//     //                 domain: type.domain
//     //             }));
//     //             setIncidentTypes(formattedTypes);
//     //         } else {
//     //             console.error('Erreur de chargement des types');
//     //             setIncidentTypes([]);
//     //         }
//     //     } catch (error) {
//     //         console.error('Erreur:', error);
//     //         setIncidentTypes([]);
//     //     } finally {
//     //         setIsLoadingTypes(false);
//     //     }
//     // }, [userDomain]);
//     const handleSearchIncidentTypes = useCallback(async (searchInput) => {
//         // Permettre la recherche même sans input pour voir tous les résultats
//         try {
//             setIsLoadingTypes(true);
            
//             // Construire l'URL
//             let url = `${URLS.INCIDENT_API}/incident-types?`;
            
//             // Ajouter la recherche si elle existe
//             if (searchInput) {
//                 url += `search=${encodeURIComponent(searchInput)}&`;
//             }
            
//             // Ajouter le filtre par domaine
//             if (userDomain && userDomain !== "PRIVILEGED") {
//                 url += `domain=${userDomain}&`;
//             }
            
//             // Augmenter la limite pour voir plus de résultats
//             url += `limit=50`;
            
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
//                     value: type.id,
//                     domain: type.domain
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
//     }, [userDomain]);

//     const handleSelectIncidentType = (item) => {
//         setValue('incidentTypeId', item ? item.value : '');
//     };

//     const submitForm = async (data) => {
//         setIsSubmitting(true);
//         try {
//             // Vérifier si l'utilisateur a sélectionné un type d'incident d'un domaine non autorisé
//             const selectedType = incidentTypes.find(type => type.value === data.incidentTypeId);
//             if (selectedType && userDomain !== "PRIVILEGED" && selectedType.domain !== userDomain) {
//                 toast.error("Vous ne pouvez sélectionner que des types d'incident de votre domaine");
//                 setIsSubmitting(false);
//                 return;
//             }

//             const url = `${URLS.INCIDENT_API}/incident-causes`;
//             data.createdBy = "user 1"; // À adapter selon votre authentification
            
//             const response = await handlePost(url, data, true);
            
//             if (response.error) {
//                 toast.error("Cet enregistrement existe déjà dans la base de données");
//                 console.log(response);
//                 return;
//             }
            
//             toast.success("Créé avec succès");
//             reset();
//             setIncidentTypes([]);
//             setValue('incidentTypeId', '');
//             onSucess();
            
//         } catch (error) {
//             console.log(error);
//             toast.error("Erreur lors de la création");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleCancel = () => {
//         reset();
//         setIncidentTypes([]);
//         setValue('incidentTypeId', '');
//         // Si vous avez un callback de cancellation dans le parent
//         // if (onCancel) onCancel();
//     };

//     // Filtrer les domaines disponibles selon les permissions
//     const getAvailableDomains = () => {
//         if (userDomain === "PRIVILEGED") {
//             return EQUIPMENT_DOMAIN;
//         } else {
//             return EQUIPMENT_DOMAIN.filter(domain => domain.value === userDomain);
//         }
//     };

//     const availableDomains = getAvailableDomains();

//     return (
//         <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
//             {/* Champ Nom */}
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

//             {/* Type d'incident associé */}
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
//                 />
                
//                 {/* Message d'information sur les restrictions */}
//                 {userDomain !== "PRIVILEGED" && (
//                     <small className="text-xs text-gray-500 mt-1 block">
//                         Seuls les types d'incident du domaine {userDomain} sont disponibles
//                     </small>
//                 )}
//             </div>

//             {/* Indicateur de domaine utilisateur */}
//             <div className="p-2 bg-gray-50 rounded border text-sm">
//                 <span className="font-medium">Domaine utilisateur : </span>
//                 {/* <span className={userDomain === "PRIVILEGED" ? "text-purple-600" : "text-blue-600"}>
//                     {userDomain === "PRIVILEGED" ? "Privilégié (tous domaines)" : userDomain}
//                 </span> */}
//             </div>

//             {/* Description (optionnelle) */}
//             <div className='flex flex-col'>
//                 <label className="block text-sm font-medium mb-1">
//                     Description
//                 </label>
//                 <textarea 
//                     {...register("description")} 
//                     className="outline-none border rounded p-2 text-sm min-h-[80px]"
//                     placeholder="Description optionnelle..."
//                 />
//             </div>

//             {/* Boutons d'action */}
//             <div className="flex justify-end gap-2 mt-4">
//                 <Button 
//                     type="button"
//                     onClick={handleCancel}
//                     variant="outline"
//                     className="text-sm flex gap-2"
//                 >
//                     <XCircle className="h-4 w-4" />
//                     <span>Annuler</span>
//                 </Button>
                
//                 <Button 
//                     type="submit"
//                     disabled={isSubmitting}
//                     className={`${isSubmitting ? 'opacity-50' : ''} text-sm flex gap-2`}
//                 >
//                     {isSubmitting ? (
//                         <>
//                             <Preloader size={16} />
//                             <span>Création...</span>
//                         </>
//                     ) : (
//                         <>
//                             <CheckCircle className="h-4 w-4" />
//                             <span>Créer</span>
//                         </>
//                     )}
//                 </Button>
//             </div>
//         </form>
//     )
// }

// export default InitiateForm;

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import toast from 'react-hot-toast';
import AutoComplete from '../../common/AutoComplete';
import { CheckCircle, XCircle } from 'lucide-react';
import Preloader from "../../Preloader";

const InitiateForm = ({ onSucess, userDomain = "PRIVILEGED" }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const { handlePost } = useFetch();
    const [isLoadingTypes, setIsLoadingTypes] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [incidentTypes, setIncidentTypes] = useState([]);

    // Enregistrement manuel du champ incidentTypeId
    useEffect(() => {
        register('incidentTypeId');
    }, [register]);

    // Recherche des types d'incident SANS filtrage par domaine
    const handleSearchIncidentTypes = useCallback(async (searchInput = "") => {
        try {
            setIsLoadingTypes(true);
            
            // Construire l'URL sans filtre de domaine
            let url = `${URLS.INCIDENT_API}/incident-types?`;
            
            // Ajouter la recherche si elle existe
            if (searchInput) {
                url += `search=${encodeURIComponent(searchInput)}&`;
            }
            
            // Augmenter la limite pour voir plus de résultats
            url += `limit=50`;
            
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
                console.error('Erreur de chargement des types');
                setIncidentTypes([]);
            }
        } catch (error) {
            console.error('Erreur:', error);
            setIncidentTypes([]);
        } finally {
            setIsLoadingTypes(false);
        }
    }, []); // Pas de dépendance à userDomain

    const handleSelectIncidentType = (item) => {
        setValue('incidentTypeId', item ? item.value : '');
    };

    const submitForm = async (data) => {
        setIsSubmitting(true);
        try {
            const url = `${URLS.INCIDENT_API}/incident-causes`;
            data.createdBy = "user 1"; // À adapter selon votre authentification
            
            const response = await handlePost(url, data, true);
            
            if (response.error) {
                toast.error("Cet enregistrement existe déjà dans la base de données");
                console.log(response);
                return;
            }
            
            toast.success("Créé avec succès");
            reset();
            setIncidentTypes([]);
            setValue('incidentTypeId', '');
            onSucess();
            
        } catch (error) {
            console.log(error);
            toast.error("Erreur lors de la création");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        setIncidentTypes([]);
        setValue('incidentTypeId', '');
    };

    return (
        <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
            {/* Champ Nom */}
            <div className='flex flex-col'>
                <label className="block text-sm font-medium mb-1">
                    Nom de la cause <span className="text-red-500">*</span>
                </label>
                <Input 
                    {...register("name", { 
                        required: "Ce champ est requis"
                    })} 
                    className="outline-none" 
                    placeholder="Entrer le nom de la cause"
                />
                {errors.name && (
                    <small className='text-xs mt-1 text-red-500'>{errors.name.message}</small>
                )}
            </div>

            {/* Type d'incident associé */}
            <div className='flex flex-col'>
                <label className="block text-sm font-medium mb-1">
                    Type d'incident associé
                </label>
                <AutoComplete
                    placeholder="Rechercher un type d'incident..."
                    isLoading={isLoadingTypes}
                    dataList={incidentTypes}
                    onSearch={handleSearchIncidentTypes}
                    onSelect={handleSelectIncidentType}
                />
                
                {/* Message d'information */}
                <small className="text-xs text-gray-500 mt-1 block">
                    Tous les types d'incident sont disponibles
                </small>
            </div>

            {/* Description (optionnelle) */}
            <div className='flex flex-col'>
                <label className="block text-sm font-medium mb-1">
                    Description
                </label>
                <textarea 
                    {...register("description")} 
                    className="outline-none border rounded p-2 text-sm min-h-[80px]"
                    placeholder="Description optionnelle..."
                />
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-2 mt-4">
                <Button 
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                    className="text-sm flex gap-2"
                >
                    <XCircle className="h-4 w-4" />
                    <span>Annuler</span>
                </Button>
                
                <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`${isSubmitting ? 'opacity-50' : ''} text-sm flex gap-2`}
                >
                    {isSubmitting ? (
                        <>
                            <Preloader size={16} />
                            <span>Création...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Créer</span>
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

export default InitiateForm;