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

import {Input} from "../ui/input";
import { Button } from "../../components/ui/button";

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
    .min(5, "La valeur de ce champs doit contenir au moins 5 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom d utilisateur' Conforme.")

    });

// Fonction principale pour gérer les actions utilisateur
export const UserAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(userSchema),
    });

   

    const onSubmit = async (data) => {
        await new Promise(resolve =>setTimeout(resolve, 2000));
        if (isEdited) {
            console.log("Mise à jour de l'utilisateur :", data);
        } else {
            console.log("Détails de l'utilisateur :", data);
        }
        setDialogOpen(false);
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

    const disabledUser = (id) => {
        console.log("User is disabled", id);
    };

    const deletedUser = (id) => {
        console.log("deleted User", id);
    };

    const showDialogUser = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isEdited ? "Modifier les informations" : "Détails de l'utilisateur"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isEdited ? (
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
                                    </div>
                                    <div>
                                             <label htmlFor='username' className="text-xs">
                                                Nom d'utilisateur <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="username"
                                                type="text"
                                                defaultValue={selectedUser?.username}
                                                {...register("username")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.username ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                    </div>
                                </form>
                            ) : (
                                selectedUser && (
                                    <div className='flex flex-col text-black space-y-3'>
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
                                                {selectedUser?.isActive ? "Actif" : "Désactivé"}
                                            </h3>
                                        </div>
                                    </div>
                                )
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {isEdited ? (
                            <div className='flex space-x-2'>
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="border-2 px-4 py-3 border-green-900 outline-green-900 text-green-900 text-xs shadow-md hover:bg-green-700 hover:text-white transition"
                                    >
                                       {isSubmitting ? "validation en cours..." : "valider"}
                                </Button>
                                
                                <AlertDialogCancel 
                                    className="border-2 border-black outline-black text-black text-xs shadow-md hover:bg-black hover:text-white transition"
                                    onClick={() => setDialogOpen(false)}>
                                        Retour
                                </AlertDialogCancel>
                            </div>
                        ) : (
                            <div className='flex space-x-2'>
                                { 
                                    selectedUser?.isActive == false ? 
                                        (
                                                <AlertDialogAction 
                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md hover:bg-blue-600 hover:text-white transition"
                                                    onClick={() => disabledUser(selectedUser.id)}>
                                                        Activer
                                                </AlertDialogAction>

                                        ):(

                                                <AlertDialogAction 
                                                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md hover:bg-gray-600 hover:text-white transition"
                                                    onClick={() => disabledUser(selectedUser.id)}>
                                                        Désactiver
                                                </AlertDialogAction>
                                        )
                                
                                }
                                <AlertDialogAction 
                                    className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md hover:bg-red-600 hover:text-white transition"
                                    onClick={() => deletedUser(selectedUser.id)}>
                                        Supprimer
                                </AlertDialogAction>
                                <AlertDialogCancel 
                                    className="border-2 border-black outline-black text-black text-xs shadow-md hover:bg-black hover:text-white transition"
                                    onClick={() => setDialogOpen(false)}>
                                        Retour
                                </AlertDialogCancel>
                            </div>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };


    const columns = useMemo(() => [
        { accessorKey: 'last_name', header: 'Nom' },
        { accessorKey: 'first_name', header: 'Prénom' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'phone', header: 'Téléphone' },
        { accessorKey: 'username', header: 'Nom d\'utilisateur' },
        { accessorKey: 'isActive', header: 'Statut' },
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
        columns, // Exporter les colonnes pour utilisation ailleurs
        handleShowUser,
        handleEditUser,
    };
};