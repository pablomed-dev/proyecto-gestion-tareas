#from django.shortcuts import render
from rest_framework import viewsets
from .models import gestionDeTareas
from .serializers import GestionDeTareasSerializer

class GestionDeTareasViewSet(viewsets.ModelViewSet):
    queryset = gestionDeTareas.objects.all()
    serializer_class = GestionDeTareasSerializer