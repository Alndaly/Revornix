import os
from urllib.parse import quote_plus

POSTGRES_USER = os.environ.get('POSTGRES_USER')
POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD')
if not POSTGRES_PASSWORD:
    raise Exception('POSTGRES_PASSWORD is not set')
POSTGRES_PASSWORD = quote_plus(POSTGRES_PASSWORD)
POSTGRES_DB_URL = os.environ.get('POSTGRES_DB_URL')
POSTGRES_DB = os.environ.get('POSTGRES_DB')