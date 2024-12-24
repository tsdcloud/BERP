import {useState} from 'react';
import {Input} from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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


const resetPasswordSchema = z.object({
  email: z.string()
  .nonempty("Ce champs 'Email' est réquis.")
  .email("Adresse mail invalide")
  .max(255)
  ,
});



export default function ForgetPassword() {

  const [isDialogOpen, setDialogOpen] = useState(false);

  
  const returnDialog = () =>{

    return(
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Finaliser la procédure.</AlertDialogTitle>
          <AlertDialogDescription>
            Nous vous avons envoyé par votre adresse mail renseignée, des instructions à suivre
            pour terminer la procédure de réinitialisation de mot de passe.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
          <AlertDialogAction className="py-2 px-3 bg-blue-900 text-white" onClick={() => setDialogOpen(false)}>Bien, recu.</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    );
  };



  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    });

  const handleSubmitEmailForReseting = async(data) => {
      console.log(data);
      await new Promise(resolve =>setTimeout(resolve, 2000));
      setDialogOpen(true);
  };




  return (
    <SignInLayout>
          <div className='text-center py-3'>
              <h3 className='font-semibold mb-3 text-lg'>Réinitialiser votre mot de passe</h3>
              <p className='text-[13px] mb-5'>
                Renseigner votre adresse mail afin de reçevoir un code de Réinitialisation.
              </p>
          </div>
          <form onSubmit={handleSubmit(handleSubmitEmailForReseting)} 
            className='sm:bg-blue-200 mb-5 md:bg-transparent'>

                    <div className='mb-4'>
                            <label htmlFor="email" className="block text-xs font-medium mb-0">
                                      Adresse mail<sup className='text-red-500'>*</sup>
                            </label>
                              <Input
                                  id='email'
                                  type="mail"
                                  {...register('email')}
                                  className={`w-[320px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:mt-1
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
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-[320px] bg-blue-900 text-white py-2 px-4 text-xs rounded-3xl shadow-md hover:bg-blue-700 transition"
                          >
                            {isSubmitting ? "Envoi en cours..." : "Envoyez moi un mail"}
                          </Button>
                          <div className=' flex justify-center mt-6 text-[8px]'>
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
