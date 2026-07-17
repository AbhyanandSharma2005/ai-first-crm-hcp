import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchHCP from "../components/SearchHCP";


function Dashboard() {

  const cards = [
    {
      title: "Total HCPs",
      value: "120",
      icon: <PeopleAltIcon fontSize="large" />,
      description: "Healthcare Professionals"
    },
    {
      title: "Interactions Logged",
      value: "356",
      icon: <EventNoteIcon fontSize="large" />,
      description: "Total interactions recorded"
    },
    {
      title: "AI Assisted Logs",
      value: "89",
      icon: <SmartToyIcon fontSize="large" />,
      description: "Created using AI assistant"
    },
    {
      title: "Follow-ups",
      value: "24",
      icon: <TrendingUpIcon fontSize="large" />,
      description: "Upcoming follow-ups"
    }
  ];


  return (

    <Box>

      <Typography 
        variant="h4"
        fontWeight="600"
        gutterBottom
      >
        Dashboard
      </Typography>


      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Welcome to the AI-First CRM Healthcare Professional Module.
        Manage HCP interactions efficiently using AI-powered assistance.
      </Typography>


      <Grid 
        container 
        spacing={3}
      >

        {
          cards.map((card, index) => (

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
            >

              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 3
                }}
              >

                <CardContent>


                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2
                    }}
                  >

                    <Typography
                      variant="h6"
                      color="text.secondary"
                    >
                      {card.title}
                    </Typography>


                    {card.icon}


                  </Box>



                  <Typography
                    variant="h3"
                    fontWeight="bold"
                  >
                    {card.value}
                  </Typography>



                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {card.description}
                  </Typography>


                </CardContent>

              </Card>


            </Grid>

          ))
        }


      </Grid>



      <Card
        sx={{
          mt:4,
          borderRadius:3,
          boxShadow:3
        }}
      >

        <CardContent>


          <Typography
            variant="h5"
            fontWeight="600"
            gutterBottom
          >
            AI CRM Assistant
          </Typography>


          <Typography
            color="text.secondary"
          >
            Use the AI assistant to summarize HCP meetings,
            extract key insights, recommend next actions,
            and maintain accurate interaction records.
          </Typography>


        </CardContent>


      </Card>


    </Box>

  );

}


export default Dashboard;