import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { ArticleFamilyAction } from './ColumnsArticleFamily';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateArticleFamily from './CreateArticleFamily';

export default function ArticleFamily() {
    const [articleFamillies, setArticleFamillies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchArticleFamily = async () => {
        const urlToShowAllArticleFamillies = `${URLS.ENTITY_API}/article-families`;
        console.log(urlToShowAllArticleFamillies);
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllArticleFamillies);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        console.log(results);
                        const filteredArticleFamillies = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        setArticleFamillies(filteredArticleFamillies);
                }
                else{
                    throw new Error('Erreur lors de la récupération des ArticleFamillies');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchArticleFamily();
        
    }, []);


    const updateData = (id, updatedArticleFamily) => {
        setArticleFamillies((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedArticleFamily } : item
            )
        );
    };

    const delArticleFamily = (id) => {
        setArticleFamillies((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogArticleFamily, columnsArticleFamily } = ArticleFamilyAction({ updateData, delArticleFamily });

  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des Familles d'aticle</h1>
                <div className='space-y-2 w-full'>
                    <CreateArticleFamily setOpen={setOpen} onSubmit={fetchArticleFamily} />
                    { columnsArticleFamily && articleFamillies.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsArticleFamily}
                            data={articleFamillies} 
                        />
                    )}
                </div>
                {showDialogArticleFamily()}
            </div>
  );
}
