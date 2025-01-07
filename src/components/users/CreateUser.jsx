import {useState} from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../modals/CustomingModal';
import { Button } from "../ui/button";
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../configUrl';

import PropTypes from 'prop-types';
import { useFetch } from '../../hooks/useFetch';

import toast, { Toaster } from 'react-hot-toast';

// Définition du schéma avec Zod
const userSchema = z.object({
    last_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z]+$/, "Ce champ doit être un 'nom' conforme."),

    first_name: z.string()
    .nonempty("Ce champs 'Pénom' est réquis")
    .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
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
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom d utilisateur' Conforme.")
    ,

    // password: z.string()
    // .nonempty("Ce champs 'Mot de passe' est réquis.")
    // .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@]).{8,}/, 
    //   "Le mot de passe saisie doit avoir au moins une lettre majuscule, une minuscule, un caractère spécial (@), un chiffre et doit contenir au moins 8 caractères."),
});

export default function CreateUser({setOpen, onSubmit}) {

  // const navigateToDashboard = useNavigate();
  const { handlePost } = useFetch();

    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(userSchema),
    });


    const handleSubmitDataFormUser = async(data) => {
      // const urlToCreateUser = "http://127.0.0.1:8000/api_gateway/api/user/";
      const urlToCreateUser = URLS.API_USER;
        // console.log(data);
        try {
          const response = await handlePost(urlToCreateUser, data, true);
          // console.log("response crea", response);
          if (response && response?.success && response.status === 201) {
            toast.success("Utilisateur crée avec succès", {duration:2000});
            console.log("User created", response?.success);
            setOpen(false);
            onSubmit();
            // navigateToDashboard("/");
            // window.location.reload();

          }
          else {
            toast.error(response.error, { duration: 5000});
          }
          
        } catch (error) {
          console.error("Error during creating",error);
          toast.error("Erreur lors de la création de l'utilisateur", { duration: 5000 });
        }
    };

    //  const handleCancel = () => {
    //     // e.preventDefault();
    //     console.log('Bouton annuler cliqué dans le user');
    //     setOpen(false);
    // };

    return (
      <CustomingModal
        title="Ajouter un nouvel utilisateur"
        buttonText="Créer un utilisateur"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de l'utilisateur.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormUser)} className='sm:bg-blue-200 md:bg-transparent'>

                  <div className='mb-1'>
                      <label htmlFor="last_name" className="block text-xs font-medium mb-0">
                          Nom<sup className='text-red-500'>*</sup>
                      </label>

                      <input 
                        id='last_name'
                        type="text"
                        {...register('last_name')} 
                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                        ${
                            errors.last_name ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {
                        errors.last_name && (
                          <p className="text-red-500 text-[9px] mt-1">{errors.last_name.message}</p>
                        )
                      }
                  </div>

                  <div className='mb-1'>
                        <label htmlFor="first_name" className="block text-xs font-medium mb-0">
                            Prénom<sup className='text-red-500'>*</sup>
                        </label>
                        <input 
                            id='first_name'
                            type="text"
                            {...register('first_name')}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                              ${
                                errors.first_name ? "border-red-500" : "border-gray-300"
                              }`}
                        />

                        {
                          errors.first_name && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.first_name.message}</p>
                          )
                        }

                  </div>

                  <div className='mb-1'>
                      <label htmlFor="email" className="block text-xs font-medium mb-0">
                                Adresse mail<sup className='text-red-500'>*</sup>
                            </label>
                            <input 
                                id='email'
                                type="mail"
                                {...register('email')}
                                className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                  ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                  }`}
                            />

                            {
                              errors.email && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.email.message}</p>
                              )
                            }
                  </div>

                  <div className='mb-1'>
                      <label htmlFor="phone" className="block text-xs font-medium mb-0">
                                Téléphone<sup className='text-red-500'>*</sup>
                            </label>
                            <input 
                                id='phone'
                                type="phone"
                                defaultValue={6}
                                {...register('phone')}
                                className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
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
                  <hr className="border-dashed border-1 m-5 border-black" />
                  <h2 className='font-bold'>Informations de connexion</h2>
                  <p className='text-[8px] mb-3'>
                      Les informations renseignées seront les éléments de connexion de cet utilisateur pour accéder à son compte.
                  </p>

                  <div className='mb-2'>
                      <label htmlFor="username" className="block text-xs font-medium mb-0">
                                Nom d'utilisateur<sup className='text-red-500'>*</sup>
                            </label>
                            <input 
                                id='username'
                                type="text"
                                placeholder="Définir son nom d'utilisateur"
                                {...register('username')}
                                className={`w-2/3 px-2 py-3 text-[13px] border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                  ${
                                    errors.username ? "border-red-500" : "border-gray-300"
                                  }`}
                            />

                            {
                              errors.username && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.username.message}</p>
                              )
                            }
                  </div>

                  <div className='flex justify-end space-x-2 mt-2'>
                    <Button 
                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-primary hover:text-white transition" 
                    type="submit"
                    disabled={isSubmitting}
                   
                    >
                      {isSubmitting ? "Création en cours..." : "Créer un utilisateur"}
                    </Button>
                    <Button 
                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition" 
                    onClick={setOpen()} 
                    >
                      Annuler
                    </Button>

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
    );
}
 // Ajout de la validation des props
 CreateUser.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};