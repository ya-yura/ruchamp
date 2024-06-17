from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.datastructures import UploadFile


class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_upload_size: int):
        super().__init__(app)
        self.max_upload_size = max_upload_size

    async def dispatch(self, request: Request, call_next):
        if request.url.path == "/uploadfile/" and request.method == "POST":
            size = 0
            async for chunk in request.stream():
                size += len(chunk)
                if size > self.max_upload_size:
                    return Response("File size exceeds limit", status_code=413)
        response = await call_next(request)
        return response