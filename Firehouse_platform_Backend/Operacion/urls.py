from django.urls import path
from Operacion import views

urlpatterns = [
    # Existentes
    path('MaterialMayor/', views.Obtener_Material_Mayor),
    path('MaterialMayor/listar/', views.Listar_Material_Mayor),
    path('cursos/inscribir/', views.inscribir_bombero, name='inscribir_bombero'),

    # Mapa / Geolocalización
    path('mapa/unidades/', views.listar_unidades_mapa, name='listar_unidades_mapa'),
    path('mapa/unidades/<str:id_material>/', views.obtener_posicion_unidad, name='obtener_posicion_unidad'),
    path('mapa/unidades/<str:id_material>/actualizar/', views.actualizar_posicion, name='actualizar_posicion'),
    path('mapa/unidades/<str:id_material>/historial/', views.historial_posicion, name='historial_posicion'),
]