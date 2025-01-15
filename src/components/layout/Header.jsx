import { useState, useContext, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

export default function Header() {
        const { userData } = useContext(AUTHCONTEXT);
        const [userDataDecoded, setUserDataDecoded] = useState();
        const [dropdownOpen, setDropdownOpen] = useState(false);

        useEffect(() => {
                
                console.log("header userdata", userData);
        
                if (typeof userData === 'string') {
                    try {
                        const decoded = jwtDecode(userData);
                        console.log("decoded", decoded);
                        setUserDataDecoded(decoded);
                    } catch (error) {
                        console.error("Failed to decode token:", error);
                        // Gérer l'erreur, par exemple, en réinitialisant l'état ou en affichant un message d'erreur
                    }
                } else {
                    console.error("Invalid token: must be a string", userData);
                    // Gérer l'erreur, par exemple, en réinitialisant l'état ou en affichant un message d'erreur
                }
            }, [userData]);



        const toggleDropdown = () => {
                setDropdownOpen(!dropdownOpen);
                console.log("Je clique");
        };

  return (
    <div className='m-6'>
        <div className='bg-blue-900 w-full h-[55px] rounded-sm flex justify-between'>

                <h1 className='text-white text-xs font-mono text-md p-5'>
                        BERP. Business Entreprise Resource Planning
                </h1>
                       
                <div className="relative">
                        <Avatar className="m-2 rounded-full border-2 border-orange-500" onClick={toggleDropdown}>
                        <AvatarImage 
                                className="border-white rounded-full" 
                                src="https://github.com/shadcn.png" 
                                alt="Avatar"
                        />
                        <AvatarFallback className="bg-gray-400">
                                CN
                        </AvatarFallback>
                        </Avatar>

                        {dropdownOpen && (

                        <div className={`transition-transform transform ${dropdownOpen ? 'scale-100 translate-y-0' : 'scale-95 -translate-y-2'} absolute right-0 mt-2 w-60 bg-white text-black rounded-md shadow-lg z-10`}>

                                <div className='p-1 m-1 text-sm cursor-pointer space-y-2'>
                                        <p> Vous interéagissez en tant que <span className='text-secondary'>{ userDataDecoded?.user?.first_name + " " + userDataDecoded?.user?.last_name }</span></p>
                                        <hr />
                                                <ul className='px-1 w-full'>
                                                        <li className='hover:bg-gray-200'>
                                                                Profil
                                                        </li>
                                                        <li className='hover:bg-gray-200'>
                                                                Paramètres
                                                        </li>
                                                        <li className='hover:bg-red-200 w-full'>
                                                                Se déconnecter
                                                        </li>
                                                </ul>
                                
                                </div>
                        </div>
                        )}
            </div>
           
        </div>
    </div>
  );
};
