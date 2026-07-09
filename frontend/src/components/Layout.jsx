import {
  Box
} from "@mui/material";


import Sidebar from "./Sidebar";
import Header from "./Header";



function Layout({children}) {


return (


<Box
sx={{
display:"flex",
minHeight:"100vh"
}}
>


<Sidebar />



<Box
component="main"

sx={{

flexGrow:1,

backgroundColor:"#f5f7fb"

}}

>


<Header />



<Box
sx={{
padding:3
}}
>


{children}


</Box>



</Box>


</Box>


);


}



export default Layout;