import { URLS } from "../../configUrl"
import { jwtDecode } from "jwt-decode";
/**
 * Get user's employee profile
 * @param string
 * @returns employee
 */
export const getEmployee = async () =>{
    const token = localStorage.getItem('token');
    if(!token || token === null) return null;

    const decodedToken = jwtDecode(token);
    console.log(decodedToken)
    const userId = decodedToken?.user_id;
    
    
    if(!userId) return null

    try {
        let response = await fetch(`${URLS.ENTITY_API}/employees/?userId=${userId}`,{
            headers:{
                'authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        if(response.status === 200){
            let result = await response.json();
            console.log(result)
            if(result?.data.length > 0){
                return result?.data[0];
            }
            return result
        }
    } catch (error) {
        console.error(error);
    }
} 


const getRoles = async()=>{

}


