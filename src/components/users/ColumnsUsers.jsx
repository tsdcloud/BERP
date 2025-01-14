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
         AlertDialogTitle } from "../ui/alert-dialog";

import { Input } from "../ui/input";
import { Button } from "../../components/ui/button";
import { useFetch } from '../../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import { URLS } from '../../../configUrl';

// Schéma de validation avec Zod
const userSchema = z.object({
    last_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z]+$/, "Ce champ doit être un 'nom' conforme."),

    first_name: z.string()
    .nonempty("Ce champs 'Pénom' est réquis")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z]+$/, "Ce champs doit être un 'prénom' conforme"),

    email: z.string()
    .nonempty("Ce champs 'Email' est réquis.")
    .email("Adresse mail invalide")
    .max(255)
    ,

    phone: z.string()
    .nonempty("Ce champs 'Téléphone' est réquis.")
    .length(9, "La valeur de ce champs doit contenir 9 caractères.")
    .regex(/^[0-9]+$/)
    ,

    username: z.string()
    .nonempty('Ce champs "Nom d utilisateur" est réquis')
    // .min(5, "La valeur de ce champs doit contenir au moins 5 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom d utilisateur' Conforme.")

    });


// Fonction principale pour gérer les actions utilisateur
export const UserAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedUser, setSelectedUser] = useState({});

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(userSchema),
    });

   const { handlePatch, handleDelete } = useFetch();

    const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.API_USER}${selectedUser?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            console.log("response update", response);
            if (response.success) {
  
                console.log("User updated", response);
                setDialogOpen(false);

                window.location.reload();

                toast.success("user modified successfully", { duration: 5000});
            }
            else {
                setDialogOpen(false);
                toast.error(response.errors.email || response.errors.username, { duration: 5000});
            }
            
          } catch (error) {
            console.error("Error during updated",error);
            toast.error("Erreur lors de la modification de l'utilisateur", { duration: 5000 });
          }
    };

    const handleShowUser = (user) => {
        setSelectedUser(user);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        reset(user);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledUser = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cet utilisateur ?");
            if (confirmation) {
                const urlToDisabledUser = `${URLS.API_USER}${id}`;

                        try {
                                const response = await handleDelete(urlToDisabledUser);
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
                            console.error("Erreur lors de la désactivation de cet utilisateur:", error);
                            toast.error("Erreur lors de la désactivation de l'utilisateur", { duration: 5000 });
                        }

                        finally{
                            setIsLoading(false);
                            
                            }

                } 
                else {
                    console.log("La désactivation a été annulée.");
                }
    };

    const activedUser = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cet utilisateur ?");
        const urlToDisabledUser = `${URLS.API_USER}${id}`;
        if (confirmation) {
              try{
                    const response = await handlePatch(urlToDisabledUser, {is_active: true})

                    if (response.success){
                        setDialogOpen(false);

                        setTimeout(()=>{
                            toast.success("user activated successfully", { duration: 2000});
                        },[100])
                        
                        setTimeout(()=>{
                            window.location.reload();
                        },[900])
                    }else{
                        toast.error("error occured", { duration: 2000});
                    }

                //   navigateToMyEvent(`/events/${eventId}`)
              }
              catch(error){
                  console.error("Erreur lors de la désactivation de cet utilisateur:", error);
              }
              finally{
                // setIsLoading(false);
                console.log("okay");
                }

                console.log("L'utilisateur a été désactivé.", id);
                } else {
                console.log("La désactivation a été annulée.");
                }
    };
    
    const deletedUser = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");

        if (confirmation) {
            const urlToDeleteUser = `${URLS.API_USER}${id}/?delete=true`;

                    try {
                            const response = await handleDelete(urlToDeleteUser);
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
                        console.error("Erreur lors de la suppression de cet utilisateur:", error);
                        toast.error("Erreur lors de la suppression de l'utilisateur", { duration: 5000 });
                    }

                    finally{
                        setIsLoading(false);
                        
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogUser = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? "Modifier les informations" : "Détails de l'utilisateur" }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                            <label htmlFor='last_name' className="text-xs mt-2">
                                                Nom <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="last_name"
                                                type="text"
                                                defaultValue={selectedUser?.last_name}
                                                {...register("last_name")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.last_name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.last_name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.last_name.message}</p>
                                                )}
                                    </div>
                                    <div>
                                                <label htmlFor='first_name' className="text-xs">
                                                    Prénom <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="first_name"
                                                    type="text"
                                                    defaultValue={selectedUser?.first_name}
                                                    {...register("first_name")}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.first_name ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                />
                                                {errors.first_name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.first_name.message}</p>
                                                )}
                                    </div>
                                    <div>
                                                <label htmlFor='email' className="text-xs">
                                                    Adresse mail <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="mail"
                                                    defaultValue={selectedUser?.email}
                                                    {...register("email")}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.email ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                />
                                                 {errors.email && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.email.message}</p>
                                                )}

                                    </div>
                                    <div>
                                            <label htmlFor='phone' className="text-xs">
                                                Téléphone <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="phone"
                                                type="phone"
                                                defaultValue={selectedUser?.phone}
                                                {...register("phone")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.phone ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                           {errors.phone && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.phone.message}</p>
                                            )}
                                    </div>
                                    <div>
                                             <label htmlFor='username' className="text-xs">
                                                Nom d'utilisateur <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="username"
                                                type="text"
                                                defaultValue={selectedUser?.username}
                                                // disabled
                                                {...register("username")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.username ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {errors.username && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.username.message}</p>
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
                                selectedUser && (
                                    <div className='flex flex-col text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedUser?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom</p>
                                            <h3 className="font-bold text-sm">{selectedUser?.last_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Prénom</p>
                                            <h3 className="font-bold text-sm">{selectedUser?.first_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Email</p>
                                            <h3 className="font-bold text-sm">{selectedUser?.email}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Téléphone</p>
                                            <h3 className="font-bold text-sm">{selectedUser?.phone}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom d'utilisateur</p>
                                            <h3 className="font-bold text-sm">{selectedUser?.username}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedUser?.is_active ? "Actif" : "Désactivé"}
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
                                                selectedUser?.is_active == false ? 
                                                    (
                                                            <AlertDialogAction 
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => activedUser(selectedUser.id)}>
                                                                    Activer
                                                            </AlertDialogAction>

                                                    ):(

                                                            <AlertDialogAction 
                                                                className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                onClick={() => disabledUser(selectedUser.id)}>
                                                                    Désactiver
                                                            </AlertDialogAction>
                                                    )
                                            
                                            }
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedUser(selectedUser.id)}>
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


    const columnsUser = useMemo(() => [
        { accessorKey: 'last_name', header: 'Nom' },
        { accessorKey: 'first_name', header: 'Prénom' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'phone', header: 'Téléphone' },
        // { accessorKey: 'is_staff', header: 'Administrateur' },
        // { accessorKey: 'is_superuser', header: 'Super administrateur' },
        { accessorKey: 'username', header: 'Nom d\'utilisateur' },
        { accessorKey: 'is_active', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowUser(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditUser(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledUser(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedUser(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogUser,
                columnsUser, // Exporter les colonnes pour utilisation ailleurs
                handleShowUser,
                handleEditUser,
             
    };
};