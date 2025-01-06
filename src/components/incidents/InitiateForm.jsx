import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';

const InitiateForm = () => {
    const {register, handleSubmit} = useForm();
  return (
    <form>
        <Input 
            {...register("username", {required:"This field is required", minLength:{value:3, message:"Most have atleast 3 characters"}})}
        />
    </form>
  )
}

export default InitiateForm