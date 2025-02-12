import React, { useState, useEffect } from 'react';
import { SupplierAction } from './ColumnsSupplier';
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable';
import CreateSupplier from './CreateSupplier';

export default function Supplier() {

    const { showDialogSupplier, columnsSupplier } = SupplierAction();
    const [supplier, setSupplier] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchSupplier = async () => {
        const urlToShowAllSupplier =  `${URLS.ENTITY_API}/suppliers`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllSupplier);
            // console.log("respoSupplier",response);
            
                if (response && response?.status === 200) {
                    
                        const results = response?.data;
                        const filteredSupplier = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { id: rest.id, 
                                     name:rest.name,
                                     address:rest.address,
                                     phone:rest.phone,
                                     email:rest.email,
                                     entityId:rest.entity.name,
                                     createdAt:rest.createdAt,
                                     isActive:rest.isActive,
                                    };

                        });
                        setSupplier(filteredSupplier);
                }
                else{
                    throw new Error('Erreur lors de la récupération des suppliers');
                    
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchSupplier();
        
    }, []);

  return (
    <div className='m-1 space-y-3 my-10 '>
    <h1 className='text-sm mb-2'>Gestion des Prestataires</h1>
    <div className='space-y-2'>
        <CreateSupplier setOpen={setOpen} onSubmit={fetchSupplier}/>
        {columnsSupplier && supplier?.length >= 0 && (
            <DataTable
                className="rounded-md border w-[1000px] text-xs"
                columns={columnsSupplier}
                data={supplier} 
            />
        )}
    </div>
    {showDialogSupplier()}
</div> 
  );
};

