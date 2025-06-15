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

    const [budgetLineName, setBudgetLineName] = useState([]);

    const [month1, setMonth1] = useState("JANVIER");
    const [montant1, setMontant1] = useState("");

    const [month2, setMonth2] = useState("FEVRIER");
    const [montant2, setMontant2] = useState("");

    const [month3, setMonth3] = useState("MARS");
    const [montant3, setMontant3] = useState("");

    const [month4, setMonth4] = useState("AVRIL");
    const [montant4, setMontant4] = useState("");

    const [month5, setMonth5] = useState("MAI");
    const [montant5, setMontant5] = useState("");

    const [month6, setMonth6] = useState("JUIN");
    const [montant6, setMontant6] = useState("");

    const [month7, setMonth7] = useState("JUILLET");
    const [montant7, setMontant7] = useState("");

    const [month8, setMonth8] = useState("AOUT");
    const [montant8, setMontant8] = useState("");

    const [month9, setMonth9] = useState("SEPTEMBRE");
    const [montant9, setMontant9] = useState("");

    const [month10, setMonth10] = useState("OCTOBRE");
    const [montant10, setMontant10] = useState("");

    const [month11, setMonth11] = useState("NOVEMBRE");
    const [montant11, setMontant11] = useState("");

    const [month12, setMonth12] = useState("DECEMBRE");
    const [montant12, setMontant12] = useState("");

    const [entries, setEntries] = useState([]);

    
    // Budget Line Name
    const handleFetchBudgetLineName = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setBudgetLineName(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }

  

    const updateEntries = (month1, montant1) => {
      setEntries(prevEntries =>
        prevEntries.some(entry => entry.month === month1)
          ? prevEntries.map(entry => 
              entry.month === month1 ? { ...entry, estimatedAmount: montant1 } : entry
            )
          : [...prevEntries, { month: month1, estimatedAmount: montant1 }]
      );
    };
    
    const addEntry = () => {
      
      if (montant1 > 0) {
        updateEntries(month1, montant1)
      }

      if (montant2 > 0) {
        updateEntries(month2, montant2)
      }

      if (montant3 > 0) {
        updateEntries(month3, montant3)
      }

      if (montant4 > 0) {
        updateEntries(month4, montant4)
      }

      if (montant5 > 0) {
        updateEntries(month5, montant5)
      }

      if (montant6 > 0) {
        updateEntries(month6, montant6)
      }

      if (montant7 > 0) {
        updateEntries(month7, montant7)
      }

      if (montant8 > 0) {
        updateEntries(month8, montant8)
      }

      if (montant9 > 0) {
        updateEntries(month9, montant9)
      }
      
      if (montant10 > 0) {
        updateEntries(month10, montant10)
      }

      if (montant11 > 0) {
        updateEntries(month11, montant11)
      }

      if (montant12 > 0) {
        updateEntries(month12, montant12)
      }
      
    }

    const handleResetAll = () => {
      setMonth1("")
      setMontant1("")
      setMonth2("")
      setMontant2("")
      setMonth3("")
      setMontant3("")
      setMonth4("")
      setMontant4("")
      setMonth5("")
      setMontant5("")
      setMonth6("")
      setMontant6("")
      setMonth7("")
      setMontant7("")
      setMonth8("")
      setMontant8("")
      setMonth9("")
      setMontant9("")
      setMonth10("")
      setMontant10("")
      setMonth11("")
      setMontant11("")
      setMonth12("")
      setMontant12("")
    }

    const handleSbmitBreakdownBudgetLineOf = async (id) =>{
    
      let link = `${URLS.API_BUDGETLINE}/breakdown-budget-lineOfs/`
      
      for (const entry of entries) {
        
        console.log("sending data", id, entry)
        
        let data = {
          budgetLineOfId: id,
          month: entry.month,
          estimatedAmount: entry.estimatedAmount,
        }
        
        try {
          let response = await handlePost(link, data);     
          if(response?.status === 200){
            console.log("Enregistrement réussi !", response)
          }
        } catch (error) {
          console.error(error);
        } finally{
          setIsLoading(false);
        }
      }
      
      handleResetAll()
      setEntries([])
      
      toast.success("Nouvel exercice budgetaire crée avec succès");
      onSucess();
      
    }
    
    const handleSubmitExceciseLigne = async (data) =>{
      // console.log(data)
      setIsSubmiting(true);

      // addEntry()

      try {

        let url = `${import.meta.env.VITE_BUDGETLINE_API}/budget-line-ofs/`;

        if (!montant1 && !montant2 && !montant3 && !montant4 && !montant5 && !montant6 && !montant7 && !montant8 && !montant9 && !montant10 && !montant11 && !montant12) {
          toast.error("Veuillez saisir au moins un montant pour un mois !")
          return
        }

        if (entries?.length === 0) {
          // alert("Veuillez saisir au moins un montant !")
          toast.error("Veuillez saisir au moins un montant pour un mois !")
          return
        }


        let response = await handlePost(url, data);
        if(response.status === 400){
          toast.error(response.message)
        } else {
          handleSbmitBreakdownBudgetLineOf(response.data.id)
        }
        // toast.success("Nouvel exercice budgetaire crée avec succès");
        // onSucess();
      } catch (error) {
        console.log(error)
      }finally{
        setIsSubmiting(false);
      }
    }

    const handleSearchbudgetLineName=async(searchInput)=>{
      try{
        handleFetchBudgetLineName(`${URLS.API_BUDGETLINE}/budget-line-names/?name=${searchInput}&isActive=true`);
      }catch(error){
        console.log(error);
      }
    }

    const handleSelectTypes = (item) => {
      if(item){
        setValue("budgetLineNameId", item?.value);
      }else{
        setValue("budgetLineNameId",null);
      }
    };

    // console.log("la valeur de la ligne name", value)

    useEffect(()=>{
      handleFetchBudgetLineName(`${URLS.API_BUDGETLINE}/budget-line-names/?isActive=true`);
    },[]);

    useEffect(()=>{
      addEntry()
      // updateEntries(month1, montant1)
    },[montant1, montant2, montant3, montant4, montant5, montant6, montant7, montant8, montant9, montant10, montant11, montant12]);



    console.log("entries", entries);
    


  return (
    <form className='h-[400px] p-2' onSubmit={handleSubmit(handleSubmitExceciseLigne)}>
      <div className='h-[350px] overflow-y-scroll overflow-x-hidden'>

        {/* Major Line */}

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-sm font-semibold px-2'>Ligne <span className='text-red-500'>*</span></label>
          <AutoComplete
            placeholder="Choisir la ligne correspondante"
            isLoading={isLoading}
            dataList={budgetLineName}
            onSearch={handleSearchbudgetLineName}
            onSelect={handleSelectTypes}
            register={{...register('budgetLineNameId', {required:'Ce champ est requis'})}}
            error={errors.budgetLineNameId}
          />
          {errors.budgetLineNameId && <small className='text-xs text-red-500 px-2'>{errors.budgetLineNameId.message}</small>}
        </div>
        
        {/* Janvier */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="JANVIER" placeholder='JANVIER' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant1} onChange={(e) => setMontant1(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Fervrier */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="FEVRIER" placeholder='FEVRIER' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant2} onChange={(e) => setMontant2(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Mars */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="MARS" placeholder='MARS' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant3} onChange={(e) => setMontant3(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Avril */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="AVRIL" placeholder='AVRIL' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant4} onChange={(e) => setMontant4(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Mai */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="MAI" placeholder='MAI' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant5} onChange={(e) => setMontant5(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Juin */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="JUIN" placeholder='JUIN' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant6} onChange={(e) => setMontant6(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Juillet */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="JUILLET" placeholder='JUILLET' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant7} onChange={(e) => setMontant7(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Aout */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="AOUT" placeholder='AOUT' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant8} onChange={(e) => setMontant8(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Septembre */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="SEPTEMBRE" placeholder='SEPTEMBRE' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant9} onChange={(e) => setMontant9(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Octobre */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="OCTOBRE" placeholder='OCTOBRE' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant10} onChange={(e) => setMontant10(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Novembre */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="NOVEMBRE" placeholder='NOVEMBRE' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant11} onChange={(e) => setMontant11(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
        </div>

        {/* Decembre */}
        <div className='flex w-full px-2 pb-2'>
          <div>
            <label htmlFor="" className='text-sm font-semibold'>Mois :</label>
            <input type="text" value="DECEMBRE" placeholder='DECEMBRE' disabled className='border rounded-lg p-2 text-sm' />
          </div>
          <div className='flex flex-col'>
            <div>
              <label htmlFor="" className='text-sm font-semibold'>Montant <span className='text-red-500'>*</span>:</label>
              <input type="number" min="0" className='border rounded-lg p-2 text-sm' value={montant12} onChange={(e) => setMontant12(e.target.value)}/>
            </div>
            {/* {errors.estimatedAmount && <small className='text-xs text-red-500'>{errors.estimatedAmount.message}</small>} */}
          </div>
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