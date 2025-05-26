import React, {useContext, useEffect, useState} from 'react';
import { Select, Button, Pagination } from 'antd';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Tabs from '../../components/budgetLine/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Card from '../../components/incidents/Dashboard/Card';
import ActionHeader from '../../components/incidents/Dashboard/ActionHeader';

import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { getEmployee } from '../../utils/entity.utils';
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import Datalist from '../../components/budgetLine/Dashboard/Datalist';


const DashboardBudget = () =>{

    const { token } = useContext(AUTHCONTEXT);

    const {handleFetch, handlePost} = useFetch();

    const [isLoading, setIsLoading] = useState(false)
    const [services, setServices] = useState([])
    const [department, setDepartment] = useState([]) 
    const [selectedDepartment, setSelectedDepartment] = useState(null) 

    const [currentDepName, setCurrentDepName] = useState(null) 
    const [currentServiceName, setCurrentServiceName] = useState(null) 
    const [currentStartMonthName, setCurrentStartMonthName] = useState(null) 
    const [currentEndMonthName, setCurrentEndMonthName] = useState(null) 
    const [currentDate, setCurrentYear] = useState(null) 

    const [dashBoardAnalysis, setDashBoardAnalysis] = useState([])
    const [data, setData] = useState([])

    const [employee, setEmployee] = useState([]) 

    const [moisDebut, setMoisDebut] = useState(null);
    const [moisFin, setMoisFin] = useState(null); 

    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedService, setSelectedService] = useState([]);

    const [allSelected, setAllSelected] = useState(false);

    const currentYear = new Date().getFullYear();
    const numberOfFutureYears = 1;
    
    const [startMonthFooter, setStartMonthFooter] = useState("JANVIER");
    const [endMonthFooter, setEndMonthFooter] = useState("DECEMBRE");
    const [dateFooter, setDateFooter] = useState(null);

    // Générer une liste d'années à partir de l'année actuelle
    const years = Array.from(
        { length: numberOfFutureYears + 1 }, // +1 pour inclure l'année actuelle
        (_, index) => currentYear + index
    ).map((year) => ({
        value: year.toString(),
        label: year.toString(),
    }));

    // Gestion du changement de sélection
    const onChangeYear = (value) => {
      setSelectedYear(value);
      setCurrentYear(value)
    //   console.log("Année sélectionnée :", value);
    };

    const onChangeDepartment = value => {
        // console.log(`selected ${value}`);
        setSelectedDepartment(value)
    };
    const onSearchDepartment = value => {
        // console.log('search:', value);
    };

    const onChangeService = (value, obj) => {
        // console.log(`selected ${value}`);
        setSelectedService([value])
        setCurrentServiceName(obj?.label)
    };
    const onSearchService = value => {
        // console.log('search:', value);
    };
    
    const onChangeMoisDebut = (value) => {
        console.log(`selected ${value}`);
        setMoisDebut(value);
        setCurrentStartMonthName(value)
        setMoisFin(null);
        setCurrentEndMonthName(null)
    };
    const onSearchMoisDebut = value => {
        // console.log('search:', value);
    };

    const onChangeMoisFin = (value) => {
        // console.log(`selected ${value}`);
        setMoisFin(value);
        setCurrentEndMonthName(value)
    };
    const onSearchMoisFin = value => {
        // console.log('search:', value);
    };

    // console.log("moisDebut", moisDebut);
    // console.log("moisFIn", moisFin);
    // console.log("année", selectedYear);
    

    const months = [
        {label:"JANVIER", value: "JANVIER"},
        {label:"FEVRIER", value: "FEVRIER"},
        {label:"MARS", value: "MARS"},
        {label:"AVRIL", value: "AVRIL"},
        {label:"MAI", value: "MAI"},
        {label:"JUIN", value: "JUIN"},
        {label:"JUILLET", value: "JUILLET"},
        {label:"AOUT", value: "AOUT"},
        {label:"SEPTEMBRE", value: "SEPTEMBRE"},
        {label:"OCTOBRE", value: "OCTOBRE"},
        {label:"NOVEMBRE", value: "NOVEMBRE"},
        {label:"DECEMBRE", value: "DECEMBRE"}
      ];
    
    // Filtrer les mois disponibles pour le mois de fin
    const filteredMonths = moisDebut
    ? months.filter((month, index) => {
        const debutIndex = months.findIndex((m) => m.value === moisDebut);
        return index > debutIndex; // Inclure uniquement les mois après le mois de début
      })
    : [];

    const handleFetchEmployee = async () =>{
        try {
            let employee = await getEmployee();
            setEmployee(employee)
        } catch (error) {
            console.log(error);
        }
    }

    const checkAllSelected = () => {
        if(selectedDepartment && selectedYear && moisDebut && selectedService && moisFin) {
            return true
        }

        return false
            
    }

    // Fetch Department
    const handleFetchDepartement = async (link) =>{
        try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
            let formatedData = response?.data.map(item=>{
            return {
                label:item?.name,
                value: item?.id
            }
            });
            setDepartment(formatedData);
        }
        } catch (error) {
        console.error(error);
        } finally{
        setIsLoading(false);
        }
    }

    // Fetch Services
    const handleFetchService = async (link) =>{
        try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
            let formatedData = response?.data.map(item=>{
            return {
                label:item?.name,
                value: item?.id
            }
            });
            setServices(formatedData);
        }
        } catch (error) {
        console.error(error);
        } finally{
        setIsLoading(false);
        }
    }

    // Fetch Analysis 
    const handleFetchAnalysis = async (link, idServices, startMonth, endMonth, year) =>{

        let servicesIds = [""]

        services?.forEach((item)=>{servicesIds.push(item.value)})

        // if(servicesIds.length === 0) {
        //     console.log("servicesIds", servicesIds);
            
        //     return
        // }
        

        setIsLoading(true);
        
        let data = {
            // services : ["7e2abe22-933e-4bd8-a107-f5bdd15e06e8","1949f04a-45e8-49e1-9f11-2856fcfe1c1e"],
            services : idServices ? idServices : servicesIds,
            year: year ? year : currentYear,
            startMonth: startMonth ? startMonth : startMonthFooter,
            endMonth: endMonth ? endMonth : endMonthFooter
        }

        try {

            let response = await handlePost(link, data);

            if(response?.status === 200){
                setData(response);

                if(startMonth) {
                    setStartMonthFooter(startMonth)
                }

                if(endMonth) {
                    setEndMonthFooter(endMonth)
                }

                if(year) {
                    setDateFooter(year)
                }

                handleSetnull()

                // console.log("response", response)
            }
        } catch (error) {
            console.error(error);
        } finally{
            setIsLoading(false);
        }
    }

    const handleUpdateWithFilter = () => {
        handleFetchAnalysis(`${URLS.API_BUDGETLINE}/major-budget-lines/analysis`, selectedService, moisDebut, moisFin, selectedYear)
    }

    const groupDataByService = async () => {
        try {
            if (!services) return
            // Regrouper les données par serviceId
            const groupedByService = {};
    
            data.forEach(item => {
                const serviceId = item.serviceId;
                if (!groupedByService[serviceId]) {
                    groupedByService[serviceId] = [];
                }
                groupedByService[serviceId].push(item);
            });
    
            //Convertir l'objet temporaire en tableau de groupes en ajoutant le nom du service
            const result = Object.keys(groupedByService).map(serviceId => {
                // Trouver le nom du service correspondant
                const serviceName = services?.find(service => service.value === serviceId)?.label || "--";
    
                return {
                    serviceId: serviceId,
                    serviceName: serviceName,
                    data: groupedByService[serviceId]
                };
            });
    
            // console.log("Filtered result", result);

            setDashBoardAnalysis(result)

            // return result;
        } catch (error) {
            console.error("Une erreur est survenue lors du groupage des données par service:", error);
        }
    }    

    const handleSelectedDepartmentName = (id) => {
        let depName = department.filter((dep) => (id == dep.value))
        setCurrentDepName(depName)
    }

    // const handleSelectedServiceName = (id) => {
    //     let servName = services.filter((service) => (id == service.value))

    
    //     setCurrentServiceName(servName)
    // }
        // console.log("servName", currentServiceName);

    const handleSetnull = () => {
        // setSelectedDepartment("")
        setSelectedYear(null)
        setMoisDebut(null)
        setCurrentServiceName(null)
        setSelectedService([])
        setMoisFin(null)
        setCurrentEndMonthName(null)
        setCurrentStartMonthName(null)
        setCurrentYear(null)
    }

    // console.log("employee", employee)


    useEffect(()=>{
        handleFetchEmployee()
    }, []);


    useEffect(()=>{
        handleFetchDepartement(`${URLS.ENTITY_API}/departments/?entityId=${employee?.entity?.id}`)
        // handleFetchService(`${URLS.ENTITY_API}/services`)   
    }, [employee]);

    useEffect(()=>{
        handleFetchService(`${URLS.ENTITY_API}/services/?departmentId=${department[0]?.value}`)  
    }, [department]);

    useEffect(()=>{
        handleFetchService(`${URLS.ENTITY_API}/services/?departmentId=${selectedDepartment}`)
        handleSelectedDepartmentName(selectedDepartment)   
    }, [selectedDepartment]); 

    useEffect(()=>{
        handleFetchAnalysis(`${URLS.API_BUDGETLINE}/major-budget-lines/analysis`)
    }, [services]);

    useEffect(()=>{
        groupDataByService()
    }, [data]);

    // useEffect(()=>{
    //     handleSelectedServiceName(selectedService)   
    // }, [selectedService]);

    
    useEffect(()=>{
         setAllSelected(checkAllSelected())

        //  let selectedTest = checkAllSelected()

        //  console.log("selectedTest", selectedTest)
    }, [selectedDepartment, selectedYear, moisDebut, selectedService, moisFin]);


    // if (!employeeData?.id) {
    //     return <div>Vous N'etes pas employé</div>
    // }


    return(
        <>
            <Header />
            <div className='px-6 space-y-2'>
                {/* Header */}
                <div className='overflow-x-auto'>
                    <Tabs />
                </div>
                {/* Dialog */}
                <div className='py-2'>
                    {/* <ActionHeader 
                        onIncidentClick={()=>handleOpenDialog("INCIDENT")}
                        onMaintenanceClick={()=>handleOpenDialog("MAINTENANCE")}
                        onClickOffBridge={()=>handleOpenDialog("OFF_BRIDGE")}
                    /> */}
                    <div className='flex justify-between p-2 rounded-lg border space-x-2'>
                        <div className='flex space-x-2'>
                            <div className='h-8 bg-gray-200 rounded-md px-2 flex items-center text-gray-700'>
                                Entité - <span className='font-bold'>{ employee?.entity?.name}</span>
                            </div>
                            {/* <div className='h-8 bg-gray-200 rounded-md px-2 flex items-center text-gray-700'> */}
                            <div>
                                {/* Departement - <span className='font-bold'>{selectedDepartment ? currentDepName[0]?.label : department[0]?.label}</span> */}
                                
                                <Select
                                    showSearch
                                    placeholder="Selectionner le departement"
                                    optionFilterProp="label"
                                    onChange={onChangeDepartment}
                                    onSearch={onSearchDepartment}
                                    options={department}
                                    style={{ width: 100 }}
                                    value={selectedDepartment ? currentDepName[0]?.label : department[0]?.label}
                                />
                            </div>
                        </div>

                        <div className='flex flex-none space-x-2'>
                            <div className='flex items-center'>
                                <span className='font-bold'>Filtres :</span>
                            </div>

                            <Select
                                showSearch
                                placeholder="Selectionner le Service"
                                optionFilterProp="label"
                                onChange={onChangeService}
                                onSearch={onSearchService}
                                options={services}
                                // disabled={!selectedDepartment}
                                style={{ width: 200 }}
                                value={currentServiceName}

                            />
                            <div className='space-x-2'>
                                {/* <span className=''>Mois début:</span> */}
                                
                                <Select
                                    showSearch
                                    placeholder="Mois début"
                                    optionFilterProp="label"
                                    onChange={onChangeMoisDebut}
                                    onSearch={onSearchMoisDebut}
                                    options={months}
                                    disabled={selectedService.length == 0 ? true : false}
                                    style={{ width: 120 }}
                                    value={currentStartMonthName}
                                />

                                {/* <span className=''>Mois Fin:</span> */}
                                
                                <Select
                                    showSearch
                                    placeholder={
                                        moisDebut ? "Mois Fin" : "Veuillez sélectionner le mois de début"
                                    }
                                    optionFilterProp="label"
                                    onChange={onChangeMoisFin}
                                    onSearch={onSearchMoisFin}
                                    options={filteredMonths}
                                    disabled={!moisDebut}
                                    style={{ width: 120 }}
                                    value={currentEndMonthName}
                                />

                                {/* <span className="">Année :</span> */}
                                <Select
                                    showSearch
                                    placeholder="Année"
                                    optionFilterProp="label"
                                    onChange={onChangeYear}
                                    options={years}
                                    style={{ width: 120 }}
                                    disabled={!moisDebut}
                                    value={currentDate}
                                />
                            </div>
                            <div>
                                <Button type="primary" disabled={!allSelected} onClick={handleUpdateWithFilter} icon={<CheckCircleIcon className="h-6 w-6 text-white" />} />
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>

            <div className='px-6'>
                <div className='bg-white rounded-lg p-2'>
                    <Datalist 
                        dataList={dashBoardAnalysis}
                        fetchData={()=>{}}
                        loading={isLoading}
                        searchValue={0}
                        pagination={
                            <div className='flex items-center px-6'>
                                <p className='text-xs text-gray-400'>{0} ligne(s)</p>
                                <Pagination 
                                    total={0}
                                    pageSize={100}
                                    // onChange={(page)=>{
                                    //     totalPages > page && fetchMajorBudgetLine(`${URLS.API_BUDGETLINE}/major-budget-lines/?skip=${page}&isActive=true`)
                                    // }}
                                />
                            </div>
                        }
                        currentYear={currentYear}
                        startMonthFooter={startMonthFooter}
                        endMonthFooter={endMonthFooter}
                        dateFooter={dateFooter}
                    />
                </div>
            </div>
        </>
    )
}

export default DashboardBudget