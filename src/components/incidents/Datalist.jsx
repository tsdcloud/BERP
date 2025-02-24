import React, {useEffect, useState} from 'react';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { INCIDENT_STATUS } from '../../utils/constant.utils';
import { XMarkIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import AutoComplete from '../common/AutoComplete';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import CustomPagination from '../common/Pagination';
 




const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {

  const handleDelete = async (id) =>{
    if (window.confirm("Voulez vous supprimer l'incident ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/incidents/${id}`;
        let response = await fetch(url, {
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}` || ''
          },
        });
        if(response.status === 200){
          alert("Deleted successfully");
          fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const highlightText = (text) => {
    if (!searchValue) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text?.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  };
          
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [externalEntities, setExternalEntities] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingRow, setEditingRow] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedIncident, setSelectedIncident] = useState("");
  const [selectedEquipement, setSelectedEquipement] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [maintenanceType, setMaintenanceType] = useState("");
  const [supplierType, setSupplierType] = useState("");
  const [description, setDescription] = useState("");

  const {register, handleSubmit, formState:{errors}, setValue} = useForm();


  const columns=[
    {
      title:"No ref",
      dataIndex:"numRef",
      width:"100px",
      render:(value, record)=>
        <p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title:"Type incident",
      dataIndex:"incident",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value?.name) || value}</p>
    },
    {
      title:"Description",
      dataIndex:"description",
      width:"200px",
      render:(value)=><p className='text-sm'>{value?.name || value}</p>
    },
    {
      title:"Site",
      dataIndex:"siteId",
      width:"100px",
      render:(value)=>
        <p className='text-sm capitalize'>
          {sites.find(site => site.value === value)?.name || value}
        </p>
    },
    {
      title:"Shift",
      dataIndex:"shiftId",
      width:"150px",
      render:(value)=>
        <p className='text-sm capitalize'>
          {shifts.find(shift => shift.value === value)?.name || value || "--"}
        </p>
    },
    {
      title:"Utilisateur",
      dataIndex:"createdBy",
      width:"200px",
      render:(value)=>
        <p className='text-sm capitalize'>
          {employees.find(employee => employee.value === value)?.name || value}
        </p>
    },
    {
      title:"Cloturer par",
      dataIndex:"closedBy",
      width:"200px",
      render:(value)=>
        <p className='text-sm capitalize'>
          {employees.find(employee => employee.value === value)?.name || value || "--"}
        </p>
    },
    {
      title:"Equipement",
      dataIndex:"equipement",
      width:"200px",
      render:(value)=>
        <p className='text-sm capitalize'>
          {value?.name}
        </p>
    },
    {
      title:"Cause incident",
      dataIndex:"incidentCauses",
      width:"200px",
      render:(value)=>
        <p className='text-sm capitalize'>
          {value?.name}
        </p>
    },
    {
      title:"Date de creation",
      dataIndex:"creationDate",
      width:"200px",
      render:(value)=>
        <p className='text-sm capitalize'>
          {value?.split("T")[0] || "--"}
        </p>
    },
    {
      title:"Date de cloture",
      dataIndex:"closedDate",
      width:"200px",
      render:(value)=>
        <p className='text-sm capitalize'>
          {value?.split("T")[0] || "--"}
        </p>
    },
    {
      title:"Statut",
      dataIndex:"status",
      fixed:"right",
      width:"150px",
      render:(value)=>
        <div className={`${
          value === "UNDER_MAINTENANCE"?"border-yellow-500 bg-yellow-300":
          value === "CLOSED" ? "border-green-500 bg-green-300" :""
        } p-2 rounded-lg border`}>{INCIDENT_STATUS[value] || "Unknown Status"}</div>
    },
    {
      title:"Action",
      dataIndex:"",
      fixed:"right",
      width:"75px",
      render:(value, record)=>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                <PencilIcon className='h-4 w-6'/>
                <span className=''>Editer</span>
              </DropdownMenuItem> */}
              {
                record.status === "PENDING" &&
                <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                  <button className='flex items-center space-x-2'
                    onClick={()=>{
                      setSelectedSite(record.siteId);
                      setSelectedIncident(record.id);
                      setSelectedEquipement(record.equipementId);
                      setIsOpen(true);
                    }}
                  >
                    <ExclamationTriangleIcon />
                    <span>Mettre en maintenance</span>
                  </button>
                </DropdownMenuItem>
              }
              {
                (record.status === "UNDER_MAINTENANCE" || record.status === "PENDING") &&
                <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                  <button className='flex items-center space-x-2'
                    onClick={async ()=>{
                      if (window.confirm("Voulez vous cloturer l'incident ?")) {
                        try {
                          let url = `${URLS.INCIDENT_API}/incidents/${record.id}`;
                          let response = await fetch(url, {
                            method:"PATCH",
                            headers:{
                              "Content-Type":"application/json",
                              'authorization': `Bearer ${localStorage.getItem('token')}` || ''
                            },
                            body:JSON.stringify({status: "CLOSED"})
                          });
                          if(response.status === 200){
                            fetchData();
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      }
                    }}
                  >
                    <XMarkIcon />
                    <span>Cloturer l'incident</span>
                  </button>
                </DropdownMenuItem>
              }
              <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" onClick={()=>handleDelete(record.id)}>
                <TrashIcon className='text-red-500 h-4 w-6'/>
                <span className='text-red-500'>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      },
  ]
    
  const {handleFetch, handlePost} = useFetch();

  const handleFetchSites = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setSites(formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleFetchShifts = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setShifts(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleFetchEmployees = async (link) =>{
    try {
      let response = await handleFetch(link);
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });

        setEmployees(formatedData);

        // setTimeout(()=>{
        //   console.log(employees.find(employee => employee.value === "5435e1e3-4074-4d7f-94b2-f2157f3b0c71")?.name);

        // }, [10000])

      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleFetchExternalEntities = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setExternalEntities(formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const submitMaintenance = async(data) =>{
    data.userId = "user id";
    data.createdBy = "created id";
    data.description = description;
    data.siteId = selectedSite;
    data.equipement = selectedEquipement;
    
    let url = `${import.meta.env.VITE_INCIDENT_API}/maintenances`
    try {
      let response = await handlePost(url, {...data, incidentId: selectedIncident});
      if(response.status !== 201){
        alert("Echec de la creation de la maintenance");
        return;
      }
      let incidentUrl = `${import.meta.env.VITE_INCIDENT_API}/incidents/${selectedIncident}`;
      let res = await fetch(incidentUrl,{
        headers:{
          "Content-Type":"application/json",
          'authorization': `Bearer ${localStorage.getItem('token')}` || ''
        },
        method:"PATCH",
        body: JSON.stringify({status:"UNDER_MAINTENANCE"})
      })
      if(res.status !== 200){
        alert("Echec de la mis a jour");
        return
      }
      fetchData();
      setIsOpen(false);
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchMaintenanceTypes = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setMaintenanceTypes(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }
  const handleSelectMaintenanceType=(item)=>{
    setValue("maintenanceId", item.value)
  }

  const handleSelectSupplier=(item)=>{
    setValue("supplierId", item.value)
  }

  const handleSearchMaintenanceType=async(searchInput)=>{
    try{
      handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types?search=${searchInput}`);
    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
    handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts`);
    handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types?hasIncident=${true}`);
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
    handleFetchExternalEntities(`${import.meta.env.VITE_ENTITY_API}/suppliers`);
  }, []);

  useEffect(()=>{
    // handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types?hasIncident=${true}`);
    handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types?hasIncident=${false}`);
  }, [isOpen])
  
  return (
    <div className="w-full">
      <div className="py-4 px-4 w-full max-h-[500px]">
        <Form>
          <Table 
            footer={() => <div className='flex'></div>}
            dataSource={dataList}
            columns={columns}
            bordered={true}
            scroll={{
                x: 500,
                y: "30vh"
            }}
            pagination={false}
            loading={loading}
          />
        </Form>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>{"Mettre en maintenance"}</DialogHeader>
                <form onSubmit={handleSubmit(submitMaintenance)}>
                  {/* Type maintenance selection */}
                  <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs px-2'>Choisir le type de maintenance*:</label>
                    <AutoComplete
                      placeholder="Choisir le type de maintenance"
                      isLoading={isLoading}
                      dataList={maintenanceTypes}
                      onSearch={handleSearchMaintenanceType}
                      onSelect={handleSelectMaintenanceType}
                      // register={register}
                    />
                    {/* {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>} */}
                  </div>
                  
                  {/* type selection */}
                  <label htmlFor="" className='text-xs px-2'>Choisir le type d'intervenant*:</label>
                  <div 
                    className='flex flex-col mx-2'
                    onChange={(e)=>setSupplierType(e.target.value)}
                  >
                    <select name="" id="" className='border rounded-lg p-2' placeholder="Choisir le type d'intervenant">
                      <option value="">Choisir le type d'intervenant</option>
                      <option value="EMPLOYEE">Employer</option>
                      <option value="SUPPLIER">Prestataire</option>
                    </select>
                    {/* {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>} */}
                  </div>


                  {/* Supplier selection */}
                  {
                    supplierType === "SUPPLIER" &&
                    <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs px-2'>Choisir le prestataire:</label>
                    <AutoComplete
                      placeholder="Choisir le prestataire"
                      isLoading={isLoading}
                      dataList={externalEntities}
                      onSearch={()=>{}}
                      onSelect={handleSelectSupplier}
                      // register={register}
                    />
                    {/* {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>} */}
                    </div>
                  }

                  {/* Employer selection */}
                  {
                    supplierType === "EMPLOYEE" &&
                    <div className='flex flex-col'>
                      <label htmlFor="" className='text-xs px-2'>Choisir un employer:</label>
                      <AutoComplete
                        placeholder="Choisir un employer"
                        isLoading={isLoading}
                        dataList={employees}
                        onSearch={()=>{}}
                        onSelect={handleSelectSupplier}
                        // register={register}
                      />
                      {/* {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>} */}
                    </div>
                  }

                  {/* Description */}
                  <div className='mx-2 mt-3'>
                    <textarea 
                      name="" 
                      id="" 
                      className='border rounded-lg p-2 w-full' 
                      placeholder='Description'
                      value={description}
                      onChange={(e)=>setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <Button className="text-white">
                    Mettre en maintenance
                  </Button>
                </form>
                <DialogFooter>{""}</DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default Datalist