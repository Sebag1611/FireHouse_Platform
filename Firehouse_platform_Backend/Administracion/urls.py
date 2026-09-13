from django.urls import path
from . import views

app_name = 'administracion'

urlpatterns = [
    # =========================
    # Autenticación
    # =========================
    path('auth/login/', views.inicio_sesion, name='login'),
    path('auth/change-password/', views.cambiar_contraseña, name='change_password'),
    path('auth/password-recovery/request/', views.solicitar_recuperacion, name='password_recovery_request'),
    path('auth/password-recovery/confirm/', views.cambiar_contraseña_recuperada, name='password_recovery_confirm'),

    # =========================
    # Gestión de Personal
    # =========================
    path('personal/aspirantes/', views.crear_aspirante, name='create_aspirante'),
    path('personal/bomberos/', views.crear_bombero, name='create_bombero'),
    path('personal/bomberos/rango/', views.cambiar_rango_bombero, name='update_bombero_rank'),
    path('personal/bomberos/estado/', views.cambiar_estado_bombero, name='update_bombero_status'),

    # =========================
    # Encuestas de Guardia
    # =========================
    path('encuestas/', views.listar_encuestas, name='list_encuestas'),
    path('encuestas/crear/', views.crear_encuesta, name='create_encuesta'),
    path('encuestas/<int:id_encuesta>/guardias/', views.listar_guardias, name='list_guardias'),
    path('encuestas/guardias/crear/', views.crear_guardia, name='create_guardia'),
    path('encuestas/guardias/tomar/', views.tomar_guardia, name='take_guardia'),
    path('encuestas/guardias/cancelar/', views.cancelar_guardia, name='cancel_guardia'),
    path('encuestas/guardias/<int:id_guardia>/disponibles/', views.listar_bomberos_disponibles_guardia, name='list_available_bomberos'),

    # =========================
    # Jornadas Laborales
    # =========================
    path('jornadas/', views.crear_jornada_laboral, name='create_jornada'),
    path('jornadas/cambiar/', views.cambiar_jornada_laboral, name='update_jornada'),
    path('jornadas/bombero/<str:rut>/', views.listar_jornadas_bombero, name='list_jornadas_bombero'),

    # =========================
    # Disponibilidad
    # =========================
    path('disponibilidad/excepciones/', views.crear_excepcion_disponibilidad, name='create_excepcion'),
    path('disponibilidad/excepciones/bombero/<str:rut>/', views.listar_excepciones_bombero, name='list_excepciones_bombero'),
    path('disponibilidad/bombero/<str:rut>/<str:fecha>/', views.consultar_disponibilidad_bombero, name='check_disponibilidad'),
]