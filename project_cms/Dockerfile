FROM python:3.10.0

ENV PYTHONUNBUFFERED 1

WORKDIR /project_cms

COPY requirements.txt /project_cms/
RUN pip install -r requirements.txt

COPY . /project_cms/

CMD ["gunicorn", "--bind", "0.0.0.0:9000", "project_cms.wsgi"]