import { useEffect, useState } from "react";

import API from "../api/api";

function DashboardAnalytics({

    onDataLoaded

}) {

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

                response.data.success

            ) {

                setStats(

                    response.data.data

                );

                if (

                    onDataLoaded

                ) {

                    onDataLoaded(

                        response.data.data

                    );

                }

            }

            else {

                setError(

                    response.data.message ||

                    "Unable to load dashboard."

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

            <p>

                Loading Dashboard Analytics...

            </p>

        );

    }

    if (error) {

        return (

            <div>

                <p style={{ color: "red" }}>

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

    return (

        <div>

            <h2>

                Dashboard Analytics

            </h2>

            <table

                style={{

                    width: "100%",

                    borderCollapse: "collapse"

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

                    <tr>

                        <td style={tableHeader}>

                            Products

                        </td>

                        <td style={tableCell}>

                            {

                                Object.entries(

                                    stats.products

                                ).map(

                                    ([product, count]) => (

                                        <div

                                            key={product}

                                        >

                                            {product} : {count}

                                        </div>

                                    )

                                )

                            }

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    );

}

const tableHeader = {

    border: "1px solid #ddd",

    padding: "10px",

    backgroundColor: "#f5f5f5",

    fontWeight: "bold",

    width: "250px"

};

const tableCell = {

    border: "1px solid #ddd",

    padding: "10px"

};

export default DashboardAnalytics;