from services.redis_service import redis_service

redis_service.set(

    "crm",

    {

        "status": "running"

    }

)

print(

    redis_service.get("crm")

)