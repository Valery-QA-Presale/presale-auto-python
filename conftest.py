"""
Корневой conftest.py — точка входа для всех фикстур pytest.

Порядок подключения (будет заполняться по шагам):
  Шаг 2 → helpers, data_generators
  Шаг 3 → base_api_client, b2c_api_client, b2b_api_client
  Шаг 4 → auth-контексты (b2c_user, b2b_user, admin, ...)
  Шаг 5 → первый тест (test_auth.py) — проверяем конвейер
  Шаг 6 → pydantic-модели и валидаторы
"""

import pytest

# ---------------------------------------------------------------------------
# ENV / CONFIG
# Будет заменено на нормальную фикстуру после Шага 2
# ---------------------------------------------------------------------------
# from src.utils.config import Settings
#
# @pytest.fixture(scope="session")
# def settings() -> Settings:
#     return Settings()


# ---------------------------------------------------------------------------
# HTTP-КЛИЕНТЫ
# Будет заменено после Шага 3
# ---------------------------------------------------------------------------
# from src.api.b2c_api_client import B2cApiClient
# from src.api.b2b_api_client import B2bApiClient
#
# @pytest.fixture(scope="session")
# async def b2c_client(settings) -> AsyncIterator[B2cApiClient]:
#     async with B2cApiClient(base_url=settings.B2C_BASE_URL) as client:
#         yield client
#
# @pytest.fixture(scope="session")
# async def b2b_client(settings) -> AsyncIterator[B2bApiClient]:
#     async with B2bApiClient(base_url=settings.B2B_BASE_URL) as client:
#         yield client


# ---------------------------------------------------------------------------
# AUTH-КОНТЕКСТЫ
# Будет заменено после Шага 4
# ---------------------------------------------------------------------------
# @pytest.fixture(scope="session")
# async def b2c_auth(b2c_client, settings):
#     """Возвращает авторизованный контекст для B2C-пользователя."""
#     ...
#
# @pytest.fixture(scope="session")
# async def b2b_auth(b2b_client, settings):
#     """Возвращает авторизованный контекст для B2B-пользователя."""
#     ...
