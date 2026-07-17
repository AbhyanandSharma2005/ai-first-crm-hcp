import React, { useEffect, useState } from "react";
import API from "../api/api";

function Metrics() {

    const [metrics, setMetrics] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const fetchMetrics = async (isRefresh = false) => {

        try {

            if (isRefresh) {

                setRefreshing(true);

            }

            else {

                setLoading(true);

            }

            const response = await API.get("/metrics");

            console.log("Metrics:", response.data);

            if (

                response.data.success &&

                response.data.data

            ) {

                setMetrics(response.data.data);

                setError("");

            }

            else {

                setMetrics(null);

                setError(

                    response.data.message ||

                    "Unable to load metrics."

                );

            }

        }

        catch (err) {

            console.error(err);

            setMetrics(null);

            setError(

                err.response?.data?.message ||

                "Unable to fetch metrics."

            );

        }

        finally {

            setLoading(false);

            setRefreshing(false);

        }

    };

    useEffect(() => {

        fetchMetrics();

        const interval = setInterval(() => {

            fetchMetrics();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    if (loading) {

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

                <h2>Application Metrics</h2>

                <p>Loading metrics...</p>

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
                backgroundColor: "#ffffff"
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

                <h2>Application Metrics</h2>

                <button

                    onClick={() => fetchMetrics(true)}

                    disabled={refreshing}

                    style={{
                        padding: "10px 18px",
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

                error && (

                    <p
                        style={{
                            color: "red"
                        }}
                    >

                        {error}

                    </p>

                )

            }

            {

                metrics && (

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <tbody>

                            <tr>

                                <th style={tableHeader}>
                                    Total Interactions
                                </th>

                                <td style={tableCell}>
                                    {metrics.total_interactions}
                                </td>

                            </tr>

                            <tr>

                                <th style={tableHeader}>
                                    Total Healthcare Professionals
                                </th>

                                <td style={tableCell}>
                                    {metrics.total_hcps}
                                </td>

                            </tr>

                            <tr>

                                <th style={tableHeader}>
                                    Application Status
                                </th>

                                <td style={tableCell}>
                                    {metrics.status}
                                </td>

                            </tr>

                            <tr>

                                <th style={tableHeader}>
                                    Environment
                                </th>

                                <td style={tableCell}>
                                    {metrics.environment}
                                </td>

                            </tr>

                            <tr>

                                <th style={tableHeader}>
                                    API
                                </th>

                                <td style={tableCell}>
                                    {metrics.api}
                                </td>

                            </tr>

                            <tr>

                                <th style={tableHeader}>
                                    Version
                                </th>

                                <td style={tableCell}>
                                    {metrics.version}
                                </td>

                            </tr>

                        </tbody>

                    </table>

                )

            }

        </div>

    );

}

const tableHeader = {

    border: "1px solid #ccc",

    padding: "12px",

    backgroundColor: "#f5f5f5",

    textAlign: "left",

    width: "35%"

};

const tableCell = {

    border: "1px solid #ccc",

    padding: "12px"

};

export default Metrics;