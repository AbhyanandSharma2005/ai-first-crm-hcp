import React, { useState } from "react";
import API from "../api/api";

function SearchHCP() {

    const [doctorName, setDoctorName] = useState("");

    const [result, setResult] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");



    const searchDoctor = async () => {

        if (!doctorName.trim()) {

            setError("Please enter a doctor name.");

            return;

        }

        setLoading(true);

        setError("");

        setResult("");

        try {

            const response = await API.get(

                "/hcp/search",

                {

                    params: {

                        session_id: "frontend-session",

                        doctor_name: doctorName

                    }

                }

            );

            console.log(response.data);

            if (

                response.data.success &&

                response.data.data

            ) {

                setResult(

                    response.data.data.response

                );

            }

            else {

                setError(

                    response.data.message ||

                    "Doctor not found."

                );

            }

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.message ||

                "Unable to search Healthcare Professional."

            );

        }

        finally {

            setLoading(false);

        }

    };



    return (

        <div

            style={{

                marginTop: "20px",

                padding: "20px",

                border: "1px solid #ddd",

                borderRadius: "8px",

                backgroundColor: "#ffffff"

            }}

        >

            <h2>

                Search Healthcare Professional

            </h2>



            <div

                style={{

                    display: "flex",

                    gap: "10px",

                    marginBottom: "20px"

                }}

            >

                <input

                    type="text"

                    placeholder="Enter Doctor Name"

                    value={doctorName}

                    onChange={(e) =>

                        setDoctorName(

                            e.target.value

                        )

                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            searchDoctor();

                        }

                    }}

                    style={{

                        flex: 1,

                        padding: "10px"

                    }}

                />



                <button

                    onClick={searchDoctor}

                    disabled={loading}

                    style={{

                        padding: "10px 20px"

                    }}

                >

                    {

                        loading

                            ? "Searching..."

                            : "Search"

                    }

                </button>

            </div>



            {

                error && (

                    <div

                        style={{

                            color: "red",

                            marginTop: "10px"

                        }}

                    >

                        {error}

                    </div>

                )

            }



            {

                result && (

                    <div

                        style={{

                            marginTop: "20px",

                            padding: "15px",

                            backgroundColor: "#f8f9fa",

                            border: "1px solid #ddd",

                            borderRadius: "8px"

                        }}

                    >

                        <h3>

                            Search Result

                        </h3>

                        <p>

                            {result}

                        </p>

                    </div>

                )

            }

        </div>

    );

}

export default SearchHCP;