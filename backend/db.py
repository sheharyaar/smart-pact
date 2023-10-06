supabase_url = "https://dijwhvtevpfjabedbszq.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpandodnRldnBmamFiZWRic3pxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NTk4OTgxMSwiZXhwIjoyMDExNTY1ODExfQ.s2RQU2kYTVaWtrVbrMyxWwxa2vxtbDqdKeYaZpkSVgk"

from supabase import create_client, Client
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from s3 import AwsUploadService
from typing import Annotated
import os
from fastapi import Form, UploadFile


class DBPdfListReq(BaseModel):
    user_id: str


class DBPdfReq(BaseModel):
    user_id: str
    pdf_id: str


class DBPdfCreateReq(BaseModel):
    user_id: str
    pdf_name: str
    pdf_path: str


class DBEmptyPdfReq(BaseModel):
    user_id: str
    pdf_name: str


class SupabaseAPI:
    url: str
    key: str
    client: Client

    def __init__(self, aws_service: AwsUploadService):
        self.aws_service = aws_service
        self.url = supabase_url
        self.key = supabase_key
        self.client: Client = create_client(self.url, self.key)

    """
    Fetch PDF List
    JSON Response : 200 else 400 on error
    {
        list : [
            pdf_name : string,
            pdf_thumbnail : 
            last_updated_at : string,
            is_starred : boolean,
        ]
    }
    """

    def FetchPdflist(self, req: DBPdfListReq) -> JSONResponse:
        try:
            user = (
                self.client.table("global_pdf")
                .select(
                    "pdf_id, user_id, starred, role, pdf(created_by, pdf_name, pdf_thumbnail)"
                )
                .eq("user_id", req.user_id)
                .execute()
            )
            if user is None or user.data is None or len(user.data) == 0:
                return JSONResponse(
                    content=None,
                    status_code=200,
                    media_type="application/json",
                )

            return JSONResponse(
                content={"pdf_list": user.data},
                status_code=200,
                media_type="application/json",
            )

        except Exception as e:
            print("Execption in fetching PDF List : ", e)
            return JSONResponse(
                content={"message": "error"},
                status_code=400,
                media_type="application/json",
            )

    """
    Fetch PDF by ID
    JSON Response : 200 else 400 on error
    {
        pdf_url : string ,
        diff_json : JSON
    }
    """

    def FetchPdfById(self, req: DBPdfReq) -> JSONResponse:
        try:
            # verify if the pdf_id exists and the
            # user_id has the role of an editor
            data, error = (
                self.client.table("global_pdf")
                .select("pdf_id, pdf(pdf_name)")
                .eq("user_id", req.user_id)
                .eq("pdf_id", req.pdf_id)
                .eq("role", "editor")
                .execute()
            )
            if data[1] is None:
                return JSONResponse(
                    content={"message": "pdf is not found"},
                    status_code=400,
                    media_type="application/json",
                )

            if error[1] is not None:
                print("Error in fetching pdf : ", error)
                return JSONResponse(
                    content={"message": "error"},
                    status_code=400,
                    media_type="application/json",
                )

            # fetch the pdf, json from s3 and send the url
            pathprefix = self.aws_service.pdf_prefix + req.pdf_id + "/"
            pdf_path = pathprefix + req.pdf_id + ".pdf"
            json_path = pathprefix + req.pdf_id + ".json"
            pdf_file = self.aws_service.FetchFileURL(object_name=pdf_path)
            print("pdf_file : ", pdf_file["downloadUrl"])
            if pdf_file is None:
                return JSONResponse(
                    content={"message": "error in fetching pdf"},
                    status_code=400,
                    media_type="application/json",
                )

            json_file = self.aws_service.FetchFileURL(object_name=json_path)
            print("json_file : ", json_file["downloadUrl"])
            if json_file is None:
                return JSONResponse(
                    content={
                        "pdf_url": pdf_file["downloadUrl"],
                        "diff_json": None,
                        "pdf_name": data[1][0]["pdf"]["pdf_name"],
                    },
                    status_code=200,
                    media_type="application/json",
                )

            return JSONResponse(
                content={
                    "pdf_url": pdf_file["downloadUrl"],
                    "diff_json": json_file["downloadUrl"],
                    "pdf_name": data[1][0]["pdf"]["pdf_name"],
                },
                status_code=200,
                media_type="application/json",
            )

        except Exception as e:
            print("Execption in fetching PDF List : ", e)
            return JSONResponse(
                content={"message": "error"},
                status_code=400,
                media_type="application/json",
            )

    def CreatePdf(self, req: DBPdfCreateReq) -> JSONResponse:
        try:
            # create a db entry in pdf
            # returns the pdf_id creader
            print("Creating pdf entry", req.user_id)
            pdf_name = req.pdf_name + ".pdf"
            data, count = self.client.rpc(
                "create_pdf", {"req_user_id": req.user_id, "req_pdf_name": pdf_name}
            ).execute()

            pdf_id = data[1]

            if count[1] is not None:
                print("Error in creating pdf entry ")
                return JSONResponse(
                    content={"message": "error"},
                    status_code=400,
                    media_type="application/json",
                )

            if self.aws_service.UploadFile(
                req.pdf_path,
                self.aws_service.pdf_prefix + pdf_id + "/" + pdf_id + ".pdf",
                "application/pdf",
                False,
            ):
                return JSONResponse(
                    content={"pdf_id": pdf_id},
                    status_code=200,
                    media_type="application/json",
                )
            else:
                # TODO: remove pdf entry from db

                return JSONResponse(
                    content={"message": "error in uploading file"},
                    status_code=400,
                    media_type="application/json",
                )
        except Exception as e:
            print("Execption in creating pdf : ", e)
            return JSONResponse(
                content={"message": "error"},
                status_code=400,
                media_type="application/json",
            )

    def CreateEmptyPdf(self, req: DBEmptyPdfReq) -> JSONResponse:
        try:
            pdf_path = "./assets/empty.pdf"
            new_req = DBPdfCreateReq(
                user_id=req.user_id,
                pdf_name=req.pdf_name,
                pdf_path=pdf_path,
            )

            return self.CreatePdf(new_req)
        except Exception as e:
            print("Execption in creating empty pdf : ", e)
            return JSONResponse(
                content={"message": "error"},
                status_code=400,
                media_type="application/json",
            )

    def CreateUploadPdf(
        self,
        file: Annotated[UploadFile, Form()],
        file_name: Annotated[str, Form()],
        user_id: Annotated[str, Form()],
    ) -> JSONResponse:
        # save the file and call create pdf
        path = "./temp/" + user_id + "_" + file_name
        # check if the file name has pdf extension
        if not file_name.endswith(".pdf"):
            path = path + ".pdf"

        try:
            open(path, "wb").write(file.file.read())
            new_req = DBPdfCreateReq(
                user_id=user_id,
                pdf_name=file_name,
                pdf_path=path,
            )
            resp = self.CreatePdf(new_req)
            # remove the created file
            os.remove(path)
            return resp
        except:
            return JSONResponse(
                content={"message": "error in uploading file"},
                status_code=400,
                media_type="application/json",
            )
