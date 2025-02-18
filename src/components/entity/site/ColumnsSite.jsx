import { useMemo, useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AlertDialog,
         AlertDialogAction, 
         AlertDialogCancel,
         AlertDialogContent, 
         AlertDialogDescription,
         AlertDialogFooter,
         AlertDialogHeader,
         AlertDialogTitle } from "../../ui/alert-dialog";

import { Input } from '../../ui/input';
import { Button } from "../../ui/button";
import { useFetch } from '../../../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import { URLS } from '../../../../configUrl';
import { jwtDecode } from 'jwt-decode';




// Schéma de validation avec Zod
const siteSchema = z.object({
    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z0-9 ,]+$/, "Ce champ doit être un 'nom cv' conforme."),

    entityId: z.string()
    .nonempty('Ce champs "Nom de la ville" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
      "Ce champs doit être un 'nom de entité' Conforme."),

    
    typeSite: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champ doit être un 'type de site' conforme."),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),

    });

// Fonction principale pour gérer les actions utilisateur
export const SiteAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedSite, setSelectedSite] = useState({});
    const [selectedEntities, setSelectedEntities] = useState([]);
    const [showEntities, setShowEntities] = useState([]);
    const [selectedTypeOfSite, setSelectedTypeOfSite] = useState([]);
    const [tokenUser, setTokenUser] = useState();
    const [error, setError] = useState();

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(siteSchema),
    });

   const { handlePatch, handleDelete, handleFetch } = useFetch();
   

   const fetchEntites = async () => {
    const getEntities =  `${URLS.ENTITY_API}/entities`;
    try {
        setIsLoading(true);
        const response = await handleFetch(getEntities);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    // console.log("results", results);

                    const filteredEntities = results?.map(item => {
                    const { createdBy, updateAt, ...rest } = item;
                    return { 
                        id:rest.id, 
                        ...rest
                    };
                });
                    // console.log("districts - Town",filteredEntities);
                    setShowEntities(filteredEntities);
            }
            else{
                throw new Error('Erreur lors de la récupération des entités');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
     };


  useEffect(()=>{
    fetchEntites();
  },[]);


  const getTypeOfSite = [
    {
        id: "HEADQUARTER",
        name : "À la direction"
    },
    {
        id: "FIELD",
        name : "Sur le terrain"
    }
];

   useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
        const decode = jwtDecode(token);
        setTokenUser(decode.user_id);
        // console.log("var", tokenUser);
    }
  }, [tokenUser]);



    const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.ENTITY_API}/sites/${selectedSite?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            console.log("response site update", response);
                if (response) {
                    setDialogOpen(false);
                        
                    setTimeout(()=>{
                        toast.success("site modified successfully", { duration: 900 });
                        window.location.reload();
                    },[200]);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification du site", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };

    const handleShowSite = (site) => {
        setSelectedSite(site);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditSite = (site) => {
        setSelectedSite(site);
        reset(site);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledSite = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce site ?");
        if (confirmation) {
            const urlToDisabledSite =  `${URLS.ENTITY_API}/sites/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledSite, { isActive:false });
                            // console.log("response for disabled", response);
                                if (response.errors) {
                                    if (Array.isArray(response.errors)) {
                                        const errorMessages = response.errors.map(error => error.msg).join(', ');
                                        toast.error(errorMessages, { duration: 5000 });
                                      } else {
                                        toast.error(response.errors.msg, { duration: 5000 });
                                      }
                                }
                                else {
                                    setTimeout(()=>{
                                        toast.success("department disabled successfully", { duration: 5000 });
                                        window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation site :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enableSite = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce site ?");

        if (confirmation) {
            const urlToEnabledSite =  `${URLS.ENTITY_API}/sites/${id}`;

                    try {
                            const response = await handlePatch(urlToEnabledSite, {isActive:true});
                            console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("site enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation site", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation site :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedSite = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce site ?");

        if (confirmation) {
            const urlToDeletedSite =  `${URLS.ENTITY_API}/sites/${id}`;

                    try {
                            const response = await handleDelete(urlToDeletedSite, {isActive:false});
                            console.log("response for deleting", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("site disabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation site", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation site :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogSite = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? "Modifier les informations" : "Détails du site" }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                            <label htmlFor='name' className="text-xs mt-2">
                                                Nom du site <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={selectedSite?.name}
                                                {...register("name")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                                                )}
                                    </div>
                                    <div className=' flex flex-col'>
                                            <label htmlFor='entityId' className="text-xs mt-2">
                                                Nom de l'entité <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                    onChange={(e) => {
                                                        const nameEntitiesSelected = showEntities.find(item => item.id === e.target.value);
                                                        setSelectedEntities(nameEntitiesSelected);
                                                    }}
                                                    defaultValue={selectedSite?.entityId}
                                                    {...register('entityId')}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.entityId ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                >
                                                    <option value="">Selectionner une entité</option>
                                                    {showEntities.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.entityId && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.entityId.message}</p>
                                                )}
                                    </div>
                                    <div className=' flex flex-col'>
                                                    <label htmlFor="typeSite" className="block text-xs font-medium mb-1">
                                                        Type de site <sup className='text-red-500'>*</sup>
                                                    </label>

                                        
                                                    <select
                                                                onChange={(e) => {
                                                                    const nameTypeOfSiteSelected = getTypeOfSite.find(item => item.id === e.target.value);
                                                                    setSelectedTypeOfSite(nameTypeOfSiteSelected);
                                                                }}
                                                                defaultValue={selectedSite?.typeSite}
                                                                {...register('typeSite')} 
                                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                                    errors.typeSite ? "border-red-500" : "border-gray-300"
                                                                }`}
                                                            >
                                                                <option value="">Selectionner un type</option>
                                                                    {getTypeOfSite.map((item) => (
                                                                        <option key={item.id} value={item.id}>
                                                                                {item.name}
                                                                        </option>
                                                                    ))}
                                                    </select>
                                                    {
                                                        errors.typeSite && (
                                                        <p className="text-red-500 text-[9px] mt-1">{errors?.typeSite?.message}</p>
                                                        )
                                                    }
                                    </div>

                                    <div className='mb-1 hidden'>
                                            <label htmlFor="createdBy" className="block text-xs font-medium mb-0">
                                                    créer par<sup className='text-red-500'>*</sup>
                                                </label>
                                                <input 
                                                    id='createdBy'
                                                    type="text"
                                                    defaultValue={tokenUser}
                                                    {...register('createdBy')}
                                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                                        ${
                                                        errors.createdBy ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />

                                                {
                                                    errors.createdBy && (
                                                    <p className="text-red-500 text-[9px] mt-1">{errors.createdBy.message}</p>
                                                    )
                                                }
                                    </div>
                                    <div className='flex space-x-2 justify-end'>
                                        <Button 
                                            type="submit"
                                            disabled={isSubmitting}
                                        
                                            className="border-2 px-4 py-3 border-green-900 outline-green-900 text-green-900 text-xs shadow-md bg-transparent hover:bg-green-700 hover:text-white transition"
                                            >
                                            {isSubmitting ? "validation en cours..." : "valider"}
                                        </Button>
                                        
                                        <AlertDialogCancel 
                                            className="border-2 border-black outline-black text-black text-xs shadow-md hover:bg-black hover:text-white transition"
                                            onClick={() => setDialogOpen(false)}>
                                                Retour
                                        </AlertDialogCancel>
                                    </div>
                                <Toaster/>
                                </form>
                            ) : (
                                selectedSite && (
                                    <div className='flex flex-col text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedSite?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du site</p>
                                            <h3 className="font-bold text-sm">{selectedSite?.name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de l'entité</p>
                                            <h3 className="font-bold text-sm">{selectedSite?.entityId}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Type de site</p>
                                            <h3 className="font-bold text-sm">{selectedSite?.typeSite === "HEADQUARTER" ? "À la direction" : "Sur le terrain"}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedSite?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedSite?.isActive ? "Actif" : "Désactivé"}
                                            </h3>
                                        </div>
                                    </div>
                                )
                            )}
                        </AlertDialogDescription>

                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {
                        isEdited === false ? (
                            <div className='flex space-x-2'>
                                            <div className='flex space-x-2'>
                                                {/* { 
                                                    selectedSite?.is_active == false ? 
                                                        (
                                                                <AlertDialogAction
                                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                    onClick={() => enableSite(selectedSite.id)}>
                                                                        Activer
                                                                </AlertDialogAction>

                                                        ):(

                                                                <AlertDialogAction 
                                                                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                    onClick={() => disabledSite(selectedSite.id)}>
                                                                        Désactiver
                                                                </AlertDialogAction>
                                                        )
                                                
                                                } */}
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedSite(selectedSite.id)}>
                                                    Supprimer
                                            </AlertDialogAction>
                                            <AlertDialogCancel 
                                                className="border-2 border-black outline-black text-black text-xs shadow-md hover:bg-black hover:text-white transition"
                                                onClick={() => setDialogOpen(false)}>
                                                    Retour
                                            </AlertDialogCancel>
                                            
                            </div>
                        ) : (
                           null
                        )
                        }
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };


    const columnsSite = useMemo(() => [
        { accessorKey: 'name', header: 'Nom du site' },
        { accessorKey: 'entityId', header: 'Nom de l\'entité' },
        { accessorKey: 'typeSite', header: 'Type de site' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowSite(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditSite(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledSite(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedSite(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogSite,
                columnsSite,
                handleShowSite,
                handleEditSite,
             
    };
};