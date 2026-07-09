import {
  TextField,
  Button,
  Typography,
  Stack
} from "@mui/material";


import SaveIcon from "@mui/icons-material/Save";


import { useState } from "react";



function InteractionForm(){


const [formData,setFormData] = useState({

hcpName:"",
hospital:"",
specialization:"",
discussion:"",
product:"",
followUp:""

});



const handleChange=(e)=>{

setFormData({

...formData,

[e.target.name]:e.target.value

});

};



const handleSubmit=(e)=>{

e.preventDefault();

console.log(formData);

alert("Interaction saved successfully");


};



return (


<form onSubmit={handleSubmit}>


<Typography
variant="h6"
fontWeight="600"
gutterBottom
>
Structured Interaction Form
</Typography>



<Stack spacing={2}>


<TextField

label="HCP Name"

name="hcpName"

value={formData.hcpName}

onChange={handleChange}

fullWidth

/>




<TextField

label="Hospital / Clinic"

name="hospital"

value={formData.hospital}

onChange={handleChange}

fullWidth

/>




<TextField

label="Specialization"

name="specialization"

value={formData.specialization}

onChange={handleChange}

fullWidth

/>




<TextField

label="Products Discussed"

name="product"

value={formData.product}

onChange={handleChange}

fullWidth

/>




<TextField

label="Discussion Summary"

name="discussion"

value={formData.discussion}

onChange={handleChange}

multiline

rows={4}

fullWidth

/>




<TextField

label="Follow-up Date"

name="followUp"

type="date"

InputLabelProps={{
shrink:true
}}

value={formData.followUp}

onChange={handleChange}

fullWidth

/>





<Button

type="submit"

variant="contained"

startIcon={<SaveIcon/>}

>

Save Interaction

</Button>



</Stack>


</form>


);


}



export default InteractionForm;