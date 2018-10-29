from .settings import *

# Define development-specific Django settings here
##################################################

CORS_ORIGIN_WHITELIST = (
    'localhost:3000',
)
CORS_ALLOW_METHODS = (
    'GET',
    'POST',
    'PUT',
)
# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

