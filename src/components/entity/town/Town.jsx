import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { TownAction } from './ColumnsTown';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateTown from './CreateTown';

export default function Town() {
    const { showDialogTown, columnsTown } = TownAction();
    const [towns, setTowns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchTown = async () => {
        const urlToShowAllTown = URLS.API_TOWN;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllTown);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        console.log("resTown", results);

                        const filteredTown = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { id: rest.id, 
                                 name:rest.name,
                                 districtId:rest.district.name,
                                 createdAt:rest.createdAt,
                                 isActive:rest.isActive,
                                };
                    });
                        console.log("Town",filteredTown);
                        setTowns(filteredTown);
                }
                else{
                    throw new Error('Erreur lors de la récupération des villes');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchTown();
        
    }, []);


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des villes</h1>
                <div className='space-y-2'>
                    <CreateTown setOpen={setOpen} onSubmit={fetchTown} />
                    { columnsTown && towns?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsTown}
                            data={towns} 
                        />
                    )}
                </div>
                {showDialogTown()}
            </div>
  );
}
