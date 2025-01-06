import React, {useState} from 'react'
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import { toast } from "sonner"
import { useToast } from "../../../hooks/use-toast"
import { cn } from "../../../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover"

const InitiateForm = ({onSucess}) => {
  
  const { register, handleSubmit, formState:{errors} } = useForm();
  const { handlePost } = useFetch();
  const { toast } = useToast();

  const submitForm = async (data) =>{
    let url = `${URLS.INCIDENT_API}/consommables`
    data.createdBy = "user 1";
    try {
      let response = await handlePost(url, data, false);
      if(response.error){
        alert("Erreur. Une erreur est survenue lors de la création.");
        return
      }
      onSucess();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <form onSubmit={handleSubmit(submitForm)} className='space-y-2'>
        <div className='flex flex-col'>
          <Input {...register("name", {required:"Ce champs est requis"})} className="outline-none" placeholder="Entrer le nom du consommable"/>
          {errors.name && <small className='text-xs my-2 text-red-500'>{errors.name.message}</small>}
        </div>
        <Button className="bg-primary text-white font-normal my-2 py-1 text-xs">Créer</Button>
    </form>
  )
}

export default InitiateForm