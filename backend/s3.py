import os
import boto3
from botocore.exceptions import NoCredentialsError
from botocore.client import Config

aws_access_key_id = "AKIAVXF3LRV3V4D6U3AZ"
aws_secret_access_key = "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"
region_name = "ap-south-1"
bucket_name = "smart-pact"


class AwsUploadService:
    def __init__(self):
        self.bucket_name = bucket_name
        self.profile_img_prefix = "profile_img/"
        self.pdf_prefix = "user_pdf/"
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name,  # Replace with your desired region
            config=Config(signature_version="s3v4"),
        )

    """
    Upload a file to an S3 bucket
    """

    def UploadFile(self, file, path_s3, content_type, public=False) -> bool:
        if public:
            extra_args = {"ContentType": content_type, "ACL": "public-read"}
        else:
            extra_args = {"ContentType": content_type}

        try:
            self.s3.upload_file(
                file,
                self.bucket_name,
                path_s3,
                ExtraArgs=extra_args,
            )
            return True
        except Exception as e:
            print(e)
            return False

    """
    Delete a file from an S3 bucket
    """

    def DeleteFile(self, path_s3) -> bool:
        try:
            self.s3.delete_object(Bucket=self.bucket_name, Key=path_s3)
            return True
        except Exception as e:
            print(e)
            return False

    """
    Generate a presigned URL to share an S3 object
    """

    def FetchFileURL(self, object_name) -> dict | None:
        try:
            url = self.s3.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": object_name},
                ExpiresIn=3600,
            )
            return {"downloadUrl": url, "expiresIn": 3600}
        except Exception as e:
            print(e)
            return None

    # """
    # Upload
    # """

    # def PutFile(self, content_type, file_name_or_key, buffer):
    #     try:
    #         self.s3.put_object(
    #             Bucket=self.bucket_name,
    #             Key=file_name_or_key,
    #             Body=buffer,
    #             ContentType=content_type,
    #         )
    #         return {"fileKey": file_name_or_key}
    #     except NoCredentialsError:
    #         return None
