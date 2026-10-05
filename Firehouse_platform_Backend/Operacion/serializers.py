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

class CursoSerializer(serializers.ModelSerializer):
    # Creamos un campo extra para enviar el listado de nombres de los inscritos
    inscritos = serializers.SerializerMethodField()

    class Meta:
        model = Curso
        fields = ['id_curso', 'nombre', 'oficial_a_cargo', 'fecha', 'cupos', 'estado', 'inscritos']

    def get_inscritos(self, obj):
        # Esto busca todos los bomberos inscritos en este curso específico
        # Asume que tu modelo Bombero tiene un campo que lo identifica (ej: __str__ o 'nombre')
        return [inscripcion.bombero.__str__() for inscripcion in obj.inscritos.all()]