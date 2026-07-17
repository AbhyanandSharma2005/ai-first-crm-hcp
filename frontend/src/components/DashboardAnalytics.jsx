import { useEffect, useState } from "react";

import API from "../api/api";
import ProductChart from "./ProductChart";

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
                    marginTop: "20px",
                    textAlign: "center"
                }}
            >

                <h3>Loading Dashboard Analytics...</h3>

            </div>

        );

    }

    if (error) {

        return (

            <div
                style={{
                    marginTop: "20px"
                }}
            >

                <p
                    style={{
                        color: "red"
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

            <h2>

                Dashboard Analytics

            </h2>

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

            <ProductChart
                products={stats.products}
            />

        </div>

    );

}

const tableHeader = {

    border: "1px solid #ddd",

    padding: "12px",

    backgroundColor: "#f5f5f5",

    fontWeight: "bold",

    width: "250px"

};

const tableCell = {

    border: "1px solid #ddd",

    padding: "12px"

};

export default DashboardAnalytics;