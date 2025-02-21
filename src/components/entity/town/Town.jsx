import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { TownAction } from './ColumnsTown';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateTown from './CreateTown';

export default function Town() {
    const [towns, setTowns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchTown = async () => {
        const urlToShowAllTown = `${URLS.ENTITY_API}/towns`;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllTown);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredTown = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { id: rest.id, 
                                 name:rest.name,
                                 districtId:rest.district.name,
                                 createdAt:rest.createdAt,
                                 isActive:rest.isActive,
                                };
                    });
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


    const updateData = (id, updatedCountry) => {
        setTowns((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedCountry } : item
            )
        );
        fetchTown();
    };

    const delTown = (id) => {
        setTowns((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogTown, columnsTown } = TownAction({ delTown, updateData });

  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des villes</h1>
                <div className='space-y-2 w-full'>
                    <CreateTown setOpen={setOpen} onSubmit={fetchTown} />
                    { columnsTown && towns?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsTown}
                            data={towns} 
                        />
                    )}
                </div>
                {showDialogTown()}
            </div>
  );
}
