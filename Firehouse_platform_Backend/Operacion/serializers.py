from rest_framework import serializers
from Operacion.models import (
    Actividad,
    Asistencia,
    Emergencia,
    MaterialMayor,
    HistorialPosicion,
    Despacho,
    Tripulacion,
)
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


# NUEVO: reemplaza el diccionario armado a mano en las vistas
# Obtener_Material_Mayor y Listar_Material_Mayor
class MaterialMayorResumenSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialMayor
        fields = [
            'id_material',
            'nombre',
            'especialidad',
            'marca',
            'descripcion',
            'anio',
            'estado',
        ]


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


class MaterialMayorMapaSerializer(serializers.ModelSerializer):
    # coerce_to_string=False: devuelve numeros (-33.45) y no textos ("-33.450000"),
    # que es lo que esperan Leaflet, Google Maps, etc.
    latitud = serializers.DecimalField(
        max_digits=9, decimal_places=6, coerce_to_string=False, read_only=True
    )
    longitud = serializers.DecimalField(
        max_digits=9, decimal_places=6, coerce_to_string=False, read_only=True
    )

    class Meta:
        model = MaterialMayor
        fields = [
            'id_material',
            'nombre',
            'especialidad',
            'estado',
            'latitud',
            'longitud',
            'ultima_actualizacion',
        ]


class HistorialPosicionSerializer(serializers.ModelSerializer):
    latitud = serializers.DecimalField(
        max_digits=9, decimal_places=6, coerce_to_string=False, read_only=True
    )
    longitud = serializers.DecimalField(
        max_digits=9, decimal_places=6, coerce_to_string=False, read_only=True
    )

    class Meta:
        model = HistorialPosicion
        fields = ['id_historial', 'material', 'latitud', 'longitud', 'timestamp']
        read_only_fields = ['id_historial', 'timestamp']


class ActualizarPosicionSerializer(serializers.Serializer):
    # Rangos validos de coordenadas: evita guardar posiciones imposibles
    latitud = serializers.DecimalField(
        max_digits=9, decimal_places=6, min_value=-90, max_value=90
    )
    longitud = serializers.DecimalField(
        max_digits=9, decimal_places=6, min_value=-180, max_value=180
    )


class CambiarEstadoSerializer(serializers.Serializer):
    # Cuando definas los estados oficiales, cambia esto por un ChoiceField:
    # estado = serializers.ChoiceField(choices=['Disponible', 'En emergencia', 'Fuera de servicio'])
    estado = serializers.CharField(max_length=50, allow_blank=False, trim_whitespace=True)