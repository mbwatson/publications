# Containerized Publications Application API and Frontend
### Django Backend, React Frontend, Postgres Database, served with Nginx

This project is based on another [one of my repositories](https://github.com/renciweb/dockerized-django-postgres-nginx). The difference is the addition of the container for the frontend, which is built in [React](https://reactjs.org/).

This uses Docker to deploy a multi-container project: API built with Django Rest Framework (container 1), a React JS frontend (container 2), Postgres database (container 3), and a Nginx webserver (container 4).

## Project Preparation

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

The Dockerfiles dictate how the container will be built, and each service has its own Dockerfile in its respective directory.

### Docker Compose

Two Docker Compose files exist--one for development and one for production--`docker-compose.yml` and `docker-compose.prod.yml`, respectively.

#### Development

Running `docker-compose up` spins up the development container, using `docker-compose.yml` by default, simply serving the Django project and the React frontend via their respective builtin development servers. Thus the `docker-compose.yml` file is straight-forward:

```
# ./docker-compose.yml

services:
  frontend:
    container_name: react
    build:
      context: ./frontend/
      dockerfile: Dockerfile
    volumes:
      - './frontend:/usr/src/app'
      - '/usr/src/app/node_modules'
    environment:
      - NODE_ENV=development
    ports:
      - 3000:3000
    depends_on:
      - webapp
  webapp:
    container_name: django
    build:
      context: ./web/
      dockerfile: Dockerfile
    command: python3 manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/src
    ports:
      - 8000:8000
    environment:
      - DJANGO_SETTINGS_MODULE=api.settings-dev
    depends_on:
      - db
  db:
    image: postgres:10
    container_name: postgres
    environment:
      POSTGRES_HOST: localhost
      POSTGRES_DB: postgres_db
      POSTGRES_USER: postgres_user
      POSTGRES_PASSWORD: postgres_password
      POSTGRES_PORT: 5432
    volumes:
      - ./postgres/pgdata:/var/lib/postgresql/data
    ports:
      - 5432:5432
```

The frontend is accessed on port 3000, while the backend is accessed on port 8000. Both of these ports are the defaults. The mounted volumes allow for hot reloading during development.

### Production

The production situation starts up four services:

- our Django API (`webapp`),
- the database (`db`),
- its frontend (`frontend`),
- and a webserver (`server`).

These containers are built according to the following `docker-compose.prod.yml`.

```
# ./docker-compose.prod.yml

version: '3'

volumes:
  static_files:
  media:
  conf:
  pgdata:
  frontend:

services:
  frontend:
    container_name: react
    build:
      context: ./frontend/
      dockerfile: Dockerfile-prod
      args:
        - REACT_APP_API_URL=http://localhost:8000/api/publications/
    volumes:
      - './frontend:/usr/src/app'
      - '/usr/src/app/node_modules'
      - ./web/static_files:/src/static_files
    environment:
      - NODE_ENV=production
    depends_on:
      - webapp
    ports:
      - 80:80
  webapp:
    container_name: webapp
    build:
      context: ./web/
      dockerfile: Dockerfile
    command: gunicorn -w 4 api.wsgi:application -b 0.0.0.0:8080
    volumes:
      - ./web/static_files:/src/static_files
    ports:
      - 8080:8080
    environment:
      DJANGO_SETTINGS_MODULE: api.settings-prod
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
      - 8000:8000
    volumes:
      - ./web/static_files:/src/static_files
      - ./default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - webapp
      - frontend
```

#### The API

The `webapp` service is our Django project container, which is served with [Gunicorn](https://gunicorn.org/). Gunicorn doesn't serve the project's static files, and require Nginx for serving. We also set an environment variable indicating that Django should use the production environment settings module.

By installing the dependencies according to Pipenv files--`Pipfile` and `Pipfile.lock`--in the Django root directory, Docker constructs the desired environment by installing dependencies and finishes up by collecting the static files.

```
# web/Dockerfile

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
```

There are other database-related environment variables that are required by both the `webapp` and the `db` services and are thus extracted to an external file: `/postgres/db.env`. That file has the following structure.

```
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password
POSTGRES_DB=postgres_db
```

#### The Frontend

For the frontend service, we use multistage builds, creating a temporary image to construct the production build that is then copied to the production image. The final build is served with Nginx, and the temporary build image and its associated files are discarded, leaving a leaner image for production. The Docker documentation has more information on [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/).

The environment variable for the API URL is required for the React, but it is only required in the production build, as the minimized production build is constructed. To accomplish this, and to keep management of the API URL in the compose file, we make use build arguments.

We define the build argument `REACT_APP_API_URL`, which is available at buildtime, which is used to define the environment variable by the same name at runtime in the production dockerfile, `frontend/Dockerfile-prod`.

```
# /frontend/Dockerfile-prod

# build environment
FROM node:10.12.0-alpine as builder
RUN mkdir /src
WORKDIR /src
ENV PATH /src/node_modules/.bin:$PATH
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
COPY package.json /src/package.json
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent
COPY . /src
RUN npm run build

# production environment
FROM nginx:1.15-alpine
COPY --from=builder /src/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

More details about this method can be found in the Docker documentation: [https://docs.docker.com/compose/compose-file/#context](https://docs.docker.com/compose/compose-file/#context)

#### The Database

The database is built off of the `postgres:10` image. The database credentials live in an external file (`postgres/db.env`), as they are also required by Django running in the `webapp` service.

\* Note: Any database credentials altered in the `postgres/db.env` file will be conveniently scooped up by the necessary services. However, if the database has already been created, the changes need to be made to the existing database by hand or take the more bullish approach and drop the volume completely and start fresh.

Finally, we create a volume for the database so our data persists and pass traffic through the standard PostgreSQL port 5432. Notice that volume is listed at the top of the file with the `webapp` volumes.

#### The Server

Nginx will serve the static assets (as outlined in [the Django documentation](https://docs.djangoproject.com/en/2.1/howto/static-files/deployment/), so we mount those directories as separate volumes in both the `webapp` and the `server` service. Additionally, we also mount our custom Nginx configuration file `./nginx/default.conf` file to replace the default Nginx `.conf` file.

No external build instructions are required, hence no need for a `Dockerfile` in the `postgres` directory.

## Quickstart

### Development

#### Frontend

- `/publications/frontend$ npm start`

#### Everything Else

- `/publications$ docker-compose up`

The first time the application runs, the database will not be set up, and a 500 Server Error will be thrown. Thus the standard `python manage.py makemigrations` and `python manage.py migrate` commands need to be run inside the `webapp` container to initialize the database.

This goes for `python manage.py createsuperuser`, too.

For a faster approach, use `exec`, *e.g.*, `docker-compose up exec webapp python manage.py migrate`.

### Production

- `/publications$ docker-compose -f docker-compose.prod.yml up`

In addition, it is likely that the detatch flag, `-d`, is desirable here.

## Additional References

- Docker
  + Docker: [https://docs.docker.com](https://docs.docker.com)
  + Docker Compose: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)
  + Docker Multi-Stage Builds [https://docs.docker.com/develop/develop-images/multistage-build/](https://docs.docker.com/develop/develop-images/multistage-build/)
- Django
  + Django: [https://docs.djangoproject.com/en/2.1/](https://docs.djangoproject.com/en/2.1/)
  + Django REST Framework: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
- Gunicorn: [https://gunicorn.org/](https://gunicorn.org/)
- Nginx: [https://nginx.org/en/docs/](https://nginx.org/en/docs/)
- React JS: [https://reactjs.org/](https://reactjs.org/)