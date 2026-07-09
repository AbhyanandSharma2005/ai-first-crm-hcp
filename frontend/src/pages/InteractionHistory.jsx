import {
  Card,
  CardContent,
  Typography
} from "@mui/material";



function InteractionHistory(){


const interactions=[

{
hcp:"Dr. Sharma",
product:"CardioPlus",
date:"09 July 2026",
summary:"Discussed product benefits and clinical outcomes."
},


{
hcp:"Dr. Patel",
product:"DiabetesCare",
date:"05 July 2026",
summary:"Doctor requested additional information."
}

];



return (

<div>


<Typography

variant="h4"

fontWeight="600"

gutterBottom

>

Interaction History

</Typography>




{
interactions.map((item,index)=>(


<Card

key={index}

sx={{

mb:2,

borderRadius:3

}}

>


<CardContent>


<Typography variant="h6">

{item.hcp}

</Typography>


<Typography>

Product: {item.product}

</Typography>


<Typography>

Date: {item.date}

</Typography>


<Typography>

Summary: {item.summary}

</Typography>



</CardContent>


</Card>


))

}



</div>

);


}



export default InteractionHistory;