import React, { useState, useEffect } from 'react';
import { SupplierAction } from './ColumnsSupplier';
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable';
import CreateSupplier from './CreateSupplier';

export default function Supplier() {
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
                if (response && response?.status === 200) {
                    
                        const results = response?.data;
                        const filteredSupplier = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { id: rest.id, 
                                     name:rest.name || "non défini",
                                     address:rest.address || "non défini",
                                     phone:rest.phone || "non défini",
                                     email:rest.email || "non défini",
                                     entityId:rest.entity.name || "non défini",
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


    const updateData = (id, updatedSupplier) => {
        setSupplier((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedSupplier } : item
            ));
            fetchSupplier();
    };

    const delSupplier = (id) => {
        setSupplier((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogSupplier, columnsSupplier } = SupplierAction({ delSupplier, updateData });

  return (
    <div className='m-1 space-y-3 my-10 w-full'>
    <h1 className='text-sm mb-2 font-semibold'>Gestion des Prestataires</h1>
    <div className='space-y-2 w-full'>
        <CreateSupplier setOpen={setOpen} onSubmit={fetchSupplier}/>
        {columnsSupplier && supplier?.length >= 0 && (
            <DataTable
                className="rounded-md border w-[1000px] max-w-full text-xs sm:text-sm"
                columns={columnsSupplier}
                data={supplier} 
            />
        )}
    </div>
    {showDialogSupplier()}
</div> 
  );
};

