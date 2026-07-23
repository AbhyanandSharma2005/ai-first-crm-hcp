import React from "react";

import {
    Routes,
    Route
}
from "react-router-dom";


import Dashboard from "../pages/Dashboard";
import LogInteraction from "../pages/LogInteraction";
import ChatScreen from "../pages/ChatScreen";



function AppRoutes(){


    return (

        <Routes>


            <Route

            path="/"

            element={
                <Dashboard />
            }

            />



            <Route

            path="/log-interaction"

            element={
                <LogInteraction />
            }

            />

            <Route

            path="/chat"

            element={
                <ChatScreen />
            }

            />

        </Routes>

    );

}



export default AppRoutes;