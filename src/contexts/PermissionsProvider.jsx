import React, {createContext, useState, useEffect, useContext} from 'react';
import { getEmployee } from '../utils/entity.utils';
import { useFetch } from '../hooks/useFetch';
import { URLS } from '../../configUrl';

export const PERMISSION_CONTEXT = createContext();

const PermissionsProvider = ({children}) => {
    const [permissions, setPermissions] = useState([]);
    const { handleFetch } = useFetch()
    const [roles, setRoles] = useState([]);
    useEffect(()=>{

      // Fetch permissions and roles
      const fetchPermissionsAndRoles = async () => {
        try {
          const employee = await getEmployee();
          if(!employee){
              setIsLoading(false);
              return 
          }
          const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
          const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
          
          let empPerms = employeePermissions?.employeePermissions
          let empRoles = employeeRoles?.employeeRoles
  
          let formatedRoles = empRoles.map(role=>role?.role.roleName)
          let formatedPerms = empPerms.map(perm=>perm?.permission.permissionName)
  
          setRoles(formatedRoles);
          setPermissions(formatedPerms);
        } catch (error) {
          console.error("Error during fetch permissions and roles",error);
        }
      }
  
      fetchPermissionsAndRoles();
  
    }, []);
  return (
    <PERMISSION_CONTEXT.Provider
    value={{
        permissions,
        setPermissions,
        roles,
        setRoles
    }}
    >{children}</PERMISSION_CONTEXT.Provider>
  )
}


export const usePermissions = () => {
    return useContext(PERMISSION_CONTEXT);
}

export default PermissionsProvider