import os
import boto3
from botocore.exceptions import NoCredentialsError
from botocore.client import Config

class AwsService:
    def __init__(self):
        self.bucket_name = os.environ.get("AWS_BUCKET_NAME")
        self.profile_img_prefix = "profile_img/"
        self.pdf_prefix = "user_pdf/"
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
            region_name=os.environ.get("AWS_REGION_NAME"),  # Replace with your desired region
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
    Upload object to S3
    """

    def UploadObject(self, object, path_s3, content_type, public=False) -> bool:
        if public:
            acl = "public-read"
        else:
            acl = "private"

        try:
            self.s3.put_object(
                Body=object,
                Bucket=self.bucket_name,
                Key=path_s3,
                ACL=acl,
            )
            return True
        except Exception as e:
            print(e)
            return False

    """
    Delete a file from an S3 bucket
    """

    def DeleteFolder(self, path_s3) -> bool:
        try:
            # List all objects within the folder
            objects_to_delete = self.s3.list_objects_v2(
                Bucket=self.bucket_name, Prefix=path_s3
            )

            if "Contents" in objects_to_delete:
                # Prepare a list of objects to delete
                delete_keys = {"Objects": []}
                delete_keys["Objects"] = [
                    {"Key": obj["Key"]} for obj in objects_to_delete["Contents"]
                ]

                # Delete the objects
                self.s3.delete_objects(Bucket=self.bucket_name, Delete=delete_keys)
                print(f"All objects in {path_s3} deleted.")
            else:
                print(f"No objects found in {path_s3}.")
            return True
        except Exception as e:
            print("Delete File Exception ", e)
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
