import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box
} from "@mui/material";


function Header() {

  return (

    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: "#ffffff",
        color: "#333333"
      }}
    >

      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >


        <Typography
          variant="h6"
          fontWeight="600"
        >
          AI-First CRM - HCP Module
        </Typography>



        <Box
          sx={{
            display:"flex",
            alignItems:"center",
            gap:2
          }}
        >

          <Typography
            variant="body1"
          >
            Field Representative
          </Typography>


          <Avatar>
            FR
          </Avatar>


        </Box>


      </Toolbar>


    </AppBar>

  );

}


export default Header;