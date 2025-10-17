import React from 'react'
import {useForm} from 'react-hook-form';
import { AutoComplete } from 'antd';
import { useFetch } from '../../../hooks/useFetch';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import toast from 'react-hot-toast';  

const InitiateForm = ({onSucess}) => {
  
  const { register, handleSubmit, formState:{errors}, reset } = useForm();
  const { handlePost } = useFetch();

  const submitForm = async (data) =>{
    let url = `${URLS.INCIDENT_API}/incident-causes`
    // data.createdBy = "user 1";
    try {
      let response = await handlePost(url, data, true);
      if(response.error){
        // alert("Erreur. Une erreur est survenue lors de la création.");
        toast.error("Cette enregistrement existe déja dans la base de donnée");
        console.log(response)
        return
      }
      toast.success("Crée avec succès");
      reset();
      onSucess();
    } catch (error) {
      console.log(error);
      // toast.error("La création a échoué, vérifiez votre connexion ou contactez un IT");
    }
  }
  return (
    <form onSubmit={handleSubmit(submitForm)} className='space-y-2'>
        <div className='flex flex-col'>
          <Input {...register("name", {required:"Ce champs est requis"})} className="outline-none" placeholder="Entrer le nom de la cause"/>
          {errors.name && <small className='text-xs my-2 text-red-500'>{errors.name.message}</small>}
        </div>
        <Button className="bg-primary text-white font-normal my-2 py-1 text-xs">Créer</Button>
    </form>
  )
}

export default InitiateForm