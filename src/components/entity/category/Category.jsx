import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { CategoryAction } from './ColumnsCategory';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateCategory from './CreateCategory';

export default function Category() {
    const { showDialogCategory, columnsCategory } = CategoryAction();
    const [Categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchCategory = async () => {
        // const urlToShowAllCategories = "http://127.0.0.1:8000/api_gateway/api/user/";
        const urlToShowAllCategories = "";
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllCategories);
            // console.log("respo",response);
            
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredCategory = results?.map(item => {
                        const { user_created_by, user_updated_by, is_staff, is_superuser, ...rest } = item;
                        return rest;
                        });
                        // console.log("Categories", filteredCategory);
                        setCategories(filteredCategory);
                }
                else {
                    throw new Error('Erreur lors de la récupération des Categories');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchCategory();
        
    }, []);


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des Categories</h1>
                <div className='space-y-2'>
                    <CreateCategory setOpen={setOpen} onSubmit={fetchCategory} />
                    {columnsCategory && Categories.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsCategory}
                            data={Categories} 
                        />
                        // <div>Je ne pas là.</div>
                    )}
                </div>
                {showDialogCategory()}
            </div>
  );
}
