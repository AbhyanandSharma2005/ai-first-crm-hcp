import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box
} from "@mui/material";


import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HistoryIcon from "@mui/icons-material/History";


import { Link } from "react-router-dom";


const drawerWidth = 240;



function Sidebar() {


const menuItems = [

{
text:"Dashboard",
icon:<DashboardIcon/>,
path:"/"
},


{
text:"Log Interaction",
icon:<AddCircleIcon/>,
path:"/log-interaction"
},


{
text:"Interaction History",
icon:<HistoryIcon/>,
path:"/history"
}


];



return (


<Drawer

variant="permanent"

sx={{

width:drawerWidth,

flexShrink:0,


"& .MuiDrawer-paper":{

width:drawerWidth,

boxSizing:"border-box",

backgroundColor:"#ffffff",

borderRight:"1px solid #e0e0e0"

}

}}

>


<Box
sx={{
padding:3
}}
>


<Typography
variant="h5"
fontWeight="700"
>
AI CRM
</Typography>


<Typography
variant="body2"
color="text.secondary"
>
Healthcare Professional Module
</Typography>


</Box>



<List>


{
menuItems.map((item,index)=>(


<ListItem
key={index}
disablePadding
>


<ListItemButton
component={Link}
to={item.path}
>


<ListItemIcon>

{item.icon}

</ListItemIcon>



<ListItemText
primary={item.text}
/>


</ListItemButton>


</ListItem>


))
}



</List>



</Drawer>


);


}



export default Sidebar;