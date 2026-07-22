import React, { useEffect, useState, useCallback, useContext } from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/ReportingSupervisory/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/ReportingSupervisory/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { Pagination } from 'antd';
import { URLS } from '../../../configUrl';
import { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { getEmployee } from '../../utils/entity.utils';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ActionHeaders from '../../components/common/ActionHeaders';
import { Button } from '../../components/ui/button';

// Rôles pour lesquels on restreint la vue aux seuls rapports créés par l'utilisateur
const RESTRICTED_ROLES = ['OP', 'head guard', 'coordinator', 'CORDO'];

const ReportingSupervisory = () => {
    const { handleFetch } = useFetch();
    const authContext = useContext(AUTHCONTEXT);

    const [reportingSupervisorys, setReportingSupervisorys] = useState([]);
    const [isOpenned, setIsOpenned]             = useState(false);
    const [isLoading, setIsLoading]             = useState(false);
    const [totalPages, setTotalPages]           = useState(0);
    const [total, setTotal]                     = useState(0);
    const [page, setPage]                       = useState(1);
    const [userPermissions, setUserPermissions] = useState([]);
    const [editData, setEditData]               = useState(null);
    const [currentFilter, setCurrentFilter]     = useState(null);
    const [references, setReferences]           = useState({ 
        sites: [], 
        shifts: [], 
        employees: [],
        suppliers: [],
        ships: [],
        products: []
    });

    // ✅ Rôles (tableau) et identité de l'utilisateur connecté
    const [currentUserRoles, setCurrentUserRoles] = useState(null);
    const [currentUserId, setCurrentUserId]       = useState(null);

    // ✅ Restreint SI ET SEULEMENT SI tous les rôles sont dans RESTRICTED_ROLES
    const isRestricted =
        currentUserRoles !== null &&
        currentUserRoles.length > 0 &&
        currentUserRoles.every(r => RESTRICTED_ROLES.includes(r));

    // ── États filtres ──────────────────────────────────────────────────────────
    const [selectValue, setSelectValue] = useState('');
    const [inputValue, setInputValue]   = useState('');
    const [startDate, setStartDate]     = useState('');
    const [endDate, setEndDate]         = useState('');

    // ── Options de filtre ───────────────────────────────────────────────────────
    const allFilterOptions = [
        { value: "shiftId",              name: "Quart" },
        { value: "incomingSupervisoryId", name: "Superviseur entrant" },
        { value: "createdBy",            name: "Créé par" },
        { value: "updatedBy",            name: "Modifié par" },
        { value: "isActive",             name: "Statut" },
        { value: "createdAt",            name: "Date de création" },
        { value: "updatedAt",            name: "Date de modification" },
    ];

    const filterOptions = isRestricted
        ? allFilterOptions.filter(f => f.value !== 'createdBy')
        : allFilterOptions;

    const DATE_FILTERS = ['createdAt', 'updatedAt'];

    // ── Références ─────────────────────────────────────────────────────────────
    const loadReferences = async () => {
        try {
            const [sitesRes, shiftsRes, employeesRes, suppliersRes, shipsRes, productsRes] = await Promise.all([
                handleFetch(`${URLS.ENTITY_API}/sites`),
                handleFetch(`${URLS.ENTITY_API}/shifts`),
                handleFetch(`${URLS.ENTITY_API}/employees`),
                handleFetch(`${URLS.ENTITY_API}/suppliers`),
                handleFetch(`${URLS.INCIDENT_API}/ships`),
                handleFetch(`${URLS.INCIDENT_API}/products`),
            ]);
            const extractArray = (res) => {
                const data = res?.data;
                if (!data) return [];
                return Array.isArray(data.data) ? data.data
                     : Array.isArray(data)      ? data
                     : [];
            };
            setReferences({
                sites:     extractArray(sitesRes),
                shifts:    extractArray(shiftsRes),
                employees: extractArray(employeesRes),
                suppliers: extractArray(suppliersRes),
                ships:     extractArray(shipsRes),
                products:  extractArray(productsRes),
            });
        } catch (error) {
            console.error("Erreur chargement références:", error);
        }
    };

    // ✅ Chargement du rôle et de l'ID de l'employé connecté
    const loadUserPermissions = async () => {
        try {
            const employee = await getEmployee();
            if (!employee) return;

            const roles = Array.isArray(employee?.employeeRoles)
                ? employee.employeeRoles
                    .map(er => er?.role?.roleName)
                    .filter(Boolean)
                : [];
            console.log("Rôles de l'employé connecté:", roles);
            setCurrentUserRoles(roles);
            setCurrentUserId(employee?.id || null);

            const res = await handleFetch(
                `${URLS.ENTITY_API}/employees/${employee?.id}/permissions`
            );
            const names = res?.employeePermissions?.map(p => p.permission.permissionName) || [];
            setUserPermissions(names);
        } catch (error) {
            console.error("Erreur chargement permissions:", error);
        }
    };

    // ── Fetch principal ────────────────────────────────────────────────────────
    const fetchReportingSupervisorys = useCallback(async (params = {}) => {
        setIsLoading(true);
        try {
            let url = `${URLS.INCIDENT_API}/reporting-supervisories`;
            const queryParams = new URLSearchParams();

            if (params.page) queryParams.append('page', params.page);
            if (params.filter && params.value) {
                queryParams.append('filter', params.filter);
                queryParams.append('value',  params.value);
            }

            const qs = queryParams.toString();
            if (qs) url += `?${qs}`;

            const response = await handleFetch(url);

            if (response?.data) {
                const payload = response.data;
                let data = [];

                if (payload.data && Array.isArray(payload.data)) {
                    data = payload.data;
                } else if (Array.isArray(payload)) {
                    data = payload;
                }

                // ✅ Filtrage défensif côté frontend
                if (isRestricted && currentUserId) {
                    data = data.filter(r => r.createdBy === currentUserId);
                }

                setReportingSupervisorys(data);
                setTotal(payload.total      ?? data.length);
                setTotalPages(payload.totalPages ?? 1);
                setPage(payload.page         ?? 1);
            }
        } catch (error) {
            console.error("Erreur fetch reportingSupervisorys:", error);
        } finally {
            setIsLoading(false);
        }
    }, [handleFetch, isRestricted, currentUserId]);

    // ── Handlers filtres ───────────────────────────────────────────────────────
    const handleOnSelectChange = (evt) => {
        const value = evt.target.value;
        setSelectValue(value);
        setInputValue('');
        setStartDate('');
        setEndDate('');
        setCurrentFilter(null);
        if (!value) fetchReportingSupervisorys();
    };

    const handleInputChange = useCallback((evt) => {
        const value = evt.target.value;
        setInputValue(value);
        if (selectValue && value) {
            setCurrentFilter({ filter: selectValue, value });
            fetchReportingSupervisorys({ filter: selectValue, value });
        } else if (!value) {
            setCurrentFilter(null);
            fetchReportingSupervisorys();
        }
    }, [selectValue, fetchReportingSupervisorys]);

    const handleStartDateChange = (e) => {
        const value = e.target.value;
        setStartDate(value);
        if (value && endDate) {
            const dateValue = `${value},${endDate}`;
            setInputValue(dateValue);
            setCurrentFilter({ filter: selectValue, value: dateValue });
            fetchReportingSupervisorys({ filter: selectValue, value: dateValue });
        } else if (!value && endDate) {
            setCurrentFilter(null);
            fetchReportingSupervisorys();
        }
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;
        setEndDate(value);
        if (startDate && value) {
            const dateValue = `${startDate},${value}`;
            setInputValue(dateValue);
            setCurrentFilter({ filter: selectValue, value: dateValue });
            fetchReportingSupervisorys({ filter: selectValue, value: dateValue });
        } else if (startDate && !value) {
            setCurrentFilter(null);
            fetchReportingSupervisorys();
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage <= totalPages) {
            const params = { page: newPage };
            if (currentFilter) {
                params.filter = currentFilter.filter;
                params.value  = currentFilter.value;
            }
            fetchReportingSupervisorys(params);
        }
    };

    const resetFilters = () => {
        setSelectValue('');
        setInputValue('');
        setStartDate('');
        setEndDate('');
        setCurrentFilter(null);
        fetchReportingSupervisorys();
    };

    // ── Input dynamique ────────────────────────────────────────────────────────
    const handleDisplayInput = (criteria) => {
        const disabled = !criteria;
        const baseClass = `p-1 text-sm w-full focus:outline-blue-300 ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}`;
        const wrapClass = `border p-1 rounded-lg w-full md:max-w-[300px] relative flex items-center my-2 ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}`;

        if (criteria === 'shiftId') {
            return (
                <div className={wrapClass}>
                    <MagnifyingGlassIcon className='h-4 text-gray-400 px-2' />
                    <select className={baseClass} value={inputValue} onChange={handleInputChange}>
                        <option value="">Sélectionner un quart</option>
                        {references.shifts.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            );
        }

        if (criteria === 'incomingSupervisoryId') {
            return (
                <div className={wrapClass}>
                    <MagnifyingGlassIcon className='h-4 text-gray-400 px-2' />
                    <select className={baseClass} value={inputValue} onChange={handleInputChange}>
                        <option value="">Sélectionner un superviseur</option>
                        {references.employees.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                    </select>
                </div>
            );
        }

        if (criteria === 'isActive') {
            return (
                <div className={wrapClass}>
                    <MagnifyingGlassIcon className='h-4 text-gray-400 px-2' />
                    <select className={baseClass} value={inputValue} onChange={handleInputChange}>
                        <option value="">Sélectionner un statut</option>
                        <option value="true">Actif</option>
                        <option value="false">Inactif</option>
                    </select>
                </div>
            );
        }

        if (DATE_FILTERS.includes(criteria)) {
            return (
                <div className={wrapClass}>
                    <div className='flex items-center gap-2 w-full px-1'>
                        <input
                            type='date'
                            value={startDate}
                            onChange={handleStartDateChange}
                            className={baseClass}
                        />
                        <span className='text-gray-400 shrink-0'>à</span>
                        <input
                            type='date'
                            value={endDate}
                            onChange={handleEndDateChange}
                            className={baseClass}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className={wrapClass}>
                <MagnifyingGlassIcon className='h-4 text-gray-400 px-2' />
                <input
                    placeholder={
                        criteria
                            ? `Rechercher par ${filterOptions.find(f => f.value === criteria)?.name?.toLowerCase() || criteria}`
                            : 'Choisir le filtre'
                    }
                    className={baseClass}
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={disabled}
                />
            </div>
        );
    };

    // ── Submit / Edit ──────────────────────────────────────────────────────────
    const handleSubmit = () => {
        fetchReportingSupervisorys(currentFilter || {});
        document.getElementById("close-dialog")?.click();
        setIsOpenned(false);
        setEditData(null);
    };

    const handleCancelEdit = () => {
        setEditData(null);
        setIsOpenned(false);
    };

    const handleEdit = (record) => {
        setEditData(record);
        setIsOpenned(true);
    };

    // ── Effets ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        loadReferences();
    }, []);

    useEffect(() => {
        loadUserPermissions();
    }, []);

    useEffect(() => {
        if (currentUserRoles !== null) {
            fetchReportingSupervisorys();
        }
    }, [currentUserRoles, currentUserId]);

    // ── Rendu ──────────────────────────────────────────────────────────────────
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
                    <div className='flex flex-col md:flex-row items-center justify-between mb-4 px-4'>

                        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                            <ActionHeaders
                                filterOptions={filterOptions}
                                selectChange={handleOnSelectChange}
                                selectValue={selectValue}
                                input={handleDisplayInput(selectValue)}
                            />

                            {(selectValue || inputValue || startDate || endDate) && (
                                <Button
                                    variant="outline"
                                    onClick={resetFilters}
                                    className="flex items-center gap-2 h-10"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                    Réinitialiser
                                </Button>
                            )}
                        </div>

                        <Dialogue
                            buttonText={editData ? "Modifier le rapport" : "Nouveau rapport Superviseur"}
                            header={<h2 className='text-xl font-semibold'>{editData ? "Modifier le rapport" : "Nouveau rapport Superviseur"}</h2>}
                            content={
                                <InitiateForm
                                    onSuccess={handleSubmit}
                                    onCancelEdit={handleCancelEdit}
                                    editData={editData}
                                    references={references}
                                />
                            }
                            isOpenned={isOpenned}
                            onOpen={() => setIsOpenned(true)}
                            onClose={() => { setIsOpenned(false); setEditData(null); }}
                        />
                    </div>

                    <Datalist
                        dataList={reportingSupervisorys}
                        fetchData={() => fetchReportingSupervisorys(currentFilter || {})}
                        searchValue={inputValue}
                        loading={isLoading}
                        userPermissions={userPermissions}
                        onEditSuccess={() => fetchReportingSupervisorys(currentFilter || {})}
                        onEdit={handleEdit}
                        references={references}
                        currentUserRoles={currentUserRoles}
                        pagination={
                            <div className='flex flex-col md:flex-row items-center w-full justify-end px-6'>
                                <p className='text-md text-black font-bold'>{total} ligne(s)</p>
                                <Pagination
                                    total={total}
                                    pageSize={100}
                                    current={page}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
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

export default ReportingSupervisory;