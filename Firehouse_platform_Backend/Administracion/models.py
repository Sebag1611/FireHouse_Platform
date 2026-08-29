from django.db import models
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class Persona(models.Model):
    rut = models.CharField(max_length=15, primary_key=True, db_column='RUT')
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    telefono = models.CharField(max_length=50)
    correo = models.CharField(max_length=100)
    contraseña = models.CharField(max_length=255)
    direccion = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

# HERENCIAS / ROLES DE PERSONA
class Bombero(models.Model):
    rut = models.OneToOneField(Persona, on_delete=models.CASCADE, primary_key=True, db_column='RUT')
    fecha_ingreso = models.DateField(null=True, blank=True)
    rango = models.CharField(max_length=100)
    nivel = models.CharField(max_length=100)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"Bombero: {self.rut}"

class Aspirante(models.Model):

    rut = models.OneToOneField(
        Persona,
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='RUT'
    )

    fecha_ingreso = models.DateField(null=True, blank=True)

    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"Aspirante: {self.rut}"

# TABLAS RELACIONADAS A PERSONA / BOMBERO
class Documento(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=100)
    fecha_emision = models.DateField(null=True, blank=True)
    fecha_vencimiento = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=50)
    ruta_archivo = models.CharField(max_length=255)
    rut = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='RUT')

class Equipo(models.Model):
    codigo = models.CharField(max_length=50, primary_key=True, db_column='Codigo')
    nombre = models.CharField(max_length=100)
    marca = models.CharField(max_length=100)
    tipo = models.CharField(max_length=100)
    talla = models.CharField(max_length=20)

    def __str__(self):
        return self.nombre

class Equipo_Asignado(models.Model):
    id_asignacion = models.AutoField(primary_key=True)
    rut = models.ForeignKey(Bombero, on_delete=models.CASCADE, db_column='RUT')
    codigo = models.ForeignKey(Equipo, on_delete=models.CASCADE, db_column='Codigo')
    fecha_asignacion = models.DateField(null=True, blank=True)
    fecha_devolucion = models.DateField(null=True, blank=True)

class Encuesta_Guardia(models.Model):

    ESTADO_ENCUESTA = [
        ("ABIERTA", "Abierta"),
        ("CERRADA", "Cerrada"),
    ]

    id_encuesta = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_ENCUESTA,
        default="ABIERTA"
    )

    fecha_creacion = models.DateField(auto_now_add=True)

    creado_por = models.ForeignKey(
        Bombero,
        on_delete=models.CASCADE,
        db_column="Creado_Por"
    )

    def __str__(self):
        return self.titulo
    
class Guardia(models.Model):

    TIPO_GUARDIA = [
        ("DIA", "Día"),
        ("NOCHE", "Noche"),
    ]

    ESTADO_GUARDIA = [
        ("ABIERTA", "Abierta"),
        ("COMPLETA", "Completa"),
        ("CERRADA", "Cerrada"),
    ]

    id_guardia = models.AutoField(primary_key=True)

    encuesta = models.ForeignKey(
        Encuesta_Guardia,
        on_delete=models.CASCADE,
        db_column="Id_Encuesta"
    )

    fecha = models.DateField()

    tipo = models.CharField(
        max_length=10,
        choices=TIPO_GUARDIA
    )

    numero = models.IntegerField()

    hora_inicio = models.TimeField()

    hora_fin = models.TimeField()

    cupos = models.IntegerField(default=4)

    oficial_a_cargo = models.ForeignKey(
        Bombero,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="oficial_guardias",
        db_column="Oficial_A_Cargo"
    )

    maquinista = models.ForeignKey(
        Bombero,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="maquinista_guardias",
        db_column="Maquinista"
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_GUARDIA,
        default="ABIERTA"
    )

    def __str__(self):
        return f"{self.fecha} - {self.get_tipo_display()} {self.numero}"
    
class Inscripcion_Guardia(models.Model):
    id_inscripcion = models.AutoField(primary_key=True)

    guardia = models.ForeignKey(
        Guardia,
        on_delete=models.CASCADE,
        db_column="Id_Guardia"
    )

    bombero = models.ForeignKey(
        Bombero,
        on_delete=models.CASCADE,
        db_column="RUT"
    )

    fecha_inscripcion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bombero} - {self.guardia}"

