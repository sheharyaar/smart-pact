from pydantic import BaseModel
from dropbox_sign import ApiClient, ApiException, Configuration, apis, models
from fastapi.responses import JSONResponse
from helpers import DownloadFileFromURL
from s3 import AwsUploadService
from db import SupabaseAPI, DBPdfCreateReq
import os

sign_api_key = "f59d2ae8271998faa458210c174a85f96085e03f0d1582cc03da2415199b0312"
sign_client_id = "973b3a1562379a15e47fb44b611b8388"
sign_client_secret = "062b80607470b5d85c05484efbe499f9"


class OauthTokenRequest(BaseModel):
    state: str
    code: str


class SignTemplateListRequest(BaseModel):
    token: str
    page: int


class SignTemplateRequest(BaseModel):
    token: str
    user_id: str
    template_id: str
    template_name: str


class HelloSign:
    def __init__(self, aws_service: AwsUploadService, db_service: SupabaseAPI) -> None:
        self.client_id = sign_client_id
        self.client_secret = sign_client_secret
        self.aws_service = aws_service
        self.db_service = db_service

    """
        Function to generate HelloSign Oauth Token
    """

    def GetOauthToken(self, req: OauthTokenRequest) -> JSONResponse:
        print(req)
        configuration = Configuration()

        with ApiClient(configuration) as api_client:
            api = apis.OAuthApi(api_client)
            data = models.OAuthTokenGenerateRequest(
                # from the request body
                state=req.state,
                code=req.code,
                # from Dropbox
                client_id=self.client_id,
                client_secret=self.client_secret,
            )

            try:
                response = api.oauth_token_generate(data, _request_timeout=10)
                print(response)
                if response is None:
                    return JSONResponse(
                        content={"message": "response is empty"},
                        status_code=400,
                        media_type="application/json",
                    )
                # return JSON
                return JSONResponse(
                    content=response.to_dict(),
                    status_code=200,
                    media_type="application/json",
                )

            except ApiException as e:
                print("Exception when calling Dropbox Sign API: %s\n" % e)
                return JSONResponse(
                    content={"message": "error"},
                    status_code=400,
                    media_type="application/json",
                )

    """
        Function to refresh HelloSign Oauth Token
    """

    def RefreshOauthToken(self, req: OauthTokenRequest) -> JSONResponse:
        return JSONResponse(
            content={"message": "Hello World"},
            status_code=200,
            media_type="application/json",
        )

    """
        Function to fetch HelloSign templates
    """

    def FetchTemplates(self, req: SignTemplateListRequest) -> JSONResponse:
        print(req)

        configuration = Configuration(
            access_token=req.token,
        )

        with ApiClient(configuration) as api_client:
            template_api = apis.TemplateApi(api_client)

            # Account of the outh token owner
            account_id = None
            page = req.page

            try:
                response = template_api.template_list(
                    account_id=account_id,
                    page=page,
                    _request_timeout=10,
                )
                print(response)
                if response is None:
                    return JSONResponse(
                        content={"message": "response is empty"},
                        status_code=400,
                        media_type="application/json",
                    )
                else:
                    return JSONResponse(
                        content=response.to_dict(),
                        status_code=200,
                        media_type="application/json",
                    )
            except ApiException as e:
                print("Exception when calling Dropbox Sign API: %s\n" % e)
                return JSONResponse(
                    content={"message": "error"},
                    status_code=400,
                    media_type="application/json",
                )

    def CreateFromTemplate(self, req: SignTemplateRequest) -> JSONResponse:
        print(req)

        configuration = Configuration(
            access_token=req.token,
        )

        with ApiClient(configuration) as api_client:
            template_api = apis.TemplateApi(api_client)
            template_id = req.template_id

            # get template files
            try:
                response = template_api.template_files_as_file_url(
                    template_id, _request_timeout=10
                )
                print("Template uri response : ", response)

                # download from s3 url
                path = "./temp/" + template_id + ".pdf"
                response = template_api.template_files(template_id, file_type="pdf")
                open(path, "wb").write(response.read())
                new_req = DBPdfCreateReq(
                    user_id=req.user_id,
                    pdf_path=path,
                    pdf_name=req.template_name,
                )
                resp = self.db_service.CreatePdf(new_req)
                # remove the created file
                os.remove(path)
                return resp

            except ApiException as e:
                print("Exception when calling Dropbox Sign API: %s\n" % e)
                return JSONResponse(
                    content={"message": "error in fetching template files"},
                    status_code=400,
                    media_type="application/json",
                )
