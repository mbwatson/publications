# Containerized Publications Application API and Frontend
### Django Backend, React Frontend, Postgres Database, served with Nginx

This project is based on another [one of my repositories](https://github.com/renciweb/dockerized-django-postgres-nginx). The difference is the addition of the container for the frontend, which is built in [React](https://reactjs.org/).

This uses Docker to deploy a multi-container project: API built with Django Rest Framework (container 1), a React JS frontend (container 2), Postgres database (container 3), and a Nginx webserver (container 4).

## Preparing your Project

As mentioned above, this project comes packaged with the auto-generated Django project provided by `django-admin`. Beginning with this project, a more substantial project can be built. However, the more likely case is that you have an existing project, and you wish to drop it into *this* project. This section is intended to shed light on that process. Note that this walkthrough makes a few (reasonably common) assumptions about file locations and such.

The backend lives in the `./web` directory. The structure of that directory is shown below.

```
$ tree ./web
.
├── api
│   ├── admin.py
│   ├── __init__.py
│   ├── migrations
│   ├── models.py
│   ├── serializers.py
│   ├── settings-dev.py
│   ├── settings-prod.py
│   ├── settings.py
│   ├── urls.py
│   ├── views.py
│   └── wsgi.py
├── db.sqlite3
├── Dockerfile
├── manage.py
├── Pipfile
├── Pipfile.lock
└── static_files
    └── admin
```

## Running the Project

#### Dockerfile

The Dockerfile used to build the Django container takes care of installing your project's dependencies; here we outline two common options for this step. One commonly uses either Pipenv or a requirements.txt file to define your project dependencies.


```
# ./web/Dockerfile
FROM python:3.7

ENV PYTHONUNBUFFERED 1

RUN mkdir /web
COPY . /web
WORKDIR /web

######################
###  Dependencies  ###
######################

# If using Pipenv...
RUN pip3 install pipenv
COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock
RUN pipenv install --deploy --system

# If using requirements.txt file...
# RUN pip install -r requirements.txt

```

Below describes how to proceed in either case. Note that if using one method, delete or comment out the other.

### Environment

This project uses Pipenv, and thus makes use of the files Pipfile and Pipfile.lock files in the Django root directory.

The following lines in `web/Dockerfile` use the environment settings defined by Pipenv.

```
RUN pip3 install pipenv
COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock
```

### Docker Compose

Two Docker Compose files exist here--one for development and one for production. Each references the corresponding Django settings module.

#### Development

Running `docker-compose up` spins up the development container, which simply serves the Django project via its builtin development server. Thus the `docker-compose.yml` file is simple:

```
# ./docker-compose.yml

services:
  webapp:
    build:
      context: ./web/
      dockerfile: Dockerfile
    command: python3 ./web/manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/web
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=webapp.settings-dev
```

### Production

The production situation starts up four services:

- our Django API (`webapp`), its frontend (`frontend`), the database (`db`), and a webserver (`server`). These containers are spun up according to the following `docker-compose.prod.yml`.

```
# ./docker-compose.prod.yml

version: '3'

volumes:
  static_files:
  media:
  conf:
  pgdata:

services:
  webapp:
    container_name: webapp
    build:
      context: ./web/
      dockerfile: Dockerfile
    command: gunicorn -w 4 webapp.wsgi:application -b 0.0.0.0:8000
    volumes:
      - ./web/static_files:/web/static_files
      - ./web/media:/web/media
    ports:
      - 8000:8000
    environment:
      DJANGO_SETTINGS_MODULE: webapp.settings-prod
    env_file:
      - ./postgres/db.env
    depends_on:
      - db
  db:
    image: postgres:10
    container_name: postgres
    env_file:
      - ./postgres/db.env
    volumes:
      - ./postgres/pgdata:/var/lib/postgresql/data
    ports:
      - 5432:5432
  server:
    container_name: server
    image: nginx:latest
    ports:
      - 80:80
    volumes:
      - ./web/static_files:/web/static_files
      - ./web/media:/web/media
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - webapp


```

#### The API

The webapp service is our Django project container, which is served via [Gunicorn](https://gunicorn.org/). We also set an environment variable indicating that Django should use the production environment settings module.The webapp service is our Django project container, which is served via [Gunicorn](https://gunicorn.org/). We also set an environment variable indicating that Django should use the production environment settings module.

There are other database-related environment variables that are required by both the `webapp` and the `db` services and are thus extracted to an external file: `/postgres/db.env`.

#### The Frontend

TBA

#### The Database

The database is built off of the `postgres:10` image. The database credentials live in an external file (`postgres/db.env`), as they are also required by Django running in the `webapp` service.

\* Note: Any database credentials altered in the `postgres/db.env` file will be conveniently scooped up by the necessary services. However, if you've already created the database, you will need to make the changes to the existing database by hand or take the more bullish approach and drop the volume completely and start fresh.

Finally, we create a volume for the database so our data persists and pass traffic through the standard PostgreSQL port 5432. Notice that volume is listed at the top of the file with the `webapp` volumes.

#### The Server

Nginx will serve the static assets (as outlined in [the Django documentation](https://docs.djangoproject.com/en/2.1/howto/static-files/deployment/), so we mount those directories as separate volumes in both the `webapp` and the `server` service. Additionally, we also mount our custom Nginx configuration file `./nginx/default.conf` file to replace the default Nginx `.conf` file.

## Quickstart

### Development

- `docker-compose up`

The first time the application runs, the database will not be set up, and a 500 Server Error will be thrown. Thus you'll need to run the standard `python manage.py makemigrations` and `python manage.py migrate` commands inside the `webapp` container to initialize the database.

This goes for `python manage.py createsuperuser`, too.

### Production

- `docker-compose -f docker-compose.prod.yml up`

## Additional References

- Docker: [https://docs.docker.com](https://docs.docker.com)
- Docker Compose: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)
- Django: [https://docs.djangoproject.com/en/2.1/](https://docs.djangoproject.com/en/2.1/)
- Django REST Framework: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
- React JS: [https://reactjs.org/](https://reactjs.org/)
- Gunicorn: [https://gunicorn.org/](https://gunicorn.org/)
- Nginx: [https://nginx.org/en/docs/](https://nginx.org/en/docs/)