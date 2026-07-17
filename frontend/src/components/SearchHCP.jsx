import React, { useState } from "react";
import API from "../api/api";

function SearchHCP() {

    const [doctorName, setDoctorName] = useState("");

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const searchDoctor = async () => {

        if (!doctorName.trim()) {

            setError("Please enter a doctor name.");

            return;

        }

        setLoading(true);

        setError("");

        setResults([]);

        try {

            const response = await API.get(

                "/hcp/search",

                {

                    params: {

                        doctor_name: doctorName

                    }

                }

            );

            console.log("Search Response:", response.data);

            if (

                response.data.success &&

                Array.isArray(response.data.data)

            ) {

                setResults(response.data.data);

            }

            else {

                setError(

                    response.data.message ||

                    "No Healthcare Professional found."

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

                    <p

                        style={{

                            color: "red",

                            marginBottom: "15px"

                        }}

                    >

                        {error}

                    </p>

                )

            }

            {

                !loading &&

                results.length === 0 &&

                !error && (

                    <p>

                        Search for a Healthcare Professional.

                    </p>

                )

            }

            {

                results.length > 0 && (

                    <table

                        style={{

                            width: "100%",

                            borderCollapse: "collapse"

                        }}

                    >

                        <thead>

                            <tr>

                                <th style={tableHeader}>

                                    ID

                                </th>

                                <th style={tableHeader}>

                                    Doctor Name

                                </th>

                                <th style={tableHeader}>

                                    Specialization

                                </th>

                                <th style={tableHeader}>

                                    Hospital

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                results.map((doctor) => (

                                    <tr key={doctor.id}>

                                        <td style={tableCell}>

                                            {doctor.id}

                                        </td>

                                        <td style={tableCell}>

                                            {doctor.name}

                                        </td>

                                        <td style={tableCell}>

                                            {

                                                doctor.specialization ||

                                                "-"

                                            }

                                        </td>

                                        <td style={tableCell}>

                                            {

                                                doctor.hospital ||

                                                "-"

                                            }

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

        </div>

    );

}

const tableHeader = {

    border: "1px solid #ccc",

    padding: "10px",

    backgroundColor: "#f5f5f5",

    textAlign: "left"

};

const tableCell = {

    border: "1px solid #ccc",

    padding: "10px"

};

export default SearchHCP;