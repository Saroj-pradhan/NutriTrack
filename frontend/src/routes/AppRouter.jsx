import { Route,Routes} from "react-router-dom";
import Home from "../components/Home";
import Content from "../components/Content";
import Result from "../components/Result";
import Loader from "../components/Loader";
import UploadPage from "../pages/UploadPage";
import History from "../components/History";
import Profile from "../components/Profile";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
export const AppRouter = function(){
    return(
            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route path="/log" element={<ProtectedRoute><Content/></ProtectedRoute>}></Route>
              <Route path="/result" element={<Result/>}></Route>
              <Route path="/loader" element={<Loader/>}></Route>
              <Route path="/history" element={<ProtectedRoute><History/></ProtectedRoute>}></Route>
              <Route path="/home" element={<ProtectedRoute><UploadPage/></ProtectedRoute>}></Route>
              <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}></Route>
              <Route path="/signup" element={<SignupPage/>}></Route>
              <Route path="/login" element={<LoginPage/>}></Route>
            </Routes>
    )
}
