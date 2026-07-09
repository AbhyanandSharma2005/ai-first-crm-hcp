import React from "react";


import InteractionForm from "../components/InteractionForm";

import ChatBox from "../components/ChatBox";

import InteractionHistory from "../components/InteractionHistory";



function LogInteraction(){


    return (

        <div
        style={{
            padding:"20px"
        }}
        >


            <h1>
                Log HCP Interaction
            </h1>



            <p>
                Record healthcare professional interactions
                using structured form or AI assistant.
            </p>



            <hr />



            <section>

                <h2>
                    Structured Interaction Form
                </h2>


                <InteractionForm />

            </section>



            <hr />



            <section>

                <h2>
                    AI Conversational Assistant
                </h2>


                <ChatBox />


            </section>



            <hr />



            <section>

                <h2>
                    Interaction History
                </h2>


                <InteractionHistory />


            </section>



        </div>

    );

}


export default LogInteraction;