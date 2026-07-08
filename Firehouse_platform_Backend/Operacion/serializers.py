from rest_framework import serializers
from Operacion.models import *

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