class Tarea_Guardia(models.Model):

    ESTADO_TAREA = [
        ("PENDIENTE", "Pendiente"),
        ("EN_PROCESO", "En proceso"),
        ("COMPLETADA", "Completada"),
    ]

    id_tarea = models.AutoField(primary_key=True)

    guardia = models.ForeignKey(
        Guardia,
        on_delete=models.CASCADE,
        db_column="Id_Guardia"
    )

    titulo = models.CharField(max_length=100)

    descripcion = models.CharField(
        max_length=300,
        blank=True,
        null=True
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_TAREA,
        default="PENDIENTE"
    )

    def __str__(self):
        return self.titulo


class Instruccion_Guardia(models.Model):
    id_instruccion = models.AutoField(primary_key=True)

    encuesta = models.ForeignKey(
        Encuesta_Guardia,
        on_delete=models.CASCADE,
        db_column="Id_Encuesta"
    )

    descripcion = models.TextField()

    def __str__(self):
        return self.descripcion[:50]
    
class Asistencia_Guardia(models.Model):

    ESTADO_ASISTENCIA = [
        ("PRESENTE", "Presente"),
        ("AUSENTE", "Ausente"),
        ("JUSTIFICADO", "Justificado"),
    ]

    id_asistencia = models.AutoField(primary_key=True)

    inscripcion = models.OneToOneField(
        Inscripcion_Guardia,
        on_delete=models.CASCADE,
        db_column="Id_Inscripcion"
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_ASISTENCIA,
        default="PRESENTE"
    )

    hora_llegada = models.DateTimeField(
        null=True,
        blank=True
    )

    observacion = models.CharField(
        max_length=300,
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.inscripcion}"

class RecuperacionContraseña(models.Model):

    id_recuperacion = models.AutoField(primary_key=True)

    persona = models.ForeignKey(
        Persona,
        on_delete=models.CASCADE,
        db_column="RUT"
    )

    codigo = models.CharField(max_length=6)

    fecha_creacion = models.DateTimeField(auto_now_add=True)

    usado = models.BooleanField(default=False)


    def valido(self):

        return timezone.now() <= self.fecha_creacion + timedelta(minutes=10)


    def __str__(self):

        return f"{self.persona.rut} - {self.codigo}"

class Imagen_Publica(models.Model):

    id_imagen = models.AutoField(primary_key=True)

    imagen = models.ImageField(
        upload_to="publico/"
    )

    descripcion = models.CharField(
        max_length=300
    )

    fecha_subida = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.descripcion



class Jornada_Laboral_Bombero(models.Model):

    id_jornada = models.AutoField(
        primary_key=True
    )

    bombero = models.ForeignKey(
        Bombero,
        on_delete=models.CASCADE,
        db_column="RUT"
    )

    dias_trabajo = models.IntegerField()

    dias_libres = models.IntegerField()

    fecha_inicio = models.DateField()

    fecha_fin = models.DateField(
        null=True,
        blank=True
    )

    estado_inicial = models.CharField(
        max_length=20,
        choices=[
            ("TRABAJO", "Trabajando"),
            ("LIBRE", "Libre"),
        ],
        default="TRABAJO"
    )

    activa = models.BooleanField(
        default=True
    )

    def __str__(self):

        return f"{self.bombero} - {self.dias_trabajo}x{self.dias_libres}"


class Excepcion_Disponibilidad(models.Model):

    TIPO_EXCEPCION = [
        ("VACACIONES", "Vacaciones"),
        ("PERMISO", "Permiso"),
        ("LICENCIA", "Licencia"),
        ("VIAJE", "Viaje"),
        ("NO_DISPONIBLE", "No disponible"),
    ]


    id_excepcion = models.AutoField(
        primary_key=True
    )


    bombero = models.ForeignKey(
        Bombero,
        on_delete=models.CASCADE,
        db_column="RUT"
    )


    tipo = models.CharField(
        max_length=30,
        choices=TIPO_EXCEPCION
    )


    fecha_inicio = models.DateField()


    fecha_fin = models.DateField()


    descripcion = models.CharField(
        max_length=300,
        null=True,
        blank=True
    )


    def __str__(self):

        return f"{self.bombero} - {self.tipo}"