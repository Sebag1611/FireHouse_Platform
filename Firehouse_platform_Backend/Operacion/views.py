from django.shortcuts import render
from Operacion.models import *
from Administracion.models import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import status
from Operacion.serializers import *
from datetime import datetime
from django.db import transaction

# Create your views here.

#Material mayor
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
    materiales = MaterialMayor.objects.all().order_by('id_material')
    
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

@api_view(['PUT'])
def Editar_material_mayor(request, id_material):
    try:
        material = MaterialMayor.objects.get(id_material=id_material)
    except MaterialMayor.DoesNotExist:
        return Response(
            {"error": "Material mayor no encontrado."}, 
            status=status.HTTP_404_NOT_FOUND
        )
    serializer = MaterialMayorSerializer(material, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"mensaje": "Estado actualizado con éxito", "data": serializer.data}, 
            status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#cursos
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

@api_view(['GET'])
def listar_cursos(request):
    # Traemos todos los cursos de la base de datos
    cursos = Curso.objects.all().order_by('-fecha')
    serializer = CursoSerializer(cursos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def crear_curso(request):
    serializer = CursoSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"mensaje": "Curso creado con éxito", "data": serializer.data}, 
            status=status.HTTP_201_CREATED
        )
        
    # Si falta algún dato o el formato es incorrecto, devuelve el error
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def eliminar_curso(request, id_curso):
    try:
        curso = Curso.objects.get(id_curso=id_curso) 
        curso.delete()
        
        return Response(
            {"mensaje": "Curso eliminado correctamente"},
            status=status.HTTP_200_OK
        )
    except Curso.DoesNotExist:
        return Response(
            {"error": "El curso no existe o ya fue eliminado"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": f"Error al eliminar: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
def desinscribir_curso(request):
    rut_bombero = request.data.get('rut_bombero')
    id_curso = request.data.get('id_curso')

    if not rut_bombero or not id_curso:
        return Response(
            {"error": "Faltan datos para desinscribir."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        inscripcion = Inscripcion_Curso.objects.get(
            bombero_id=rut_bombero,
            curso_id=id_curso
        )
        inscripcion.delete()
        
        return Response(
            {"mensaje": "Desinscripción realizada con éxito"},
            status=status.HTTP_200_OK
        )
    except Inscripcion_Curso.DoesNotExist:
        return Response(
            {"error": "El bombero no está inscrito en este curso."},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": f"Error del servidor: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

#Emergencias
@api_view(['GET'])
def listar_emergencias(request):
    emergencias = Emergencia.objects.all().order_by('-id_emergencia')
    datos = []
    for e in emergencias:
        datos.append({
            "id": e.id_emergencia,
            "clave": f"{e.clave} · {e.nombre}",
            "descripcion": e.descripcion,
            "sector": e.sector,
            "fecha": str(e.fecha) if e.fecha else "",
            "hora": str(e.hora) if e.hora else ""
        })
    return Response(datos, status=status.HTTP_200_OK)

@api_view(['POST'])
def crear_emergencia(request):
    clave = request.data.get('claveTipo')
    nombre = request.data.get('nombreTipo')
    descripcion = request.data.get('descripcion', '')
    sector = request.data.get('sector')
    
    # Tomamos la fecha y hora actuales si no vienen del front
    fecha = request.data.get('fecha', datetime.now().date())
    hora = request.data.get('hora', datetime.now().time())

    try:
        with transaction.atomic():
            actividad = Actividad.objects.create(
                tipo="Emergencia",
                descripcion=f"Llamado {clave} en {sector}",
                fecha=fecha,
                hora=hora
            )

            emergencia = Emergencia.objects.create(
                clave=clave,
                nombre=nombre,
                descripcion=descripcion,
                sector=sector,
                fecha=fecha,
                hora=hora,
                id_actividad=actividad
            )
            
        return Response({"mensaje": "Emergencia registrada con éxito"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def eliminar_emergencia(request, id_emergencia):
    try:
        emergencia = Emergencia.objects.get(id_emergencia=id_emergencia)
        actividad = emergencia.id_actividad
        emergencia.delete()
        if actividad:
            actividad.delete()
        return Response({"mensaje": "Eliminada correctamente"}, status=status.HTTP_200_OK)
    except Emergencia.DoesNotExist:
        return Response({"error": "La emergencia no existe"}, status=status.HTTP_404_NOT_FOUND)