FROM python:3.10.0

RUN mkdir /backend

WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .

RUN pip install -r /backend/requirements.txt --no-cache-dir 

COPY . .

# RUN chmod a+x docker/*.sh

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]