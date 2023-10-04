supabase_url = "https://dijwhvtevpfjabedbszq.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpandodnRldnBmamFiZWRic3pxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NTk4OTgxMSwiZXhwIjoyMDExNTY1ODExfQ.s2RQU2kYTVaWtrVbrMyxWwxa2vxtbDqdKeYaZpkSVgk"

from supabase import create_client, Client
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class DBPdfListReq(BaseModel):
    user_id: str


class SupabaseAPI:
    url: str
    key: str
    client: Client

    def __init__(self):
        self.url = supabase_url
        self.key = supabase_key
        self.client: Client = create_client(self.url, self.key)

    def FetchPdflist(self, req: DBPdfListReq) -> JSONResponse:
        try:
            user = (
                self.client.table("global_pdf")
                .select("*")
                .eq("user_id", req.user_id)
                .execute()
            )
            if user is None or user.data is None or len(user.data) == 0:
                return JSONResponse(
                    content={"message": "user is not found"},
                    status_code=400,
                    media_type="application/json",
                )

            print(user.data)
            return JSONResponse(
                content={user.data},
                status_code=200,
                media_type="application/json",
            )

        except Exception as e:
            return JSONResponse(
                content={"message": "error"},
                status_code=400,
                media_type="application/json",
            )
