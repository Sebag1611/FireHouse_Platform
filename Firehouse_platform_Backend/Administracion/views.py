# Importaciones de Django
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password

# Importaciones propias
from Administracion.models import *
from Administracion.serializers import *
from Operacion.models import *
import random

# ==========================================
# VALIDAR RUT CHILENO
# ==========================================
def validar_rut(rut):

    # Verificar que el RUT no esté vacío
    if not rut:
        return False

    # Eliminar puntos y guion para realizar la validación
    rut = rut.replace(".", "").replace("-", "").upper()

    # Verificar longitud mínima
    if len(rut) < 2:
        return False

    # Separar cuerpo y dígito verificador
    cuerpo = rut[:-1]
    dv = rut[-1]

    # Verificar que el cuerpo solo contenga números
    if not cuerpo.isdigit():
        return False

    # Calcular dígito verificador
    suma = 0
    multiplicador = 2

    for numero in reversed(cuerpo):

        suma += int(numero) * multiplicador

        multiplicador += 1

        if multiplicador > 7:
            multiplicador = 2

    # Obtener resultado del cálculo
    resto = suma % 11
    resultado = 11 - resto

    # Determinar el dígito verificador esperado
    if resultado == 11:
        dv_calculado = "0"

    elif resultado == 10:
        dv_calculado = "K"

    else:
        dv_calculado = str(resultado)

    # Comparar el dígito ingresado con el calculado
    return dv == dv_calculado

# ==========================================
# FORMATEAR RUT PARA GUARDAR EN LA BD
# Formato: 12345678-5
# ==========================================
def formatear_rut(rut):

    # Eliminar puntos y guiones
    rut = rut.replace(".", "").replace("-", "").upper()

    # Separar cuerpo y dígito verificador
    cuerpo = rut[:-1]
    dv = rut[-1]

    # Retornar el RUT con el formato utilizado en la base de datos
    return f"{cuerpo}-{dv}"

# ==========================================
# VERIFICAR PERMISOS ADMINISTRATIVOS
# Solo Capitán o Director
# ==========================================
def tiene_permiso_administrativo(rut):

    try:

        # Buscar la persona
        persona = Persona.objects.get(rut=rut)

        # Buscar el registro de bombero
        bombero = Bombero.objects.get(rut=persona)

        # Obtener el rango del bombero
        rango = bombero.rango.lower()

        # Verificar si tiene permisos administrativos
        if rango in ["capitan", "director"]:
            return True

        return False

    # Si la persona o el bombero no existen, no tiene permisos
    except (Persona.DoesNotExist, Bombero.DoesNotExist):

        return False
    
#==============================================
# CREAR ASPIRANTE
#Solo Capiran o Director Pueden realizarlo
#==============================================

