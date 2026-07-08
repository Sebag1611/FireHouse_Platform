"""
URL configuration for Backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import mensaje_prueba
from rest_framework.routers import DefaultRouter
from . import views

# El router se encarga de crear todas las URLs automáticamente para los ViewSets
router = DefaultRouter()

# Registramos cada tabla con su ruta en la URL
router.register(r'personas', views.PersonaViewSet)
router.register(r'bomberos', views.BomberoViewSet)
router.register(r'aspirantes', views.AspiranteViewSet)
router.register(r'documentos', views.DocumentoViewSet)
router.register(r'equipos', views.EquipoViewSet)
router.register(r'equipos-asignados', views.EquipoAsignadoViewSet)
router.register(r'actividades', views.ActividadViewSet)
router.register(r'asistencias', views.AsistenciaViewSet)
router.register(r'emergencias', views.EmergenciaViewSet)
router.register(r'material-mayor', views.MaterialMayorViewSet)
router.register(r'despachos', views.DespachoViewSet)
router.register(r'tripulacion', views.TripulacionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/prueba/', mensaje_prueba),
    path('', include('api')),
]
