from django.urls import path
from Administracion import views

urlpatterns = [
       # Gestión de usuarios
    path('crear-aspirante/', views.crear_aspirante),
    path('crear-bombero/', views.crear_bombero),
    path('Personal/listar/', views.listar_personal),
    path('cambiar-rango/', views.cambiar_rango_bombero),
    
    # Autenticación y sesión
    path('perfil/', views.obtener_perfil),
    path('login/', views.inicio_sesion),
    
    # Gestión de contraseñas
    path('cambiar-contrasena/', views.cambiar_contraseña),
    path('solicitar-recuperacion/', views.solicitar_recuperacion),
    path('recuperar-contrasena/', views.cambiar_contraseña_recuperada),

    #Noticias
    path('noticias/', views.listar_noticias),
    path('noticias/crear/', views.crear_noticia),
    path('noticias/eliminar/<int:id_noticia>/', views.eliminar_noticia),
    path('noticias/editar/<int:id_noticia>/', views.editar_noticia),
]