import React, { useEffect, useState, useContext } from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Product/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/Product/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { Pagination } from 'antd';
import { URLS } from '../../../configUrl';
import { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { getEmployee } from '../../utils/entity.utils';

const Product = () => {
    const { handleFetch } = useFetch();
    const authContext = useContext(AUTHCONTEXT);
    
    const [products, setProducts] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [userPermissions, setUserPermissions] = useState([]);
    const [editData, setEditData] = useState(null);

    // Charger les permissions utilisateur
    const loadUserPermissions = async () => {
        try {
            const employee = await getEmployee();
            if (!employee) return;
            
            const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
            const permissionNames = employeePermissions?.employeePermissions?.map(p => p.permission.permissionName) || [];
            
            setUserPermissions(permissionNames);
            
        } catch (error) {
            console.error("Erreur chargement permissions:", error);
        }
    };

    const fetchProducts = async (url) => {
        setIsLoading(true);
        try {
            const urlObj = new URL(url, window.location.origin);
            
            // Ajouter la recherche si présente
            if (searchValue) {
                urlObj.searchParams.set('search', searchValue);
            }
            
            const finalUrl = urlObj.toString();
            console.log("Fetch URL Products:", finalUrl);
            
            const response = await handleFetch(finalUrl);
            
            console.log("Réponse API products:", response);
            
            let productsData = [];
            
            if (response?.data) {
                // Structure paginée
                if (response.data.data && Array.isArray(response.data.data)) {
                    productsData = response.data.data;
                    setTotal(response.data.total || response.data.data.length);
                    setTotalPages(response.data.totalPages || 1);
                    setPage(response.data.page || 1);
                } 
                // Structure directe (sans pagination)
                else if (Array.isArray(response.data)) {
                    productsData = response.data;
                    setTotal(response.data.length);
                    setTotalPages(1);
                    setPage(1);
                }
                // Autre structure
                else if (response.data && typeof response.data === 'object') {
                    const values = Object.values(response.data);
                    if (values.length > 0 && Array.isArray(values[0])) {
                        productsData = values[0];
                    }
                    setTotal(productsData.length);
                    setTotalPages(1);
                    setPage(1);
                }
            }
            
            if (!Array.isArray(productsData)) {
                console.error("Les données ne sont pas un tableau:", productsData);
                productsData = [];
            }
            
            console.log("Données à afficher:", productsData);
            setProducts(productsData);
            
        } catch (error) {
            console.error("Erreur fetch products:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = () => {
        fetchProducts(`${URLS.INCIDENT_API}/products`);
        document.getElementById("close-dialog")?.click();
        setIsOpenned(false);
        setEditData(null); // Réinitialiser le mode édition
    }

    const handleCancelEdit = () => {
        setEditData(null);
        setIsOpenned(false);
    }

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        
        // Debounce pour éviter trop d'appels API
        setTimeout(() => {
            fetchProducts(`${URLS.INCIDENT_API}/products`);
        }, 300);
    }

    const handleEdit = (record) => {
        setEditData(record);
        setIsOpenned(true);
    }

    useEffect(() => {
        loadUserPermissions();
        fetchProducts(`${URLS.INCIDENT_API}/products`);
    }, []);

    return (
        <>
            <Header />
            <div className='px-6 space-y-4'>
                <div className='flex items-center'>
                    <div className='overflow-x-auto'>
                        <Tabs />
                    </div>
                </div>

                {/* Table */}
                <div className='w-full bg-white rounded-lg p-2 h-[70vh] flex flex-col'>
                    <div className='px-4 w-full justify-between items-center flex flex-col gap-2 sm:flex-row'>
                        <input 
                            type="text"
                            className='p-2 text-sm border rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                            placeholder='Recherche...' 
                            value={searchValue}
                            onChange={handleSearch}
                        />
                        <div className='flex gap-2 items-center w-full md:w-auto'>
                            <Dialogue 
                                buttonText={editData ? "Modifier le produit" : "Créer un nouveau produit"}
                                header={
                                    <h2 className='text-xl font-semibold'>
                                        {editData ? "Modifier le produit" : "Créer un nouveau produit"}
                                    </h2>
                                }
                                content={
                                    <InitiateForm 
                                        onSuccess={handleSubmit}
                                        onCancelEdit={handleCancelEdit}
                                        editData={editData}
                                    />
                                }
                                isOpenned={isOpenned}
                                onOpen={() => setIsOpenned(true)}
                                onClose={() => {
                                    setIsOpenned(false);
                                    setEditData(null);
                                }}
                            />
                        </div>
                    </div>
                    <Datalist 
                        dataList={products}
                        fetchData={() => fetchProducts(`${URLS.INCIDENT_API}/products`)}
                        searchValue={searchValue}
                        loading={isLoading}
                        userPermissions={userPermissions}
                        onEditSuccess={() => fetchProducts(`${URLS.INCIDENT_API}/products`)}
                        onEdit={handleEdit}
                        pagination={
                        <div className='flex flex-col md:flex-row items-center w-full justify-end px-6'>
                            <p className='text-md text-black font-bold'>{total} ligne(s)</p>
                            <Pagination 
                                total={total}
                                pageSize={100}
                                current={page}
                                onChange={(page) => {
                                    fetchProducts(`${URLS.INCIDENT_API}/products?page=${page}`);
                                }}
                            />
                        </div>}
                    />
                </div>
                <Toaster 
                    position="bottom-right"
                    reverseOrder={false}
                />
            </div>
        </>
    )
}

export default Product