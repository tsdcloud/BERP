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
         AlertDialogTitle } from "../../ui/alert-dialog";

import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useFetch } from '../../../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import { URLS } from '../../../../configUrl';






// Schéma de validation avec Zod
const permissionSchema = z.object({
    display_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100),
    // .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme."),

    description: z.string()
    .nonempty("Ce champs 'description' est réquis")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z\s,]+$/, "Ce champs doit être un 'description' conforme"),
    });

// Fonction principale pour gérer les actions utilisateur
export const PermissionAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedPermission, setSelectedPermission] = useState({});

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(permissionSchema),
    });

   const { handlePatch, handleDelete } = useFetch();
   

   const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.API_PERMISSION}${selectedPermission?.id}/`;

        try {
            const response = await handlePatch(urlToUpdate, data);
            
            if (response.success) {
                setDialogOpen(false);
                
                setTimeout(()=>{
                    toast.success("Permission mis a jour avec succès", { duration: 900 });
                },[100])
                
                setTimeout(()=>{
                    window.location.reload();
                },[900])
            } else {
                setDialogOpen(false);
                setTimeout(()=>{
                    toast.error(response.errors.display_name || "Une erreur est survenue", { duration: 3000 });
                },[100])
            }
        } catch (error) {
            console.error("Erreur inattendue :", error);
            toast.error("Erreur lors de la modification de la permission", { duration: 5000 });
        }
    };


    const handleShowPermission = (persmission) => {
        setSelectedPermission(persmission);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditPermission = (persmission) => {
        setSelectedPermission(persmission);
        reset(persmission);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledPermission = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette permission ?");
            if (confirmation) {
                const urlToDisabledPermission = `${URLS.API_PERMISSION}${id}/`;

                        try {
                                const response = await handlePatch(urlToDisabledPermission, {is_active:false});
                                console.log("response for disabled", response);
                                if (response && response?.message) {
                                    // console.log("permission disabled", response);
                                    // console.log("La permission a été désactivé.", id);
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
                            console.error("Erreur lors de la désactivation de cette permission:", error);
                            toast.error("Erreur lors de la désactivation de la permission", { duration: 5000 });
                        }

                        finally{
                            setIsLoading(false);
                            }

                } 
                else {
                    console.log("La désactivation a été annulée.");
                }
    };

    const activedPermission = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette permission ?");

        if (confirmation) {
            const urlToActivePermission = `${URLS.API_PERMISSION}${id}/`;
              try{
                // setDialogOpen(false);
                //   await handlePatch(url)
                //   navigateToMyEvent(`/events/${eventId}`)
                const response = await handlePatch(urlToActivePermission, {is_active:true});
                console.log("response for disabled", response);
                if (response.success) {
                    // console.log("permission disabled", response);
                    // console.log("La permission a été désactivé.", id);
                    toast.success("permission activated successfully", { duration: 3000});
                    isDialogOpen && setDialogOpen(false);
                    window.location.reload();
                }
                else {
                toast.error(response.error, { duration: 5000});
                }
                isDialogOpen && setDialogOpen(false);
              }
              catch(error){
                  console.error("Erreur lors de la désactivation de cette permission:", error);
              }
              finally{
                // setIsLoading(false);
                console.log("okay");
                }

                console.log("La permission a été désactivé.", id);
                } else {
                console.log("La désactivation a été annulée.");
                }
    };
    
    const deletedPermission = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette permission ?");

        if (confirmation) {
            const urlToDeletePermission = `${URLS.API_PERMISSION}${id}/`;
            console.log("url delete perm",urlToDeletePermission);
            // const urlToDeletePermission = URLS.API_PERMISSION`${id}/?delete=true`;

                    try {
                            const response = await handleDelete(urlToDeletePermission);
                            console.log("response for deleting", response);
                            if (response && response?.message) {
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
                        console.error("Erreur lors de la suppression de cette permission:", error);
                        toast.error("Erreur lors de la suppression de la permission", { duration: 5000 });
                    }

                    finally{
                        setIsLoading(false);
                        
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogPermission = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                        <span className='flex text-left'> { isEdited ? "Modifier les informations" : "Détails de la permission" } </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex flex-col text-left">
                                            <label htmlFor='display_name' className="text-xs mt-2">
                                                Nom de la permission <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="display_name"
                                                type="text"
                                                defaultValue={selectedPermission?.display_name}
                                                {...register("display_name")}
                                                className={`w-full sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.display_name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.display_name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.display_name.message}</p>
                                                )}
                                    </div>
                                    <div className="flex flex-col text-left">
                                                <label htmlFor='description' className="text-xs">
                                                    Description <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="description"
                                                    type="text"
                                                    defaultValue={selectedPermission?.description}
                                                    {...register("description")}
                                                    className={`w-full sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.description ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                />
                                                {errors.description && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.description.message}</p>
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
                                selectedPermission && (
                                    <div className='flex flex-col text-left text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedPermission?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de la permission</p>
                                            <h3 className="font-bold text-sm">{selectedPermission?.display_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Description</p>
                                            <h3 className="font-bold text-sm">{selectedPermission?.description}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedPermission?.is_active ? "Actif" : "Désactivé"}
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
                            <div className='flex space-x-2 justify-end'>
                                            <div className='flex space-x-2'>
                                            { 
                                                selectedPermission?.is_active == false ? 
                                                    (
                                                            <AlertDialogAction 
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => activedPermission(selectedPermission.id)}>
                                                                    Activer
                                                            </AlertDialogAction>

                                                    ):(

                                                            <AlertDialogAction 
                                                                className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                onClick={() => disabledPermission(selectedPermission.id)}>
                                                                    Désactiver
                                                            </AlertDialogAction>
                                                    )
                                            
                                            }
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedPermission(selectedPermission.id)}>
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


    const columnsPermission = useMemo(() => [
        { accessorKey: 'display_name', header: 'Nom' },
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'is_active', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowPermission(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditPermission(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledPermission(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedPermission(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogPermission,
                columnsPermission, // Exporter les colonnes pour utilisation ailleurs
                handleShowPermission,
                handleEditPermission,
             
    };
};