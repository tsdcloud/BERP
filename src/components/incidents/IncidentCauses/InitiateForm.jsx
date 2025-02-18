import React from 'react'
import {useForm} from 'react-hook-form';
import { AutoComplete } from 'antd';
import { useFetch } from '../../../hooks/useFetch';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';

const InitiateForm = ({onSucess}) => {
  
  const { register, handleSubmit, formState:{errors} } = useForm();
  const { handlePost } = useFetch();

  const submitForm = async (data) =>{
    let url = `${URLS.INCIDENT_API}/incident-causes`
    data.createdBy = "user 1";
    try {
      let response = await handlePost(url, data, false);
      if(response.error){
        alert("Erreur. Une erreur est survenue lors de la création.");
        console.log(response)
        return
      }
      onSucess();
    } catch (error) {
      console.log(error);
      alert("Erreur. Une erreur est survenue lors de la création.");
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