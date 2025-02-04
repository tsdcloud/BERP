import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { GradeAction } from './ColumnsGrade';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateGrade from './CreateGrade';

export default function Grade() {
    const { showDialogGrade, columnsGrade } = GradeAction();
    const [grades, setGrades] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchGrade = async () => {
        const urlToShowAllGrades = URLS.API_GRADE;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllGrades);
            // console.log("respo",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredGrades = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        // console.log("Grades", filteredGrades);
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


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des Grades</h1>
                <div className='space-y-2'>
                    <CreateGrade setOpen={setOpen} onSubmit={fetchGrade} />
                    {columnsGrade && grades.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsGrade}
                            data={grades} 
                        />
                    )}
                </div>
                {showDialogGrade()}
            </div>
  );
}
