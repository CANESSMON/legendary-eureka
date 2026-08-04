import os
from dotenv import load_dotenv

# Load environment variables from the .env file in backend directory
# By default, load_dotenv() will search for a .env file in the current working directory or parent directories.
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/jobportal")
PG_ROOT_DATABASE_URL = os.getenv("PG_ROOT_DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-for-job-portal")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# Split comma-separated list of CORS origins
cors_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174")
CORS_ORIGINS = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

DEFAULT_ADMIN_EMAIL = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@jobportal.com")
DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin@123")

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "PRAFUL101NAYAK@GMAIL.COM")
SMTP_PASS = os.getenv("SMTP_PASS", "wdji tkzk kqsw vvcv")
SMTP_TO = os.getenv("SMTP_TO", "digitalpraful101@gmail.com")

