import NavBar from './components/NavBar'
import { AppRouter } from './routes/AppRouter'
import dotenv from "dotenv";
import {ToastContainer} from "react-toastify"
import AppNavBar from './components/AppNavBar';
function App() {

  return (
    < div className=' h-screen w-full '> 
    <ToastContainer />
    <NavBar></NavBar>
    <AppRouter></AppRouter>
    <AppNavBar></AppNavBar>
    </div>
  )
}

export default App
