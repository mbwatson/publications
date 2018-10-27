FROM python:3.7

ENV PYTHONUNBUFFERED 1

RUN mkdir /src
COPY . /src
WORKDIR /src

###  Dependencies
RUN pip3 install pipenv
COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock
RUN pipenv install --deploy --system
