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
const asignPermAppSchema = z.object({
    role_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme."),

    description: z.string()
    .nonempty("Ce champs 'description' est réquis")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z\s,]+$/, "Ce champs doit être un 'description' conforme"),
    });

// Fonction principale pour gérer les actions utilisateur
export const AsignPermAppAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedAsignPermApp, setSelectedAsignPermApp] = useState(null);

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(asignPermAppSchema),
    });

   const { handlePatch, handleDelete } = useFetch();
   

    const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.API_ASIGN_PERM_APP}${selectedAsignPermApp?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            // console.log("response update", response);
            if (response ) {
                // console.log("User updated", response);
                setDialogOpen(false);
                window.location.reload();
            }
            else {
              toast.error(response.error, { duration: 5000});
            }
            
          } catch (error) {
            console.error("Error during updated",error);
            toast.error("Erreur lors de la modification de l'asignation perm & app", { duration: 5000 });
          }
    };

    const handleShowAsignPermApp = (asignPermApp) => {
        setSelectedAsignPermApp(asignPermApp);
        setIsEdited(false);
        setDialogOpen(true);
        // console.log("item selected", asignPermApp);
    };

    const handleEditAsignPermApp = (asignPermApp) => {
        setSelectedAsignPermApp(asignPermApp);
        reset(asignPermApp);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledAsignPermApp = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette asignation permission - rôle ?");
            if (confirmation) {
                const urlToDisabledAsignPermApp = `${URLS.API_ASIGN_PERM_APP}${id}/`;

                        try {
                            const response = await handlePatch(urlToDisabledAsignPermApp, {is_active:false});
                            console.log("response for disabled", response);
                            if (response && response?.message) {
                                // console.log("app disabled", response);
                                // console.log("La app a été désactivé.", id);
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
                            console.error("Erreur lors de la désactivation de l'asignation permission - rôle :", error);
                            toast.error("Erreur lors de la désactivation de l'asignation permission - rôle ", { duration: 5000 });
                        }

                        finally{
                            setIsLoading(false);
                            
                            }

                } 
                else {
                    console.log("La désactivation a été annulée.");
                }
    };

    const activedAsignPermApp = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette asignation permission - app ?");

        if (confirmation) {
              try{
                setDialogOpen(false);
                //   await handlePatch(url)
                //   navigateToMyEvent(`/events/${eventId}`)
              }
              catch(error){
                  console.error("Erreur lors de la désactivation de cette asignation permission - app :", error);
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
    
    const deletedAsignPermApp = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette asignation permission - app ?");

        if (confirmation) {
            const urlToDeleteAsignPermApp = `${URLS.API_ASIGN_PERM_APP}${id}/`;
            console.log("url delete app ",urlToDeleteAsignPermApp);
            // const urlToDeleteAsignPermApp = URLS.API_ASIGN_PERM_APP`${id}/?delete=true`;

                    try {
                            const response = await handleDelete(urlToDeleteAsignPermApp);
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
                        console.error("Erreur lors de la suppression de cette asignation permission - app:", error);
                        toast.error("Erreur lors de la suppression de l'asignation permission - app ", { duration: 5000 });
                    }

                    finally{
                        setIsLoading(false);
                        
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogAsignPermApp = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? "Modifier les informations" : "Détails de l'asignation permission - application " }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                            <label htmlFor='permission_name' className="text-xs mt-2">
                                                Nom du rôle <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="app_name"
                                                type="text"
                                                defaultValue={selectedAsignPermApp?.app_name}
                                                {...register("app_name")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.app_name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.app_name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.app_name.message}</p>
                                                )}
                                    </div>
                                    <div>
                                                <label htmlFor='description' className="text-xs">
                                                    Description <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="description"
                                                    type="text"
                                                    defaultValue={selectedAsignPermApp?.description}
                                                    {...register("description")}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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
                                selectedAsignPermApp && (
                                    <div className='flex flex-col text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermApp?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de la permission</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermApp?.permission_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Description de la permission</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermApp?.description}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de la permission</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermApp?.application_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Description du rôle</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermApp?.description_app}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedAsignPermApp?.is_active ? "Actif" : "Désactivé"}
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
                                            {/* <div className='flex space-x-2'>
                                            { 
                                                selectedAsignPermApp?.is_active == false ? 
                                                    (
                                                            <AlertDialogAction
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => activedAsignPermApp(selectedAsignPermApp.id)}>
                                                                    Activer
                                                            </AlertDialogAction>

                                                    ):(

                                                            <AlertDialogAction 
                                                                className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                onClick={() => disabledAsignPermApp(selectedAsignPermApp.id)}>
                                                                    Désactiver
                                                            </AlertDialogAction>
                                                    )
                                            
                                            }
                                            
                                           </div> */}
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedAsignPermApp(selectedAsignPermApp.id)}>
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


    const columnsAsignPermApp = useMemo(() => [
        { accessorKey: 'permission_name', header: 'Nom de la permission' },
        { accessorKey: 'description', header: 'Description de la permission' },
        { accessorKey: 'application_name', header: "Nom de l'application" },
        { accessorKey: 'description_app', header: "Description de l'application" },
        // { accessorKey: 'is_active', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowAsignPermApp(row.original)} />
                    {/* <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditAsignPermApp(row.original)} /> */}
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledAsignPermApp(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedAsignPermApp(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogAsignPermApp,
                columnsAsignPermApp, // Exporter les colonnes pour app ailleurs
                handleShowAsignPermApp,
                handleEditAsignPermApp,
             
    };
};