import './index.css'
import logo from './assets/bfclogo.png'
function App() {
  return (
    <div className="flex flex-row h-screen w-full justify-center items-center">
      <div>
        <img src={logo} alt="" className='w-[300px]'/>
        <p className="text-md text-center bg-green-500 text-white">Frontend starter.</p>
      </div>
    </div>
  )
}

export default App
