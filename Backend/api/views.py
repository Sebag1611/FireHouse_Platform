from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets

from .models import (
    Persona, Bombero, Aspirante, Documento, Equipo, 
    EquipoAsignado, Actividad, Asistencia, Emergencia, 
    MaterialMayor, Despacho, Tripulacion
)
from .serializer import (
    PersonaSerializer, BomberoSerializer, AspiranteSerializer, 
    DocumentoSerializer, EquipoSerializer, EquipoAsignadoSerializer, 
    ActividadSerializer, AsistenciaSerializer, EmergenciaSerializer, 
    MaterialMayorSerializer, DespachoSerializer, TripulacionSerializer
)

# Dejamos tu vista de prueba intacta
@api_view(['GET'])
def mensaje_prueba(request):
    return Response({"mensaje": "¡Hola desde Django! La conexión fue un éxito."})

# --------------------------------------------------------
# VIEWSETS (Controladores automáticos que sacan los datos del Model)
# --------------------------------------------------------

class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer

class BomberoViewSet(viewsets.ModelViewSet):
    queryset = Bombero.objects.all()
    serializer_class = BomberoSerializer

class AspiranteViewSet(viewsets.ModelViewSet):
    queryset = Aspirante.objects.all()
    serializer_class = AspiranteSerializer

class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer

class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer

class EquipoAsignadoViewSet(viewsets.ModelViewSet):
    queryset = EquipoAsignado.objects.all()
    serializer_class = EquipoAsignadoSerializer

class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer

class AsistenciaViewSet(viewsets.ModelViewSet):
    queryset = Asistencia.objects.all()
    serializer_class = AsistenciaSerializer

class EmergenciaViewSet(viewsets.ModelViewSet):
    queryset = Emergencia.objects.all()
    serializer_class = EmergenciaSerializer

class MaterialMayorViewSet(viewsets.ModelViewSet):
    queryset = MaterialMayor.objects.all()
    serializer_class = MaterialMayorSerializer

class DespachoViewSet(viewsets.ModelViewSet):
    queryset = Despacho.objects.all()
    serializer_class = DespachoSerializer

class TripulacionViewSet(viewsets.ModelViewSet):
    queryset = Tripulacion.objects.all()
    serializer_class = TripulacionSerializer
