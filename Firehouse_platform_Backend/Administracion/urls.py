from django.urls import path
from Administracion import views

urlpatterns = [
       # Gestión de usuarios
    path('crear-aspirante/', views.crear_aspirante),
    path('crear-bombero/', views.crear_bombero),
    path('cambiar-rango/', views.cambiar_rango_bombero),
    
    # Autenticación y sesión
    path('login/', views.inicio_sesion),
    
    # Gestión de contraseñas
    path('cambiar-contrasena/', views.cambiar_contraseña),
    path('solicitar-recuperacion/', views.solicitar_recuperacion),
    path('recuperar-contrasena/', views.cambiar_contraseña_recuperada),
]