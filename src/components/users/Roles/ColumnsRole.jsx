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
const roleSchema = z.object({
    display_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100),
    // .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme."),

    description: z.string()
    .nonempty("Ce champs 'description' est réquis")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z\s,]+$/, "Ce champs doit être un 'description' conforme"),
    });

// Fonction principale pour gérer les actions utilisateur
export const RoleAction = ( { actRole, desRole, updateData } ) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedRole, setSelectedRole] = useState({});

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(roleSchema),
    });

   const { handlePatch, handleDelete } = useFetch();
   

    const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.API_ROLE}${selectedRole?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            // console.log("response update", response);
            if (response.success) {
                // console.log("User updated", response);
                setDialogOpen(false);

                toast.success("role modified successfully", { duration: 1000 });

                updateData(response.data.id, response.data)
            }
            else {
                setDialogOpen(false);
                toast.error(response.errors.display_name, { duration: 2000});
            }
            
          } catch (error) {
            console.error("Error during updated",error);
            toast.error("Erreur lors de la modification du rôle", { duration: 5000 });
          }
    };

    const handleShowRole = (role) => {
        setSelectedRole(role);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditRole = (role) => {
        setSelectedRole(role);
        reset(role);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce rôle ?");
            if (confirmation) {
                const urlToDisabledRole = `${URLS.API_ROLE}${id}/`;

                        try {
                                const response = await handlePatch(urlToDisabledRole, {is_active:false});
                                console.log("response for disabled", response);
                                if (response.success) {
                                    // console.log("ROLE disabled", response);
                                    // console.log("La ROLE a été désactivé.", id);
                                    toast.success("role disabled successfully", { duration: 1000});
                                    isDialogOpen && setDialogOpen(false);
                                    desRole(id)
                                    // window.location.reload();
                                }
                                else {
                                toast.error(response.error, { duration: 1000});
                                }
                                isDialogOpen && setDialogOpen(false);
                        }
                        catch(error){
                            console.error("Erreur lors de la désactivation du rôle :", error);
                            toast.error("Erreur lors de la désactivation du rôle", { duration: 5000 });
                        }

                        finally{
                            setIsLoading(false);
                            
                            }

                } 
                else {
                    console.log("La désactivation a été annulée.");
                }
    };

    const enableRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir activer ce rôle ?");

        const urlToDisabledRole = `${URLS.API_ROLE}${id}/`

        if (confirmation) {
              try{
                    setDialogOpen(false);
                    const response = await handlePatch(urlToDisabledRole, {is_active: true})

                    if (response.success) {
                        toast.success("role activated successfully", { duration: 1000});
                        isDialogOpen && setDialogOpen(false);
                        actRole(id)
                    }
              }
              catch(error){
                  console.error("Erreur lors de la désactivation de ce rôle :", error);
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
    
    const deletedRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?");

        if (confirmation) {
            const urlToDeleteRole = `${URLS.API_ROLE}${id}/`;
            console.log("url delete role ",urlToDeleteRole);
            // const urlToDeleteRole = URLS.API_ROLE`${id}/?delete=true`;

                    try {
                            const response = await handleDelete(urlToDeleteRole);
                            console.log("response for deleting", response);
                            if (response.success) {
                                toast.success("role disabled successfully", { duration: 1000});
                                isDialogOpen && setDialogOpen(false);
                                desRole(id)
                                // window.location.reload();
                            }

                            setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la suppression de ce rôle:", error);
                        toast.error("Erreur lors de la suppression du rôle", { duration: 5000 });
                    }

                    finally{
                        setIsLoading(false);
                        
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogRole = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <span className='flex text-left'>{ isEdited ? "Modifier les informations" : "Détails du rôle" }</span>
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
                                                id="display_name"
                                                type="text"
                                                defaultValue={selectedRole?.display_name}
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
                                                    defaultValue={selectedRole?.description}
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
                                selectedRole && (
                                    <div className='flex flex-col text-left text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedRole?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du rôle</p>
                                            <h3 className="font-bold text-sm">{selectedRole?.role_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Description</p>
                                            <h3 className="font-bold text-sm">{selectedRole?.description}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedRole?.is_active ? "Actif" : "Désactivé"}
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
                                                selectedRole?.is_active == false ? 
                                                    (
                                                            <AlertDialogAction
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => enableRole(selectedRole.id)}>
                                                                    Activer
                                                            </AlertDialogAction>

                                                    ):(

                                                            <AlertDialogAction 
                                                                className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                onClick={() => disabledRole(selectedRole.id)}>
                                                                    Désactiver
                                                            </AlertDialogAction>
                                                    )
                                            
                                            }
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedRole(selectedRole.id)}>
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


    const columnsRole = useMemo(() => [
        { accessorKey: 'display_name', header: 'Nom' },
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'is_active', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowRole(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditRole(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledRole(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedRole(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogRole,
                columnsRole, // Exporter les colonnes pour role ailleurs
                handleShowRole,
                handleEditRole,
             
    };
};