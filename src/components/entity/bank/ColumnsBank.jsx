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
const bankSchema = z.object({
    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z0-9 ,]+$/, "Ce champ doit être un 'nom' conforme."),

    address: z.string()
    .nonempty("Ce champs 'Adresse' est réquis")
    .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champs doit être une 'Adresse' conforme"),

    phone: z.string()
    .nonempty("Ce champs 'Téléphone' est réquis.")
    .length(9, "La valeur de ce champs doit contenir 9 caractères.")
    .regex(/^[0-9]+$/)
    ,

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
    });

// fonction principale pour gérer les actions utilisateur
export const BankAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedBank, setSelectedBank] = useState({});
    const [tokenUser, setTokenUser] = useState();

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(bankSchema),
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

        // console.log("data bank", data);

        const urlToUpdate = `${URLS.API_BANK}/${selectedBank?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            // console.log("response bank update", response);
                if (response) {
                    setDialogOpen(false);
                        
                    setTimeout(()=>{
                        toast.success("Bank modified successfully", { duration: 900 });
                        window.location.reload();
                    },[200]);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification Banque", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };

    const handleShowBank = (item) => {
        setSelectedBank(item);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditedBank = (item) => {
        setSelectedBank(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledBank = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette banque ?");
        if (confirmation) {
            const urlToDisabledBank = `${URLS.API_BANK}/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledBank, {isActive:false});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("Bank disabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation Banque", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation Banque :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enabledBank = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette banque ?");

        if (confirmation) {
            const urlToDisabledBank = `${URLS.API_BANK}/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledBank, {isActive:true});
                            console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("Banque enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation Banque", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation Banque :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedBank = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette banque ?");

        if (confirmation) {
            const urlToDisabledBank = `${URLS.API_BANK}/${id}`;

                    try {
                            const response = await handleDelete(urlToDisabledBank, {isActive:false});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("Banque disabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation Banque", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation Banque :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogBank = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? " Modifier les informations " : " Détails de la banque " }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                            <label htmlFor='name' className="text-xs mt-2">
                                                Nom de la banque <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={selectedBank?.name}
                                                {...register("name")}
                                                className={`w-2/3 font-semibold mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                                                )}
                                    </div>

                                    <div className='mb-1'>
                                    <label htmlFor="address" className="block text-xs font-medium mb-0">
                                        Localisation de la banque <sup className='text-red-500'>*</sup>
                                    </label>

                                    <input 
                                        id='address'
                                        type="text"
                                        {...register('address')} 
                                        className={`w-2/3 font-semibold px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                        ${
                                            errors.address ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {
                                        errors.address && (
                                        <p className="text-red-500 text-[9px] mt-1">{errors.address.message}</p>
                                        )
                                    }
                                </div>

                                <div className='mb-1'>
                                    <label htmlFor="phone" className="block text-xs font-medium mb-0">
                                                Téléphone de la banque<sup className='text-red-500'>*</sup>
                                            </label>
                                            <input 
                                                id='phone'
                                                type="phone"
                                                defaultValue={6}
                                                {...register('phone')}
                                                className={`w-2/3 font-semibold px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                                ${
                                                    errors.phone ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />

                                            {
                                            errors.phone && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.phone.message}</p>
                                            )
                                            }
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
                                        
                                            className="border-2 px-4 py-3 border-green-900 outline-green-900 text-green-900 text-xs shadow-md bg-transparent hover:bg-green-900 hover:text-white transition"
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
                                selectedBank && (
                                    <div className='flex flex-col text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedBank?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de la banque</p>
                                            <h3 className="font-bold text-sm">{selectedBank?.name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Adresse de la banque</p>
                                            <h3 className="font-bold text-sm">{selectedBank?.address}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Numéro de téléphone de la banque</p>
                                            <h3 className="font-bold text-sm">{selectedBank?.phone}</h3>
                                        </div>
                                        {/* <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedBank?.createdAt.split("T")[0]}</h3>
                                        </div> */}
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedBank?.isActive ? "Actif" : "Désactivé"}
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
                                                selectedBank?.isActive == false ? 
                                                    (
                                                            <AlertDialogAction
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => enabledBank(selectedBank.id)}>
                                                                    Activer
                                                            </AlertDialogAction>

                                                    ):(

                                                            <AlertDialogAction 
                                                                className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                onClick={() => disabledBank(selectedBank.id)}>
                                                                    Désactiver
                                                            </AlertDialogAction>
                                                    )
                                            
                                            }
                                            
                                           </div> */}
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedBank(selectedBank.id)}>
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


    const columnsBank = useMemo(() => [
        { accessorKey: 'name', header: 'Nom de la banque' },
        { accessorKey: 'address', header: 'Adresse de la banque' },
        { accessorKey: 'phone', header: 'Téléphone' },
        // { accessorKey: 'createdAt', header: 'Date de création' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowBank(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditedBank(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledBank(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedBank(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogBank,
                columnsBank,
                handleShowBank,
                handleEditedBank,
             
    };
};