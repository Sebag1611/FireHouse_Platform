from rest_framework import serializers
from .models import (
    Persona, Bombero, Aspirante, Documento, Equipo, 
    Equipo_Asignado, Actividad, Asistencia, Emergencia, 
    MaterialMayor, Despacho, Tripulacion
)

# SERIALIZADOR PRINCIPAL
class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'

# SERIALIZADORES DE ROLES
class BomberoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bombero
        fields = '__all__'

class AspiranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aspirante
        fields = '__all__'


# SERIALIZADORES DE DOCUMENTOS Y EQUIPOS
class DocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = '__all__'

class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'

class EquipoAsignadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo_Asignado
        fields = '__all__'

# SERIALIZADORES DE ACTIVIDADES
class ActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = '__all__'

class AsistenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistencia
        fields = '__all__'

# SERIALIZADORES DE EMERGENCIAS Y DESPACHOS
class EmergenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emergencia
        fields = '__all__'

class MaterialMayorSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialMayor
        fields = '__all__'

class DespachoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Despacho
        fields = '__all__'

class TripulacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tripulacion
        fields = '__all__'