from pydantic import BaseModel
from typing import List
from fastapi.responses import JSONResponse
from prompt import summarySystemPrompt
import openai
import json

import requests

organization = "org-7t8vOMXNQG0CPXIj5BDkVwAc"
api_key = "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"


class AIGenerateRequest(BaseModel):
    prompt: str


class AIAnalyseNode(BaseModel):
    pageIndex: int
    id: int
    text: str


class AIAnalyseRequest(BaseModel):
    input: List[AIAnalyseNode]


class AIService:
    def __init__(self) -> None:
        self.apiKey = api_key
        self.organization = organization
        openai.api_key = self.apiKey

    """
        Function to generate a document from Huggingface
    """

    def GenerateDoc(self, req: AIGenerateRequest) -> JSONResponse:
        prompt = self.promptPrefix + req.prompt
        response = requests.post(
            self.apiUrl, headers=self.headers, data={"inputs": prompt}
        )
        print(response.content)
        return response.json()

    def AnalyseDoc(self, req: List[AIAnalyseNode]) -> JSONResponse:
        print("Request: ", req)
        response = openai.ChatCompletion.create(
            model="gpt-4",
            temperature=0,
            messages=[
                {"role": "system", "content": summarySystemPrompt},
                {
                    "role": "user",
                    "content": json.dumps(req, default=lambda x: x.__dict__),
                },
            ],
        )

        print("Response: ", response["choices"][0]["message"]["content"])
        return JSONResponse(
            content={"content": response["choices"][0]["message"]["content"]},
            media_type="application/json",
        )


if __name__ == "__main__":
    hf = AIService()
    resp = hf.GenerateDoc(
        AIGenerateRequest(prompt="Generate an NDA document for the company Smart Pact.")
    )

    print(resp)
