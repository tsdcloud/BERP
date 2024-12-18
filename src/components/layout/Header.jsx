import {useState} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header() {

  return (
    <div className='m-6'>
        <div className='bg-blue-900 w-full h-[55px] rounded-sm flex justify-between'>

                <h1 className='text-white text-xs font-mono text-md p-5'>
                        BERP. Business Entreprise Resource Planning
                </h1>
                <Avatar className=" m-2">
                    <AvatarImage className="border-white rounded-full" src="https://github.com/shadcn.png" alt={"Avatar"} />
                        <AvatarFallback className="bg-gray-400">
                           CN
                        </AvatarFallback>
                </Avatar>
        </div>
    </div>
  );
};
