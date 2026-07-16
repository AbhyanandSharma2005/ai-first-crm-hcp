import time

from starlette.middleware.base import BaseHTTPMiddleware

from utils.logger import logger


class LoggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):

        start = time.time()

        response = await call_next(request)

        duration = round(time.time() - start, 3)

        logger.info(
            f"{request.method} {request.url.path} "
            f"{response.status_code} "
            f"{duration}s"
        )

        return response