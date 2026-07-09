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