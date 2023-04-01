import asyncio
from collections import OrderedDict

def update_changepath(func):
    async def wrapper(*args, **kwargs):
        data = await func(*args, **kwargs)
        async def inner(data):
            for key, value in data.items():
                try:
                    value = data[key]
                    path = "http://localhost:8000"
                    is_mediafile = "/media" in value
                    if isinstance(value, dict) or isinstance(value, OrderedDict):
                        await inner(value)
                    elif(is_mediafile):
                        data[key] = path + value
                except:
                    pass
            return data
        data = await inner(data)
        return data
    return wrapper