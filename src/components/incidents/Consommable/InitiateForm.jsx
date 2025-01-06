import React from 'react'
import {useForm} from 'react-hook-form'
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
const InitiateForm = () => {
  
  const { register, handleSubmit, formState:{errors} } = useForm();
  const submitForm = async () =>{
    try {
      
    } catch (error) {
      
    }
  }
  return (
    <form onSubmit={handleSubmit(submitForm)}>
        <div className='flex flex-col'>
          <Input {...register("name", {required:"Ce champs est requis"})} placeholder="Entrer le nom du consommable"/>
          {errors.name && <small className='text-xs my-2 text-red-500'>{errors.name.message}</small>}
        </div>
        <Button className="bg-primary text-white font-normal my-2">Créer</Button>
    </form>
  )
}

export default InitiateForm