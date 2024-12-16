import {useState} from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import CustomingModal from '../../modals/CustomingModal';
import { Button } from "../../ui/button";

// Définition du schéma avec Zod
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
    ,

    password: z.string()
    .nonempty("Ce champs 'Mot de passe' est réquis.")
    .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@]).{8,}/, 
      "Le mot de passe saisie doit avoir au moins une lettre majuscule, une minuscule, un caractère spécial (@), un chiffre et doit contenir au moins 8 caractères."),
});

export default function CreateUser() {
  const [showPassword, setShowPassword] = useState(false);

  const [modalOpen, setModalOpen] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(userSchema),
    });

    const handleSubmitDataFormUser = async(data) => {
        console.log(data);
        await new Promise(resolve =>setTimeout(resolve, 2000));
        setModalOpen(false);
    };

     const handleCancel = () => {
        console.log('Bouton annuler cliqué dans le user');
        setModalOpen(false);
    };

    return (
      <CustomingModal
      title="Ajouter un utilisateur"
      buttonText="Créer un utilisateur"
      onOk={handleSubmit(handleSubmitDataFormUser)}
      onCancel={handleCancel}
      open={modalOpen}
      >

        <div className='space-y-0'>
            <p className='text-[10px] mb-5'>Veuillez correctement renseigner les informations de l'utilisateur.</p>
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
                            className={`w-2/3 px-2 py-3 text-[10px] border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
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

              <div className='mb-0 relative'>
                  <label htmlFor="password" className="block text-xs font-medium mb-0">
                            Mot de passe<sup className='text-red-500'>*</sup>
                        </label>
                        <input 
                            id='password'
                            placeholder="Définir son mot de passe"
                            type={showPassword ? "text" : "password"}
                            {...register('password')}
                            className={`w-2/3 px-2 py-3 text-[10px] border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                              ${
                                errors.password ? "border-red-500" : "border-gray-300"
                              }`}
                        />
                        <span 
                            className="absolute top-[50px] right-[175px] transform -translate-y-[20px] cursor-pointer" // Positionnement absolu
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? 
                              (<EyeSlashIcon className="h-4 w-4 text-gray-500" />) : 
                              (<EyeIcon className="h-4 w-4 text-gray-500" />) 
                            }
                        </span>

                        {
                          errors.password && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.password.message}</p>
                          )
                        }
              </div>

              <div className='flex justify-end space-x-2 mt-2'>
                <Button 
                className='px-3 w-36 text-white rounded-sm text-xs bg-green-600' 
                type="submit"
                disabled={isSubmitting}
                >
                  {isSubmitting ? "Création en cours..." : "Créer un utilisateur"}
                </Button>
                <Button 
                className='px-3 w-36 text-white rounded-sm text-xs bg-gray-700' 
                onClick={()=>handleCancel()}
                >
                  Annuler
                </Button>

              </div>
            </form>
      </div>
      </CustomingModal>
    );
}