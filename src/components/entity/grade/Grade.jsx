import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { GradeAction } from './ColumnsGrade';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateGrade from './CreateGrade';

export default function Grade() {
    const { showDialogGrade, columnsGrade } = GradeAction();
    const [Grades, setGrades] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchGrade = async () => {
        // const urlToShowAllGrades = "http://127.0.0.1:8000/api_gateway/api/user/";
        const urlToShowAllGrades = "";
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllGrades);
            // console.log("respo",response);
            
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredGrade = results?.map(item => {
                        const { user_created_by, user_updated_by, is_staff, is_superuser, ...rest } = item;
                        return rest;
                        });
                        // console.log("Grades", filteredGrade);
                        setGrades(filteredGrade);
                }
                else{
                    throw new Error('Erreur lors de la récupération des Grades');
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
                    {columnsGrade && Grades.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsGrade}
                            data={Grades} 
                        />
                        // <div>Je ne pas là.</div>
                    )}
                </div>
                {showDialogGrade()}
            </div>
  );
}
