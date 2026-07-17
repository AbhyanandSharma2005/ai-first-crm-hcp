import React, { useEffect, useState } from "react";

import API from "../api/api";

import EditInteraction from "./EditInteraction";

function InteractionHistory() {

    const [interactions, setInteractions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [selectedInteraction, setSelectedInteraction] = useState(null);

    const [showEdit, setShowEdit] = useState(false);



    const fetchInteractions = async (isRefresh = false) => {

        try {

            if (isRefresh) {

                setRefreshing(true);

            }

            else {

                setLoading(true);

            }

            const response = await API.get("/interaction/");

            console.log("Interaction History:", response.data);

            if (Array.isArray(response.data)) {

                setInteractions(response.data);

            }

            else if (Array.isArray(response.data.data)) {

                setInteractions(response.data.data);

            }

            else {

                setInteractions([]);

            }

            setError("");

        }

        catch (err) {

            console.error("Error fetching interactions:", err);

            setError(

                err.response?.data?.message ||

                "Unable to load interaction history."

            );

        }

        finally {

            setLoading(false);

            setRefreshing(false);

        }

    };



    useEffect(() => {

        fetchInteractions();

    }, []);




    const openEdit = (interaction) => {

        setSelectedInteraction(interaction);

        setShowEdit(true);

    };



    const closeEdit = () => {

        setSelectedInteraction(null);

        setShowEdit(false);

    };




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

                <p style={{ color: "red" }}>

                    {error}

                </p>

                <button

                    onClick={() => fetchInteractions()}

                    style={{

                        marginTop: "10px",

                        padding: "8px 15px"

                    }}

                >

                    Retry

                </button>

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

                    onClick={() => fetchInteractions(true)}

                    disabled={refreshing}

                    style={{

                        padding: "8px 15px",

                        cursor: "pointer"

                    }}

                >

                    {

                        refreshing

                            ? "Refreshing..."

                            : "Refresh"

                    }

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

                                <th style={tableHeader}>Action</th>

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

                                            {

                                                interaction.follow_up

                                                    ? interaction.follow_up.substring(0, 10)

                                                    : "-"

                                            }

                                        </td>

                                        <td style={tableCell}>

                                            <button

                                                onClick={() => openEdit(interaction)}

                                            >

                                                Edit

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }



            {

                showEdit && (

                    <EditInteraction

                        interaction={selectedInteraction}

                        onClose={closeEdit}

                        onUpdate={fetchInteractions}

                    />

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