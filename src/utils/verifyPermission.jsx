import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'

const VerifyPermission = ({children, expected=[], roles=[], functions=[], isExclude = false}) => {  
  
  let token = localStorage.getItem('token');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
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

    // if(isSuperAdmin){
    //   return<>{children}</>
    // }

    if(expected instanceof Array){

        if(isExclude){
          if((!expected.includes(roles) || !expected.includes(functions))){
            return <>{children}</>
          }
          return null;
        }

        let includeRoles = roles.filter((item) => expected.includes(item))
        let includePerms = functions.filter((item) => expected.includes(item))

        // console.log("includeRoles", includeRoles)
        // console.log("includePerms", includePerms)

        if(includeRoles.length !== 0 || includePerms.length !== 0){
          // console.log("is exclude", isExclude)
          return <>{children}</>
        }

        // if(expected.includes(roles) || expected.includes(functions)){
        //   console.log("is exclude", isExclude)
        //   return <>{children}</>
        // }
        return null;
    }
    return null
}

export default VerifyPermission