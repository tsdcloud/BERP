import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { CategoryAction } from './ColumnsCategory';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateCategory from './CreateCategory';

export default function Category() {
    const { showDialogCategory, columnsCategory } = CategoryAction();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchCategory = async () => {
        // const urlToShowAllCategories = URLS.API_CATEGORY;
        const urlToShowAllCategories = `${URLS.ENTITY_API}/categories`;
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllCategories);
            // console.log("respo",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredCategories = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        // console.log("Catégories", filteredCategories);
                        setCategories(filteredCategories);
                }
                else{
                    throw new Error('Erreur lors de la récupération des catégories');
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
                    {columnsCategory && categories.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsCategory}
                            data={categories} 
                        />
                    )}
                </div>
                {showDialogCategory()}
            </div>
  );
}
