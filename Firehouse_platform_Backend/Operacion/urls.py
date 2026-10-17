from django.urls import path
from Operacion import views

urlpatterns = [
    #Material Mayor
    path('MaterialMayor/', views.Obtener_Material_Mayor),
    path('MaterialMayor/listar/', views.Listar_Material_Mayor),
    path('MaterialMayor/<str:id_material>/editar/', views.Editar_material_mayor, name='editar_material_mayor'),

    #Cursos
    path('cursos/inscribir/', views.inscribir_bombero, name='inscribir_bombero'),
    path('Cursos/crear/', views.crear_curso),
    path('cursos/', views.listar_cursos, name='cursos'),
    path('cursos/eliminar/<int:id_curso>/', views.eliminar_curso),
    path('cursos/desinscribir/', views.desinscribir_curso),

    #Emergencias
    path('emergencias/listar/', views.listar_emergencias),
    path('emergencias/crear/', views.crear_emergencia),
    path('emergencias/eliminar/<int:id_emergencia>/', views.eliminar_emergencia),

    # Mapa / Geolocalización
    #path('mapa/unidades/', views.listar_unidades_mapa, name='listar_unidades_mapa'),
    #path('mapa/unidades/<str:id_material>/', views.obtener_posicion_unidad, name='obtener_posicion_unidad'),
    #path('mapa/unidades/<str:id_material>/actualizar/', views.actualizar_posicion, name='actualizar_posicion'),
    #path('mapa/unidades/<str:id_material>/historial/', views.historial_posicion, name='historial_posicion'),
]