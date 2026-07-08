from rest_framework import serializers
from Operacion.models import *
from Administracion.serializers import PersonaSerializer, BomberoSerializer

class ActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = '__all__'

class AsistenciaSerializer(serializers.ModelSerializer):
    detalle_persona = PersonaSerializer(source='rut', read_only=True)
    
    class Meta:
        model = Asistencia
        fields = '__all__'

class EmergenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emergencia
        fields = '__all__'

class MaterialMayorSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialMayor
        fields = '__all__'

class DespachoSerializer(serializers.ModelSerializer):
    # Detalles de que carro fue y que emergencia es la que se despacha
    detalle_emergencia = EmergenciaSerializer(source='id_emergencia', read_only=True)
    detalle_material = MaterialMayorSerializer(source='id_material_mayor', read_only=True)

    class Meta:
        model = Despacho
        fields = '__all__'

class TripulacionSerializer(serializers.ModelSerializer):
    # Extrae el bombero
    detalle_bombero = BomberoSerializer(source='rut', read_only=True)

    class Meta:
        model = Tripulacion
        fields = '__all__'