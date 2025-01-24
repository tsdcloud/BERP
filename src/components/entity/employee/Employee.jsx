import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { EmployeeAction } from './ColumnsEmployee';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';  
import CreateEmployee from './CreateEmployee';

export default function Employee() {
    const { showDialogEmployee, columnsEmployee } = EmployeeAction();
    const [Employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEmployee = async () => {
        // const urlToShowAllEmployee = "http://127.0.0.1:8000/api_gateway/api/user/";
        const urlToShowAllEmployee = "";
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEmployee);
            // console.log("respo",response);
            
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredEmployee = results?.map(item => {
                        const { user_created_by, user_updated_by, is_staff, is_superuser, ...rest } = item;
                        return rest;
                        });
                        // console.log("Employees", filteredEmployee);
                        setEmployees(filteredEmployee);
                }
                else {
                    throw new Error('Erreur lors de la récupération des employées');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchEmployee();
        
    }, []);


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des employé(e)s</h1>
                <div className='space-y-2'>
                    <CreateEmployee setOpen={setOpen} onSubmit={fetchEmployee} />
                    {columnsEmployee && Employees.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[1300px] text-xs"
                            columns={columnsEmployee}
                            data={Employees} 
                        />
                        // <div>Je ne pas là.</div>
                    )}
                </div>
                {showDialogEmployee()}
            </div>
  );
}
