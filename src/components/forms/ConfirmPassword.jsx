import {useState} from 'react';
import {Input} from "../ui/input";
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import {  AlertDialog,
          AlertDialogAction,
          // AlertDialogCancel,
          AlertDialogContent,
          AlertDialogDescription,
          AlertDialogFooter,
          AlertDialogHeader,
          AlertDialogTitle,
          // AlertDialogTrigger,

} from "../ui/alert-dialog";

import SignInLayout from '../layout/SignInLayout';


const confirmPasswordSchema = z.object({
    password: z.string()
    .nonempty("Ce champs 'Mot de passe' est réquis.")
    .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@]).{8,}/, 
      "Le mot de passe saisie doit avoir au moins une lettre majuscule, une minuscule, un caractère spécial (@), un chiffre et doit contenir au moins 8 caractères."),
    confirmPassword: z.string()
    .nonempty("Ce champs 'Confirmation de mot de passe' est réquis.")
    .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@]).{8,}/, 
      "La confirmation du mot de passe saisie doit avoir au moins une lettre majuscule, une minuscule, un caractère spécial (@), un chiffre et doit contenir au moins 8 caractères."),
}).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe doivent correspondre.",
    path: ["confirmPassword"], // Indiquez le champ où l'erreur doit apparaître
});




export default function ConfirmPassword() {

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const returnDialog = () =>{

    return(
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Réinitialisation réussie.</AlertDialogTitle>
          <AlertDialogDescription>
            Vous avez réinitialisé votre mot de passe avec succès.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
          <Link to="/signIn">
          <AlertDialogAction className="py-2 px-3 bg-blue-900 text-white">Ok, je vais me connecter.</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    );
  };



  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(confirmPasswordSchema),
    });

  const handleSubmitConfirmPassword = async(data) => {
      console.log(data);
      await new Promise(resolve =>setTimeout(resolve, 2000));
      setDialogOpen(true);
  };


  

  return (
    <SignInLayout>
          <div className='text-center py-3'>
              <h3 className='font-semibold text-xl'>Modifier votre mot de passe </h3>
              <p className='text-[13px] mb-1'>
                Renseigner vos nouveaux identifiants.
              </p>
          </div>
          <form onSubmit={handleSubmit(handleSubmitConfirmPassword)} 
            className='sm:bg-blue-200 text-xs md:bg-transparent'>

                <div className="relative mb-3">
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                                 Nouveau mot de passe<sup className='text-red-500'>*</sup>
                            </label>
                            <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder='Entrer votre nouveau mot de passe'
                            {...register("password")}
                            className={`w-full px-2 py-3 text-[9px] border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                            />
                            <span 
                            className="absolute top-[50px] right-3 transform -translate-y-[20px] cursor-pointer"
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
                            
                </div>
                <div className="relative mb-3">
                            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                                 confirmer votre nouveau mot de passe<sup className='text-red-500'>*</sup>
                            </label>
                            <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder='confirmer votre nouveau mot de passe'
                            {...register("confirmPassword")}
                            className={`w-full px-2 py-3 text-[9px] border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                errors.confirmPassword ? "border-red-500" : "border-gray-300"
                            }`}
                            />
                            <span 
                            className="absolute top-[50px] right-3 transform -translate-y-[20px] cursor-pointer" // Positionnement absolu
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                            {showConfirmPassword ? 
                                (<EyeSlashIcon className="h-4 w-4 text-gray-500" />) : 
                                (<EyeIcon className="h-4 w-4 text-gray-500" />) 
                            }
                            </span>
                            {errors.confirmPassword && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.confirmPassword.message}</p>
                            )}
                            
                </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-[320px] bg-blue-900 text-white py-2 px-4 text-xs rounded-3xl shadow-md hover:bg-blue-700 transition"
                          >
                            {isSubmitting ? "Confirmation en cours..." : "Je confirme mon mot de passe"}
                          </Button>
                          <div className=' flex justify-center mt-2 text-[8px]'>
                              Par cette action, vous acceptez nos 
                              <p className='text-green-900 underline cursor-pointer'>
                                Conditions de confidentialités.
                              </p>
                        </div>

          </form>
          {returnDialog()}
     </SignInLayout>
  );
}
