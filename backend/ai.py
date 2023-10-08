from pydantic import BaseModel
from typing import List
from fastapi.responses import JSONResponse
from prompt import summarySystemPrompt
import openai
import json

import requests


class AIGenerateRequest(BaseModel):
    prompt: str


class AIAnalyseNode(BaseModel):
    pageIndex: int
    id: int
    text: str


class AIAnalyseRequest(BaseModel):
    openAiKey: str
    input: List[AIAnalyseNode]


class AIService:
    def __init__(self) -> None:
        self.apiUrl = ""

    """
        Function to analyse a document from Huggingface
    """

    def AnalyseDoc(self, req: AIAnalyseRequest) -> JSONResponse:
        response = openai.ChatCompletion.create(
            api_key=req.openAiKey,
            model="gpt-4",
            temperature=0,
            messages=[
                {"role": "system", "content": summarySystemPrompt},
                {
                    "role": "user",
                    "content": json.dumps(req.input, default=lambda x: x.__dict__),
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
