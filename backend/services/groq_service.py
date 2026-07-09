from groq import Groq

from config import (
    GROQ_API_KEY,
    GROQ_MODEL
)


class GroqService:

    def __init__(self):

        if not GROQ_API_KEY:
            raise ValueError(
                "GROQ_API_KEY not found."
            )

        self.client = Groq(
            api_key=GROQ_API_KEY
        )

        self.model = GROQ_MODEL

    def chat(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 1024
    ) -> str:

        completion = self.client.chat.completions.create(

            model=self.model,

            messages=[

                {
                    "role": "system",
                    "content": system_prompt
                },

                {
                    "role": "user",
                    "content": user_prompt
                }

            ],

            temperature=temperature,

            max_tokens=max_tokens

        )

        return completion.choices[0].message.content

    def health_check(self):

        return {
            "provider": "Groq",
            "model": self.model,
            "status": "Connected"
        }


groq_service = GroqService()