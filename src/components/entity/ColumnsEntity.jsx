import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EyeIcon, NoSymbolIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AlertDialog, 
         AlertDialogAction, 
         AlertDialogCancel, 
         AlertDialogContent, 
         AlertDialogDescription, 
         AlertDialogFooter, 
         AlertDialogHeader, 
         AlertDialogTitle } from "../ui/alert-dialog";

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useFetch } from '../../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import { URLS } from '../../../configUrl';

// Schéma de validation avec Zod
const entitySchema = z.object({

    entity_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champ doit être un 'nom' conforme."),

    localisation: z.string()
    .nonempty("Ce champs 'Localisation' est réquis")
    .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champs doit être une 'localisation' conforme"),

    phone: z.string()
    .nonempty("Ce champs 'Téléphone' est réquis.")
    .length(9, "La valeur de ce champs doit contenir 9 caractères.")
    .regex(/^[0-9]+$/)
    ,

    id_ville: z.string()
    .nonempty('Ce champs "Nom de la ville" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom de la ville' Conforme.")
    ,

    });


// Fonction principale pour gérer les actions utilisateur
export const EntityAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedEntity, setSelectedEntity] = useState({});

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(entitySchema),
    });

   const { handlePatch, handleDelete } = useFetch();

    const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.API_USER}${selectedEntity?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            console.log("response update", response);
            if (response ) {
  
              console.log("entity updated", response);
                setDialogOpen(false);
                window.location.reload();
            }
            else {
              toast.error(response.error, { duration: 5000});
            }
            
          } catch (error) {
            console.error("Error during updated",error);
            toast.error("Erreur lors de la modification de l'entité", { duration: 5000 });
          }
    };

    const handleShowEntity = (entity) => {
        setSelectedEntity(entity);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditEntity = (entity) => {
        setSelectedEntity(entity);
        reset(entity);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledEntity = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette entité ?");
            if (confirmation) {
                const urlToDisabledEntity = `${URLS.API_USER}${id}`;

                        try {
                                const response = await handleDelete(urlToDisabledEntity);
                                console.log("response for disabled", response);
                                if (response && response?.message) {
                                    console.log("User diabled", response);
                                    console.log("L'utilisateur a été désactivé.", id);
                                    toast.success(response?.message, { duration: 5000});
                                    isDialogOpen && setDialogOpen(false);
                                    window.location.reload();
                                }
                                else {
                                toast.error(response.error, { duration: 5000});
                                }
                                isDialogOpen && setDialogOpen(false);
                        }
                        catch(error){
                            console.error("Erreur lors de la désactivation de cette entité :", error);
                            toast.error("Erreur lors de la désactivation de l'entité", { duration: 5000 });
                        }

                        finally{
                            setIsLoading(false);
                            
                            }

                } 
                else {
                    console.log("La désactivation a été annulée.");
                }
    };

    const activedEntity = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette entité ?");

        if (confirmation) {
              try{
                setDialogOpen(false);
                //   await handlePatch(url)
                //   navigateToMyEvent(`/events/${eventId}`)
              }
              catch(error){
                  console.error("Erreur lors de la désactivation de cette entité :", error);
              }
              finally{
                // setIsLoading(false);
                console.log("okay");
                }

                console.log("L'entité a été désactivé.", id);
                } else {
                console.log("La désactivation a été annulée.");
                }
    };
    
    const deletedEntity = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette entité ?");

        if (confirmation) {
            const urlToDeleteEntity = `${URLS.API_USER}${id}/?delete=true`;

                    try {
                            const response = await handleDelete(urlToDeleteEntity);
                            if (response && response?.message) {
                                // console.log("User deleted", response);
                                toast.success(response?.message, { duration: 5000});
                                isDialogOpen && setDialogOpen(false);
                                window.location.reload();
                            }
                            else {
                            toast.error(response.error, { duration: 5000});
                            }
                            setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la suppression de cette entité:", error);
                        toast.error("Erreur lors de la suppression de l'entité", { duration: 5000 });
                    }

                    finally{
                        setIsLoading(false);
                        
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogEntity = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? "Modifier les informations" : "Détails de l'entité" }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                            <label htmlFor='entity_name' className="text-xs mt-2">
                                                Nom de l'entité <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="entity_name"
                                                type="text"
                                                defaultValue={selectedEntity?.entity_name}
                                                {...register("entity_name")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.entity_name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.entity_name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.entity_name.message}</p>
                                                )}
                                    </div>
                                    <div>
                                                <label htmlFor='localisation' className="text-xs">
                                                    Localisation de l'entité <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="localisation"
                                                    type="text"
                                                    defaultValue={selectedEntity?.localisation}
                                                    {...register("localisation")}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.localisation ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                />
                                                {errors.localisation && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.localisation.message}</p>
                                                )}
                                    </div>
                                   
                                    <div>
                                             <label htmlFor='id_ville' className="text-xs">
                                                Nom de la ville <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="id_ville"
                                                type="text"
                                                defaultValue={selectedEntity?.id_ville}
                                                disabled
                                                {...register("id_ville")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.id_ville ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {errors.id_ville && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.id_ville.message}</p>
                                            )}
                                    </div>


                                    <div>
                                            <label htmlFor='phone' className="text-xs">
                                                Téléphone de l'entité <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="phone"
                                                type="phone"
                                                defaultValue={selectedEntity?.phone}
                                                {...register("phone")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.phone ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                           {errors.phone && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.phone.message}</p>
                                            )}
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
                                selectedEntity && (
                                    <div className='flex flex-col text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedEntity?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom</p>
                                            <h3 className="font-bold text-sm">{selectedEntity?.entity_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Prénom</p>
                                            <h3 className="font-bold text-sm">{selectedEntity?.localisation}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de la ville</p>
                                            <h3 className="font-bold text-sm">{selectedEntity?.id_ville}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Téléphone</p>
                                            <h3 className="font-bold text-sm">{selectedEntity?.phone}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedEntity?.is_active ? "Actif" : "Désactivé"}
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
                                            { 
                                                selectedEntity?.is_active == false ? 
                                                    (
                                                            <AlertDialogAction 
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => activedEntity(selectedEntity.id)}>
                                                                    Activer
                                                            </AlertDialogAction>

                                                    ):(

                                                            <AlertDialogAction 
                                                                className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                onClick={() => disabledEntity(selectedEntity.id)}>
                                                                    Désactiver
                                                            </AlertDialogAction>
                                                    )
                                            
                                            }
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedEntity(selectedEntity.id)}>
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


    const columnsEntity = useMemo(() => [
        { accessorKey: 'entity_name', header: 'Nom de l\'entité' },
        { accessorKey: 'localisation', header: 'Localisation' },
        { accessorKey: 'id_ville', header: 'Nom de la ville' },
        { accessorKey: 'phone', header: 'Téléphone' },
        { accessorKey: 'is_active', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowEntity(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditEntity(row.original)} />
                    <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledEntity(row.original.id)} />
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedEntity(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogEntity,
                columnsEntity, // Exporter les colonnes pour utilisation ailleurs
                handleShowEntity,
                handleEditEntity,
             
    };
};