import { useMemo, useState } from 'react';
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






// Schéma de validation avec Zod
const applicationSchema = z.object({
    application_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme."),

    description: z.string()
    .nonempty("Ce champs 'description' est réquis")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z\s,]+$/, "Ce champs doit être un 'description' conforme"),

    url: z.string()
    .nonempty("Ce champs 'URL' est réquis")
    .regex(/^https?:\/\/[^\s$.?#].[^\s]*$/, "L'URL doit commencer par 'http://' ou 'https://' et être valide"),
    });

// Fonction principale pour gérer les actions utilisateur
export const ApplicationAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState({});

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(applicationSchema),
    });

   const { handlePatch, handleDelete } = useFetch();
   

    const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.API_APPLICATION}${selectedApplication?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            // console.log("response update", response);
            if (response.success ) {
                // console.log("User updated", response);
                setDialogOpen(false);
                toast.success("application modified successfully", { duration: 2000});
                window.location.reload();
            }
            else {
                setDialogOpen(false);
                toast.error(response.errors.application_name || response.errors.url, { duration: 5000});
            }
            
          } catch (error) {
            console.error("Error during updated",error);
            toast.error("Erreur lors de la modification de l'application", { duration: 5000 });
          }
    };

    const handleShowApplication = (application) => {
        setSelectedApplication(application);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditApplication = (application) => {
        setSelectedApplication(application);
        reset(application);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledApplication = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette application ?");
            if (confirmation) {
                const urlToDisabledApplication = `${URLS.API_APPLICATION}${id}/`;

                        try {
                                const response = await handlePatch(urlToDisabledApplication, {is_active:false});
                                console.log("response for disabled", response);
                                if (response && response?.message) {
                                    // console.log("ROLE disabled", response);
                                    // console.log("La ROLE a été désactivé.", id);
                                    toast.success("application desactivated successfully", { duration: 5000});
                                    isDialogOpen && setDialogOpen(false);
                                    window.location.reload();
                                }
                                else {
                                toast.error(response.error, { duration: 5000});
                                }
                                isDialogOpen && setDialogOpen(false);
                        }
                        catch(error){
                            console.error("Erreur lors de la désactivation de l'application :", error);
                            toast.error("Erreur lors de la désactivation de l'application", { duration: 5000 });
                        }

                        finally{
                            setIsLoading(false);
                            
                            }

                } 
                else {
                    console.log("La désactivation a été annulée.");
                }
    };

    const activedApplication = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette application ?");

        const urlToEnabledApplication = `${URLS.API_APPLICATION}${id}/`;

        if (confirmation) {
              try{
                setDialogOpen(false);
                    const response = await handlePatch(urlToEnabledApplication, {is_active: true});

                    if (response.success) {
                        isDialogOpen && setDialogOpen(false);
                        toast.success("application activated successfully", { duration: 2000});
                        window.location.reload();
                    }
                    else {
                    toast.error("error while enabling", { duration: 5000});
                    }
              }
              catch(error){
                  console.error("Erreur lors de la désactivation de cette application :", error);
              }
              finally{
                // setIsLoading(false);
                console.log("okay");
                }

                console.log("Le rôle a été désactivé.", id);
                } else {
                console.log("La désactivation a été annulée.");
                }
    };
    
    const deletedApplication = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette application ?");

        if (confirmation) {
            const urlToDeleteApplication = `${URLS.API_APPLICATION}${id}/`;
            console.log("url delete application ",urlToDeleteApplication);
            // const urlToDeleteApplication = URLS.API_APPLICATION`${id}/?delete=true`;

                    try {
                            const response = await handleDelete(urlToDeleteApplication);
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
                        console.error("Erreur lors de la suppression de cette application:", error);
                        toast.error("Erreur lors de la suppression de cette application", { duration: 5000 });
                    }

                    finally{
                        setIsLoading(false);
                        
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogApplication = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? "Modifier les informations" : "Détails de l'application" }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                            <label htmlFor='application_name' className="text-xs mt-2">
                                                Nom de l'application <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="application_name"
                                                type="text"
                                                defaultValue={selectedApplication?.application_name}
                                                {...register("application_name")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.application_name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.application_name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.application_name.message}</p>
                                                )}
                                    </div>
                                    <div>
                                                <label htmlFor='description' className="text-xs">
                                                    Description <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="description"
                                                    type="text"
                                                    defaultValue={selectedApplication?.description}
                                                    {...register("description")}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.description ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                />
                                                {errors.description && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.description.message}</p>
                                                )}
                                    </div>
                                    <div>
                                                <label htmlFor='url' className="text-xs">
                                                    Lien <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="url"
                                                    type="text"
                                                    defaultValue={selectedApplication?.url}
                                                    {...register("url")}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.url ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                />
                                                {errors.url && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.url.message}</p>
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
                                selectedApplication && (
                                    <div className='flex flex-col text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedApplication?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de l'application</p>
                                            <h3 className="font-bold text-sm">{selectedApplication?.application_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Description</p>
                                            <h3 className="font-bold text-sm">{selectedApplication?.description}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Lien</p>
                                            <h3 className="font-bold text-sm">{selectedApplication?.url}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedApplication?.is_active ? "Actif" : "Désactivé"}
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
                                                !selectedApplication?.is_active ? 
                                                    (
                                                            <AlertDialogAction
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => activedApplication(selectedApplication.id)}>
                                                                    Activer
                                                            </AlertDialogAction>

                                                    ):(

                                                            <AlertDialogAction 
                                                                className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                onClick={() => disabledApplication(selectedApplication.id)}>
                                                                    Désactiver
                                                            </AlertDialogAction>
                                                    )
                                            
                                            }
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedApplication(selectedApplication.id)}>
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


    const columnsApplication = useMemo(() => [
        { accessorKey: 'application_name', header: 'Nom' },
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'url', header: 'Lien' },
        { accessorKey: 'is_active', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowApplication(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditApplication(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledRole(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedApplication(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogApplication,
                columnsApplication, // Exporter les colonnes pour role ailleurs
                handleShowApplication,
                handleEditApplication,
             
    };
};