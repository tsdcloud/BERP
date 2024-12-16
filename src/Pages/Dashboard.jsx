import DashboardUser from '../components/users/DashboardUser';
// import IndexUser from '../components/users/';


export default function Dashboard() {
  return (
         <div className='m-4'>
            <h1>Gestion des utilisateurs</h1>
            {/* <IndexUser/> */}
            <DashboardUser/>
        </div>
  );
}
