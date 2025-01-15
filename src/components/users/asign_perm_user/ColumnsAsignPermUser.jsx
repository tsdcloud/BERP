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
const asignPermUserSchema = z.object({
    user_name: z.string()
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
export const AsignPermUserAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedAsignPermUser, setSelectedAsignPermUser] = useState(null);

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(asignPermUserSchema),
    });

   const { handlePatch, handleDelete } = useFetch();
   

    const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.API_ASIGN_PERM_USER}${selectedAsignPermUser?.id}`;
      
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
            toast.error("Erreur lors de la modification de l'asignation perm & role", { duration: 5000 });
          }
    };

    const handleShowAsignPermUser = (asignPermUser) => {
        setSelectedAsignPermUser(asignPermUser);
        setIsEdited(false);
        setDialogOpen(true);
        // console.log("item selected", asignPermUser);
    };

    const handleEditAsignPermUser = (asignPermUser) => {
        setSelectedAsignPermUser(asignPermUser);
        reset(asignPermUser);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledAsignPermUser = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette asignation permission - utilisateur ?");
            if (confirmation) {
                const urlToDisabledAsignPermUser = `${URLS.API_ASIGN_PERM_USER}${id}/`;

                        try {
                                const response = await handlePatch(urlToDisabledAsignPermUser, {is_active:false});
                                console.log("response for disabled", response);
                                if (response && response?.message) {
                                    // console.log("ROLE disabled", response);
                                    // console.log("La ROLE a été désactivé.", id);
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
                            console.error("Erreur lors de la désactivation de l'asignation permission - user :", error);
                            toast.error("Erreur lors de la désactivation de l'asignation permission - user ", { duration: 5000 });
                        }

                        finally{
                            setIsLoading(false);
                            
                            }

                } 
                else {
                    console.log("La désactivation a été annulée.");
                }
    };

    const activedAsignPermUser = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette asignation permission - user ?");

        if (confirmation) {
              try{
                setDialogOpen(false);
                //   await handlePatch(url)
                //   navigateToMyEvent(`/events/${eventId}`)
              }
              catch(error){
                  console.error("Erreur lors de la désactivation de cette asignation permission - user :", error);
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
    
    const deletedAsignPermUser = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette asignation permission - user ?");

        if (confirmation) {
            const urlToDeleteAsignPermUser = `${URLS.API_ASIGN_PERM_USER}${id}/`;
            console.log("url delete user ",urlToDeleteAsignPermUser);
            // const urlToDeleteAsignPermUser = URLS.API_ASIGN_PERM_ROLE`${id}/?delete=true`;

                    try {
                            const response = await handleDelete(urlToDeleteAsignPermUser);
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
                        console.error("Erreur lors de la suppression de cette asignation permission - user:", error);
                        toast.error("Erreur lors de la suppression de l'asignation permission - user ", { duration: 5000 });
                    }

                    finally{
                        setIsLoading(false);
                        
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogAsignPermUser = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? "Modifier les informations" : "Détails de l'asignation permission - rôle " }
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
                                                id="role_name"
                                                type="text"
                                                defaultValue={selectedAsignPermUser?.role_name}
                                                {...register("role_name")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.role_name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.role_name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.role_name.message}</p>
                                                )}
                                    </div>
                                    <div>
                                                <label htmlFor='description' className="text-xs">
                                                    Description <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="description"
                                                    type="text"
                                                    defaultValue={selectedAsignPermUser?.description}
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
                                selectedAsignPermUser && (
                                    <div className='flex flex-col text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermUser?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de la permission</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermUser?.permission_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Description de la permission</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermUser?.description}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de famille</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermUser?.first_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom d'utilisateur</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermUser?.username}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedAsignPermUser?.is_active ? "Actif" : "Désactivé"}
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
                                                selectedAsignPermUser?.is_active == false ? 
                                                    (
                                                            <AlertDialogAction
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => activedAsignPermUser(selectedAsignPermUser.id)}>
                                                                    Activer
                                                            </AlertDialogAction>

                                                    ):(

                                                            <AlertDialogAction 
                                                                className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                onClick={() => disabledAsignPermUser(selectedAsignPermUser.id)}>
                                                                    Désactiver
                                                            </AlertDialogAction>
                                                    )
                                            
                                            }
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedAsignPermUser(selectedAsignPermUser.id)}>
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


    const columnsAsignPermUser = useMemo(() => [
        { accessorKey: 'permission_name', header: 'Nom de la permission' },
        { accessorKey: 'description', header: 'Description de la permission' },
        { accessorKey: 'first_name', header: 'Nom de famille' },
        { accessorKey: 'username', header: 'Nom d utilisateur' },
        // { accessorKey: 'is_active', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowAsignPermUser(row.original)} />
                    {/* <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditAsignPermUser(row.original)} /> */}
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledAsignPermUser(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedAsignPermUser(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogAsignPermUser,
                columnsAsignPermUser, // Exporter les colonnes pour role ailleurs
                handleShowAsignPermUser,
                handleEditAsignPermUser,
             
    };
};