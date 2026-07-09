import React, { useState } from "react";
import API from "../api/api";


function ChatBox() {

    const [message, setMessage] = useState("");

    const [chatMessages, setChatMessages] = useState([]);


    const sendMessage = async () => {

        if (!message.trim()) {
            return;
        }


        const userMessage = {
            sender: "You",
            text: message
        };


        setChatMessages((previous) => [
            ...previous,
            userMessage
        ]);



        try {

            const response = await API.post(
                "/chat/",
                {
                    message: message
                }
            );


            const aiMessage = {

                sender: "AI Assistant",

                text: response.data.response

            };


            setChatMessages((previous) => [

                ...previous,

                aiMessage

            ]);


        } 
        
        catch (error) {


            console.error(
                "Chat API Error:",
                error
            );


            setChatMessages((previous) => [

                ...previous,

                {

                    sender: "AI Assistant",

                    text:
                    "Unable to connect with AI service."

                }

            ]);

        }


        setMessage("");

    };



    return (

        <div
        style={{
            border:"1px solid #ccc",
            padding:"20px",
            borderRadius:"10px"
        }}
        >


            <h3>
                AI CRM Assistant
            </h3>



            <div
            style={{
                height:"250px",
                overflowY:"auto",
                border:"1px solid #ddd",
                padding:"10px",
                marginBottom:"15px"
            }}
            >


                {
                    chatMessages.map(
                        (msg,index)=>(

                            <div key={index}>

                                <strong>
                                    {msg.sender}
                                </strong>

                                :

                                <span>
                                    {" "}
                                    {msg.text}
                                </span>

                            </div>

                        )
                    )
                }


            </div>



            <input

            type="text"

            placeholder=
            "Ask AI CRM Assistant..."

            value={message}


            onChange={
                (e)=>
                setMessage(
                    e.target.value
                )
            }


            onKeyDown={
                (e)=>{

                    if(e.key==="Enter")
                    {
                        sendMessage();
                    }

                }
            }


            style={{
                width:"80%",
                padding:"10px"
            }}

            />



            <button

            onClick={sendMessage}

            style={{
                padding:"10px",
                marginLeft:"10px"
            }}

            >

                Send

            </button>



        </div>

    );

}


export default ChatBox;