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
const customerSchema = z.object({
    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    // .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9 ,]+$/, "Ce champ doit être un 'nom' conforme.")
    ,

    email: z.string()
    .nonempty("Ce champs 'Email' est réquis.")
    .email("Adresse mail invalide")
    .max(255)
    ,

    phone: z.string()
    .nonempty("Ce champs 'Téléphone' est réquis.")
    .length(9, "La valeur de ce champs doit contenir 9 caractères.")
    // .regex(/^[0-9]+$/)
    ,

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
    });

// fonction principale pour gérer les actions utilisateur
export const CustomerAction = ({ delCustomer, updateData }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState({});
    const [tokenUser, setTokenUser] = useState();

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(customerSchema),
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
        // const urlToUpdate = `${URLS.API_CUSTOMER}/${selectedCustomer?.id}`;
        const urlToUpdate =  `${URLS.ENTITY_API}/clients/${selectedCustomer?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            // console.log("response customer update", response);
                if (response) {
                    await updateData(response.id, { ...data, id: response.id });
                    toast.success("customer modified successfully", { duration: 900 });
                    setDialogOpen(false);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification client", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };

    const handleShowCustomer = (item) => {
        setSelectedCustomer(item);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditedCustomer = (item) => {
        setSelectedCustomer(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledCustomer = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce client ?");
        if (confirmation) {
            // const urlToDisabledCustomer = `${URLS.API_CUSTOMER}/${id}`;
            const urlToDisabledCustomer = `${URLS.ENTITY_API}/clients/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledCustomer, {isActive:false});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("client disabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation client", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation client :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enabledCustomer = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce client ?");

        if (confirmation) {
            // const urlToDisabledCustomer = `${URLS.API_CUSTOMER}/${id}`;
            const urlToDisabledCustomer = `${URLS.ENTITY_API}/clients/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledCustomer, {isActive:true});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("client enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation client", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation client :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedCustomer = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");

        if (confirmation) {
            // const urlToDisabledCustomer = `${URLS.API_CUSTOMER}/${id}`;
            const urlToDisabledCustomer = `${URLS.ENTITY_API}/clients/${id}`;

                    try {
                            const response = await handleDelete(urlToDisabledCustomer, {isActive:false});
                            // console.log("response for deleted", response);
                                if (response) {      
                                    await delCustomer(id);
                                    toast.success("Client supprimé avec succès", { duration: 5000});
                               
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation customer", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation customer :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogCustomer = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent
                className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <span className='flex text-left'>
                              { isEdited ? " Modifier les informations " : " Détails du client " }
                            </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='name' className="text-xs mt-2">
                                                Nom de la banque <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={selectedCustomer?.name}
                                                {...register("name")}
                                                className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                                                )}
                                    </div>

                                    <div className="flex flex-col text-left">
                                                <label htmlFor='email' className="text-xs">
                                                    Adresse mail <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="mail"
                                                    defaultValue={selectedCustomer?.email}
                                                    {...register("email")}
                                                    className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.email ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                />
                                                 {errors.email && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.email.message}</p>
                                                )}

                                    </div>
                                    <div className="flex flex-col text-left">
                                            <label htmlFor='phone' className="text-xs">
                                                Téléphone <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="phone"
                                                type="phone"
                                                defaultValue={selectedCustomer?.phone}
                                                {...register("phone")}
                                                className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.phone ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                           {errors.phone && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.phone.message}</p>
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
                                selectedCustomer && (
                                    <div className='flex flex-col text-left text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedCustomer?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du client</p>
                                            <h3 className="font-bold text-sm">{selectedCustomer?.name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Email du client</p>
                                            <h3 className="font-bold text-sm">{selectedCustomer?.email}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Téléphone du client</p>
                                            <h3 className="font-bold text-sm">{selectedCustomer?.phone}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedCustomer?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedCustomer?.isActive ? "Actif" : "Désactivé"}
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
                                                    selectedCustomer?.isActive == false ? 
                                                        (
                                                                <AlertDialogAction
                                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                    onClick={() => enabledCustomer(selectedCustomer.id)}>
                                                                        Activer
                                                                </AlertDialogAction>

                                                        ):(

                                                                <AlertDialogAction 
                                                                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                    onClick={() => disabledCustomer(selectedCustomer.id)}>
                                                                        Désactiver
                                                                </AlertDialogAction>
                                                        )
                                                
                                                }
                                            
                                           </div> */}
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedCustomer(selectedCustomer.id)}>
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


    const columnsCustomer = useMemo(() => [
        { accessorKey: 'name', header: 'Nom du client' },
        { accessorKey: 'email', header: 'Adresse mail' },
        { accessorKey: 'phone', header: 'Téléphone' },
        // { accessorKey: 'createdAt', header: 'Date de création' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowCustomer(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditedCustomer(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledCustomer(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedCustomer(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogCustomer,
                columnsCustomer,
                handleShowCustomer,
                handleEditedCustomer,
             
    };
};