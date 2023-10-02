hf_api_key = "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"

from pydantic import BaseModel
from fastapi.responses import JSONResponse
from prompt import aiPromptPrefix


class HFGenerateRequest(BaseModel):
    prompt: str


class HuggingFace:
    def __init__(self) -> None:
        self.promptPrefix = aiPromptPrefix
        self.apiKey = hf_api_key

    """
        Function to generate a document from Huggingface
    """

    def generateDoc(self, req: HFGenerateRequest):
        prompt = self.promptPrefix + req.prompt
        print(prompt)

        return JSONResponse(
            content={"message": "Hello World"},
            status_code=200,
            media_type="application/json",
        )
