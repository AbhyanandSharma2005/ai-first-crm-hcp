import { useEffect, useState } from "react";

import API from "../api/api";
import ProductPieChart from "./ProductPieChart";

function DashboardAnalytics({ onDataLoaded }) {

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [stats, setStats] = useState(null);

    const fetchDashboardStats = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await API.get(
                "/dashboard/stats"
            );

            console.log(
                "Dashboard Stats:",
                response.data
            );

            if (
                response.data.success &&
                response.data.data
            ) {

                setStats(
                    response.data.data
                );

                if (onDataLoaded) {

                    onDataLoaded(
                        response.data.data
                    );

                }

            }

            else {

                setError(
                    response.data.message ||
                    "Unable to load dashboard analytics."
                );

            }

        }

        catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch dashboard analytics."
            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchDashboardStats();

    }, []);

    if (loading) {

        return (

            <div
                style={{
                    marginTop: "30px",
                    textAlign: "center"
                }}
            >

                <h3>

                    Loading Dashboard Analytics...

                </h3>

            </div>

        );

    }

    if (error) {

        return (

            <div
                style={{
                    marginTop: "30px",
                    textAlign: "center"
                }}
            >

                <p
                    style={{
                        color: "red",
                        marginBottom: "15px"
                    }}
                >

                    {error}

                </p>

                <button

                    onClick={fetchDashboardStats}

                >

                    Retry

                </button>

            </div>

        );

    }

    if (!stats) {

        return null;

    }

    return (

        <div
            style={{
                marginTop: "30px"
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

                <h2>

                    Dashboard Analytics

                </h2>

                <button

                    onClick={fetchDashboardStats}

                >

                    Refresh

                </button>

            </div>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "30px"
                }}
            >

                <tbody>

                    <tr>

                        <td style={tableHeader}>

                            Total HCPs

                        </td>

                        <td style={tableCell}>

                            {stats.total_hcps}

                        </td>

                    </tr>

                    <tr>

                        <td style={tableHeader}>

                            Total Interactions

                        </td>

                        <td style={tableCell}>

                            {stats.total_interactions}

                        </td>

                    </tr>

                </tbody>

            </table>

            <ProductPieChart

                products={stats.products}

            />

            <h2
                style={{
                    marginTop: "40px",
                    marginBottom: "15px"
                }}
            >

                Recent Interactions

            </h2>

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

                            HCP Name

                        </th>

                        <th style={tableHeader}>

                            Product

                        </th>

                        <th style={tableHeader}>

                            Summary

                        </th>

                        <th style={tableHeader}>

                            Follow Up

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        stats.recent_interactions &&
                        stats.recent_interactions.length > 0 ?

                        (

                            stats.recent_interactions.map(

                                (interaction) => (

                                    <tr
                                        key={interaction.id}
                                    >

                                        <td style={tableCell}>

                                            {interaction.id}

                                        </td>

                                        <td style={tableCell}>

                                            {interaction.hcp_name}

                                        </td>

                                        <td style={tableCell}>

                                            {interaction.product}

                                        </td>

                                        <td style={tableCell}>

                                            {interaction.summary}

                                        </td>

                                        <td style={tableCell}>

                                            {

                                                interaction.follow_up ||

                                                "-"

                                            }

                                        </td>

                                    </tr>

                                )

                            )

                        )

                        :

                        (

                            <tr>

                                <td

                                    colSpan={5}

                                    style={tableCell}

                                >

                                    No recent interactions found.

                                </td>

                            </tr>

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

const tableHeader = {

    border: "1px solid #ddd",

    padding: "12px",

    backgroundColor: "#1976d2",

    color: "white",

    fontWeight: "bold",

    textAlign: "left"

};

const tableCell = {

    border: "1px solid #ddd",

    padding: "12px",

    textAlign: "left"

};

export default DashboardAnalytics;