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
const asignPermRoleSchema = z.object({
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
export const AsignPermRoleAction = ( { upDateTable } ) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedAsignPermRole, setSelectedAsignPermRole] = useState(null);

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(asignPermRoleSchema),
    });

   const { handlePatch, handleDelete } = useFetch();
   

    const onSubmit = async (data) => {
        // const urlToUpdate = `${URLS.API_ASIGN_PERM_ROLE}${selectedAsignPermRole?.id}`;
        const urlToUpdate = `${URLS.USER_API}/grant_permission_role/${selectedAsignPermRole?.id}/`;
      
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

    const handleShowAsignPermRole = (asignPermRole) => {
        setSelectedAsignPermRole(asignPermRole);
        setIsEdited(false);
        setDialogOpen(true);
        // console.log("item selected", asignPermRole);
    };

    const handleEditAsignPermRole = (asignPermRole) => {
        setSelectedAsignPermRole(asignPermRole);
        reset(asignPermRole);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledAsignPermRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette asignation permission - rôle ?");
            if (confirmation) {
                // const urlToDisabledAsignPermRole = `${URLS.API_ASIGN_PERM_ROLE}${id}/`;
                const urlToDisabledAsignPermRole = `${URLS.USER_API}/grant_permission_role/${id}/`;
                

                        try {
                                const response = await handlePatch(urlToDisabledAsignPermRole, {is_active:false});
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

    const activedAsignPermRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette asignation permission - rôle ?");

        if (confirmation) {
              try{
                setDialogOpen(false);
                //   await handlePatch(url)
                //   navigateToMyEvent(`/events/${eventId}`)
              }
              catch(error){
                  console.error("Erreur lors de la désactivation de cette asignation permission - rôle :", error);
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
    
    const deletedAsignPermRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette asignation permission - rôle ?");

        if (confirmation) {
            // const urlToDeleteAsignPermRole = `${URLS.API_ASIGN_PERM_ROLE}${id}/`;
            const urlToDeleteAsignPermRole = `${URLS.USER_API}/grant_permission_role/${id}/`;
            console.log("url delete role ",urlToDeleteAsignPermRole);
            // const urlToDeleteAsignPermRole = URLS.API_ASIGN_PERM_ROLE`${id}/?delete=true`;

                    try {
                            const response = await handleDelete(urlToDeleteAsignPermRole);
                            console.log("response for deleting", response);
                            if (response && response?.message) {
                                toast.success(response?.message, { duration: 5000});
                                isDialogOpen && setDialogOpen(false);
                                upDateTable(id)
                            }
                            else {
                            toast.error(response.error, { duration: 5000});
                            }
                            setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la suppression de cette asignation permission - rôle:", error);
                        toast.error("Erreur lors de la suppression de l'asignation permission - rôle ", { duration: 5000 });
                    }

                    finally{
                        setIsLoading(false);
                        
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogAsignPermRole = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                        <span className='flex text-left'>{ isEdited ? "Modifier les informations" : "Détails de l'asignation permission - rôle " }</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex flex-col text-left">
                                            <label htmlFor='permission_name' className="text-xs mt-2">
                                                Nom du rôle <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="role_name"
                                                type="text"
                                                defaultValue={selectedAsignPermRole?.role_name}
                                                {...register("role_name")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.role_name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.role_name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.role_name.message}</p>
                                                )}
                                    </div>
                                    <div className="flex flex-col text-left">
                                                <label htmlFor='description' className="text-xs">
                                                    Description <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="description"
                                                    type="text"
                                                    defaultValue={selectedAsignPermRole?.description}
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
                                selectedAsignPermRole && (
                                    <div className='flex flex-col text-left text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermRole?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de la permission</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermRole?.permission_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Description de la permission</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermRole?.description}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du rôle</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermRole?.role_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Description du rôle</p>
                                            <h3 className="font-bold text-sm">{selectedAsignPermRole?.description_role}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedAsignPermRole?.is_active ? "Actif" : "Désactivé"}
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
                                            {/* <div className='flex space-x-2'>
                                            { 
                                                selectedAsignPermRole?.is_active == false ? 
                                                    (
                                                            <AlertDialogAction
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => activedAsignPermRole(selectedAsignPermRole.id)}>
                                                                    Activer
                                                            </AlertDialogAction>

                                                    ):(

                                                            <AlertDialogAction 
                                                                className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                onClick={() => disabledAsignPermRole(selectedAsignPermRole.id)}>
                                                                    Désactiver
                                                            </AlertDialogAction>
                                                    )
                                            
                                            }
                                            
                                           </div> */}
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedAsignPermRole(selectedAsignPermRole.id)}>
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


    const columnsAsignPermRole = useMemo(() => [
        { accessorKey: 'permission_name', header: 'Nom de la permission' },
        { accessorKey: 'description', header: 'Description de la permission' },
        { accessorKey: 'role_name', header: 'Nom du rôle' },
        { accessorKey: 'description_role', header: 'Description du rôle' },
        // { accessorKey: 'is_active', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowAsignPermRole(row.original)} />
                    {/* <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditAsignPermRole(row.original)} /> */}
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledAsignPermRole(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedAsignPermRole(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogAsignPermRole,
                columnsAsignPermRole, // Exporter les colonnes pour role ailleurs
                handleShowAsignPermRole,
                handleEditAsignPermRole,
             
    };
};