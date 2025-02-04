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
import { Button } from '../../ui/button';
import { useFetch } from '../../../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import { URLS } from '../../../../configUrl';
import { jwtDecode } from 'jwt-decode';



// Schéma de validation avec Zod
const roleSchema = z.object({
    roleName: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z0-9 ,]+$/, "Ce champ doit être un 'nom' conforme."),

    displayName: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z0-9 ',]+$/, "Ce champ doit être une 'description' conforme."),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
    });

// fonction principale pour gérer les actions utilisateur
export const RoleAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedRole, setSelectedRole] = useState({});
    const [tokenUser, setTokenUser] = useState();

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(roleSchema),
    });

   const { handlePatch, handleDelete } = useFetch();
   

   useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
        const decode = jwtDecode(token);
        setTokenUser(decode.user_id);
        // console.log("var", tokenUser);
    }
  }, [tokenUser]);

    const onSubmit = async (data) => {

        // console.log("data role", data);

        const urlToUpdate = `${URLS.API_ROLE_ENTITY}/${selectedRole?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            // console.log("response role update", response);
                if (response) {
                    setDialogOpen(false);
                        
                    setTimeout(()=>{
                        toast.success("role modified successfully", { duration: 900 });
                        window.location.reload();
                    },[200]);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification du rôle", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };


    const handleShowRole = (item) => {
        setSelectedRole(item);
        setIsEdited(false);
        setDialogOpen(true);
        console.log("item", item);
    };

    const handleEditedRole = (item) => {
        setSelectedRole(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce rôle ?");
        if (confirmation) {
            const urlToDisabledRole = `${URLS.API_ROLE_ENTITY}/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledRole, { isActive:false });
                            console.log("response for disabled", response);
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
                                        toast.success("rôle disabled successfully", { duration: 5000 });
                                        // window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation rôle :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enabledRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce rôle ?");

        if (confirmation) {
            const urlToDisabledRole = `${URLS.API_ROLE_ENTITY}/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledRole, {isActive:true});
                            console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("rôle enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation rôle", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation rôle :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?");

        if (confirmation) {
            const urlToDisabledRole = `${URLS.API_ROLE_ENTITY}/${id}`;

                    try {
                            const response = await handleDelete(urlToDisabledRole, {isActive:false});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("role disabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation role", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation role :", error);
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
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? " Modifier les informations " : " Détails du rôle " }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs'
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                            <label htmlFor='roleName' className="text-xs mt-2">
                                                Nom du rôle <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="roleName"
                                                type="text"
                                                defaultValue={selectedRole?.roleName}
                                                {...register("roleName")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.roleName ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.roleName && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.roleName.message}</p>
                                                )}
                                    </div>
                                    <div>
                                            <label htmlFor='displayName' className="text-xs mt-2">
                                                Description <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="displayName"
                                                type="text"
                                                defaultValue={selectedRole?.displayName}
                                                {...register("displayName")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.displayName ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.displayName && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.displayName.message}</p>
                                                )}
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
                                selectedRole && (
                                    <div className='flex flex-col text-black space-y-3'>

                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedRole?.id}</h3>
                                        </div>

                                        <div>
                                            <p className="text-xs">Nom du rôle</p>
                                            <h3 className="font-bold text-sm">{selectedRole?.roleName}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Description</p>
                                            <h3 className="font-bold text-sm">{selectedRole?.displayName}</h3>
                                        </div>
                                       
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedRole?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedRole?.isActive ? "Actif" : "Désactivé"}
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
                                                    selectedRole?.isActive == false ?
                                                        (
                                                                <AlertDialogAction
                                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                    onClick={() => enabledRole(selectedRole.id)}>
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
                                            
                                           </div> */}
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
        { accessorKey: 'roleName', header: 'Nom du rôle' },
        { accessorKey: 'displayName', header: 'Description' },
        // { accessorKey: 'phone', header: 'Téléphone' },
        // { accessorKey: 'createdAt', header: 'Date de création' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowRole(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditedRole(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledRole(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedRole(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogRole,
                columnsRole,
                handleShowRole,
                handleEditedRole,
             
    };
};