import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { EmployeeAction } from './ColumnsEmployee';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';  
import CreateEmployee from './CreateEmployee';

export default function Employee() {
    const [Employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEmployee = async () => {
        const urlToShowAllEmployee = `${URLS.ENTITY_API}/employees`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEmployee);
            console.log("respoEmp", response);
            
            if (response && response?.status === 200) {
                const results = response?.data;

                // Vérification si results est un tableau
                if (Array.isArray(results)) {
                    const filteredEmployee = results.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { 
                            id: rest.id || null, 
                            name: rest.name || 'Inconnu',
                            email: rest.email || 'Non renseigné',
                            phone: rest.phone || 'Non renseigné',
                            functionId: rest.function?.name || 'Non renseigné',
                            entityId: rest.entity?.name || 'Non renseigné',
                            gradeId: rest.grade?.name || 'Non renseigné',
                            echelonId: rest.echelon?.name || 'Non renseigné',
                            categoryId: rest.category?.name || 'Non renseigné',
                            userId: rest.name || 'Inconnu',
                            createdAt: rest.createdAt || 'Non renseigné',
                            isActive: rest.isActive || "Non défini",
                        };
                    });
                    // console.log("fil", filteredEmployee);
                    setEmployees(filteredEmployee);
                } else {
                    throw new Error('Les données récupérées ne sont pas un tableau');
                }
            } else {
                throw new Error('Erreur lors de la récupération des employées');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployee();
        
    }, []);

    const updateData = (id, updatedEmployee) => {
         setEmployees((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedEmployee } : item
            ));
            fetchEmployee();
    };

    const delEmployee = (id) => {
         setEmployees((prev) =>
            prev.filter((item) => item.id != id
        ));
    };


    const { showDialogEmployee, columnsEmployee } = EmployeeAction({ delEmployee, updateData });
  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des employé(e)s</h1>
                <div className='space-y-2 w-full'>
                    <CreateEmployee setOpen={setOpen} onSubmit={fetchEmployee} />
                    {columnsEmployee && Employees.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[1300px] max-w-full text-xs sm:text-sm"
                            columns={columnsEmployee}
                            data={Employees} 
                        />
                    )}
                </div>
                {showDialogEmployee()}
            </div>
  );
}
