import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    B2C_BASE_URL = os.getenv('B2C_BASE_URL', 'https://staging.presale.ru')
    B2B_BASE_URL = os.getenv('B2B_BASE_URL', 'https://dml.staging.presale.ru')
    OTP_CODE = os.getenv('TEST_OTP_CODE', '1234')

config = Config()