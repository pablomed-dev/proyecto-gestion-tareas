from rest_framework import serializers
from .models import gestionDeTareas

class GestionDeTareasSerializer(serializers.ModelSerializer):
    class Meta:
        model = gestionDeTareas
        fields = '__all__'