from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def mensaje_prueba(request):
    return Response({"mensaje": "¡Hola desde Django! La conexión fue un éxito."})
# Create your views here.
