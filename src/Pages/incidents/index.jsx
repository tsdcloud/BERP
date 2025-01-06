import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import {Input} from "../../components/ui/input";
import {Button} from "../../components/ui/button";
import Footer from '../../components/layout/Footer';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import { useFetch } from '../../hooks/useFetch';

const Incident = () =>{
    
    return(
        <>
            <Header />
            <div className='px-6 flex items-center justify-between'>
                {/* Header */}
                <div>
                    <Tabs />
                </div>
                {/* Dialog */}
                <div className='flex gap-2 items-center'>
                    <Input placeholder="Recherche..." className="outline-primary"/>
                    <Dialogue 
                        buttonText={"Declarer un incident"}
                        header={<h2 className='text-xl font-semibold'>Initier un incident</h2>}
                        content={<InitiateForm />}
                    />
                </div>
                {/* Table */}
            </div>
        </>
    )
}

export default Incident;