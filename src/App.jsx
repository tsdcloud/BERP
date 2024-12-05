import './index.css'
import {Button} from './components/ui/button'
import logo from './assets/bfclogo.png'
import { useState } from 'react'
function App() {
  const [clicked, setClicked] = useState(0)
  return (
    <div className="flex flex-row h-screen w-full justify-center items-center">
      <div>
        <img src={logo} alt="" className='w-[300px]'/>
        <p className="text-md text-center bg-green-500 text-white">Frontend starter 1.0.0</p>
        <p className="text-md text-center text-blue-700 space-x-2">
          <a href="https://vite.dev/guide/" target='_blank'>Vite</a> | 
          <a href="https://react.dev/learn" target='_blank'>React JS</a> | 
          <a href="https://tailwindcss.com/docs/installation" target='_blank'>Tailwindcss</a> | 
          <a href="https://ui.shadcn.com/docs/installation/vite" target='_blank'>ShadCN UI</a>
        </p>
        <div className='flex justify-center my-4'>
          <Button className="bg-green-500" onClick={()=>setClicked(clicked + 1)}>Button cliked {clicked}</Button>
        </div>
      </div>
    </div>
  )
}

export default App
