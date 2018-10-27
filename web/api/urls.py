from django.contrib import admin
from django.urls import path, include
from . import views
from django.views.generic import TemplateView
from rest_framework import routers

router = routers.DefaultRouter()

router.register('publications', views.PublicationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', TemplateView.as_view(template_name='index.html'))
]
