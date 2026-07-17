import React, { useState } from "react";
import API from "../api/api";

function ChatBox() {

    const [message, setMessage] = useState("");

    const [chatMessages, setChatMessages] = useState([]);

    const [loading, setLoading] = useState(false);



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

    const currentMessage = message;

    setMessage("");

    setLoading(true);

    try {

        const response = await API.post(
            "/chat/",
            {
                session_id: "frontend-session",
                message: currentMessage
            }
        );

        console.log("Chat Response:", response.data);

        let aiResponse = "";

        if (response.data.response) {

            aiResponse = response.data.response;

        }

        else if (response.data.final_response) {

            aiResponse = response.data.final_response;

        }

        else if (response.data.message) {

            aiResponse = response.data.message;

        }

        else {

            aiResponse = JSON.stringify(response.data);

        }

        const aiMessage = {

            sender: "AI Assistant",

            text: aiResponse

        };

        setChatMessages((previous) => [

            ...previous,

            aiMessage

        ]);

    }

    catch (error) {

        console.error("Chat API Error:", error);

        setChatMessages((previous) => [

            ...previous,

            {

                sender: "AI Assistant",

                text:
                    error.response?.data?.message ||
                    "Unable to connect with AI service."

            }

        ]);

    }

    finally {

        setLoading(false);

    }

};



    return (

        <div
            style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px"
            }}
        >

            <h3>
                AI CRM Assistant
            </h3>



            <div
                style={{
                    height: "300px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: "10px",
                    marginBottom: "15px"
                }}
            >

                {
                    chatMessages.map(

                        (msg, index) => (

                            <div
                                key={index}
                                style={{
                                    marginBottom: "12px"
                                }}
                            >

                                <strong>

                                    {msg.sender}

                                </strong>

                                <br />

                                <span>

                                    {msg.text}

                                </span>

                            </div>

                        )

                    )
                }

                {

                    loading && (

                        <p>

                            <em>

                                AI Assistant is typing...

                            </em>

                        </p>

                    )

                }

            </div>



            <input

                type="text"

                placeholder="Ask AI CRM Assistant..."

                value={message}

                onChange={(e) =>

                    setMessage(e.target.value)

                }

                onKeyDown={(e) => {

                    if (e.key === "Enter") {

                        sendMessage();

                    }

                }}

                disabled={loading}

                style={{

                    width: "80%",

                    padding: "10px"

                }}

            />



            <button

                onClick={sendMessage}

                disabled={loading}

                style={{

                    padding: "10px",

                    marginLeft: "10px"

                }}

            >

                {

                    loading

                        ? "Sending..."

                        : "Send"

                }

            </button>

        </div>

    );

}

export default ChatBox;