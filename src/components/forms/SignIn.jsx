import {useState} from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";

import SignInLayout from '../layout/SignInLayout';


// Définir un schéma Zod
const formSignInSchema = z.object({
  identifier: z.string().nonempty("Ce champ est requis")
    .refine(
      (value) => /\S+@\S+\.\S+/.test(value) || /^[a-zA-Z0-9_]{6,}$/.test(value),
      "ce champ doit être un email valide ou un nom d'utilisateur valide. (minimum 6 caractères)"
    ),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});


export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

      const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: zodResolver(formSignInSchema),
      });

      const submitDataSignIn = async(data) => {
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        console.log("Données soumises : ", data);
        // C'est ici que je mettrai l'API ou effectuer une action avec les données
      };

  return (
   <SignInLayout>
     <form onSubmit={handleSubmit(submitDataSignIn)} 
      className='text-xs'>

            {/* Champ Identifier (Email ou Username) */}
        <div className="mb-5">
          <label htmlFor="identifier" className="block text-xs font-medium mb-1">
            Email ou Nom d'utilisateur<sup className='text-red-500'>*</sup>
          </label>
          <input
            id="identifier"
            type="text"
            placeholder=''
            {...register("identifier")}
            className={`w-full px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
              errors.identifier ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.identifier && (
            <p className="text-red-500 text-[9px] mt-1">{errors.identifier.message}</p>
          )}
        </div>

         {/* Champ Mot de passe */}
         <div className="relative mb-5"> {/* Ajout d'un conteneur relatif */}
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Mot de passe<sup className='text-red-500'>*</sup>
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder='Entrer votre mot de passe'
            {...register("password")}
            className={`w-full px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span 
            className="absolute top-[50px] right-3 transform -translate-y-[20px] cursor-pointer" // Positionnement absolu
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 
              (<EyeSlashIcon className="h-4 w-4 text-gray-500" />) : 
              (<EyeIcon className="h-4 w-4 text-gray-500" />) 
            }
          </span>
          {errors.password && (
            <p className="text-red-500 text-[9px] mt-1">{errors.password.message}</p>
          )}
          <div className='text-right flex justify-end mt-2 text-[9px]'>Information incorrecte ou mot de passe oublié ?<p className='text-green-900 underline cursor-pointer'>Cliquez ici.</p></div>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-900 text-white py-2 px-4 rounded-3xl shadow-md hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Connexion en cours..." : "Je me connecte"}
        </button>
        <div className=' flex justify-center mt-2 text-[8px]'>En vous connectant, vous acceptez nos <p className='text-green-900 underline cursor-pointer'>Conditions de confidentialités.</p></div>
        
     </form>
   </SignInLayout>
  );
}

