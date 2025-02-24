import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { DistrictAction } from './ColumnsDistrict';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateDistrict from './CreateDistrict';

export default function District() {
    const [districts, setDistricts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchDistrict = async () => {
        const urlToShowAllDistrict =  `${URLS.ENTITY_API}/districts`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllDistrict);
            
                if (response && response?.status === 200) {
                        const results = response?.data; const filteredDistrict = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { id: rest.id, 
                                 name:rest.name,
                                 countryId:rest.country.name,
                                 createdAt:rest.createdAt,
                                 isActive:rest.isActive,
                                };
                    });
                        setDistricts(filteredDistrict);
                }
                else{
                    throw new Error('Erreur lors de la récupération des Districts');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchDistrict();
        
    }, []);

    const updateData = (id, updatedDistrict) => {
        setDistricts((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedDistrict } : item
            ));
            fetchDistrict();
    };

    const delDistrict = (id) => {
        setDistricts((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogDistrict, columnsDistrict } = DistrictAction({ delDistrict, updateData });
  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des Districts</h1>
                <div className='space-y-2 w-full'>
                    <CreateDistrict setOpen={setOpen} onSubmit={fetchDistrict} />
                    { columnsDistrict && districts?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsDistrict}
                            data={districts} 
                        />
                    )}
                </div>
                {showDialogDistrict()}
            </div>
  );
}
