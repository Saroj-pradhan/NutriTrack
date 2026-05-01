import { Route,Routes} from "react-router-dom";
import Home from "../components/Home";
import Content from "../components/Content";
import Result from "../components/Result";
import Loader from "../components/Loader";
import UploadPage from "../pages/UploadPage";
import History from "../components/History";
import Profile from "../components/Profile";
export const AppRouter = function(){
    return(
            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route path="/home" element={<Content/>}></Route>
              <Route path="/result" element={<Result/>}></Route>
            <Route path="/loader" element={<Loader/>}></Route>
             <Route path="/history" element={<History/>}></Route>
            <Route path="/upload" element={<UploadPage/>}></Route>
             <Route path="/profile" element={<Profile/>}></Route>
            </Routes>
    )
}
