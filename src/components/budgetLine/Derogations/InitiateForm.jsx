import React, {useEffect, useState, useRef} from 'react';
import { useForm } from 'react-hook-form';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui/button';
import { CheckCircle } from 'lucide-react';
import Preloader from '../../Preloader';
import toast from 'react-hot-toast';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';

import { URLS } from '../../../../configUrl';
import { Input } from 'antd';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import TextArea from 'antd/es/input/TextArea';

const InitiateForm = ({onSucess}) => {
  const {register, handleSubmit, formState:{errors}, setValue} = useForm();
  const {handleFetch, handlePost} = useFetch();

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmiting, setIsSubmiting] = useState(false);

  const [budgetLineLibelleToDebit, setBudgetLineLibelleToDebit] = useState([]);
  const [budgetLineLibelleToCredit, setBudgetLineLibelleToCredit] = useState([]);

  const [breakDownBugetLineOfsToDebit, setBreakDownBugetLineOfsToDebit] = useState([]);
  const [breakDownBugetLineOfsToCredit, setBreakDownBugetLineOfsToCredit] = useState([]);

  const [entries, setEntries] = useState({
    derogationLignes: []
  });

  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' }).toLocaleUpperCase()

  const [selectedBreakDownBugetLineOfsToDebit, setSelectedBreakDownBugetLineOfsToDebit] = useState()
  const [selectedLibeleToDebit, setSelectedLibeleToDebit] = useState()
  
  const [selectedBreakDownBugetLineOfsToCredit, setSelectedBreakDownBugetLineOfsToCredit] = useState()
  const [selectedLibeleToCredit, setSelectedLibeleToCredit] = useState()
  
  const [budgetLineOfId1, setBudgetLineOfId1] = useState()
  const [budgetLineOfId2, setBudgetLineOfId2] = useState()

  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)

  const [tempDataTransfer, setTempDataTransfer] = useState([])

  const autoCompleteRefToDebit = useRef();
  const autoCompleteRefMonthToDebit = useRef();
  const autoCompleteRefToCredit = useRef();
  const autoCompleteRefMonthToCredit = useRef();

  let noData = [
    {
      name: "Cette ligne n'a pas de ventillation",
      value: ''
    }
  ]


  const handleClear = () => {
    if (autoCompleteRefToDebit.current) {
      autoCompleteRefToDebit.current.clear();
    }

    if (autoCompleteRefMonthToDebit.current) {
      autoCompleteRefMonthToDebit.current.clear();
    }

    if (autoCompleteRefToCredit.current) {
      autoCompleteRefToCredit.current.clear();
    }

    if (autoCompleteRefMonthToCredit.current) {
      autoCompleteRefMonthToCredit.current.clear();
    }

    setAmount(0)
  };
  

  const handleAddTransaction = () =>{

    setTempDataTransfer((prev) => {

      let data = [...prev]

      let selectedBudgetLinelibelleToDebitData = budgetLineLibelleToDebit.find(e=>e.value === selectedLibeleToDebit)

      let selectedBudgetLinelibelleToCreditData = budgetLineLibelleToCredit.find(e=>e.value === selectedLibeleToCredit)

      let budgetLineOfMonthToDebit = breakDownBugetLineOfsToDebit.find(e=>e.value === selectedBreakDownBugetLineOfsToDebit)

      let budgetLineOfMonthToCredit = breakDownBugetLineOfsToCredit.find(e=>e.value === selectedBreakDownBugetLineOfsToCredit)

      let newData = {

        budgetToDebit: selectedBudgetLinelibelleToDebitData?.name || "",
        detailMonthToDebit: budgetLineOfMonthToDebit?.name || "",

        amountToTransfert: amount || "",

        budgetToCredit: selectedBudgetLinelibelleToCreditData?.name || "",
        detailMonthToCredit: budgetLineOfMonthToCredit?.name || "",
      }

      // console.log("newData", newData);

      data.push(newData)

      let derogationsData = {
        breakdownBudgetLineOfDebitedId: selectedBreakDownBugetLineOfsToDebit,
        breakdownBudgetLineOfCreditedId: selectedBreakDownBugetLineOfsToCredit,
        Amount: amount
      }

      // console.log("derogationsData", derogationsData);
      

      setEntries(prev => ({
        ...prev,
        derogationLignes: [...prev.derogationLignes, derogationsData]
      }))

      return data
      
    })

    handleClear()
  }

  const calculateDiff = (real, estimated) =>{
    let diff = 0

    let estimatedAmount = estimated ? estimated : 0
    let realAmount = real ? real : 0

    diff = estimatedAmount - realAmount

    return diff
  }

  // Budget Line Name
  const handleFetchLibeleToDebit = async (link) =>{
    try {
      const response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedDataLibele = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setBudgetLineLibelleToDebit(formatedDataLibele);
        console.log("formatedDataLibele", formatedDataLibele)
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleFetchBreakDownBugetLineOfs1 = async (link) =>{
    try {
      const response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.month + " - " + "disponible: " + calculateDiff(item?.realAmount, item.estimatedAmount) + "F",
            value: item?.id
          }
        });
        setBreakDownBugetLineOfsToDebit(formatedData.length > 0 ? formatedData : noData);
        // console.log("breakdown-budget-lineOfs", formatedData)
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleFetchBreakDownBugetLineOfs2 = async (link) =>{
    try {
      const response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.month + " - " + "disponible: " + calculateDiff(item?.realAmount, item.estimatedAmount) + "F",
            value: item?.id
          }
        });
        setBreakDownBugetLineOfsToCredit(formatedData.length > 0 ? formatedData : noData);
        // console.log("breakdown-budget-lineOfs", formatedData)
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleFetchBugetLineOfs1= async (link) =>{
    try {
      const response = await handleFetch(link);     
      if(response?.status === 200){

        setBudgetLineOfId1(response?.data[0]?.id)
        // console.log("response?.data[0]?.id", response?.data[0]?.id)

        // return budgetLineOfId1
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleFetchBugetLineOfs2= async (link) =>{
    try {
      const response = await handleFetch(link);     
      if(response?.status === 200){

        setBudgetLineOfId2(response?.data[0]?.id)
        // console.log("response?.data[0]?.id", response?.data[0]?.id)

        // return budgetLineOfId1
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleSbmitDerogation = async (id) =>{
  
    let link = `${URLS.API_BUDGETLINE}/derogations/`

    let data = {
      description: "",
      derogationLignes: []
    }
    
    if (!description) return window.alert("la description est requise")
    
    if(tempDataTransfer.length === 0){

      if (!amount) return window.alert("le montant a transferer est requis")

      if (!selectedBreakDownBugetLineOfsToDebit) return window.alert("Veuillez selectionner la ligne budgetaire et la mois a debiter")
      
      if (!selectedBreakDownBugetLineOfsToCredit) return window.alert("Veuillez selectionner la ligne budgetaire et la mois a crediter")

      let derogationsData = {
          breakdownBudgetLineOfDebitedId: selectedBreakDownBugetLineOfsToDebit,
          breakdownBudgetLineOfCreditedId: selectedBreakDownBugetLineOfsToCredit,
          Amount: amount
        }

      data.derogationLignes.push(derogationsData)

      data.description = description

    } else {
      data = {
        description: description,
        derogationLignes: entries.derogationLignes
      }
    }
    
    try {
      let response = await handlePost(link, data);     
      if(response?.status === 201){
        console.log("Enregistrement réussi !", response)
      } else {
        return window.alert("une erreur s'est produite")
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }

    setEntries({
      derogationLignes: []
    });
    
    toast.success("Nouvelle dérogation effectuée avec succès");
    onSucess();
    
  }

  const handleSearchBudgetLineLibelleToDebit=async(searchInput)=>{
    try{
      handleFetchLibeleToDebit(`${URLS.API_BUDGETLINE}/budget-line-names/?isActive=true&name=${searchInput}`);
      // handleFetchBreakDownBugetLineOfs(`${URLS.API_BUDGETLINE}/breakdown-budget-lineOfs/?isActive=true&month=${currentMonth}&operationMonth=inf`);
    }catch(error){
      console.log(error);
    }
  }


  const handleSelectBudgetLineLibelleToDebit = (item) => {
    if(item){
      setValue("budgetLineLibelleToDebit", item?.value);
      setSelectedLibeleToDebit(item?.value)
    }else{
      setValue("budgetLineLibelleToDebit", null);
      setSelectedLibeleToDebit(null)
    }
  };

  const handleSelectBudgetLineLibelleToCredit = (item) => {
    if(item){
      setValue("budgetLineLibelleToCredit", item?.value);
      setSelectedLibeleToCredit(item?.value)
    }else{
      setValue("budgetLineLibelleToCredit",null);
      setSelectedLibeleToCredit(null)
    }
  };

  const handleSelectBudgetLineOfToDebit = (item) => {
    if(item){
      setValue("breakDownBugetLineOfsIdToDebit", item?.value);
      setSelectedBreakDownBugetLineOfsToDebit(item?.value)
    }else{
      setValue("breakDownBugetLineOfsIdToDebit",null);
      setSelectedBreakDownBugetLineOfsToDebit(null)
    }
  };

  const handleSelectBudgetLineOfToCredit = (item) => {
    if(item){
      setValue("breakDownBugetLineOfsIdToCredit", item?.value);
      setSelectedBreakDownBugetLineOfsToCredit(item?.value)
    }else{
      setValue("breakDownBugetLineOfsIdToCredit",null);
      setSelectedBreakDownBugetLineOfsToCredit(null)
    }
  };

  // console.log("la valeur de la ligne name", value)

  useEffect(()=>{
    handleFetchLibeleToDebit(`${URLS.API_BUDGETLINE}/budget-line-names/?isActive=true`);
  },[]);

  // useEffect(()=>{
  //   let filteredData = breakDownBugetLineOfsToDebit.filter((e)=>(e.value !== selectedBreakDownBugetLineOfsToDebit))
  //   setBreakDownBugetLineOfsToCredit(filteredData)
  // },[selectedBreakDownBugetLineOfsToDebit]);

  useEffect(()=>{
    let filteredData = budgetLineLibelleToDebit.filter((e)=>(e.value !== selectedLibeleToDebit))
    setBudgetLineLibelleToCredit(filteredData)

    handleFetchBugetLineOfs1(`${URLS.API_BUDGETLINE}/budget-line-ofs/?isActive=true&month=${currentMonth}&operationMonth=inf&budgetLineNameId=${selectedLibeleToDebit}`);

  },[selectedLibeleToDebit]);

  useEffect(()=>{

    handleFetchBugetLineOfs2(`${URLS.API_BUDGETLINE}/budget-line-ofs/?isActive=true&month=${currentMonth}&operationMonth=inf&budgetLineNameId=${selectedLibeleToCredit}`);

  },[selectedLibeleToCredit]);

  useEffect(()=>{
    handleFetchBreakDownBugetLineOfs1(`${URLS.API_BUDGETLINE}/breakdown-budget-lineOfs/?isActive=true&month=${currentMonth}&operationMonth=inf&budgetLineOfId=${budgetLineOfId1}`);
  },[budgetLineOfId1]); 

  useEffect(()=>{
    handleFetchBreakDownBugetLineOfs2(`${URLS.API_BUDGETLINE}/breakdown-budget-lineOfs/?isActive=true&month=${currentMonth}&operationMonth=inf&budgetLineOfId=${budgetLineOfId2}`);
  },[budgetLineOfId2]); 

  // useEffect(()=>{
  //   addEntry()
  //   // updateEntries(month1, montant1)
  // },[montant1, montant2, montant3, montant4, montant5, montant6, montant7, montant8, montant9, montant10, montant11, montant12]);



  // console.log("entries", entries);

  return (
    <form className='h-[400px] p-2' onSubmit={handleSubmit(handleSbmitDerogation)}>
      <div className='h-[350px] overflow-y-scroll overflow-x-hidden'>

        {/* Dérogations */}

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-sm font-semibold px-2'>Ligne budgetaire à debiter<span className='text-red-500'>*</span></label>
          <AutoComplete
            ref={autoCompleteRefToDebit}
            placeholder="Choisir la ligne a débiter"
            isLoading={isLoading}
            dataList={budgetLineLibelleToDebit}
            onSearch={handleSearchBudgetLineLibelleToDebit}
            onSelect={handleSelectBudgetLineLibelleToDebit}
            error={!selectedLibeleToDebit}
            value={selectedLibeleToDebit}
          />
          {!selectedLibeleToDebit && <small className='text-xs text-red-500 px-2'>Ce champ est requis</small>}
        </div>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-sm font-semibold px-2'>Mois<span className='text-red-500'>*</span></label>
          <AutoComplete
            ref={autoCompleteRefMonthToDebit}
            placeholder="Choisir le mois"
            isLoading={isLoading}
            dataList={breakDownBugetLineOfsToDebit}
            onSelect={handleSelectBudgetLineOfToDebit}
            error={!selectedBreakDownBugetLineOfsToDebit}
            value={selectedBreakDownBugetLineOfsToDebit}
          />
          {!selectedBreakDownBugetLineOfsToDebit && <small className='text-xs text-red-500 px-2'>Ce champ est requis</small>}
        </div>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-sm font-semibold px-2'>montant<span className='text-red-500'>*</span></label>
          <Input type="number" min={0} className='border border-zinc-200 rounded m-2 h-9 focus:border-blue-500 p-2 w-1/2' value={amount} onChange={(e)=>{setAmount(e.target.value)}}/>
          {!amount && <small className='text-xs text-red-500 px-2'>Ce champ est requis</small>}
        </div>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-sm font-semibold px-2'>Ligne budgetaire à créditer<span className='text-red-500'>*</span></label>
          <AutoComplete
            ref={autoCompleteRefToCredit}
            placeholder="Choisir la ligne a créditer"
            isLoading={isLoading}
            dataList={budgetLineLibelleToCredit}
            onSelect={handleSelectBudgetLineLibelleToCredit}
            error={!selectedLibeleToCredit}
            value={selectedLibeleToCredit}
          />
          {!selectedLibeleToCredit && <small className='text-xs text-red-500 px-2'>Ce champ est requis</small>}
        </div>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='text-sm font-semibold px-2'>Mois<span className='text-red-500'>*</span></label>
          <AutoComplete
            ref={autoCompleteRefMonthToCredit}
            placeholder="Choisir le mois"
            isLoading={isLoading}
            dataList={breakDownBugetLineOfsToCredit}
            onSelect={handleSelectBudgetLineOfToCredit}
            error={!selectedBreakDownBugetLineOfsToCredit}
            value={selectedBreakDownBugetLineOfsToCredit}
          />
          {!selectedBreakDownBugetLineOfsToCredit && <small className='text-xs text-red-500 px-2'>Ce champ est requis</small>}
        </div>

        <div className='flex justify-end mr-2'>
          <Button type="button" className="bg-green-600 text-white text-sm hover:bg-secondary" disabled={!selectedBreakDownBugetLineOfsToCredit} onClick={()=>{handleAddTransaction()}}>
            <PlusCircleIcon className='text-white'/>
            <span>Ajouter</span>
          </Button>
        </div>

        {tempDataTransfer.length > 0 && (
          <div className='flex flex-col bg-zinc-200 rounded m-2 p-1'>
            <span className='font-bold p-1'>Dérogations en attente</span>
            {tempDataTransfer.map((elm, index)=>(
              <div key={index} className='flex flex-col px-2 p-1'>
                {index > 0 ? <hr className='border-t border-dashed border-blue-400 pb-2'/> : ""}
                <div className='flex'>
                  <div className='flex flex-none'>
                    <span className='font-bold h-4 w-4 bg-blue-500 rounded-full text-center text-xs m-2'>{index + 1}</span>
                  </div>
                  <div className='pt-1 text-sm'>
                    <div>
                      <span className='font-bold'>ligne budgetaire débitée: </span>
                      {elm.budgetToDebit}
                    </div>
                    <div> 
                      <span className='font-bold'>Mois: </span>
                      {elm.detailMonthToDebit}
                    </div>

                    <div>
                      <span className='font-bold'>ligne budgetaire a créditer: </span>
                      {elm.budgetToCredit}
                    </div>
                    <div>
                      <span className='font-bold'>Mois: </span>
                      {elm.detailMonthToCredit}
                    </div>

                    <div>
                      <span className='font-bold'>montant a transferer: </span>
                      { elm.amountToTransfert}F
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


        <div>
          <label htmlFor="" className='text-sm font-semibold px-2'>Description<span className='text-red-500'>*</span></label>
          <div className='flex flex-col w-full px-2'>
            <TextArea 
              placeholder='entrez la description de la transaction...' 
              className={`border border-zinc-200 rounded h-12`} 
              onChange={(e)=>setDescription(e.target.value)}
              value={description}
            />
            {!description && <small className='text-xs text-red-500 px-2'>Ce champ est requis</small>}
          </div>
        </div>

      </div>
      <div className='flex justify-end p-2'>
        <Button className="bg-primary text-white my-2 text-sm w-1/3 hover:bg-secondary" disabled={isSubmiting}>
          {isSubmiting ? <Preloader size={20}/> : <CheckCircle className='text-white'/> }
          <span>{isSubmiting ? "En cours..."  : "Valider"}</span>
        </Button>
      </div>
    </form>
  )
}

export default InitiateForm