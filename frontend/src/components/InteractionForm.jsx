import React, { useState } from "react";
import API from "../api/api";

function InteractionForm() {

    const [formData, setFormData] = useState({

        hcp_name: "",

        summary: "",

        product: "",

        follow_up: ""

    });

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const submitInteraction = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await API.post(

                "/interaction/",

                formData

            );

            console.log(response.data);

            setMessage(

                response.data.message ||

                "Interaction saved successfully"

            );

            setFormData({

                hcp_name: "",

                summary: "",

                product: "",

                follow_up: ""

            });

        }

        catch (error) {

            console.error(error);

            setMessage(

                error.response?.data?.message ||

                "Failed to save interaction"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div>

            <form onSubmit={submitInteraction}>

                <div>

                    <label>

                        HCP Name

                    </label>

                    <br />

                    <input

                        name="hcp_name"

                        value={formData.hcp_name}

                        onChange={handleChange}

                        placeholder="Doctor Name"

                        disabled={loading}

                    />

                </div>

                <br />

                <div>

                    <label>

                        Interaction Summary

                    </label>

                    <br />

                    <textarea

                        name="summary"

                        value={formData.summary}

                        onChange={handleChange}

                        placeholder="Describe interaction"

                        disabled={loading}

                    />

                </div>

                <br />

                <div>

                    <label>

                        Product Discussed

                    </label>

                    <br />

                    <input

                        name="product"

                        value={formData.product}

                        onChange={handleChange}

                        placeholder="Product name"

                        disabled={loading}

                    />

                </div>

                <br />

                <div>

                    <label>

                        Follow Up Date

                    </label>

                    <br />

                    <input

                        type="date"

                        name="follow_up"

                        value={formData.follow_up}

                        onChange={handleChange}

                        disabled={loading}

                    />

                </div>

                <br />

                <button

                    type="submit"

                    disabled={loading}

                >

                    {

                        loading

                            ? "Saving..."

                            : "Save Interaction"

                    }

                </button>

            </form>

            <p>

                {message}

            </p>

        </div>

    );

}

export default InteractionForm;