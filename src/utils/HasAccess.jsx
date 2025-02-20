import React from 'react'

const HasAccess = ({
    roles=[],
    permissions=[],
    expectedRoles=[],
    expectedPermissions=[],
    isExclude=false,
    children
}) => {

    if(expectedRoles.length <=0 && expectedPermissions.length <= 0){
        return <>{children}</>
    }

    if(!isExclude){
        let hasRoles = expectedRoles.some((role)=>roles.includes(role));
        let hasPermissions = expectedPermissions.some((permission)=>permissions.includes(permission));

        if(hasPermissions || hasRoles){
            return <>{children}</>
        }
    }
    
    if(isExclude){
        let hasRoles = expectedRoles.some((role)=>roles.includes(role));
        let hasPermissions = expectedPermissions.some((permission)=>permissions.includes(permission));

        if(!hasPermissions || !hasRoles){
            return <>{children}</>
        }
    }
  
    
}

export default HasAccess


