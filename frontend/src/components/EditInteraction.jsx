import React, { useState, useEffect } from "react";
import API from "../api/api";

function EditInteraction({

    interaction,

    onClose,

    onUpdate

}) {

    const [formData, setFormData] = useState({

        hcp_name: "",

        summary: "",

        product: "",

        follow_up: ""

    });

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");



    useEffect(() => {

        if (interaction) {

            setFormData({

                hcp_name: interaction.hcp_name || "",

                summary: interaction.summary || "",

                product: interaction.product || "",

                follow_up: interaction.follow_up
                    ? interaction.follow_up.substring(0, 10)
                    : ""

            });

        }

    }, [interaction]);



    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };



    const updateInteraction = async (e) => {

        e.preventDefault();

        setLoading(true);

        setMessage("");

        try {

            const response = await API.put(

                `/edit/${interaction.id}`,

                formData

            );

            console.log("Update Response:", response.data);

            setMessage(

                response.data.message ||

                "Interaction updated successfully."

            );

            if (onUpdate) {

                await onUpdate();

            }

            setTimeout(() => {

                if (onClose) {

                    onClose();

                }

            }, 1000);

        }

        catch (error) {

            console.error("Update Error:", error);

            setMessage(

                error.response?.data?.message ||

                error.message ||

                "Failed to update interaction."

            );

        }

        finally {

            setLoading(false);

        }

    };



    if (!interaction) {

        return null;

    }



    return (

        <div

            style={{

                position: "fixed",

                top: 0,

                left: 0,

                width: "100%",

                height: "100%",

                backgroundColor: "rgba(0,0,0,0.5)",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                zIndex: 1000

            }}

        >

            <div

                style={{

                    backgroundColor: "#ffffff",

                    padding: "25px",

                    borderRadius: "10px",

                    width: "500px",

                    maxWidth: "90%",

                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)"

                }}

            >

                <h2>Edit Interaction</h2>

                <form onSubmit={updateInteraction}>

                    <div>

                        <label>HCP Name</label>

                        <br />

                        <input

                            type="text"

                            name="hcp_name"

                            value={formData.hcp_name}

                            onChange={handleChange}

                            disabled={loading}

                            style={{

                                width: "100%",

                                padding: "8px",

                                marginTop: "5px"

                            }}

                        />

                    </div>

                    <br />



                    <div>

                        <label>Summary</label>

                        <br />

                        <textarea

                            name="summary"

                            value={formData.summary}

                            onChange={handleChange}

                            disabled={loading}

                            rows={4}

                            style={{

                                width: "100%",

                                padding: "8px",

                                marginTop: "5px"

                            }}

                        />

                    </div>

                    <br />



                    <div>

                        <label>Product</label>

                        <br />

                        <input

                            type="text"

                            name="product"

                            value={formData.product}

                            onChange={handleChange}

                            disabled={loading}

                            style={{

                                width: "100%",

                                padding: "8px",

                                marginTop: "5px"

                            }}

                        />

                    </div>

                    <br />



                    <div>

                        <label>Follow Up Date</label>

                        <br />

                        <input

                            type="date"

                            name="follow_up"

                            value={formData.follow_up}

                            onChange={handleChange}

                            disabled={loading}

                            style={{

                                width: "100%",

                                padding: "8px",

                                marginTop: "5px"

                            }}

                        />

                    </div>

                    <br />



                    <button

                        type="submit"

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Updating..."

                                : "Update Interaction"

                        }

                    </button>



                    <button

                        type="button"

                        onClick={onClose}

                        disabled={loading}

                        style={{

                            marginLeft: "10px"

                        }}

                    >

                        Cancel

                    </button>

                </form>



                {

                    message && (

                        <p

                            style={{

                                marginTop: "15px",

                                color: message.toLowerCase().includes("failed")

                                    ? "red"

                                    : "green"

                            }}

                        >

                            {message}

                        </p>

                    )

                }

            </div>

        </div>

    );

}

export default EditInteraction;