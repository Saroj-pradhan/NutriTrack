import { Route,Routes} from "react-router-dom";
import Home from "../components/Home";
import Content from "../components/Content";
import Result from "../components/Result";
import Loader from "../components/Loader";
export const AppRouter = function(){
    return(
            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route path="/content" element={<Content/>}></Route>
              <Route path="/result" element={<Result/>}></Route>
            <Route path="/loader" element={<Loader/>}></Route>
            </Routes>
    )
}
