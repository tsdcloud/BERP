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
    const fetchConsommable= async () => {
        let url = `${URLS.INCIDENT_API}/consommables`;
        try {
           const response = await handleFetch(url); 
           console.log(response);
        } catch (error) {
            console.log(error)
        }
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
                        <Input placeholder="Recherche..." className="outline-primary"/>
                        <Dialogue 
                            buttonText={"Nouveau consommable"}
                            header={<h2 className='text-xl font-semibold'>Nouveau consommable</h2>}
                            content={<InitiateForm />}
                        />
                    </div>
                </div>
                {/* Table */}
                <Datalist 
                    dataList={consommables}
                />
            </div>
        </>
    )
}

export default Consommable;