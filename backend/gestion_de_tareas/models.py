from django.db import models

class gestionDeTareas(models.Model):
    ESTADOS = (
        ('pendiente','Pendiente'),
        ('en_progreso','En progreso'),
        ('completada', 'Completada'),
    )

    #por defecto django ya crea una clave primaria ej: id INTEGER PRIMARY KEY AUTOINCREMENT
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    fecha_limite = models.DateField(blank=True, null= True)
    estado = models.CharField(max_length=20, choices= ESTADOS, default='pendiente')

    def __str__(self):
        return self.titulo
