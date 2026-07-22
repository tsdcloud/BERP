import React, { useEffect, useState, useContext } from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/WeighingPrice/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/WeighingPrice/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { Pagination } from 'antd';
import { URLS } from '../../../configUrl';
import { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { getEmployee } from '../../utils/entity.utils';

const WeighingPrice = () => {
    const { handleFetch } = useFetch();
    const authContext = useContext(AUTHCONTEXT);
    
    const [weighingPrices, setWeighingPrices] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [userPermissions, setUserPermissions] = useState([]);
    const [editData, setEditData] = useState(null);

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

    const fetchWeighingPrices = async (url) => {
        setIsLoading(true);
        try {
            const urlObj = new URL(url, window.location.origin);
            if (searchValue) {
                urlObj.searchParams.set('search', searchValue);
            }
            const finalUrl = urlObj.toString();
            const response = await handleFetch(finalUrl);
            
            let weighingPricesData = [];
            if (response?.data) {
                if (response.data.data && Array.isArray(response.data.data)) {
                    weighingPricesData = response.data.data;
                    setTotal(response.data.total || response.data.data.length);
                    setTotalPages(response.data.totalPages || 1);
                    setPage(response.data.page || 1);
                } else if (Array.isArray(response.data)) {
                    weighingPricesData = response.data;
                    setTotal(response.data.length);
                    setTotalPages(1);
                    setPage(1);
                } else if (response.data && typeof response.data === 'object') {
                    const values = Object.values(response.data);
                    if (values.length > 0 && Array.isArray(values[0])) {
                        weighingPricesData = values[0];
                    }
                    setTotal(weighingPricesData.length);
                    setTotalPages(1);
                    setPage(1);
                }
            }
            if (!Array.isArray(weighingPricesData)) {
                weighingPricesData = [];
            }
            setWeighingPrices(weighingPricesData);
        } catch (error) {
            console.error("Erreur fetch weighingPrices:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        fetchWeighingPrices(`${URLS.INCIDENT_API}/weighing-prices`);
        document.getElementById("close-dialog")?.click();
        setIsOpenned(false);
        setEditData(null);
    };

    const handleCancelEdit = () => {
        setEditData(null);
        setIsOpenned(false);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        setTimeout(() => {
            fetchWeighingPrices(`${URLS.INCIDENT_API}/weighing-prices`);
        }, 300);
    };

    const handleEdit = (record) => {
        setEditData(record);
        setIsOpenned(true);
    };

    useEffect(() => {
        loadUserPermissions();
        fetchWeighingPrices(`${URLS.INCIDENT_API}/weighing-prices`);
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
                                buttonText={editData ? "Modifier le prix de pesée" : "Créer un nouveau prix de pesée"}
                                header={
                                    <h2 className='text-xl font-semibold'>
                                        {editData ? "Modifier le prix de pesée" : "Créer un nouveau prix de pesée"}
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
                        dataList={weighingPrices}
                        fetchData={() => fetchWeighingPrices(`${URLS.INCIDENT_API}/weighing-prices`)}
                        searchValue={searchValue}
                        loading={isLoading}
                        userPermissions={userPermissions}
                        onEditSuccess={() => fetchWeighingPrices(`${URLS.INCIDENT_API}/weighing-prices`)}
                        onEdit={handleEdit}
                        pagination={
                            <div className='flex flex-col md:flex-row items-center w-full justify-end px-6'>
                                <p className='text-md text-black font-bold'>{total} ligne(s)</p>
                                <Pagination 
                                    total={total}
                                    pageSize={100}
                                    current={page}
                                    onChange={(page) => {
                                        fetchWeighingPrices(`${URLS.INCIDENT_API}/weighing-prices?page=${page}`);
                                    }}
                                />
                            </div>
                        }
                    />
                </div>
                <Toaster position="bottom-right" reverseOrder={false} />
            </div>
        </>
    );
};

export default WeighingPrice;