import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { DistrictAction } from './ColumnsDistrict';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateDistrict from './CreateDistrict';

export default function District() {
    const { showDialogDistrict, columnsDistrict } = DistrictAction();
    const [districts, setDistricts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchDistrict = async () => {
        // const urlToShowAllDistrict = URLS.API_DISTRICT;
        const urlToShowAllDistrict =  `${URLS.ENTITY_API}/districts`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllDistrict);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        // console.log("res", results);

                        const filteredDistrict = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { id: rest.id, 
                                 name:rest.name,
                                 countryId:rest.country.name,
                                 createdAt:rest.createdAt,
                                 isActive:rest.isActive,
                                };
                    });
                        // console.log("district",filteredDistrict);
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


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des Districts</h1>
                <div className='space-y-2'>
                    <CreateDistrict setOpen={setOpen} onSubmit={fetchDistrict} />
                    { columnsDistrict && districts?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsDistrict}
                            data={districts} 
                        />
                    )}
                </div>
                {showDialogDistrict()}
            </div>
  );
}
