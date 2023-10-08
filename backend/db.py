from supabase import create_client, Client
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from s3 import AwsService
from typing import Annotated
import os
import io
from fastapi import Form, UploadFile


class DBDeletePdfReq(BaseModel):
    user_id: str
    pdf_id: str


class DBSavePdfReq(BaseModel):
    user_id: str
    pdf_id: str
    json_diff: str


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

    def __init__(self, aws_service: AwsService):
        self.aws_service = aws_service
        self.url = os.environ.get("SUPABASE_URL")
        self.key = os.environ.get("SUPABASE_KEY")
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
                .select("pdf_id, role, pdf(pdf_name)")
                .eq("user_id", req.user_id)
                .eq("pdf_id", req.pdf_id)
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

            f = io.BytesIO()
            print("json_path : ", json_path)
            try:
                self.aws_service.s3.download_fileobj(
                    self.aws_service.bucket_name, json_path, f
                )
            except Exception as e:
                print("Error in fetching json : ", e)
                # send without json if not found
                return JSONResponse(
                    content={
                        "pdf_url": pdf_file["downloadUrl"],
                        "diff_json": None,
                        "pdf_name": data[1][0]["pdf"]["pdf_name"],
                        "role": data[1][0]["role"],
                    },
                    status_code=200,
                    media_type="application/json",
                )

            f.seek(0)
            json_text = f.read().decode("utf-8")
            print("JSON Text", json_text)
            return JSONResponse(
                content={
                    "pdf_url": pdf_file["downloadUrl"],
                    "diff_json": json_text,
                    "pdf_name": data[1][0]["pdf"]["pdf_name"],
                    "role": data[1][0]["role"],
                },
                status_code=200,
                media_type="application/json",
            )

        except Exception as e:
            print("Execption in fetching PDF : ", e)
            return JSONResponse(
                content={"message": "error"},
                status_code=400,
                media_type="application/json",
            )

    def DBCreatePdf(self, req: DBPdfCreateReq) -> JSONResponse:
        try:
            # create a db entry in pdf
            # returns the pdf_id creader
            print("Creating pdf entry", req.user_id)
            pdf_name = req.pdf_name
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

            return self.DBCreatePdf(new_req)
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
        # check if the file name has pdf extension
        if file_name.endswith(".pdf"):
            file_name = file_name[:-4]

        # save the file and call create pdf
        path = "./temp/" + user_id + "_" + file_name + ".pdf"

        try:
            open(path, "wb").write(file.file.read())
            new_req = DBPdfCreateReq(
                user_id=user_id,
                pdf_name=file_name,
                pdf_path=path,
            )
            resp = self.DBCreatePdf(new_req)
            # remove the created file
            os.remove(path)
            return resp
        except Exception as e:
            print("Execption in uploading PDF : ", e)
            return JSONResponse(
                content={"message": "error in uploading file"},
                status_code=400,
                media_type="application/json",
            )

    def SavePdf(self, req: DBSavePdfReq) -> JSONResponse:
        # Check if we have save permission (editor)
        try:
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

            path = self.aws_service.pdf_prefix + req.pdf_id + "/"
            json_path = path + req.pdf_id + ".json"
            f = io.BytesIO(req.json_diff.encode("utf-8"))

            if self.aws_service.UploadObject(f, json_path, "application/json", False):
                # fetch the pdf, json from s3 and send the url
                return JSONResponse(
                    content={"message": "success"},
                    status_code=200,
                    media_type="application/json",
                )
            else:
                return JSONResponse(
                    content={"message": "error in saving file"},
                    status_code=400,
                    media_type="application/json",
                )

        except Exception as e:
            print("Execption in saving PDF : ", e)
            return JSONResponse(
                content={"message": "error in saving file"},
                status_code=400,
                media_type="application/json",
            )
        # Save to s3
        pass

    def PublishPdf(
        self,
        file: Annotated[UploadFile, Form()],
        pdf_id: Annotated[str, Form()],
        user_id: Annotated[str, Form()],
    ) -> JSONResponse:
        # save the file and call create pdf
        path = "./temp/" + user_id + "_" + pdf_id + ".pdf"
        # check if the file name has pdf extension

        try:
            open(path, "wb").write(file.file.read())
            if self.aws_service.UploadFile(
                path,
                self.aws_service.pdf_prefix + pdf_id + "/" + pdf_id + ".pdf",
                "application/pdf",
                False,
            ):
                # remove the created file
                os.remove(path)
                # remove json
                self.aws_service.s3.delete_object(
                    Bucket=self.aws_service.bucket_name,
                    Key=self.aws_service.pdf_prefix + pdf_id + "/" + pdf_id + ".json",
                )

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
            print("Execption in uploading PDF : ", e)
            return JSONResponse(
                content={"message": "error in uploading file"},
                status_code=400,
                media_type="application/json",
            )

    def SaveThumbnail(self) -> JSONResponse:
        pass

    def DeletePdf(self, req: DBDeletePdfReq) -> JSONResponse:
        # check if the user_id is the creator
        try:
            data, error = (
                self.client.table("pdf")
                .select("pdf_id, created_by")
                .eq("pdf_id", req.pdf_id)
                .eq("created_by", req.user_id)
                .execute()
            )

            if data[1] is None:
                return JSONResponse(
                    content={"message": "pdf is not found"},
                    status_code=400,
                    media_type="application/json",
                )

            if error[1] is not None:
                print("Error in fetching pdf info : ", error)
                return JSONResponse(
                    content={"message": "error"},
                    status_code=400,
                    media_type="application/json",
                )

            # delete from db
            data, error = (
                self.client.table("pdf")
                .delete()
                .eq("pdf_id", req.pdf_id)
                .eq("created_by", req.user_id)
                .execute()
            )
            # delete from S3

            path = self.aws_service.pdf_prefix + req.pdf_id + "/"
            print("Delete Path : ", path)
            self.aws_service.DeleteFolder(path)

            return JSONResponse(
                content={"message": "success"},
                status_code=200,
                media_type="application/json",
            )

        except Exception as e:
            print("Execption in deleting PDF : ", e)
            return JSONResponse(
                content={"message": "error in deleting file"},
                status_code=400,
                media_type="application/json",
            )
