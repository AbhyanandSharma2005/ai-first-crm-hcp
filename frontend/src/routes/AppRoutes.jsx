import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


import Dashboard from "../pages/Dashboard";

import LogInteraction from "../pages/LogInteraction";

import InteractionHistory from "../pages/InteractionHistory";

import NotFound from "../pages/NotFound";


import Layout from "../components/Layout";



function AppRoutes(){


return (


<BrowserRouter>


<Layout>


<Routes>


<Route

path="/"

element={<Dashboard/>}

/>



<Route

path="/log-interaction"

element={<LogInteraction/>}

/>



<Route

path="/history"

element={<InteractionHistory/>}

/>



<Route

path="*"

element={<NotFound/>}

/>


</Routes>


</Layout>


</BrowserRouter>


);


}



export default AppRoutes;