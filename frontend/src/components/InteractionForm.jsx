import React, { useState } from "react";

import API from "../api/api";



function InteractionForm(){


    const [formData,setFormData] = useState({

        hcp_name:"",

        summary:"",

        product:"",

        follow_up:""

    });



    const [message,setMessage] = useState("");



    const handleChange = (e)=>{


        setFormData({

            ...formData,

            [e.target.name]:
            e.target.value

        });


    };



    const submitInteraction = async(e)=>{


        e.preventDefault();



        try{


            const response = await API.post(

                "/interaction/",

                formData

            );



            console.log(response.data);



            setMessage(
                "Interaction saved successfully"
            );



            setFormData({

                hcp_name:"",

                summary:"",

                product:"",

                follow_up:""

            });



        }


        catch(error){


            console.error(
                error
            );


            setMessage(
                "Failed to save interaction"
            );

        }


    };



    return (

        <div>


            <form
            onSubmit={submitInteraction}
            >


                <div>

                <label>
                    HCP Name
                </label>

                <br/>


                <input

                name="hcp_name"

                value={
                    formData.hcp_name
                }

                onChange={
                    handleChange
                }

                placeholder="Doctor Name"

                />

                </div>



                <br/>



                <div>


                <label>
                    Interaction Summary
                </label>


                <br/>


                <textarea

                name="summary"

                value={
                    formData.summary
                }

                onChange={
                    handleChange
                }


                placeholder=
                "Describe interaction"

                />


                </div>



                <br/>



                <div>


                <label>
                    Product Discussed
                </label>


                <br/>


                <input

                name="product"

                value={
                    formData.product
                }

                onChange={
                    handleChange
                }


                placeholder="Product name"

                />


                </div>



                <br/>



                <div>


                <label>
                    Follow Up Date
                </label>


                <br/>


                <input

                type="date"

                name="follow_up"


                value={
                    formData.follow_up
                }


                onChange={
                    handleChange
                }

                />


                </div>



                <br/>


                <button
                type="submit"
                >

                    Save Interaction

                </button>



            </form>



            <p>

            {message}

            </p>


        </div>

    );


}


export default InteractionForm;