FROM python:3.7

ENV PYTHONUNBUFFERED 1

RUN mkdir /api
COPY . /api
WORKDIR /api

###  Dependencies
RUN pip3 install pipenv
COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock
RUN pipenv install --deploy --system

### Collect static files for serving to Django
RUN python manage.py collectstatic --noinput
