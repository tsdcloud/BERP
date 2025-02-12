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
const customerBankAccountSchema = z.object({
    accountNumber: z.string()
    .nonempty("Ce champ 'Numéro de compte bancaire' est requis.")
    .max(100)
    .regex(/^[0-9]+$/, 
    "Le numéro de compte bancaire doit contenir uniquement des chiffres."),

    bankId: z.string()
    .nonempty('Ce champs "Nom de la banque est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|[a-zA-Z0-9 ,]+)$/, 
     "Ce champs doit être un 'nom du pays Conforme."),

    clientId: z.string()
    .nonempty('Ce champs "Nom du client est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|[a-zA-Z0-9 ,]+)$/, 
     "Ce champs doit être un 'nom du pays Conforme."),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
  });

// fonction principale pour gérer les actions utilisateur
export const CustomerBankAccountAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedCustomerBankAccount, setSelectedCustomerBankAccount] = useState({});
    const [error, setError] = useState();
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [selectedBanks, setSelectedBanks] = useState([]);
    const [showBanks, setShowBanks] = useState([]);
    const [showCustomers, setShowCustomers] = useState([]);

    const [tokenUser, setTokenUser] = useState();


    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(customerBankAccountSchema),
    });

   const { handlePatch, handleDelete, handleFetch } = useFetch();
   

   const fetchBanks = async () => {
    // const getBanks = URLS.API_BANK;
    const getBanks = `${URLS.ENTITY_API}/banks`;
    try {
        setIsLoading(true);
        const response = await handleFetch(getBanks);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    // console.log("res bank", results);

                    const filteredBanks = results?.map(item => {
                    const { updateAt, ...rest } = item;
                    return rest;
                });
                    // console.log("banques",filteredBanks);
                    setShowBanks(filteredBanks);
            }
            else{
                throw new Error('Erreur lors de la récupération des banques');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
     };

  const fetchCustomers = async () => {
    // const getCustomers = URLS.API_CUSTOMER;
    const getCustomers = `${URLS.ENTITY_API}/clients`;
    try {
        setIsLoading(true);
        const response = await handleFetch(getCustomers);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    // console.log("res customers", results);

                    const filteredCustomers = results?.map(item => {
                    const { updateAt, ...rest } = item;
                    return rest;
                });
                    // console.log("customers",filteredCustomers);
                    setShowCustomers(filteredCustomers);
            }
            else{
                throw new Error('Erreur lors de la récupération des customers');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
     };

  useEffect(()=>{
    fetchBanks();
    fetchCustomers();
  },[]);


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
        // const urlToUpdate = `${URLS.API_CUSTOMER_BANK_ACCOUNT}/${selectedCustomerBankAccount?.id}`;
        const urlToUpdate = `${URLS.ENTITY_API}/client-bank-accounts/${selectedCustomerBankAccount?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            // console.log("response role update", response);
                if (response) {
                    setDialogOpen(false);
                        
                    setTimeout(()=>{
                        toast.success("customer bank account modified successfully", { duration: 900 });
                        window.location.reload();
                    },[200]);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification du compte bancaire du client", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };


    const handleShowCustomerBankAccount = (item) => {
        setSelectedCustomerBankAccount(item);
        setIsEdited(false);
        setDialogOpen(true);
        // console.log("item", item);
    };

    const handleEditedCustomerBankAccount = (item) => {
        setSelectedCustomerBankAccount(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };


    const disabledCustomerBankAccount = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce compte bancaire ?");
        if (confirmation) {
            // const urlToDisabledCustomerBankAccount = `${URLS.API_CUSTOMER_BANK_ACCOUNT}/${id}`;
            const urlToDisabledCustomerBankAccount = `${URLS.ENTITY_API}/client-bank-accounts/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledCustomerBankAccount, { isActive:false });
                            // console.log("response for disabled", response);
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
                                        toast.success("customer bank account disabled successfully", { duration: 5000 });
                                        // window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation compte bancaire du client :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enabledCustomerBankAccount = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce compte bancaire?");

        if (confirmation) {
            // const urlToDisabledCustomerBankAccount = `${URLS.API_CUSTOMER_BANK_ACCOUNT}/${id}`;
            const urlToDisabledCustomerBankAccount = `${URLS.ENTITY_API}/client-bank-accounts/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledCustomerBankAccount, {isActive:true});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("compte bancaire enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation compte bancaire", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation compte bancaire :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedCustomerBankAccount = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce compte bancaire ?");

        if (confirmation) {
            // const urlToDisabledCustomerBankAccount = `${URLS.API_CUSTOMER_BANK_ACCOUNT}/${id}`;
            const urlToDisabledCustomerBankAccount = `${URLS.ENTITY_API}/client-bank-accounts/${id}`;

                    try {
                            const response = await handleDelete(urlToDisabledCustomerBankAccount, {isActive:false});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("compte bancaire disabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation compte bancaire", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation compte bancaire :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogCustomerBankAccount = () => {
        
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? " Modifier les informations " : " Détails du compte bancaire du client" }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs'
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                            <label htmlFor='accountNumber' className="text-xs mt-2">
                                                Numéro de compte bancaire du client <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="accountNumber"
                                                type="text"
                                                defaultValue={selectedCustomerBankAccount?.accountNumber}
                                                {...register("accountNumber")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.accountNumber ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.accountNumber && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.accountNumber.message}</p>
                                                )}
                                    </div>

                                    <div className=' flex flex-col'>
                                            <label htmlFor='bankId' className="text-xs mt-2">
                                                Nom de la banque <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                    onChange={(e) => {
                                                        const nameBankSelected = showBanks.find(item => item.id === e.target.value);
                                                        setSelectedBanks(nameBankSelected);
                                                    }}
                                                    defaultValue={selectedCustomerBankAccount?.bankId}
                                                    {...register('bankId')}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.bankId ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                >
                                                    <option value="">Selectionner une banque</option>
                                                    {showBanks.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.bankId && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.bankId.message}</p>
                                                )}
                                    </div>
                                    <div className=' flex flex-col'>
                                            <label htmlFor='clientId' className="text-xs mt-2">
                                                Nom du client <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                    onChange={(e) => {
                                                        const nameCustomerSelected = showCustomers.find(item => item.id === e.target.value);
                                                        setSelectedCustomers(nameCustomerSelected);
                                                    }}
                                                    defaultValue={selectedCustomerBankAccount?.clientId}
                                                    {...register('clientId')}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.clientId ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                >
                                                    <option value="">Selectionner un client</option>
                                                    {showCustomers.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.clientId && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.clientId.message}</p>
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
                                selectedCustomerBankAccount && (
                                    <div className='flex flex-col text-black space-y-3'>

                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedCustomerBankAccount?.id}</h3>
                                        </div>

                                        <div>
                                            <p className="text-xs">Numéro de compte</p>
                                            <h3 className="font-bold text-sm">{selectedCustomerBankAccount?.accountNumber}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de la banque</p>
                                            <h3 className="font-bold text-sm">{selectedCustomerBankAccount?.bankId}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du client</p>
                                            <h3 className="font-bold text-sm">{selectedCustomerBankAccount?.clientId}</h3>
                                        </div>
                                       
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedCustomerBankAccount?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedCustomerBankAccount?.isActive ? "Actif" : "Désactivé"}
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
                                                    selectedCustomerBankAccount?.isActive == false ?
                                                        (
                                                                <AlertDialogAction
                                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                    onClick={() => enabledCustomerBankAccount(selectedCustomerBankAccount.id)}>
                                                                        Activer
                                                                </AlertDialogAction>

                                                        ):(

                                                                <AlertDialogAction 
                                                                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                    onClick={() => disabledCustomerBankAccount(selectedCustomerBankAccount.id)}>
                                                                        Désactiver
                                                                </AlertDialogAction>
                                                        )
                                                
                                                }
                                            
                                           </div> */}
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedCustomerBankAccount(selectedCustomerBankAccount.id)}>
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


    const columnsCustomerBankAccount = useMemo(() => [
        { accessorKey: 'accountNumber', header: 'Numéro de compte' },
        { accessorKey: 'bankId', header: 'Nom de la banque' },
        { accessorKey: 'clientId', header: 'Nom du client' },
        // { accessorKey: 'phone', header: 'Téléphone' },
        // { accessorKey: 'createdAt', header: 'Date de création' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowCustomerBankAccount(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditedCustomerBankAccount(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledCustomerBankAccount(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedCustomerBankAccount(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogCustomerBankAccount,
                columnsCustomerBankAccount,
                handleShowCustomerBankAccount,
                handleEditedCustomerBankAccount,
             
    };
};