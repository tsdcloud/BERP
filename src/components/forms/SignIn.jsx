import {useState, useContext} from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import {jwtDecode} from 'jwt-decode'; 
import { URLS } from '../../../configUrl';


import toast, { Toaster } from 'react-hot-toast';

import SignInLayout from '../layout/SignInLayout';

import { useFetch } from '../../hooks/useFetch';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';


// Définir un schéma Zod
const formSignInSchema = z.object({
  login: z.string().nonempty("Ce champ est requis")
    // .refine(
    //   (value) => /\S+@\S+\.\S+/.test(value) || /^[a-zA-Z0-9_]{3,}$/.test(value),
    //   "ce champ doit être un email valide ou un nom d'utilisateur valide. (minimum 3 caractères)"
    // )
    ,
    password: z.string()
    .nonempty("Ce champs 'Mot de passe' est réquis.")
    // .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@]).{8,}/, 
    // "Le mot de passe saisie doit avoir au moins une lettre majuscule, une minuscule, un caractère spécial (@), un chiffre et doit contenir au moins 8 caractères."),
});

export default function SignIn() {
  const navigateToDashboard = useNavigate();
  const { handlePost } = useFetch();

 const { setIsAuth, setUserData, setToken, setRefresh } = useContext(AUTHCONTEXT);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

      const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: zodResolver(formSignInSchema),
      });


  
      const submitDataSignIn = async(data) => {
        // console.log("data", data);
        // const urlToLogin = "http://127.0.0.1:8000/api_gateway/token/";
        const urlToLogin = `${URLS.API_USER_ABILITY}/login/`;
        // const urlToLogin = URLS.LOGIN;
        // console.log(urlToLogin);
        try {
              const response = await handlePost(urlToLogin, data, false);

              if (response && response?.data && response?.data?.access) {
                  const token = response?.data?.access;
                  const refresh = response?.data?.refresh;
                  setToken(token);
                  setRefresh(refresh);
                  const decoded = jwtDecode(token);
                  setIsAuth(true);
                  setUserData(decoded);
                  
                  navigateToDashboard("/");
              }
              else {
                toast.error(response.message, { duration: 5000});
              }
              
            } catch (error) {
              console.error("Error during sign-in",error);
              toast.error("Erreur lors de la connexion", { duration: 5000 });
            }
      };

  return (
   <SignInLayout>
    <div className='text-center my-3'>
        <h3 className='font-semibold text-xs'>Connectez-vous à votre compte</h3>
        <p className='text-xs'>Renseignez correctement vos identifiants.</p>
     </div>

      <form onSubmit={handleSubmit(submitDataSignIn)}  
        className='text-xs'>

              {/* Champ Identifier (Email ou Username) */}
          <div className="mb-5">
            <label htmlFor="login" className="block text-xs font-medium mb-1">
              Email ou Nom d'utilisateur<sup className='text-red-500'>*</sup>
            </label>
            <input
              id="login"
              type="text"
              placeholder=''
              {...register("login")}
              className={`w-full px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                errors.login ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.login && (
              <p className="text-red-500 text-[9px] mt-1">{errors.login.message}</p>
            )}
          </div>

          {/* Champ Mot de passe */}
          <div className="relative mb-5">
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
            <div className='text-right flex justify-end mt-2 text-[9px]'>
              Information incorrecte ou mot de passe oublié ?
              <Link to={"/forgetPassword"} className='text-green-900 underline cursor-pointer'>
                Cliquez ici.
              </Link>
            </div>
          </div>
          {/* <Button className="w-full bg-blue-900 text-white py-2 px-4 rounded-3xl shadow-md hover:bg-blue-700 transition">Something</Button> */}

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-900 text-white py-2 px-4 text-xs rounded-3xl shadow-md hover:bg-blue-700 transition"
          >
            { isSubmitting ? "Connexion en cours..." : "Je me connecte" }
          </Button>
          <div className=' flex justify-center mt-2 text-[8px]'>
                En vous connectant, vous acceptez nos 
                <p className='text-green-900 underline cursor-pointer'>
                  Conditions de confidentialités.
                </p>
          </div>
          
      </form>
      <Toaster/>
   </SignInLayout>
  );
}

