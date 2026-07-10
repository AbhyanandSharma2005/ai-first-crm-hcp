from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from routes import interaction, chat



app = FastAPI(
    title="AI First CRM HCP API"
)



app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_methods=["*"],

    allow_headers=["*"]

)



app.include_router(
    interaction.router
)


app.include_router(
    chat.router
)



@app.get("/")
def home():

    return {

        "message":
        "AI CRM Backend Running"

    }