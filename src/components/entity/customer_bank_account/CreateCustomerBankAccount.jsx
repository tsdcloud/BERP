import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../../modals/CustomingModal';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';

import PropTypes from 'prop-types';
import { useFetch } from '../../../hooks/useFetch';

import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';




export default function CreateCustomerBankAccount({setOpen, onSubmit}) {

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
  
    const [tokenUser, setTokenUser] = useState();
    const [showBanks, setShowBanks] = useState([]);
    const [showCustomers, setShowCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [selectedBanks, setSelectedBanks] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [cardType, setCardType] = useState('');

  const { handlePost, handleFetch } = useFetch();
  

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


    const handleAccountNumberChange = (e) => {
        const input = e.target.value;
        // Détection de la carte
        if (input.startsWith('4') && (input.length === 13 || input.length === 16)) {
            setCardType('Visa');
        } else if ((input.startsWith('51') || input.startsWith('52') || input.startsWith('53') || input.startsWith('54') || input.startsWith('55')) && input.length === 16) {
            setCardType('MasterCard');
        } else {
            setCardType('');
        }
  
    };

  
      const { register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({
          resolver: zodResolver(customerBankAccountSchema),
      });



  const handleSubmitDataFormCustomerBankAccount = async(data) => {
    // const urlToCreateCustomerBankAccount = URLS.API_CUSTOMER_BANK_ACCOUNT;
    const urlToCreateCustomerBankAccount = `${URLS.ENTITY_API}/client-bank-accounts`;
    //   console.log(data);
      try {
        const response = await handlePost(urlToCreateCustomerBankAccount, data, true);
        // console.log("response crea", response);
        if (response && response.status === 201) {
          toast.success("compte bancaire du client crée avec succès", { duration:2000 });
          setOpen(false);
          onSubmit();
          reset();

        }
        else {
          if (Array.isArray(response.errors)) {
            const errorMessages = response.errors.map(error => error.msg).join(', ');
            toast.error(errorMessages, { duration: 5000 });
          } else {
            toast.error(response.errors.msg, { duration: 5000 });
          }
        }
        
      } catch (error) {
        console.error("Error during creating", error);
        toast.error("Erreur lors de la création du compte bancaire", { duration: 5000 });
      }
  };
  return (
    <CustomingModal
        title="Ajouter un nouveau compte bancaire du client"
        buttonText="Créer un compte bancaire du client"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations du compte bancaire du client.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormCustomerBankAccount)} className=''>

                  <div className='mb-1'>
                      <label htmlFor="accountNumber" className="block text-xs font-medium mb-0">
                          Numéro de compte bancaire<sup className='text-red-500'>*</sup>
                      </label>

                      <input 
                        id='accountNumber'
                        type="text"
                        onChange={(e)=>handleAccountNumberChange(e)}
                        {...register('accountNumber')} 
                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                        ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {
                        errors.accountNumber && (
                          <p className="text-red-500 text-[9px] mt-1">{errors?.accountNumber?.message}</p>
                        )
                      }
                  </div>

                  <div className='mb-1'>
                                <label htmlFor="bankId" className="block text-xs font-medium mb-1">
                                    Nom de la banque<sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameBankSelected = showBanks.find(item => item.id === e.target.value);
                                        setSelectedBanks(nameBankSelected);
                                      }}
                                    {...register('bankId')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.bankId?.message}</p>
                                )}
                   </div>

                  <div className='mb-1'>
                                <label htmlFor="clientId" className="block text-xs font-medium mb-1">
                                    Nom du client<sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameCustomerSelected = showCustomers.find(item => item.id === e.target.value);
                                        setSelectedCustomers(nameCustomerSelected);
                                      }}
                                    {...register('clientId')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.clientId?.message}</p>
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


                  <div className='flex justify-end space-x-2 mt-2'>
                    <Button 
                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-primary hover:text-white transition" 
                    type="submit"
                    disabled={isSubmitting}
                   
                    >
                      {isSubmitting ? "Création en cours..." : "Créer un compte client"}
                    </Button>

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
  );
}

 // Ajout de la validation des props
 CreateCustomerBankAccount.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};

