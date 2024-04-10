#!/bin/bash

# cd backend

python create_db_1.py

python create_db_2.py

python create_db_3.py

python create_db_4.py

python create_db_5.py

uvicorn main:app --host 0.0.0.0 --port 8000