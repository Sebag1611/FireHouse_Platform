# Importaciones de Django
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction

# Importaciones propias
from Administracion.models import *
from Administracion.serializers import *
from Operacion.models import *
import random

# 2. CONSTANTES Y CONFIGURACIONES
ROLES_AUTORIZADOS_NOTICIAS = [
    "director",
    "directora",
    "capitan",
    "capitán",
    "teniente",
    "teniente 1",
    "teniente 2",
    "teniente 3",
    "teniente primero",
    "teniente segundo",
    "teniente tercero",
]

# VALIDAR RUT CHILENO

def validar_rut(rut):

    if not rut:
        return False

    rut = rut.replace(".", "").replace("-", "").upper()

    if len(rut) < 2:
        return False

    cuerpo = rut[:-1]
    dv = rut[-1]

    if not cuerpo.isdigit():
        return False


    suma = 0
    multiplicador = 2

    for numero in reversed(cuerpo):

        suma += int(numero) * multiplicador

        multiplicador += 1

        if multiplicador > 7:
            multiplicador = 2


    resto = suma % 11
    resultado = 11 - resto


    if resultado == 11:
        dv_calculado = "0"

    elif resultado == 10:
        dv_calculado = "K"

    else:
        dv_calculado = str(resultado)


    return dv == dv_calculado

# FORMATEAR RUT PARA GUARDAR EN BD
# Formato: 12345678-5

def formatear_rut(rut):

    rut = rut.replace(".", "").replace("-", "").upper()

    cuerpo = rut[:-1]
    dv = rut[-1]

    return f"{cuerpo}-{dv}"

# VERIFICAR PERMISOS DE CREACION
# Solo Capitan o Director

def tiene_permiso_administrativo(rut):

    try:

        persona = Persona.objects.get(rut=rut)

        bombero = Bombero.objects.get(rut=persona)

        rango = bombero.rango.lower()


        if rango in ["capitan", "director"]:
            return True


        return False


    except (Persona.DoesNotExist, Bombero.DoesNotExist):

        return False

# CREAR ASPIRANTE


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


# CREAR BOMBERO

