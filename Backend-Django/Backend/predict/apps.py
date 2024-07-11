from django.apps import AppConfig


class PredictConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'predict'
    
def ready(self):
        # Optional: Import signals or perform any initialization tasks
        pass