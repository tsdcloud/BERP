import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import {Input} from "../../components/ui/input";
import {Button} from "../../components/ui/button";
import Footer from '../../components/layout/Footer';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Consommable/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/Consommable/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';

const Consommable = () =>{
    const {handleFetch} = useFetch();
    const [consommables, setConsommables] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);


    const fetchConsommable= async () => {
        let url = `${URLS.INCIDENT_API}/consommables`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            setConsommables(response.data);
            setTotalPages(response.totalPages);
            setTotal(response.total);
           }
        } catch (error) {
            console.log(error)
        }
    }
    const handleSubmit=()=>{
        fetchConsommable();
        document.getElementById("close-consommable").click();
    }

    useEffect(()=>{
        fetchConsommable();
    }, []);

    return(
        <>
            <Header />
            <div className='px-6'>
                <div className='flex items-center justify-between'>
                    {/* Header */}
                    <div>
                        <Tabs />
                    </div>
                    {/* Dialog */}
                    <div className='flex gap-2 items-center'>
                        {/* <Input placeholder="Recherche..." className="outline-primary"/> */}
                        <Dialogue 
                            buttonText={"Nouveau consommable"}
                            header={<h2 className='text-xl font-semibold'>Nouveau consommable</h2>}
                            content={
                            <InitiateForm 
                                onSucess={handleSubmit}
                            />}
                            isOpenned={isOpenned}
                        />
                    </div>
                </div>
                {/* Table */}
                <div className='w-full bg-white rounded-lg p-2'>
                    <Datalist 
                        dataList={consommables}
                        fetchData={fetchConsommable}
                    />

                </div>

                {/* Pagination */}
                {
                    consommables.length > 0 &&
                    <div className='flex items-center gap-2'>
                        {/* Prev */}
                        <button className='text-sm'>Prev</button>
                        {/* Steps */}
                        {
                            
                        }
                        {/* Next */}
                        <button className='text-sm'>Next</button>
                    </div>
                }
            </div>
        </>
    )
}

export default Consommable;