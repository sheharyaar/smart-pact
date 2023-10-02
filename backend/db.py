supabase_url = "https://dijwhvtevpfjabedbszq.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpandodnRldnBmamFiZWRic3pxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NTk4OTgxMSwiZXhwIjoyMDExNTY1ODExfQ.s2RQU2kYTVaWtrVbrMyxWwxa2vxtbDqdKeYaZpkSVgk"

from supabase import create_client, Client
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class DBUserDetailsReq(BaseModel):
    token: str
    email: str


class SupabaseAPI:
    url: str
    key: str
    client: Client

    def __init__(self):
        self.url = supabase_url
        self.key = supabase_key
        self.client: Client = create_client(self.url, self.key)

    def getUserDetails(self, req: DBUserDetailsReq):
        # TODO:  check if token is valid
        print(req.token)
        print(req.email)
        try:
            user = (
                self.client.table("user").select("*").eq("email", req.email).execute()
            )
            if user is None or user.data is None or len(user.data) == 0:
                return JSONResponse(
                    content={"message": "user is not found"},
                    status_code=400,
                    media_type="application/json",
                )

            print(user.data[0])
            return JSONResponse(
                content={
                    "first_name": user.data[0]["first_name"],
                    "last_name": user.data[0]["last_name"],
                    "email": user.data[0]["email"],
                    "profile_img": user.data[0]["profile_img"],
                },
                status_code=200,
                media_type="application/json",
            )
        except Exception as e:
            print(e)
            return JSONResponse(
                content={"message": "error"},
                status_code=400,
                media_type="application/json",
            )
