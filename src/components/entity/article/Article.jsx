import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { ArticleAction } from './ColumnsArticle';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateArticle from './CreateArticle';

export default function Article() {
    const [Articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    // const fetchArticle = async () => {
    //     const urlToShowAllArticle = `${URLS.ENTITY_API}/articles`;
    //     try {
    //         setIsLoading(true);
    //         const response = await handleFetch(urlToShowAllArticle);
            
    //             if (response && response?.status === 200) {
    //                     const results = response?.data;
    //                     const filteredArticle = results?.map(item => {
    //                     const { createdBy, updateAt, ...rest } = item;
    //                     return { id: rest.id, 
    //                                 name:rest.name,
    //                                 code:rest.code,
    //                                 type:rest.type,
    //                                 quantity:rest.quantity,
    //                                 price:rest.price,
    //                                 hasTVA:rest.hasTVA,
    //                                 idArticleFamily:rest.idArticleFamily.name,
    //                                 idEntity:rest.idEntity.name,
    //                                 createdAt:rest.createdAt,
    //                                 isActive:rest.isActive,
    //                             };
    //                 });
    //                     setArticles(filteredArticle);
    //             }
    //             else{
    //                 throw new Error('Erreur lors de la récupération des villes');
    //             }
    //     } catch (error) {
    //         setError(error.message);
    //     }
    //     finally {
    //         setIsLoading(false);
    //     }
    // };
    const fetchArticle = async () => {
        const urlToShowAllArticle = `${URLS.ENTITY_API}/articles`;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllArticle);
            
            if (response && response?.status === 200) {
                const results = response?.data;
                const filteredArticle = results?.map(item => {
                    return { 
                        id: item.id, 
                        name: item.name,
                        code: item.code,
                        type: item.type,
                        quantity: item.quantity,
                        price: item.price,
                        hasTVA: item.hasTVA,
                        // Correction ici : vérifier si idArticleFamily existe et a une propriété name
                        idArticleFamily: item.articleFamilyId?.name || item.idArticleFamily,
                        // Correction ici : vérifier si idEntity existe et a une propriété name
                        idEntity: item.entity?.name || item.idEntity,
                        createdAt: item.createdAt,
                        isActive: item.isActive,
                    };
                });
                setArticles(filteredArticle);
            } else {
                throw new Error('Erreur lors de la récupération des articles');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
        
    }, []);


    const updateData = (id, updatedCountry) => {
        setArticles((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedCountry } : item
            )
        );
        fetchArticle();
    };

    const delArticle = (id) => {
        setArticles((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogArticle, columnsArticle } = ArticleAction({ delArticle, updateData });

  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des articles</h1>
                <div className='space-y-2 w-full'>
                    <CreateArticle setOpen={setOpen} onSubmit={fetchArticle} />
                    { columnsArticle && Articles?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[1300px] max-w-full text-xs sm:text-sm"
                            columns={columnsArticle}
                            data={Articles} 
                        />
                    )}
                </div>
                {showDialogArticle()}
            </div>
  );
}
