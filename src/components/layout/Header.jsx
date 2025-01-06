import { useState, useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { 
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuGroup,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuPortal,
        DropdownMenuSeparator,
        DropdownMenuShortcut,
        DropdownMenuSub,
        DropdownMenuSubContent,
        DropdownMenuSubTrigger,
        DropdownMenuTrigger,

        } from "../ui/dropdown-menu";
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

export default function Header() {
        const [userDataDecoded, setUserData] = useState();
        const [dropdownOpen, setDropdownOpen] = useState(false);


        const toggleDropdown = () => {
                setDropdownOpen(!dropdownOpen);
                console.log("Je clique");
        };

        // const { userData } = useContext(AUTHCONTEXT);
        // console.log("header userdata", userData);
        // const decoded = jwtDecode(userData);
        // console.log("decoded", decoded);

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

                        <div className={`transition-transform transform ${dropdownOpen ? 'scale-100 translate-y-0' : 'scale-95 -translate-y-2'} absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10`}>

                                <div className='m-2 text-sm cursor-pointer space-y-2'>
                                        <p className=''>Vous interéagissez en tant que {}</p>
                                        <hr />
                                                <ul className='px-1 w-full'>
                                                        <li className='hover:bg-gray-200'>
                                                                Profil
                                                        </li>
                                                        <li className=''>
                                                                Paramètres
                                                        </li>
                                                        <li className=''>
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
