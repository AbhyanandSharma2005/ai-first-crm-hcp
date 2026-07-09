import React from "react";

import Header from "../components/Header";

import Sidebar from "../components/Sidebar";



function Layout({ children }) {


    return (

        <div>


            <Header />


            <div
            style={{
                display:"flex"
            }}
            >


                <Sidebar />



                <main
                style={{
                    flex:1,
                    padding:"20px"
                }}
                >

                    {children}


                </main>


            </div>


        </div>

    );


}


export default Layout;