@api_view(['POST'])
def crear_aspirante(request):

    rut_creador = request.data.get('rut_creador')

    if not tiene_permiso_administrativo(rut_creador):

        return Response(
            {
                "error": "No tiene permisos para crear aspirantes"
            },
            status=status.HTTP_403_FORBIDDEN
        )

    rut = request.data.get('rut')


    if not validar_rut(rut):

        return Response(
            {
                "error": "El RUT ingresado no es válido"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    rut = formatear_rut(rut)


    if Persona.objects.filter(rut=rut).exists():

        return Response(
            {
                "error": "El RUT ya está registrado"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    persona = Persona.objects.create(

        rut=rut,
        nombres=request.data.get('nombres'),
        apellidos=request.data.get('apellidos'),
        telefono=request.data.get('telefono'),
        correo=request.data.get('correo'),

        contraseña=make_password(
            request.data.get('contraseña')
        ),

        direccion=request.data.get('direccion')
    )

    Aspirante.objects.create(

        rut=persona,
        fecha_ingreso=request.data.get('fecha_ingreso')

    )

    return Response(

        {
            "mensaje": "Aspirante creado correctamente",
            "rut": persona.rut,
            "nombre": persona.nombres,
            "apellido": persona.apellidos
        },

        status=status.HTTP_201_CREATED
    )

#==============================================
# CREAR BOMBERO
#Solo Capitan o Director pueden realizarlo
#==============================================

@api_view(['POST'])
def crear_bombero(request):

    rut_creador = request.data.get('rut_creador')


    if not tiene_permiso_administrativo(rut_creador):

        return Response(
            {
                "error": "No tiene permisos para crear bomberos"
            },
            status=status.HTTP_403_FORBIDDEN
        )


    rut = request.data.get('rut')


    if not validar_rut(rut):

        return Response(
            {
                "error": "El RUT ingresado no es válido"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    rut = formatear_rut(rut)

    if Persona.objects.filter(rut=rut).exists():

        return Response(
            {
                "error": "El RUT ya está registrado"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    persona = Persona.objects.create(

        rut=rut,
        nombres=request.data.get('nombres'),
        apellidos=request.data.get('apellidos'),
        telefono=request.data.get('telefono'),
        correo=request.data.get('correo'),

        contraseña=make_password(
            request.data.get('contraseña')
        ),

        direccion=request.data.get('direccion')
    )

    Bombero.objects.create(

        rut=persona,
        fecha_ingreso=request.data.get('fecha_ingreso'),
        rango=request.data.get('rango'),
        nivel=request.data.get('nivel')

    )

    return Response(

        {
            "mensaje": "Bombero creado correctamente",
            "rut": persona.rut,
            "nombre": persona.nombres,
            "apellido": persona.apellidos,
            "rango": request.data.get('rango'),
            "nivel": request.data.get('nivel')
        },

        status=status.HTTP_201_CREATED
    )

# ==========================================================
# CAMBIAR RANGO DE BOMBERO
# Permite modificar el rango de un bombero.
# Solo Director o Capitán tienen permisos para realizar
# esta acción.
# ==========================================================

@api_view(['PUT'])
def cambiar_rango_bombero(request):

    rut_solicitante = request.data.get('rut_solicitante')
    rut_bombero = request.data.get('rut_bombero')
    nuevo_rango = request.data.get('nuevo_rango')


    # Validar datos obligatorios

    if not rut_solicitante or not rut_bombero or not nuevo_rango:

        return Response(
            {
                "error": "Debe proporcionar todos los datos"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # Validar RUT del solicitante

    if not validar_rut(rut_solicitante):

        return Response(
            {
                "error": "RUT del solicitante inválido"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # Validar RUT del bombero objetivo

    if not validar_rut(rut_bombero):

        return Response(
            {
                "error": "RUT del bombero inválido"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        # Buscar quien realiza la acción

        persona_solicitante = Persona.objects.get(
            rut=rut_solicitante
        )


        # Verificar que sea bombero

        bombero_solicitante = Bombero.objects.get(
            rut=persona_solicitante
        )


        # Verificar permisos

        if bombero_solicitante.rango.lower() not in [
            "director",
            "capitan",
            "capitán"
        ]:

            return Response(
                {
                    "error": "No tiene permisos para cambiar rangos"
                },
                status=status.HTTP_403_FORBIDDEN
            )


        # Buscar bombero al que se le cambiará el rango

        persona_bombero = Persona.objects.get(
            rut=rut_bombero
        )


        bombero = Bombero.objects.get(
            rut=persona_bombero
        )


        # Actualizar rango

        bombero.rango = nuevo_rango
        bombero.save()



        return Response(
            {
                "mensaje": "Rango actualizado correctamente",
                "bombero": persona_bombero.nombres,
                "nuevo_rango": nuevo_rango
            },
            status=status.HTTP_200_OK
        )


    except Persona.DoesNotExist:

        return Response(
            {
                "error": "Persona no encontrada"
            },
            status=status.HTTP_404_NOT_FOUND
        )


    except Bombero.DoesNotExist:

        return Response(
            {
                "error": "El usuario no es un bombero"
            },
            status=status.HTTP_404_NOT_FOUND
        )


# INICIO DE SESIÓN

@api_view(['POST'])
def inicio_sesion(request):

    rut = request.data.get('rut')
    contraseña = request.data.get('contraseña')


    # Validar datos recibidos
    if not rut or not contraseña:

        return Response(
            {
                "error": "Debe proporcionar RUT y contraseña"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # Validar formato del RUT
    if not validar_rut(rut):

        return Response(
            {
                "error": "El RUT ingresado no es válido"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Normalizar RUT para buscar en BD
    rut = formatear_rut(rut)

    try:

        # Buscar persona
        persona = Persona.objects.get(rut=rut)

        # Verificar contraseña con Argon2
        if not check_password(
            contraseña,
            persona.contraseña
        ):

            return Response(
                {
                    "error": "RUT o contraseña incorrectos"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Verificar si es Bombero
        if Bombero.objects.filter(rut=persona).exists():

            bombero = Bombero.objects.get(rut=persona)

            return Response(
                {
                    "mensaje": "Inicio de sesión exitoso",
                    "tipo_usuario": "Bombero",
                    "rut": persona.rut,
                    "nombre": persona.nombres,
                    "apellido": persona.apellidos,
                    "rango": bombero.rango,
                    "nivel": bombero.nivel
                },
                status=status.HTTP_200_OK
            )

        # Verificar si es Aspirante
        elif Aspirante.objects.filter(rut=persona).exists():

            return Response(
                {
                    "mensaje": "Inicio de sesión exitoso",
                    "tipo_usuario": "Aspirante",
                    "rut": persona.rut,
                    "nombre": persona.nombres,
                    "apellido": persona.apellidos
                },
                status=status.HTTP_200_OK
            )

        # Persona sin rol
        else:

            return Response(
                {
                    "error": "La persona no tiene una cuenta habilitada"
                },
                status=status.HTTP_403_FORBIDDEN
            )

    except Persona.DoesNotExist:

        return Response(
            {
                "error": "RUT o contraseña incorrectos"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

# ==========================================================
# CAMBIAR CONTRASEÑA
# ==========================================================

@api_view(['PUT'])
def cambiar_contraseña(request):

    rut = request.data.get('rut')
    contraseña_actual = request.data.get('contraseña_actual')
    nueva_contraseña = request.data.get('nueva_contraseña')


    # Validar datos
    if not rut or not contraseña_actual or not nueva_contraseña:

        return Response(
            {
                "error": "Debe proporcionar RUT, contraseña actual y nueva contraseña"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validar RUT
    if not validar_rut(rut):

        return Response(
            {
                "error": "El RUT ingresado no es válido"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    rut = formatear_rut(rut)

    try:

        persona = Persona.objects.get(rut=rut)

        # Verificar contraseña actual
        if not check_password(
            contraseña_actual,
            persona.contraseña
        ):

            return Response(
                {
                    "error": "La contraseña actual es incorrecta"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Guardar nueva contraseña encriptada
        persona.contraseña = make_password(
            nueva_contraseña
        )

        persona.save()

        return Response(
            {
                "mensaje": "Contraseña cambiada correctamente"
            },
            status=status.HTTP_200_OK
        )


    except Persona.DoesNotExist:

        return Response(
            {
                "error": "Usuario no encontrado"
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
#==============================================
# SOLICITAR RECUPERACIÓN DE CONTRASEÑA
# Genera un código temporal para que el usuario pueda
# recuperar su contraseña mediante RUT y correo.
#==============================================

@api_view(['POST'])
def solicitar_recuperacion(request):

    rut = request.data.get('rut')
    correo = request.data.get('correo')


    if not rut or not correo:

        return Response(
            {
                "error": "Debe ingresar RUT y correo"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    if not validar_rut(rut):

        return Response(
            {
                "error": "RUT inválido"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        persona = Persona.objects.get(
            rut=rut,
            correo=correo
        )


        codigo = str(random.randint(100000, 999999))


        RecuperacionContraseña.objects.create(
            persona=persona,
            codigo=codigo
        )


        return Response(
            {
                "mensaje": "Código generado correctamente",

                # SOLO PARA PRUEBAS
                # después debe enviarse por correo
                "codigo": codigo
            },

            status=status.HTTP_200_OK
        )


    except Persona.DoesNotExist:


        return Response(

            {
                "error": "Los datos no coinciden"
            },

            status=status.HTTP_404_NOT_FOUND
        )

#==============================================
# CAMBIAR CONTRASEÑA MEDIANTE CÓDIGO DE RECUPERACIÓN
# Verifica el código generado y permite establecer una
# nueva contraseña almacenada con Argon2.
#==============================================

@api_view(['PUT'])
def cambiar_contraseña_recuperada(request):

    rut = request.data.get('rut')
    codigo = request.data.get('codigo')
    nueva_contraseña = request.data.get('nueva_contraseña')


    if not rut or not codigo or not nueva_contraseña:

        return Response(

            {
                "error": "Debe completar todos los campos"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    if not validar_rut(rut):

        return Response(

            {
                "error": "RUT inválido"
            },

            status=status.HTTP_400_BAD_REQUEST
        )



    try:

        persona = Persona.objects.get(
            rut=rut
        )


        recuperacion = RecuperacionContraseña.objects.filter(

            persona=persona,
            codigo=codigo,
            usado=False

        ).last()



        if recuperacion is None:


            return Response(

                {
                    "error": "Código incorrecto"
                },

                status=status.HTTP_400_BAD_REQUEST
            )



        if not recuperacion.valido():


            return Response(

                {
                    "error": "El código expiró"
                },

                status=status.HTTP_400_BAD_REQUEST
            )



        # Guardar contraseña usando Argon2

        persona.contraseña = make_password(
            nueva_contraseña
        )

        persona.save()



        # Invalidar código

        recuperacion.usado = True

        recuperacion.save()



        return Response(

            {
                "mensaje": "Contraseña cambiada correctamente"
            },

            status=status.HTTP_200_OK
        )



    except Persona.DoesNotExist:


        return Response(

            {
                "error": "Usuario no encontrado"
            },

            status=status.HTTP_404_NOT_FOUND
        )
    


# ==========================================
# CREAR ENCUESTA DE GUARDIAS
# Solo Capitán y Tenientes
# ==========================================

@api_view(['POST'])
def crear_encuesta(request):

    rut = request.data.get("rut")
    titulo = request.data.get("titulo")
    descripcion = request.data.get("descripcion")
    fecha_inicio = request.data.get("fecha_inicio")
    fecha_fin = request.data.get("fecha_fin")

    # Validar datos
    if not all([rut, titulo, fecha_inicio, fecha_fin]):
        return Response(
            {"error": "Faltan datos obligatorios."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Buscar bombero
    try:
        bombero = Bombero.objects.get(rut__rut=rut)
    except Bombero.DoesNotExist:
        return Response(
            {"error": "El bombero no existe."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Validar permisos
    if bombero.rango not in [
        "Capitán",
        "Teniente 1",
        "Teniente 2",
        "Teniente 3"
    ]:
        return Response(
            {"error": "No tiene permisos para crear encuestas."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Crear encuesta
    encuesta = Encuesta_Guardia.objects.create(
        titulo=titulo,
        descripcion=descripcion,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        creado_por=bombero
    )

    return Response(
        {
            "mensaje": "Encuesta creada correctamente.",
            "id_encuesta": encuesta.id_encuesta
        },
        status=status.HTTP_201_CREATED
    )


# ==========================================
# CREAR GUARDIA
# Solo Capitán y Tenientes
# ==========================================

@api_view(['POST'])
def crear_guardia(request):

    rut = request.data.get("rut")
    id_encuesta = request.data.get("id_encuesta")
    fecha = request.data.get("fecha")
    tipo = request.data.get("tipo")
    numero = request.data.get("numero")
    hora_inicio = request.data.get("hora_inicio")
    hora_fin = request.data.get("hora_fin")
    cupos = request.data.get("cupos", 4)

    if not all([
        rut,
        id_encuesta,
        fecha,
        tipo,
        numero,
        hora_inicio,
        hora_fin
    ]):
        return Response(
            {"error": "Faltan datos obligatorios."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        bombero = Bombero.objects.get(rut__rut=rut)
    except Bombero.DoesNotExist:
        return Response(
            {"error": "Bombero no encontrado."},
            status=status.HTTP_404_NOT_FOUND
        )

    if bombero.rango not in [
        "Capitán",
        "Teniente 1",
        "Teniente 2",
        "Teniente 3"
    ]:
        return Response(
            {"error": "No tiene permisos."},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        encuesta = Encuesta_Guardia.objects.get(id_encuesta=id_encuesta)
    except Encuesta_Guardia.DoesNotExist:
        return Response(
            {"error": "La encuesta no existe."},
            status=status.HTTP_404_NOT_FOUND
        )

    guardia = Guardia.objects.create(
        encuesta=encuesta,
        fecha=fecha,
        tipo=tipo,
        numero=numero,
        hora_inicio=hora_inicio,
        hora_fin=hora_fin,
        cupos=cupos
    )

    return Response(
        {
            "mensaje": "Guardia creada correctamente.",
            "id_guardia": guardia.id_guardia
        },
        status=status.HTTP_201_CREATED
    )

# ==========================================
# LISTAR ENCUESTAS
# ==========================================
@api_view(['GET'])
def listar_encuestas(request):

    # Obtener todas las encuestas
    encuestas = Encuesta_Guardia.objects.all().order_by("-fecha_inicio")

    serializer = Encuesta_GuardiaSerializer(encuestas, many=True)

    # Retornar las encuestas
    return Response(serializer.data, status=status.HTTP_200_OK)

# ==========================================
# LISTAR GUARDIAS DE UNA ENCUESTA
# ==========================================
@api_view(['GET'])
def listar_guardias(request):

    id_encuesta = request.GET.get("id_encuesta")

    # Validar parámetro
    if not id_encuesta:
        return Response(
            {"error": "Debe indicar la encuesta."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        encuesta = Encuesta_Guardia.objects.get(id_encuesta=id_encuesta)

    except Encuesta_Guardia.DoesNotExist:

        return Response(
            {"error": "Encuesta no encontrada."},
            status=status.HTTP_404_NOT_FOUND
        )

    guardias = Guardia.objects.filter(encuesta=encuesta)

    datos = []

    for guardia in guardias:

        inscritos = Inscripcion_Guardia.objects.filter(
            guardia=guardia
        ).count()

        datos.append({

            "id_guardia": guardia.id_guardia,

            "fecha": guardia.fecha,

            "tipo": guardia.tipo,

            "numero": guardia.numero,

            "hora_inicio": guardia.hora_inicio,

            "hora_fin": guardia.hora_fin,

            "cupos": guardia.cupos,

            "inscritos": inscritos,

            "estado": guardia.estado

        })

    return Response(datos, status=status.HTTP_200_OK)

# ==========================================
# TOMAR GUARDIA
# ==========================================
@api_view(['POST'])
def tomar_guardia(request):

    rut = request.data.get("rut")

    id_guardia = request.data.get("id_guardia")

    # Validar datos
    if not rut or not id_guardia:

        return Response(
            {"error": "Debe enviar todos los datos."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Buscar bombero
    try:

        persona = Persona.objects.get(rut=rut)

        bombero = Bombero.objects.get(rut=persona)

    except (Persona.DoesNotExist, Bombero.DoesNotExist):

        return Response(
            {"error": "Bombero no encontrado."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Buscar guardia
    try:

        guardia = Guardia.objects.get(id_guardia=id_guardia)

    except Guardia.DoesNotExist:

        return Response(
            {"error": "La guardia no existe."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Verificar estado de la encuesta
    if guardia.encuesta.estado != "ABIERTA":

        return Response(
            {"error": "La encuesta está cerrada."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verificar estado de la guardia
    if guardia.estado != "ABIERTA":

        return Response(
            {"error": "La guardia está cerrada."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verificar inscripción previa
    if Inscripcion_Guardia.objects.filter(
        guardia=guardia,
        bombero=bombero
    ).exists():

        return Response(
            {"error": "Ya está inscrito en esta guardia."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verificar cupos
    inscritos = Inscripcion_Guardia.objects.filter(
        guardia=guardia
    ).count()

    if inscritos >= guardia.cupos:

        return Response(
            {"error": "No quedan cupos disponibles."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Crear inscripción
    Inscripcion_Guardia.objects.create(

        guardia=guardia,

        bombero=bombero

    )

    return Response(

        {"mensaje": "Guardia tomada correctamente."},

        status=status.HTTP_201_CREATED
    )


# ==========================================
# CANCELAR INSCRIPCIÓN A UNA GUARDIA
# ==========================================
@api_view(['DELETE'])
def cancelar_guardia(request):

    rut = request.data.get("rut")

    id_guardia = request.data.get("id_guardia")

    # Validar datos
    if not rut or not id_guardia:

        return Response(
            {"error": "Debe enviar todos los datos."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Buscar bombero
    try:

        persona = Persona.objects.get(rut=rut)

        bombero = Bombero.objects.get(rut=persona)

    except (Persona.DoesNotExist, Bombero.DoesNotExist):

        return Response(
            {"error": "Bombero no encontrado."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Buscar guardia
    try:

        guardia = Guardia.objects.get(id_guardia=id_guardia)

    except Guardia.DoesNotExist:

        return Response(
            {"error": "La guardia no existe."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Buscar inscripción
    try:

        inscripcion = Inscripcion_Guardia.objects.get(

            guardia=guardia,

            bombero=bombero

        )

    except Inscripcion_Guardia.DoesNotExist:

        return Response(
            {"error": "No estaba inscrito en esta guardia."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Eliminar inscripción
    inscripcion.delete()

    return Response(

        {"mensaje": "Inscripción eliminada correctamente."},

        status=status.HTTP_200_OK
    )