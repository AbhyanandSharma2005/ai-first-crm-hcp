from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from schemas import APIResponse


# ==========================================================
# Generic Exception Handler
# ==========================================================

async def generic_exception_handler(
    request: Request,
    exc: Exception
):

    response = APIResponse(

        success=False,

        message="Internal server error.",

        data=None,

        error=str(exc)

    )

    return JSONResponse(

        status_code=500,

        content=response.model_dump()

    )


# ==========================================================
# Validation Exception Handler
# ==========================================================

async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):

    errors = exc.errors()

    message = "Validation failed."

    if errors:

        first = errors[0]

        field = first["loc"][-1]

        error_type = first["type"]

        if field == "message":

            message = "Message cannot be empty."

        elif field == "hcp_name":

            message = "HCP name is required."

        elif field == "summary":

            message = "Summary is required."

        elif field == "product":

            message = "Product is required."

        else:

            message = f"Invalid value for '{field}'."

    response = APIResponse(

        success=False,

        message=message,

        data=None,

        error="Invalid input"

    )

    return JSONResponse(

        status_code=400,

        content=response.model_dump()

    )