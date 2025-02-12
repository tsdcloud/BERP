import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { CountryAction } from './ColumnsCountry';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateCountry from './CreateCountry';

export default function Country() {
    const { showDialogCountry, columnsCountry } = CountryAction();
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchCountry = async () => {
        // const urlToShowAllCountries = URLS.API_COUNTRY;
        const urlToShowAllCountries = `${URLS.ENTITY_API}/countries`;
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllCountries);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredCountries = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        setCountries(filteredCountries);
                }
                else{
                    throw new Error('Erreur lors de la récupération des countries');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchCountry();
        
    }, []);


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des Pays</h1>
                <div className='space-y-2'>
                    <CreateCountry setOpen={setOpen} onSubmit={fetchCountry} />
                    { columnsCountry && countries.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsCountry}
                            data={countries} 
                        />
                    )}
                </div>
                {showDialogCountry()}
            </div>
  );
}
