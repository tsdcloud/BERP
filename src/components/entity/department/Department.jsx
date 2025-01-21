import React, { useState, useEffect } from 'react';
import { DepartmentAction } from './ColumnsDepartment';
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable';
import CreateDepartment from './CreateDepartment';

export default function Department() {

    const { showDialogDepartment, columnsDepartment } = DepartmentAction();
    const [department, setDepartment] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchDepartment = async () => {
        const urlToShowAllDepartment = "";
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllDepartment);
            console.log("respoDepartment",response);
            
                if (response && response?.data?.results) {
                    
                        const results = response?.data?.results;
                        const filteredDepartment = results?.map(item => {
                        const { role_created_by, role_updated_by, ...rest } = item;
                        return rest;

                        });
                        setDepartment(filteredDepartment);
                }
                else{
                    throw new Error('Erreur lors de la récupération des departements');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchDepartment();
        
    }, []);

  return (
    <div className='m-1 space-y-3 my-10 '>
    <h1 className='text-sm mb-2'>Gestion des departements</h1>
    <div className='space-y-2'>
        <CreateDepartment setOpen={setOpen} onSubmit={fetchDepartment}/>
        {columnsDepartment && department?.length >= 0 && (
            <DataTable
                className="rounded-md border w-[800px] text-xs"
                columns={columnsDepartment}
                data={department} 
            />
        )}
    </div>
    {showDialogDepartment()}
</div> 
  );
};

