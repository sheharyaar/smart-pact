import os
from typing import Annotated, List, Dict
from fastapi import FastAPI, Form, UploadFile, Request
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sign import (
    OauthTokenRequest,
    SignTemplateListRequest,
    SignTemplateRequest,
    DropboxSign,
)
from ai import AIGenerateRequest, AIService, AIAnalyseRequest
from db import (
    SupabaseAPI,
    DBPdfListReq,
    DBPdfReq,
    DBEmptyPdfReq,
    DBSavePdfReq,
    DBDeletePdfReq,
)
from s3 import AwsService

# Environment variables
required_env = [
      "SUPABASE_URL",
      "SUPABASE_KEY",
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_REGION_NAME",
      "AWS_BUCKET_NAME",
      "DROPBOX_SIGN_CLIENT_ID",
      "DROPBOX_SIGN_CLIENT_SECRET"
]

signApi = None
aiApi = None
supabaseApi = None
awsService = None


# lifespan handling for initialising APIs
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Loading functions
    print("Running startup functions")

    # Ensure all environment variables are set  
    for env in required_env:
        if env not in os.environ:
            raise Exception(f"Environment variable {env} not set")
        
    # Ensure the folder exists; create it if it doesn't
    if not os.path.exists("./temp"):
        os.makedirs("./temp")

    global awsService
    awsService = AwsService()

    global supabaseApi
    supabaseApi = SupabaseAPI(aws_service=awsService)

    global signApi
    signApi = DropboxSign(aws_service=awsService, db_service=supabaseApi)

    global aiApi
    aiApi = AIService()

    yield
    # Clean up functions
    print("Running shutdown functions")


app = FastAPI(lifespan=lifespan)

# Cors handling
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def root():
    return {"message": "Hello World"}


# Dropbox Sign API endpoints
@app.post("/api/helloSign/oauthToken")
async def signOauthToken(req: OauthTokenRequest) -> JSONResponse:
    if req.code is None or req.state is None:
        return JSONResponse(
            content={"message": "code or state is empty"},
            status_code=400,
            media_type="application/json",
        )

    if signApi is None:
        return JSONResponse(
            content={"message": "signApi is not initialised"},
            status_code=400,
            media_type="application/json",
        )

    return signApi.GetOauthToken(req)


@app.post("/api/helloSign/refreshOauthToken")
async def signRefreshOauthToken(req: OauthTokenRequest) -> JSONResponse:
    if req.code is None or req.state is None:
        return JSONResponse(
            content={"message": "code or state is empty"},
            status_code=400,
            media_type="application/json",
        )

    if signApi is None:
        return JSONResponse(
            content={"message": "signApi is not initialised"},
            status_code=400,
            media_type="application/json",
        )

    return signApi.RefreshOauthToken(req)


