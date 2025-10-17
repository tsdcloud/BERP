// export default InitiateForm
import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import AutoComplete from '../../common/AutoComplete';
import toast from 'react-hot-toast';
import Preloader from "../../Preloader";
import { CheckCircle } from 'lucide-react';

const InitiateForm = ({onSucess}) => {
  
  const { register, handleSubmit, formState:{errors}, reset } = useForm();
  const { handlePost } = useFetch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data) =>{
    let url = `${URLS.INCIDENT_API}/equipment-group-families`
    setIsSubmitting(true)
    try {
      let response = await handlePost(url, data, true);
      if(response.error){
        response?.errors.forEach(error => {
          toast.error(error?.msg);
        });
        return
      }
      toast.success("Crée avec succès");
      reset(); // Réinitialise le formulaire
      onSucess();
    } catch (error) {
      console.log(error);
      // toast.error("La création a échoué, vérifiez votre connexion ou contactez un IT");
    }finally{
      setIsSubmitting(false);
    }
  }
  

  return (
    <form onSubmit={handleSubmit(submitForm)} className='space-y-2'>
        <div className='flex flex-col mx-4 space-y-2'>
          <label htmlFor="" className='text-sm font-semibold'>Nom du domaine :</label>
          <input {...register("name", {required:"Ce champs est requis"})} className={`${errors.name ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="Entrer le nom du domaine"/>
          {errors.name && <small className='text-xs my-2 text-red-500'>{errors.name.message}</small>}
        </div>
        <div className='flex justify-end'>
          <Button disabled={isSubmitting} className={`${isSubmitting ? 'bg-blue-300' :'bg-primary hover:bg-secondary'} text-white font-semibold my-2 py-1 text-sm flex`}>
            {isSubmitting ? <Preloader size={20}/> : <CheckCircle />}
            <span>{isSubmitting ? "Création encours..." : "Créer"}</span>
          </Button>
        </div>
    </form>
  )
}

export default InitiateForm