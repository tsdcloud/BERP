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
import { usePermissions } from '../../contexts/PermissionsProvider';
import { getEmployee } from '../../utils/entity.utils';

// Définir un schéma Zod
const formSignInSchema = z.object({
  login: z.string().nonempty("Ce champ est requis")
    ,
    password: z.string()
    .nonempty("Ce champs 'Mot de passe' est réquis."),
});

export default function SignIn() {
  const navigateToDashboard = useNavigate();
  const { handlePost } = useFetch();

 const { setIsAuth, setUserData, setToken, setRefresh } = useContext(AUTHCONTEXT);
 const { setPermissions, setRoles } = usePermissions();

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
      const urlToLogin = `${URLS.API_USER_ABILITY}/login/`;
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
                fetchPermissionsAndRoles();
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

    // Fetch permissions and roles
    const fetchPermissionsAndRoles = async () => {
      try {
        const employee = await getEmployee();
        if(!employee){
            setIsLoading(false);
            return 
        }
        const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
        const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
        
        let empPerms = employeePermissions?.employeePermissions
        let empRoles = employeeRoles?.employeeRoles

        let formatedRoles = empRoles.map(role=>role?.role.roleName)
        let formatedPerms = empPerms.map(perm=>perm?.permission.permissionName)

        setRoles(formatedRoles);
        setPermissions(formatedPerms);


      } catch (error) {
        console.error("Error during fetch permissions and roles",error);
      }
    }

  return (
   <SignInLayout>
    <div className='text-center my-0 sm:my-3'>
        <h3 className='font-semibold text-md sm:text-xl'>Connectez-vous à votre compte</h3>
        <p className='text-xs'>Renseignez correctement vos identifiants.</p>
     </div>

      <form onSubmit={handleSubmit(submitDataSignIn)}  
        className='text-xs m-0 my-5 sm:m-10'>

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

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-900 text-white py-2 px-4 text-xs rounded-3xl shadow-md hover:bg-blue-700 transition"
          >
            { isSubmitting ? "Connexion en cours..." : "Je me connecte" }
          </Button>
          <div className='flex justify-center mt-2 text-[8px]'>
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

