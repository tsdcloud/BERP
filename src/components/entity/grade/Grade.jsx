import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { GradeAction } from './ColumnsGrade';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateGrade from './CreateGrade';

export default function Grade() {
    const [grades, setGrades] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchGrade = async () => {
        const urlToShowAllGrades =  `${URLS.ENTITY_API}/grades`;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllGrades);
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredGrades = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        setGrades(filteredGrades);
                }
                else{
                    throw new Error('Erreur lors de la récupération des grades');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchGrade();
        
    }, []);


    const updateData = (id, updatedGrades) => {
        setGrades((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedGrades } : item
            )
        );
    };

    const delGrade = (id) => {
        setGrades((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogGrade, columnsGrade } = GradeAction({ delGrade, updateData });


  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des Grades</h1>
                <div className='space-y-2 w-full'>
                    <CreateGrade setOpen={setOpen} onSubmit={fetchGrade} />
                    {columnsGrade && grades.length >= 0 && (
                        <DataTable
                           className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsGrade}
                            data={grades} 
                        />
                    )}
                </div>
                {showDialogGrade()}
            </div>
  );
}
