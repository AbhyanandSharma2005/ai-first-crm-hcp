import {
  TextField,
  Button,
  Typography,
  Stack,
  Paper
} from "@mui/material";


import SendIcon from "@mui/icons-material/Send";


import {
useState
} from "react";



function ChatBox(){


const [message,setMessage]=useState("");

const [chat,setChat]=useState([]);



const sendMessage=()=>{


if(!message.trim())
return;



setChat([

...chat,

{
sender:"user",
text:message
}

]);



setMessage("");

};



return (

<div>


<Typography

variant="h6"

fontWeight="600"

gutterBottom

>

AI Interaction Assistant

</Typography>




<Paper

sx={{

height:250,

padding:2,

overflow:"auto",

background:"#fafafa"

}}

>



{
chat.map((item,index)=>(


<Typography

key={index}

sx={{

mb:1

}}

>


<b>
{item.sender}:
</b>

{" "}

{item.text}


</Typography>


))

}



</Paper>




<Stack
direction="row"
spacing={1}
sx={{
mt:2
}}
>


<TextField

fullWidth

placeholder="Describe your HCP meeting..."

value={message}

onChange={(e)=>setMessage(e.target.value)}

/>



<Button

variant="contained"

onClick={sendMessage}

endIcon={<SendIcon/>}

>

Send

</Button>


</Stack>


</div>


);


}



export default ChatBox;