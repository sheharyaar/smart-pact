from pydantic import BaseModel
from dropbox_sign import ApiClient, ApiException, Configuration, apis, models
from fastapi.responses import JSONResponse

sign_api_key = "f59d2ae8271998faa458210c174a85f96085e03f0d1582cc03da2415199b0312"
sign_client_id = "973b3a1562379a15e47fb44b611b8388"
sign_client_secret = "062b80607470b5d85c05484efbe499f9"


class OauthTokenRequest(BaseModel):
    state: str
    code: str


class SignTemplateRequest(BaseModel):
    token: str
    account_id: str
    page: int


class HelloSign:
    def __init__(self) -> None:
        self.client_id = sign_client_id
        self.client_secret = sign_client_secret

    """
        Function to generate HelloSign Oauth Token
    """

    def getOauthToken(self, req: OauthTokenRequest) -> JSONResponse:
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

    def refreshOauthToken(self, req: OauthTokenRequest) -> JSONResponse:
        return JSONResponse(
            content={"message": "Hello World"},
            status_code=200,
            media_type="application/json",
        )

    """
        Function to fetch HelloSign templates
    """

    def fetchTemplates(self, req: SignTemplateRequest) -> JSONResponse:
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
