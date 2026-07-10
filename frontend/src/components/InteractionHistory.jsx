import React, { useEffect, useState } from "react";
import API from "../api/api";

function InteractionHistory() {

    const [interactions, setInteractions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");



    const fetchInteractions = async () => {

        try {

            setLoading(true);

            const response = await API.get("/interaction/");

            setInteractions(response.data);

            setError("");

        }

        catch (err) {

            console.error("Error fetching interactions:", err);

            setError("Unable to load interaction history.");

        }

        finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchInteractions();

    }, []);




    if (loading) {

        return (

            <div>

                <h3>Interaction History</h3>

                <p>Loading interactions...</p>

            </div>

        );

    }



    if (error) {

        return (

            <div>

                <h3>Interaction History</h3>

                <p style={{ color: "red" }}>{error}</p>

            </div>

        );

    }



    return (

        <div
            style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff"
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >

                <h2>Interaction History</h2>

                <button
                    onClick={fetchInteractions}
                    style={{
                        padding: "8px 15px",
                        cursor: "pointer"
                    }}
                >
                    Refresh
                </button>

            </div>



            {
                interactions.length === 0 ? (

                    <p>No interactions found.</p>

                ) : (

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <thead>

                            <tr>

                                <th style={tableHeader}>ID</th>

                                <th style={tableHeader}>HCP Name</th>

                                <th style={tableHeader}>Summary</th>

                                <th style={tableHeader}>Product</th>

                                <th style={tableHeader}>Follow Up</th>

                            </tr>

                        </thead>



                        <tbody>

                            {

                                interactions.map((interaction) => (

                                    <tr key={interaction.id}>

                                        <td style={tableCell}>
                                            {interaction.id}
                                        </td>

                                        <td style={tableCell}>
                                            {interaction.hcp_name}
                                        </td>

                                        <td style={tableCell}>
                                            {interaction.summary}
                                        </td>

                                        <td style={tableCell}>
                                            {interaction.product}
                                        </td>

                                        <td style={tableCell}>
                                            {interaction.follow_up}
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



export default InteractionHistory;