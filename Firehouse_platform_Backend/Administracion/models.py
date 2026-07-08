from django.db import models

# Create your models here.
class Persona(models.Model):
    rut = models.CharField(max_length=15, primary_key=True, db_column='RUT')
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    telefono = models.CharField(max_length=50)
    correo = models.CharField(max_length=100)
    contraseña = models.CharField(max_length=32)
    direccion = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

# HERENCIAS / ROLES DE PERSONA
class Bombero(models.Model):
    rut = models.OneToOneField(Persona, on_delete=models.CASCADE, primary_key=True, db_column='RUT')
    fecha_ingreso = models.DateField(null=True, blank=True)
    rango = models.CharField(max_length=100)
    nivel = models.CharField(max_length=100)

    def __str__(self):
        return f"Bombero: {self.rut}"

class Aspirante(models.Model):
    rut = models.OneToOneField(Persona, on_delete=models.CASCADE, primary_key=True, db_column='RUT')
    fecha_ingreso = models.DateField(null=True, blank=True)

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