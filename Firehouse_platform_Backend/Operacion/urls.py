from django.urls import path
from Operacion import views

urlpatterns = [
    path('MaterialMayor/', views.Obtener_Material_Mayor),
    path('MaterialMayor/listar/', views.Listar_Material_Mayor),
]