from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GestionDeTareasViewSet

router = DefaultRouter()
router.register(r'gestion_de_tareas', GestionDeTareasViewSet, basename= 'gestion_de_tareas')

urlpatterns= [
    path('', include(router.urls)),
]