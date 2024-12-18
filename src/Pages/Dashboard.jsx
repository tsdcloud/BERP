import Header from '../components/layout/Header';
import DashboardUser from '../components/users/DashboardUser';
import {Input} from "../components/ui/input";
import Footer from '../components/layout/Footer';
// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import IndexUser from '../components/users/';


export default function Dashboard() {
  return (
        <>
             <Header/>
              <div className='m-6 flex justify-end'>
                  <Input className=" w-[300px]" 
                    placeholder="Rechercher..." />
                
              </div>
              <div className='m-6'>
                <DashboardUser/>
              </div>
                {/* <IndexUser/> */}
                <Footer className="flex space-x-2 justify-center p-2"/>
        </>
  );
}
