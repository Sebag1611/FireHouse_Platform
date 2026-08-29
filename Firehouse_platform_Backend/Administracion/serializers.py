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

class Encuesta_GuardiaSerializer(serializers.ModelSerializer):

    creado_por = BomberoSerializer(read_only=True)

    class Meta:
        model = Encuesta_Guardia
        fields = '__all__'


class GuardiaSerializer(serializers.ModelSerializer):

    encuesta = Encuesta_GuardiaSerializer(read_only=True)

    oficial_a_cargo = BomberoSerializer(read_only=True)

    maquinista = BomberoSerializer(read_only=True)

    class Meta:
        model = Guardia
        fields = '__all__'


class Inscripcion_GuardiaSerializer(serializers.ModelSerializer):

    bombero = BomberoSerializer(read_only=True)

    guardia = GuardiaSerializer(read_only=True)

    class Meta:
        model = Inscripcion_Guardia
        fields = '__all__'


class Tarea_GuardiaSerializer(serializers.ModelSerializer):

    guardia = GuardiaSerializer(read_only=True)

    class Meta:
        model = Tarea_Guardia
        fields = '__all__'


class Instruccion_GuardiaSerializer(serializers.ModelSerializer):

    encuesta = Encuesta_GuardiaSerializer(read_only=True)

    class Meta:
        model = Instruccion_Guardia
        fields = '__all__'


# SERIALIZER ASISTENCIA DE GUARDIA

class Asistencia_GuardiaSerializer(serializers.ModelSerializer):

    inscripcion = Inscripcion_GuardiaSerializer(read_only=True)

    class Meta:

        model = Asistencia_Guardia

        fields = '__all__'

# SERIALIZER RECUPERACIÓN DE CONTRASEÑA

class RecuperacionContraseñaSerializer(serializers.ModelSerializer):

    class Meta:

        model = RecuperacionContraseña

        fields = "__all__"

# SERIALIZER IMAGEN PUBLICA

class Imagen_PublicaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Imagen_Publica
        fields = '__all__'

# SERIALIZER DISPONIBILIDAD DEL BOMBERO

class Jornada_Laboral_BomberoSerializer(serializers.ModelSerializer):

    bombero = BomberoSerializer(read_only=True)


    class Meta:

        model = Jornada_Laboral_Bombero

        fields = '__all__'

# SERIALIZER EXCEPCION DE DISPONIBILIDAD

class Excepcion_DisponibilidadSerializer(serializers.ModelSerializer):

    bombero = BomberoSerializer(read_only=True)


    class Meta:

        model = Excepcion_Disponibilidad

        fields = '__all__'