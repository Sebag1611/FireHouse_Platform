from django.urls import path
from Operacion import views

urlpatterns = [
    path('MaterialMayor/', views.Obtener_Material_Mayor),
    path('MaterialMayor/listar/', views.Listar_Material_Mayor),
    path('MaterialMayor/<str:id_material>/editar/', views.Editar_material_mayor, name='editar_material_mayor'),
    path('cursos/inscribir/', views.inscribir_bombero, name='inscribir_bombero'),
    path('Cursos/crear/', views.crear_curso),
    path('cursos/', views.listar_cursos, name='cursos')
]