# Importaciones de Django
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q
from datetime import datetime

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


    # VALIDAR DATOS

    if not rut or not id_guardia:

        return Response(

            {
                "error": "Debe enviar todos los datos."
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # BUSCAR BOMBERO

    try:

        persona = Persona.objects.get(
            rut=rut
        )

        bombero = Bombero.objects.get(
            rut=persona
        )

    except (Persona.DoesNotExist, Bombero.DoesNotExist):

        return Response(

            {
                "error": "Bombero no encontrado."
            },

            status=status.HTTP_404_NOT_FOUND
        )


    # BUSCAR GUARDIA

    try:

        guardia = Guardia.objects.get(
            id_guardia=id_guardia
        )

    except Guardia.DoesNotExist:

        return Response(

            {
                "error": "La guardia no existe."
            },

            status=status.HTTP_404_NOT_FOUND
        )


    # VERIFICAR ESTADO DE LA ENCUESTA

    if guardia.encuesta.estado != "ABIERTA":

        return Response(

            {
                "error": "La encuesta está cerrada."
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # VERIFICAR ESTADO DE LA GUARDIA

    if guardia.estado != "ABIERTA":

        return Response(

            {
                "error": "La guardia está cerrada."
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # VERIFICAR DISPONIBILIDAD DEL BOMBERO
    # ==========================================


    # BUSCAR EXCEPCIONES PARA EL DIA DE LA GUARDIA

    excepcion = Excepcion_Disponibilidad.objects.filter(

        bombero=bombero,

        fecha_inicio__lte=guardia.fecha,

        fecha_fin__gte=guardia.fecha

    ).first()


    # SI TIENE UNA EXCEPCION

    if excepcion:

        return Response(

            {
                "error": "El bombero no está disponible para esta fecha.",

                "tipo": excepcion.tipo,

                "descripcion": excepcion.descripcion
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # BUSCAR JORNADA LABORAL QUE CORRESPONDE A LA FECHA

    jornada = Jornada_Laboral_Bombero.objects.filter(

        bombero=bombero,

        fecha_inicio__lte=guardia.fecha

    ).filter(

        Q(fecha_fin__gte=guardia.fecha) |

        Q(fecha_fin__isnull=True)

    ).order_by(

        "-fecha_inicio"

    ).first()


    # SI NO EXISTE JORNADA

    if jornada is None:

        return Response(

            {
                "error": "El bombero no tiene una jornada laboral registrada para esta fecha."
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # CALCULAR CICLO LABORAL
    # ==========================================


    dias_transcurridos = (

        guardia.fecha -

        jornada.fecha_inicio

    ).days


    dias_trabajo = jornada.dias_trabajo

    dias_libres = jornada.dias_libres


    total_ciclo = (

        dias_trabajo +

        dias_libres

    )


    posicion_ciclo = (

        dias_transcurridos %

        total_ciclo

    )


    # ==========================================
    # DETERMINAR DISPONIBILIDAD
    # ==========================================


    if jornada.estado_inicial == "TRABAJO":

        if posicion_ciclo < dias_trabajo:

            estado = "TRABAJO"

        else:

            estado = "LIBRE"


    else:

        if posicion_ciclo < dias_libres:

            estado = "LIBRE"

        else:

            estado = "TRABAJO"


    # SI ESTA TRABAJANDO NO PUEDE TOMAR GUARDIA

    if estado == "TRABAJO":

        return Response(

            {
                "error": "No puede tomar esta guardia porque corresponde a un día de trabajo.",

                "fecha": guardia.fecha,

                "jornada": f"{dias_trabajo}x{dias_libres}",

                "estado": estado
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # VERIFICAR INSCRIPCION PREVIA
    # ==========================================

    if Inscripcion_Guardia.objects.filter(

        guardia=guardia,

        bombero=bombero

    ).exists():

        return Response(

            {
                "error": "Ya está inscrito en esta guardia."
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # VERIFICAR CUPOS
    # ==========================================

    inscritos = Inscripcion_Guardia.objects.filter(

        guardia=guardia

    ).count()


    if inscritos >= guardia.cupos:

        return Response(

            {
                "error": "No quedan cupos disponibles."
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # CREAR INSCRIPCION
    # ==========================================

    Inscripcion_Guardia.objects.create(

        guardia=guardia,

        bombero=bombero

    )


    return Response(

        {
            "mensaje": "Guardia tomada correctamente.",

            "fecha": guardia.fecha,

            "estado": estado,

            "jornada": f"{dias_trabajo}x{dias_libres}"
        },

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

# CAMBIAR ESTADO DE UN BOMBERO
# Solo Director o Capitán pueden activar/desactivar un bombero

@api_view(['PUT'])
def cambiar_estado_bombero(request):

    rut_solicitante = request.data.get('rut_solicitante')
    rut_bombero = request.data.get('rut_bombero')
    estado = request.data.get('estado')


    if not rut_solicitante or not rut_bombero or estado is None:

        return Response(

            {
                "error": "Debe completar todos los campos"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    if not validar_rut(rut_solicitante):

        return Response(

            {
                "error": "RUT del solicitante inválido"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    if not validar_rut(rut_bombero):

        return Response(

            {
                "error": "RUT del bombero inválido"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    if not tiene_permiso_administrativo(rut_solicitante):

        return Response(

            {
                "error": "No tiene permisos para realizar esta acción"
            },

            status=status.HTTP_403_FORBIDDEN
        )


    try:

        persona = Persona.objects.get(
            rut=rut_bombero
        )

        bombero = Bombero.objects.get(
            rut=persona
        )


        bombero.estado = estado
        bombero.save()


        return Response(

            {
                "mensaje": "Estado actualizado correctamente"
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


# ==========================================
# LISTAR BOMBEROS DISPONIBLES PARA UNA GUARDIA
# ==========================================

@api_view(['GET'])
def listar_bomberos_disponibles_guardia(request, id_guardia):

    # BUSCAR GUARDIA

    try:

        guardia = Guardia.objects.get(
            id_guardia=id_guardia
        )

    except Guardia.DoesNotExist:

        return Response(

            {
                "error": "La guardia no existe."
            },

            status=status.HTTP_404_NOT_FOUND
        )


    # OBTENER TODOS LOS BOMBEROS ACTIVOS

    bomberos = Bombero.objects.filter(
        estado=True
    )


    disponibles = []


    # ==========================================
    # REVISAR CADA BOMBERO
    # ==========================================

    for bombero in bomberos:

        # ==========================================
        # BUSCAR EXCEPCION
        # ==========================================

        excepcion = Excepcion_Disponibilidad.objects.filter(

            bombero=bombero,

            fecha_inicio__lte=guardia.fecha,

            fecha_fin__gte=guardia.fecha

        ).first()


        # SI TIENE EXCEPCION NO ESTA DISPONIBLE

        if excepcion:

            continue


        # ==========================================
        # BUSCAR JORNADA
        # ==========================================

        jornada = Jornada_Laboral_Bombero.objects.filter(

            bombero=bombero,

            fecha_inicio__lte=guardia.fecha

        ).filter(

            Q(fecha_fin__gte=guardia.fecha) |

            Q(fecha_fin__isnull=True)

        ).order_by(

            "-fecha_inicio"

        ).first()


        # SI NO TIENE JORNADA

        if jornada is None:

            continue


        # ==========================================
        # CALCULAR CICLO
        # ==========================================

        dias_transcurridos = (

            guardia.fecha -

            jornada.fecha_inicio

        ).days


        dias_trabajo = jornada.dias_trabajo

        dias_libres = jornada.dias_libres


        total_ciclo = (

            dias_trabajo +

            dias_libres

        )


        posicion_ciclo = (

            dias_transcurridos %

            total_ciclo

        )


        # ==========================================
        # DETERMINAR ESTADO
        # ==========================================

        if jornada.estado_inicial == "TRABAJO":

            if posicion_ciclo < dias_trabajo:

                estado = "TRABAJO"

            else:

                estado = "LIBRE"


        else:

            if posicion_ciclo < dias_libres:

                estado = "LIBRE"

            else:

                estado = "TRABAJO"


        # ==========================================
        # SOLO AGREGAR BOMBEROS LIBRES
        # ==========================================

        if estado == "LIBRE":

            # VERIFICAR SI YA ESTA INSCRITO

            inscrito = Inscripcion_Guardia.objects.filter(

                guardia=guardia,

                bombero=bombero

            ).exists()


            # SERIALIZAR BOMBERO

            serializer = BomberoSerializer(
                bombero
            )


            disponibles.append({

                "bombero": serializer.data,

                "jornada": f"{dias_trabajo}x{dias_libres}",

                "estado": estado,

                "inscrito": inscrito

            })


    # ==========================================
    # RESPUESTA
    # ==========================================

    return Response(

        {
            "guardia": {

                "id_guardia": guardia.id_guardia,

                "fecha": guardia.fecha,

                "tipo": guardia.tipo,

                "numero": guardia.numero

            },

            "cantidad_disponibles": len(disponibles),

            "bomberos": disponibles
        },

        status=status.HTTP_200_OK
    )




# CREAR JORNADA LABORAL DEL BOMBERO

@api_view(['POST'])
def crear_jornada_laboral(request):

    rut = request.data.get('rut')

    dias_trabajo = request.data.get('dias_trabajo')

    dias_libres = request.data.get('dias_libres')

    fecha_inicio = request.data.get('fecha_inicio')

    estado_inicial = request.data.get('estado_inicial')


    # VALIDAR CAMPOS OBLIGATORIOS

    if not rut or not dias_trabajo or not dias_libres or not fecha_inicio or not estado_inicial:

        return Response(

            {
                "error": "Debe completar todos los campos"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # VALIDAR QUE LOS DIAS SEAN NUMEROS

    try:

        dias_trabajo = int(dias_trabajo)

        dias_libres = int(dias_libres)


    except (ValueError, TypeError):

        return Response(

            {
                "error": "Los días de trabajo y días libres deben ser números"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # VALIDAR QUE LOS DIAS SEAN MAYORES A 0

    if dias_trabajo <= 0 or dias_libres <= 0:

        return Response(

            {
                "error": "Los días de trabajo y días libres deben ser mayores a 0"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        # BUSCAR BOMBERO

        persona = Persona.objects.get(
            rut=rut
        )


        bombero = Bombero.objects.get(
            rut=persona
        )


        # BUSCAR JORNADA ACTUAL

        jornada_actual = Jornada_Laboral_Bombero.objects.filter(

            bombero=bombero,
            activa=True

        ).order_by("-fecha_inicio").first()


        # SI EXISTE UNA JORNADA ACTIVA

        if jornada_actual:

            return Response(

                {
                    "error": "El bombero ya tiene una jornada laboral activa"
                },

                status=status.HTTP_400_BAD_REQUEST
            )


        # CREAR JORNADA

        jornada = Jornada_Laboral_Bombero.objects.create(

            bombero=bombero,

            dias_trabajo=dias_trabajo,

            dias_libres=dias_libres,

            fecha_inicio=fecha_inicio,

            estado_inicial=estado_inicial,

            activa=True
        )


        serializer = Jornada_Laboral_BomberoSerializer(
            jornada
        )


        return Response(

            {
                "mensaje": "Jornada laboral creada correctamente",

                "jornada": serializer.data
            },

            status=status.HTTP_201_CREATED
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
                "error": "Bombero no encontrado"
            },

            status=status.HTTP_404_NOT_FOUND
        )

# LISTAR JORNADAS LABORALES DEL BOMBERO

@api_view(['GET'])
def listar_jornadas_bombero(request, rut):

    try:

        # BUSCAR PERSONA

        persona = Persona.objects.get(
            rut=rut
        )


        # BUSCAR BOMBERO

        bombero = Bombero.objects.get(
            rut=persona
        )


        # OBTENER TODAS LAS JORNADAS

        jornadas = Jornada_Laboral_Bombero.objects.filter(

            bombero=bombero

        ).order_by("-fecha_inicio")


        serializer = Jornada_Laboral_BomberoSerializer(

            jornadas,

            many=True
        )


        return Response(

            serializer.data,

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
                "error": "Bombero no encontrado"
            },

            status=status.HTTP_404_NOT_FOUND
        )

# CAMBIAR JORNADA LABORAL DEL BOMBERO

@api_view(['PUT'])
def cambiar_jornada_laboral(request):

    rut = request.data.get('rut')

    dias_trabajo = request.data.get('dias_trabajo')

    dias_libres = request.data.get('dias_libres')

    fecha_inicio = request.data.get('fecha_inicio')

    estado_inicial = request.data.get('estado_inicial')


    # VALIDAR CAMPOS

    if not rut or not dias_trabajo or not dias_libres or not fecha_inicio or not estado_inicial:

        return Response(

            {
                "error": "Debe completar todos los campos"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # VALIDAR DIAS

    try:

        dias_trabajo = int(dias_trabajo)

        dias_libres = int(dias_libres)


    except (ValueError, TypeError):

        return Response(

            {
                "error": "Los días de trabajo y días libres deben ser números"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    if dias_trabajo <= 0 or dias_libres <= 0:

        return Response(

            {
                "error": "Los días de trabajo y días libres deben ser mayores a 0"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    # CONVERTIR FECHA

    try:

        fecha_inicio_convertida = datetime.strptime(

            fecha_inicio,

            "%Y-%m-%d"

        ).date()


    except ValueError:

        return Response(

            {
                "error": "Formato de fecha inválido. Use YYYY-MM-DD"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        # BUSCAR PERSONA

        persona = Persona.objects.get(
            rut=rut
        )


        # BUSCAR BOMBERO

        bombero = Bombero.objects.get(
            rut=persona
        )


        # BUSCAR JORNADA ACTUAL

        jornada_actual = Jornada_Laboral_Bombero.objects.filter(

            bombero=bombero,

            activa=True

        ).order_by("-fecha_inicio").first()


        # CERRAR JORNADA ANTERIOR

        if jornada_actual:

            # VALIDAR QUE LA NUEVA FECHA SEA POSTERIOR

            if fecha_inicio_convertida <= jornada_actual.fecha_inicio:

                return Response(

                    {
                        "error": "La nueva jornada debe comenzar después de la jornada actual"
                    },

                    status=status.HTTP_400_BAD_REQUEST
                )


            jornada_actual.fecha_fin = (

                fecha_inicio_convertida -

                timedelta(days=1)

            )

            jornada_actual.activa = False

            jornada_actual.save()


        # CREAR NUEVA JORNADA

        nueva_jornada = Jornada_Laboral_Bombero.objects.create(

            bombero=bombero,

            dias_trabajo=dias_trabajo,

            dias_libres=dias_libres,

            fecha_inicio=fecha_inicio_convertida,

            estado_inicial=estado_inicial,

            activa=True
        )


        serializer = Jornada_Laboral_BomberoSerializer(

            nueva_jornada
        )


        return Response(

            {
                "mensaje": "Jornada laboral actualizada correctamente",

                "jornada": serializer.data
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
                "error": "Bombero no encontrado"
            },

            status=status.HTTP_404_NOT_FOUND
        )

# CREAR EXCEPCION DE DISPONIBILIDAD

@api_view(['POST'])
def crear_excepcion_disponibilidad(request):

    rut = request.data.get('rut')

    tipo = request.data.get('tipo')

    fecha_inicio = request.data.get('fecha_inicio')

    fecha_fin = request.data.get('fecha_fin')

    descripcion = request.data.get('descripcion')


    # VALIDAR CAMPOS OBLIGATORIOS

    if not rut or not tipo or not fecha_inicio or not fecha_fin:

        return Response(

            {
                "error": "Debe completar todos los campos obligatorios"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        # BUSCAR PERSONA

        persona = Persona.objects.get(
            rut=rut
        )


        # BUSCAR BOMBERO

        bombero = Bombero.objects.get(
            rut=persona
        )


        # CREAR EXCEPCION

        excepcion = Excepcion_Disponibilidad.objects.create(

            bombero=bombero,

            tipo=tipo,

            fecha_inicio=fecha_inicio,

            fecha_fin=fecha_fin,

            descripcion=descripcion
        )


        serializer = Excepcion_DisponibilidadSerializer(

            excepcion
        )


        return Response(

            {
                "mensaje": "Excepción registrada correctamente",

                "excepcion": serializer.data
            },

            status=status.HTTP_201_CREATED
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
                "error": "Bombero no encontrado"
            },

            status=status.HTTP_404_NOT_FOUND
        )

# LISTAR EXCEPCIONES DE DISPONIBILIDAD

@api_view(['GET'])
def listar_excepciones_bombero(request, rut):

    try:

        # BUSCAR PERSONA

        persona = Persona.objects.get(
            rut=rut
        )


        # BUSCAR BOMBERO

        bombero = Bombero.objects.get(
            rut=persona
        )


        # OBTENER EXCEPCIONES

        excepciones = Excepcion_Disponibilidad.objects.filter(

            bombero=bombero

        ).order_by("-fecha_inicio")


        serializer = Excepcion_DisponibilidadSerializer(

            excepciones,

            many=True
        )


        return Response(

            serializer.data,

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
                "error": "Bombero no encontrado"
            },

            status=status.HTTP_404_NOT_FOUND
        )

# CONSULTAR DISPONIBILIDAD DEL BOMBERO EN UNA FECHA

@api_view(['GET'])
def consultar_disponibilidad_bombero(request, rut, fecha):

    try:

        # CONVERTIR LA FECHA RECIBIDA

        fecha_consulta = datetime.strptime(

            fecha,

            "%Y-%m-%d"

        ).date()


    except ValueError:

        return Response(

            {
                "error": "Formato de fecha inválido. Use YYYY-MM-DD"
            },

            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        # BUSCAR PERSONA

        persona = Persona.objects.get(

            rut=rut

        )


        # BUSCAR BOMBERO

        bombero = Bombero.objects.get(

            rut=persona

        )


        # BUSCAR SI EXISTE UNA EXCEPCION PARA ESA FECHA

        excepcion = Excepcion_Disponibilidad.objects.filter(

            bombero=bombero,

            fecha_inicio__lte=fecha_consulta,

            fecha_fin__gte=fecha_consulta

        ).first()


        # SI EXISTE UNA EXCEPCION

        if excepcion:

            return Response(

                {
                    "fecha": fecha_consulta,

                    "estado": excepcion.tipo,

                    "descripcion": excepcion.descripcion,

                    "puede_tomar_guardia": False
                },

                status=status.HTTP_200_OK
            )


        # BUSCAR LA JORNADA LABORAL QUE CORRESPONDE A ESA FECHA

        jornada = Jornada_Laboral_Bombero.objects.filter(

            bombero=bombero,

            fecha_inicio__lte=fecha_consulta

        ).filter(

            Q(fecha_fin__gte=fecha_consulta) |

            Q(fecha_fin__isnull=True)

        ).order_by(

            "-fecha_inicio"

        ).first()


        # SI NO EXISTE JORNADA PARA ESA FECHA

        if jornada is None:

            return Response(

                {
                    "error": "No existe una jornada laboral registrada para esta fecha"
                },

                status=status.HTTP_404_NOT_FOUND
            )


        # CALCULAR LOS DIAS DESDE EL INICIO DE LA JORNADA

        dias_transcurridos = (

            fecha_consulta -

            jornada.fecha_inicio

        ).days


        # OBTENER DIAS DE TRABAJO Y DIAS LIBRES

        dias_trabajo = jornada.dias_trabajo

        dias_libres = jornada.dias_libres


        # CALCULAR EL TOTAL DEL CICLO

        total_ciclo = (

            dias_trabajo +

            dias_libres

        )


        # OBTENER LA POSICION DEL DIA DENTRO DEL CICLO

        posicion_ciclo = (

            dias_transcurridos %

            total_ciclo

        )


        # DETERMINAR SI EL BOMBERO ESTA TRABAJANDO O LIBRE

        if jornada.estado_inicial == "TRABAJO":

            if posicion_ciclo < dias_trabajo:

                estado = "TRABAJO"

                puede_tomar_guardia = False

            else:

                estado = "LIBRE"

                puede_tomar_guardia = True


        else:

            if posicion_ciclo < dias_libres:

                estado = "LIBRE"

                puede_tomar_guardia = True

            else:

                estado = "TRABAJO"

                puede_tomar_guardia = False


        # RETORNAR LA DISPONIBILIDAD

        return Response(

            {
                "fecha": fecha_consulta,

                "estado": estado,

                "dias_trabajo": dias_trabajo,

                "dias_libres": dias_libres,

                "jornada": f"{dias_trabajo}x{dias_libres}",

                "fecha_inicio_jornada": jornada.fecha_inicio,

                "puede_tomar_guardia": puede_tomar_guardia
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
                "error": "Bombero no encontrado"
            },

            status=status.HTTP_404_NOT_FOUND
        )