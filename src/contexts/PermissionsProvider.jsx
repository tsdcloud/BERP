import React, {createContext, useState} from 'react';

export const PERMISSION_CONTEXT = createContext();

const PermissionsProvider = ({children}) => {
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
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

export default PermissionsProvider