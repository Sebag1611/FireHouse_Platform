from rest_framework import serializers
from Administracion.models import *

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'
        extra_kwargs = {
            'contraseña': {'write_only': True}
        }

class BomberoSerializer(serializers.ModelSerializer):
    # Esto es para extraer los datos de persona a bombero, por ejemplo, nombre y apellido
    datos_persona = PersonaSerializer(source='rut', read_only=True)

    class Meta:
        model = Bombero
        fields = '__all__'

class AspiranteSerializer(serializers.ModelSerializer):
    datos_persona = PersonaSerializer(source='rut', read_only=True)

    class Meta:
        model = Aspirante
        fields = '__all__'

class DocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = '__all__'

class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'

class Equipo_AsignadoSerializer(serializers.ModelSerializer):
    # Muestra el detalle del equipo y no solo el código
    detalle_equipo = EquipoSerializer(source='codigo', read_only=True)
    
    class Meta:
        model = Equipo_Asignado
        fields = '__all__'