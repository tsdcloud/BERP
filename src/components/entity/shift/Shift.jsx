import React, { useState, useEffect } from 'react';
import { ShiftAction } from './ColumnsShift';
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable';
import CreateShift from './CreateShift';

export default function Shift() {

    const { showDialogShift, columnsShift } = ShiftAction();
    const [shift, setShift] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchShift = async () => {
        const urlToShowAllShift =  `${URLS.ENTITY_API}/shifts`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllShift);
            // console.log("respoShift",response);
            
                if (response && response?.status === 200) {
                    
                        const results = response?.data;
                        const filteredShift = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { id: rest.id, 
                                     name:rest.name,
                                     startTime:rest.startTime,
                                     endTime:rest.endTime,
                                     entityId:rest.entity.name,
                                     createdAt:rest.createdAt,
                                     isActive:rest.isActive,
                                    };

                        });
                        setShift(filteredShift);
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
        fetchShift();
    }, []);

  return (
    <div className='m-1 space-y-3 my-10 '>
        <h1 className='text-sm mb-2'>Gestion des shifts</h1>
        <div className='space-y-2'>
            <CreateShift setOpen={setOpen} onSubmit={fetchShift}/>
            {columnsShift && shift?.length >= 0 && (
                <DataTable
                    className="rounded-md border w-[800px] text-xs"
                    columns={columnsShift}
                    data={shift} 
                />
            )}
        </div>
        {showDialogShift()}
    </div> 
  );
};

