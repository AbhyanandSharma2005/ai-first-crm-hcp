import {
  Grid,
  Paper,
  Typography
} from "@mui/material";

import InteractionForm from "../components/InteractionForm";
import ChatBox from "../components/ChatBox";


function LogInteraction() {


  return (

    <div>

      <Typography
        variant="h4"
        fontWeight="600"
        gutterBottom
      >
        Log HCP Interaction
      </Typography>


      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Record Healthcare Professional interactions using
        a structured form or AI-powered conversation.
      </Typography>



      <Grid
        container
        spacing={3}
      >


        <Grid
          item
          xs={12}
          md={6}
        >

          <Paper
            elevation={3}
            sx={{
              padding:3,
              borderRadius:3
            }}
          >

            <InteractionForm />

          </Paper>


        </Grid>




        <Grid
          item
          xs={12}
          md={6}
        >


          <Paper
            elevation={3}
            sx={{
              padding:3,
              borderRadius:3
            }}
          >

            <ChatBox />

          </Paper>


        </Grid>


      </Grid>


    </div>

  );


}


export default LogInteraction;