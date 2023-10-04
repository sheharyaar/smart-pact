from fastapi import FastAPI
from pprint import pprint
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sign import OauthTokenRequest, HelloSign
from hf import HFGenerateRequest, HuggingFace
from db import SupabaseAPI, DBPdfListReq

signApi = None
hfApi = None
supabaseApi = None


# lifespan handling for initialising APIs
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Loading functions
    print("Running startup functions")
    global signApi
    signApi = HelloSign()

    global hfApi
    hfApi = HuggingFace()

    global supabaseApi
    supabaseApi = SupabaseAPI()

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


@app.get("/")
async def root():
    return {"message": "Hello World"}


# Dropbox Sign API endpoints
@app.post("/helloSign/oauthToken")
async def signOauthToken(req: OauthTokenRequest):
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

    return signApi.getOauthToken(req)


@app.post("/helloSign/refreshOauthToken")
async def signRefreshOauthToken(req: OauthTokenRequest):
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

    return signApi.refreshOauthToken(req)


# Huggingface API endpoints
@app.post("/huggingface/generateDoc")
async def huggingfaceGenerateDoc(req: HFGenerateRequest):
    if req.prompt is None or req.prompt == "":
        return JSONResponse(
            content={"message": "prompt is empty or null"},
            status_code=400,
            media_type="application/json",
        )
    return hfApi.generateDoc(req)


@app.post("/api/userPdfList")
async def supabaseUserPdflist(req: DBPdfListReq):
    if req.user_id is None or req.user_id == "":
        return JSONResponse(
            content={"message": "authToken is empty or null"},
            status_code=400,
            media_type="application/json",
        )
    return supabaseApi.FetchPdflist(req)
