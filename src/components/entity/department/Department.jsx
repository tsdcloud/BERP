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
        // const urlToShowAllDepartment = URLS.API_DEPARTMENT;
        const urlToShowAllDepartment =  `${URLS.ENTITY_API}/departments`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllDepartment);
            // console.log("respoDepartment",response);
            
                if (response && response?.status === 200) {
                    
                        const results = response?.data;
                        const filteredDepartment = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { id: rest.id, 
                                     name:rest.name,
                                     entityId:rest.entity.name,
                                     createdAt:rest.createdAt,
                                     isActive:rest.isActive,
                                    };

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

