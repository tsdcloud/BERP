import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui/button';
import { CheckCircle } from 'lucide-react';
import Preloader from '../../Preloader';
import toast from 'react-hot-toast';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';

import { URLS } from '../../../../configUrl';

const InitiateForm = ({onSucess}) => {
    const {register, handleSubmit, formState:{errors}, setValue} = useForm();
    const {handleFetch, handlePost} = useFetch();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmiting, setIsSubmiting] = useState(false);

    const [majorLine, setMajorLine] = useState([]);
    
    // MajorLine
    const handleFetchMajorLine = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setMajorLine(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }
    
    const handleSubmitLigne = async (data) =>{
      console.log(data)
      setIsSubmiting(true);
      try {
        let url = `${import.meta.env.VITE_BUDGETLINE_API}/budget-line-names/`;
        let response = await handlePost(url, data);
        if(response.error){
          toast.error(response.message)
          return;
        }
        toast.success("Libellé de la ligne budgetaire crée avec succès");
        onSucess();
      } catch (error) {
        console.log(error)
      }finally{
        setIsSubmiting(false);
      }
    }

    const handleSearchMajorLine=async(searchInput)=>{
      try{
        handleFetchMajorLine(`${URLS.API_BUDGETLINE}/major-budget-lines/?name=${searchInput}&isActive=true`);
      }catch(error){
        console.log(error);
      }
    }

    const handleSelectTypes = (item) => {
      if(item){
        setValue("majorBudgetLineId", item?.value);
      }else{
        setValue("majorBudgetLineId",null);
      }
    };

    useEffect(()=>{
      handleFetchMajorLine(`${URLS.API_BUDGETLINE}/major-budget-lines/?isActive=true`);
    },[]);


  return (
    <form className='h-[250px] p-2' onSubmit={handleSubmit(handleSubmitLigne)}>
      <div className='h-[200px] overflow-y-scroll overflow-x-hidden'>

        {/* Major Line */}

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-sm font-semibold px-2'>La famille de la ligne <span className='text-red-500'>*</span></label>
          <AutoComplete
            placeholder="Choisir la famille de la ligne"
            isLoading={isLoading}
            dataList={majorLine}
            onSearch={handleSearchMajorLine}
            onSelect={handleSelectTypes}
            register={{...register('majorBudgetLineId', {required:'Ce champ est requis'})}}
            error={errors.majorBudgetLineId}
          />
          {errors.majorBudgetLineId && <small className='text-xs text-red-500 px-2'>{errors.majorBudgetLineId.message}</small>}
        </div>
        {/* Code */}
        <div className='flex flex-col w-full px-2 pb-2'>
          <label htmlFor="" className='text-sm font-semibold'>Code <span className='text-red-500'>*</span>:</label>
          <input type="text" className='border rounded-lg p-2 text-sm' {...register("code", {required:"Ce champ est requis"})}/>
          {errors.code && <small className='text-xs text-red-500'>{errors.code.message}</small>}
        </div>

        {/* Name */}
        <div className='flex flex-col w-full px-2'>
          <label htmlFor="" className='text-sm font-semibold'>Nom <span className='text-red-500'>*</span>:</label>
          <input type="text" className='border rounded-lg p-2 text-sm' {...register("name", {required:"Ce champ est requis"})}/>
          {errors.name && <small className='text-xs text-red-500'>{errors.name.message}</small>}
        </div> 

      </div>
      <div className='flex justify-end p-2'>
        <Button className="bg-primary text-white my-2 text-sm w-1/3 hover:bg-secondary" disabled={isSubmiting}>
          {isSubmiting ? <Preloader size={20}/> : <CheckCircle className='text-white'/> }
          <span>{isSubmiting ? "En cours..."  : "Créer"}</span>
        </Button>
      </div>
    </form>
  )
}

export default InitiateForm