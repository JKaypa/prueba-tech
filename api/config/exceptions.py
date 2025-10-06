from rest_framework.views import exception_handler
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    detail = response.data.get("detail", "Something failed.")

    if response.status_code == status.HTTP_401_UNAUTHORIZED:
        response.data = {
            "error": "Unauthorized",
            "message": detail
        }

    elif response.status_code == status.HTTP_403_FORBIDDEN:
        response.data = {
            "error": "forbidden",
            "message": detail
        }

    return response
