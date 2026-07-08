from django.db import models
from Administracion.models import *

# Create your models here.
# ACTIVIDADES Y ASISTENCIAS
class Actividad(models.Model):
    id_actividad = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha = models.DateField(null=True, blank=True)
    hora = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.tipo} - {self.fecha}"

class Asistencia(models.Model):
    id_asistencia = models.AutoField(primary_key=True)
    rut = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='RUT')
    id_actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE, db_column='id_actividad')
    estado = models.CharField(max_length=50)

# EMERGENCIAS, DESPACHO Y MATERIAL MAYOR
class Emergencia(models.Model):
    id_emergencia = models.AutoField(primary_key=True)
    clave = models.CharField(max_length=50, db_column='Clave')
    nombre = models.CharField(max_length=150, db_column='Nombre')
    descripcion = models.TextField(db_column='Descripcion')
    sector = models.CharField(max_length=100, db_column='Sector')
    hora = models.TimeField(null=True, blank=True, db_column='Hora')
    fecha = models.DateField(null=True, blank=True, db_column='Fecha')
    id_actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE, db_column='id_actividad')

    def __str__(self):
        return self.nombre

class MaterialMayor(models.Model):
    id_material = models.CharField(max_length=50, primary_key=True)
    nombre = models.CharField(max_length=100, db_column='Nombre')
    especialidad = models.CharField(max_length=100, db_column='Especialidad')
    marca = models.CharField(max_length=100, db_column='Marca')
    descripcion = models.TextField(db_column='Descripcion')
    anio = models.IntegerField(db_column='Anio')
    estado = models.CharField(max_length=50, db_column='Estado')
    latitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, db_column='Latitud')
    longitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, db_column='Longitud')

    def __str__(self):
        return self.nombre

class Despacho(models.Model):
    id_despacho = models.AutoField(primary_key=True)
    id_emergencia = models.ForeignKey(Emergencia, on_delete=models.CASCADE, db_column='id_emergencia')
    id_material_mayor = models.ForeignKey(MaterialMayor, on_delete=models.CASCADE, db_column='id_material_mayor')
    hora_despacho = models.TimeField(null=True, blank=True)
    hora_regreso = models.TimeField(null=True, blank=True)

class Tripulacion(models.Model):
    id_tripulacion = models.AutoField(primary_key=True)
    id_despacho = models.ForeignKey(Despacho, on_delete=models.CASCADE, db_column='id_despacho')
    rut = models.ForeignKey(Bombero, on_delete=models.CASCADE, db_column='RUT')
    funcion = models.CharField(max_length=100)