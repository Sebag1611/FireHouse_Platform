from rest_framework import serializers
from Administracion.models import *

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