```
presale-auto-python/
├── pyproject.toml              # вместо package.json
├── pytest.ini                  # или секция [tool.pytest.ini_options] в pyproject
├── .env
├── config/
│   └── config.py               # уже есть ✅
├── tests/
│   ├── conftest.py             # общие фикстуры (≈ test-setup.ts)
│   ├── b2c/
│   │   ├── conftest.py         # b2c-фикстуры
│   │   └── api/
│   │       └── auth/
│   │           └── test_auth.py     # ≈ auth.spec.ts
│   ├── b2b/
│   │   └── ...
│   ├── data/
│   │   ├── constants.py        # ≈ constants/index.ts
│   │   └── test_users.py       # ≈ test-users.ts
│   ├── fixtures/
│   │   └── api_clients/
│   │       ├── base_api_client.py   # ≈ base-api-client.ts
│   │       ├── b2c_api_client.py    # ≈ b2c-api-client.ts
│   │       └── ...
│   ├── utils/
│   │   ├── helpers.py
│   │   ├── retry_utils.py
│   │   └── generators/
│   │       └── data_generators.py
│   └── models/                 # ← НОВОЕ: pydantic-схемы (бывшие zod)
│       ├── complete_set.py
│       └── ...
```

---