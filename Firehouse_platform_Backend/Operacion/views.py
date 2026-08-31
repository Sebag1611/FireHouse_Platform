from django.shortcuts import render
from Operacion.models import *
from Administracion.models import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import status
from Operacion.serializers import *

# Create your views here.

@api_view(['GET'])
def Obtener_Material_Mayor(request):
    id_material = request.query_params.get('id_material')
    
    if not id_material:
        return Response({"error": "Debes proporcionar un id_material válido."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Se guarda el objeto
        material = MaterialMayor.objects.get(id_material=id_material)
    except MaterialMayor.DoesNotExist:
        return Response({"error": "Material mayor no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    serializer = MaterialMayorSerializer(material)
    
    # Extraer solo las columnas especificas
    datos_especificos = {
        "id_material": serializer.data.get("id_material"),
        "nombre": serializer.data.get("nombre"),
        "especialidad": serializer.data.get("especialidad"),
        "marca": serializer.data.get("marca"),
        "descripcion": serializer.data.get("descripcion"),
        "anio": serializer.data.get("anio"),
        "estado": serializer.data.get("estado")
    }
    
    return Response(datos_especificos, status=status.HTTP_200_OK)

@api_view(['GET'])
def Listar_Material_Mayor(request):
    materiales = MaterialMayor.objects.all()
    serializer = MaterialMayorSerializer(materiales, many=True)
    
    datos = [
        {
            "id_material": item.get("id_material"),
            "nombre": item.get("nombre"),
            "especialidad": item.get("especialidad"),
            "marca": item.get("marca"),
            "descripcion": item.get("descripcion"),
            "anio": item.get("anio"),
            "estado": item.get("estado")
        }
        for item in serializer.data
    ]
    
    return Response(datos, status=status.HTTP_200_OK)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Curso, Inscripcion_Curso

@api_view(['POST'])
def inscribir_bombero(request):
    curso_id = request.data.get('id_curso')
    bombero_rut = request.data.get('rut_bombero')

    curso = Curso.objects.get(id_curso=curso_id)

    # 1. Verificar si ya está cerrado
    if curso.estado == "CERRADO":
        return Response({"error": "El curso ya está cerrado."}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Contar inscritos actuales
    cantidad_inscritos = curso.inscritos.count()

    # 3. Verificar cupos
    if cantidad_inscritos >= curso.cupos:
        # Si se llenó justo ahora, lo cerramos por seguridad
        curso.estado = "CERRADO"
        curso.save()
        return Response({"error": "No quedan cupos disponibles."}, status=status.HTTP_400_BAD_REQUEST)

    # 4. Inscribir al bombero
    Inscripcion_Curso.objects.create(curso=curso, bombero_id=bombero_rut)

    # 5. Cierre automático post-inscripción si se alcanzó el límite
    if (cantidad_inscritos + 1) >= curso.cupos:
        curso.estado = "CERRADO"
        curso.save()

    return Response({"mensaje": "Inscrito con éxito"}, status=status.HTTP_201_CREATED)