@app.post("/api/helloSign/fetchTemplates")
async def signFetchTemplates(req: SignTemplateListRequest) -> JSONResponse:
    if req.token is None or req.token == "":
        return JSONResponse(
            content={"message": "authToken is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if signApi is None:
        return JSONResponse(
            content={"message": "signApi is not initialised"},
            status_code=400,
            media_type="application/json",
        )

    return signApi.FetchTemplates(req)


@app.post("/api/helloSign/createFromTemplate")
async def signCreateFromTemplate(req: SignTemplateRequest) -> JSONResponse:
    print(req)
    if req.token is None or req.token == "":
        return JSONResponse(
            content={"message": "authToken is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if req.template_id is None or req.template_id == "":
        return JSONResponse(
            content={"message": "template_id is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if req.user_id is None or req.user_id == "":
        return JSONResponse(
            content={"message": "user_id is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if req.template_name is None or req.template_name == "":
        return JSONResponse(
            content={"message": "template_name is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if signApi is None:
        return JSONResponse(
            content={"message": "signApi is not initialised"},
            status_code=400,
            media_type="application/json",
        )

    return signApi.CreateFromTemplate(req)


# Huggingface API endpoints
@app.post("/api/ai/generateDoc")
async def aiGenerateDoc(req: AIGenerateRequest) -> JSONResponse:
    if req.prompt is None or req.prompt == "":
        return JSONResponse(
            content={"message": "prompt is empty or null"},
            status_code=400,
            media_type="application/json",
        )
    return aiApi.GenerateDoc(req)


@app.post("/api/ai/analyseDoc")
async def aiAnalyseDoc(req: AIAnalyseRequest) -> JSONResponse:
    print(req)
    if req is None:
        return JSONResponse(
            content={"message": "input is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    return aiApi.AnalyseDoc(req)


# user/database api requests
@app.post("/api/userPdfList")
async def supabaseUserPdflist(req: DBPdfListReq) -> JSONResponse:
    if req.user_id is None or req.user_id == "":
        return JSONResponse(
            content={"message": "authToken is empty or null"},
            status_code=400,
            media_type="application/json",
        )
    return supabaseApi.FetchPdflist(req)


@app.post("/api/fetchPdf")
async def supabaseFetchPdf(req: DBPdfReq) -> JSONResponse:
    if req.user_id is None or req.user_id == "":
        return JSONResponse(
            content={"message": "authToken is empty or null"},
            status_code=400,
            media_type="application/json",
        )
    if req.pdf_id is None or req.pdf_id == "":
        return JSONResponse(
            content={"message": "pdf_id is empty or null"},
            status_code=400,
            media_type="application/json",
        )
    return supabaseApi.FetchPdfById(req)


@app.post("/api/createEmptyPdf")
async def supabaseEmptyPdf(req: DBEmptyPdfReq) -> JSONResponse:
    if req.user_id is None or req.user_id == "":
        return JSONResponse(
            content={"message": "authToken is empty or null"},
            status_code=400,
            media_type="application/json",
        )
    if req.pdf_name is None or req.pdf_name == "":
        return JSONResponse(
            content={"message": "pdf_name is empty or null"},
            status_code=400,
            media_type="application/json",
        )
    return supabaseApi.CreateEmptyPdf(req)


@app.post("/api/createUploadPdf")
async def supabaseUploadPdf(
    file: Annotated[UploadFile, Form()],
    file_name: Annotated[str, Form()],
    user_id: Annotated[str, Form()],
) -> JSONResponse:
    if user_id is None or user_id == "":
        return JSONResponse(
            content={"message": "authToken is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if file_name is None or file_name == "":
        return JSONResponse(
            content={"message": "file_name is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if file is None:
        return JSONResponse(
            content={"message": "file is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    return supabaseApi.CreateUploadPdf(file, file_name, user_id)


@app.post("/api/savePdf")
async def savePdf(req: DBSavePdfReq) -> JSONResponse:
    if req.pdf_id is None or req.pdf_id == "":
        return JSONResponse(
            content={"message": "pdf_id is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if req.user_id is None or req.user_id == "":
        return JSONResponse(
            content={"message": "pdf_name is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if req.json_diff is None or req.json_diff == "":
        return JSONResponse(
            content={"message": "pdf_path is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    return supabaseApi.SavePdf(req)


@app.post("/api/publishPdf")
async def publishPdf(
    file: Annotated[UploadFile, Form()],
    pdf_id: Annotated[str, Form()],
    user_id: Annotated[str, Form()],
) -> JSONResponse:
    if user_id is None or user_id == "":
        return JSONResponse(
            content={"message": "authToken is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if pdf_id is None or pdf_id == "":
        return JSONResponse(
            content={"message": "pdf_id is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if file is None:
        return JSONResponse(
            content={"message": "file is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    return supabaseApi.PublishPdf(file, pdf_id, user_id)


@app.post("/api/saveThumbnail")
async def saveThumbnail() -> JSONResponse:
    pass


@app.post("/api/deletePdf")
async def deletePdf(req: DBDeletePdfReq) -> JSONResponse:
    if req.pdf_id is None or req.pdf_id == "":
        return JSONResponse(
            content={"message": "pdf_id is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    if req.user_id is None or req.user_id == "":
        return JSONResponse(
            content={"message": "user_id is empty or null"},
            status_code=400,
            media_type="application/json",
        )

    return supabaseApi.DeletePdf(req)
