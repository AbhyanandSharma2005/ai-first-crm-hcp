from pydantic import BaseModel

from datetime import date



class InteractionCreate(BaseModel):

    hcp_name:str

    summary:str

    product:str

    follow_up:date