@api_view(['POST'])
def crear_bombero(request):
    rut_creador = request.data.get('rut_creador')

    if not tiene_permiso_administrativo(rut_creador):
        return Response(
            {"error": "No tiene permisos para crear bomberos"},
            status=status.HTTP_403_FORBIDDEN
        )

    rut = request.data.get('rut')

    if not validar_rut(rut):
        return Response(
            {"error": "El RUT ingresado no es válido"},
            status=status.HTTP_400_BAD_REQUEST
        )

    rut = formatear_rut(rut)

    if Persona.objects.filter(rut=rut).exists():
        return Response(
            {"error": "El RUT ya está registrado"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # transaction.atomic() asegura que se guarden ambas tablas o ninguna
        with transaction.atomic():
            persona = Persona.objects.create(
                rut=rut,
                nombres=request.data.get('nombres'),
                apellidos=request.data.get('apellidos'),
                telefono=request.data.get('telefono'),
                correo=request.data.get('correo'),
                contraseña=make_password(request.data.get('contraseña')),
                direccion=request.data.get('direccion')
            )

            Bombero.objects.create(
                rut=persona,
                fecha_ingreso=request.data.get('fecha_ingreso'),
                rango=request.data.get('rango'),
                nivel=request.data.get('nivel'),
                estado=True
            )
            
    except Exception as e:
        return Response(
            {"error": f"Error en la base de datos: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
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


# ==========================================================
# OBTENER PERFIL ACTUALIZADO
# ==========================================================
@api_view(['POST'])
def obtener_perfil(request):
    rut = request.data.get('rut')

    if not rut:
        return Response({"error": "Falta el RUT"}, status=status.HTTP_400_BAD_REQUEST)
    
    rut = formatear_rut(rut)

    try:
        # Busca a la persona directamente en la BD
        persona = Persona.objects.get(rut=rut)

        # Revisa si es Bombero
        if Bombero.objects.filter(rut=persona).exists():
            bombero = Bombero.objects.get(rut=persona)
            return Response({
                "rut": persona.rut,
                "nombres": persona.nombres,
                "apellidos": persona.apellidos,
                "rango": bombero.rango,
                "nivel": bombero.nivel,
                "tipo_usuario": "Bombero"
            }, status=status.HTTP_200_OK)

        # Revisa si es Aspirante
        elif Aspirante.objects.filter(rut=persona).exists():
            return Response({
                "rut": persona.rut,
                "nombres": persona.nombres,
                "apellidos": persona.apellidos,
                "tipo_usuario": "Aspirante"
            }, status=status.HTTP_200_OK)

        else:
            return Response({"error": "Usuario sin rol definido"}, status=status.HTTP_403_FORBIDDEN)

    except Persona.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

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

# SOLICITAR RECUPERACIÓN DE CONTRASEÑA
# Genera un código temporal para que el usuario pueda
# recuperar su contraseña mediante RUT y correo.

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

# CAMBIAR CONTRASEÑA MEDIANTE CÓDIGO DE RECUPERACIÓN
# Verifica el código generado y permite establecer una
# nueva contraseña almacenada con Argon2.

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

@api_view(['GET'])
def listar_personal(request):
    try:
        bomberos = Bombero.objects.select_related('rut').all()
        data = []
        for b in bomberos:
            data.append({
                "rut": b.rut.rut,
                "nombres": b.rut.nombres,
                "apellidos": b.rut.apellidos,
                "nombre": f"{b.rut.nombres} {b.rut.apellidos}",
                "telefono": b.rut.telefono,
                "correo": b.rut.correo,
                "direccion": b.rut.direccion,
                "rango": b.rango,
                "nivel": b.nivel,
                "fecha_ingreso": b.fecha_ingreso,
                "estado": "activo" # O el estado que tengas en tu BD
            })
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#Noticias
def tiene_permiso_noticias(rut_bombero):
    if not rut_bombero:
        return False, None
    bombero = Bombero.objects.filter(rut__rut=rut_bombero).first()
    if not bombero:
        return False, None
    
    rango_actual = (bombero.rango or "").lower().strip()
    autorizado = any(rol in rango_actual for rol in ROLES_AUTORIZADOS_NOTICIAS)
    return autorizado, bombero

@api_view(["GET"])
def listar_noticias(request):
    try:
        noticias = Noticias.objects.select_related('bombero__rut').all().order_by('-id_noticias')
        
        data = []
        for n in noticias:
            persona = n.bombero.rut
            autor_nombre = f"{persona.nombres} {persona.apellidos}"
            
            data.append({
                "id": n.id_noticias,
                "titulo": n.titulo_Noticia,
                "cuerpo": n.cuerpo,
                "resumen": n.cuerpo,
                "categoria": n.categoria or "General",
                "foto": n.foto,
                "fecha": n.fecha_publicacion.strftime("%Y-%m-%d") if n.fecha_publicacion else "",
                "autor": autor_nombre,
                "rut_autor": persona.rut
            })
            
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def crear_noticia(request):
    try:
        data = request.data
        rut_bombero = data.get("rut")
        
        autorizado, bombero = tiene_permiso_noticias(rut_bombero)
        if not autorizado:
            return Response(
                {"error": "No tienes los permisos requeridos para publicar noticias."},
                status=status.HTTP_403_FORBIDDEN
            )

        titulo = data.get("titulo")
        cuerpo = data.get("cuerpo")
        categoria = data.get("categoria", "General")
        foto = data.get("foto", None)

        if not titulo or not cuerpo:
            return Response(
                {"error": "El título y el cuerpo son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        nueva_noticia = Noticias.objects.create(
            bombero=bombero,
            titulo_Noticia=titulo,
            cuerpo=cuerpo,
            categoria=categoria,
            foto=foto
        )

        return Response(
            {"mensaje": "Noticia publicada con éxito.", "id": nueva_noticia.id_noticias},
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def eliminar_noticia(request, id_noticia):
    try:
        rut_solicitante = request.query_params.get("rut") or request.data.get("rut")
        
        autorizado, _ = tiene_permiso_noticias(rut_solicitante)
        if not autorizado:
            return Response(
                {"error": "No tienes permisos para eliminar comunicados oficiales."},
                status=status.HTTP_403_FORBIDDEN
            )

        noticia = Noticias.objects.filter(id_noticias=id_noticia).first()
        if not noticia:
            return Response(
                {"error": "La noticia no existe."},
                status=status.HTTP_404_NOT_FOUND
            )

        noticia.delete()
        return Response(
            {"mensaje": "Noticia eliminada correctamente."},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def editar_noticia(request, id_noticia):
    try:
        rut_solicitante = request.data.get("rut")
        
        autorizado, _ = tiene_permiso_noticias(rut_solicitante)
        if not autorizado:
            return Response(
                {"error": "No tienes permisos para editar comunicados oficiales."},
                status=status.HTTP_403_FORBIDDEN
            )

        noticia = Noticias.objects.filter(id_noticias=id_noticia).first()
        if not noticia:
            return Response(
                {"error": "La noticia no existe."},
                status=status.HTTP_404_NOT_FOUND
            )

        titulo = request.data.get("titulo")
        cuerpo = request.data.get("cuerpo")
        categoria = request.data.get("categoria", "General")
        foto = request.data.get("foto", None)

        if titulo:
            noticia.titulo_Noticia = titulo
        if cuerpo:
            noticia.cuerpo = cuerpo
        noticia.categoria = categoria
        if foto is not None:
            noticia.foto = foto

        noticia.save()

        return Response(
            {"mensaje": "Noticia editada correctamente."},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)