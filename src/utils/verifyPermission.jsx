import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'

const VerifyPermission = ({children, expected=[], roles=[], functions=[], isExclude = false}) => {  
  
  let token = localStorage.getItem('token');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(()=>{
      const isSuperAdmin =()=>{
        try {
          let decodedToken = jwtDecode(token)
          if(decodedToken){
            let isSuperUser = decodedToken?.user.is_superuser;
            setIsSuperAdmin(isSuperUser);
          }
        } catch (error) {
          console.log(error)
        }
      }
      isSuperAdmin();
    },[]);

    if(isSuperAdmin){
      return<>{children}</>
    }

    if(expected instanceof Array){

        let includeRoles = roles.find((item) => expected.includes(item))
        let includePerms = functions.find((item) => expected.includes(item))

        if(isExclude){
          if((!includeRoles || !includePerms)){
            return <>{children}</>
          }
          return null;
        }

        if(includeRoles|| includePerms){
          return <>{children}</>
        }

        return null;
    }
    return null
}

export default VerifyPermission