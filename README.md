- [Prerequisites](#prerequisites)
  - [Required Environment variables](#required-environment-variables)
  - [Supabase DB Definitions](#supabase-db-definitions)
  - [S3 bucket setup](#s3-bucket-setup)
- [Running the application](#running-the-application)


# Prerequisites

## Required Environment variables

- Frontend 
```env
REACT_APP_FRONTEND_URL="<Frontend urrl (Eg - http://localhost)>"
REACT_APP_BACKEND_URL="<Backend url (Eg - http://localhost/api)>"
REACT_APP_SUPABASE_URL="<Supabase URL>"
REACT_APP_SUPABASE_ANON_KEY="<Supabase anon key>"
REACT_APP_DROPBOX_SIGN_CLIENT_ID="<Dropbox Sign Client ID>"
```

- Backend
```env
SUPABASE_URL="<Supabase Url>
SUPABASE_KEY="<Supabase Key>"
AWS_ACCESS_KEY_ID="<AWS Access Key ID>"
AWS_SECRET_ACCESS_KEY="<AWS Secret Access Key>"
AWS_REGION_NAME="<AWS Region Name>"
AWS_BUCKET_NAME="<AWS Bucket Name>"
DROPBOX_SIGN_CLIENT_ID="<Dropbox Sign Client ID>"
DROPBOX_SIGN_CLIENT_SECRET="<Dropbox Sign Client Secret>"
```

## Supabase DB Definitions

- Global pdf table 
```sql
create table
  public.global_pdf (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    pdf_id uuid not null,
    user_id uuid not null,
    starred boolean not null default false,
    role public.role not null default 'editor'::role,
    constraint global_pdf_pkey primary key (id),
    constraint global_pdf_id_key unique (id),
    constraint global_pdf_pdf_id_fkey foreign key (pdf_id) references pdf (pdf_id) on update cascade on delete cascade,
    constraint global_pdf_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade
  ) tablespace pg_default;
```

- Pdf table
```sql
create table
  public.pdf (
    pdf_id uuid not null default gen_random_uuid (),
    pdf_name text not null,
    created_at timestamp with time zone not null default now(),
    created_by uuid not null,
    updated_at timestamp with time zone null,
    pdf_thumbnail text null,
    constraint PDF_pkey primary key (pdf_id),
    constraint pdf_pdf_id_key unique (pdf_id),
    constraint pdf_created_by_fkey foreign key (created_by) references auth.users (id) on update cascade on delete restrict,
    constraint pdf_pdf_name_check check ((length(pdf_name) <= 128))
  ) tablespace pg_default;

create trigger handle_updated_at before
update on pdf for each row
execute function moddatetime ('updated_at');
```

## S3 bucket setup

- Create a S3 bucket with two folders
    - `profile_img/`
    - `user_pdf/`

# Running the application

The frontend and backend can be run and built using `docker compose` in the current folder.

1. Make sure you have docker installed in your system. Else checkout docker installation [here](https://docs.docker.com/engine/install/). Also make sure no other application is running on port `80`.

2. Save the env files as :
   1. `.env` in the folder containing `package.json` (for frontend)
   2. `.env` in the `backend/` folder (for backend)

3. Run the following command in the current folder (containing `docker-compose.yml`)

```shell
docker compose up --build -d
```

4. Open `http://localhost` in your browser.