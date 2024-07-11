from django.db import models

class Consumption(models.Model):
    #DATE_ACTIVATION = models.DateTimeField()
    GROUPE_OFFRE = models.IntegerField()
    #CREDIT_CLEARANCE_DATE = models.DateTimeField()
    HANDSET = models.IntegerField()
    MNT_FORF_DATA_W0 = models.FloatField()
    MNT_TRANSFERT_IN_M4 = models.FloatField()
    MNT_TRANSFERT_OUT_M4 = models.FloatField()
    MNT_RECHARGE_SUP5_W6 = models.FloatField()
    MNT_FORF_DATA_W1 = models.FloatField()
    MNT_FORF_DATA_W2 = models.FloatField()
    MNT_FORF_DATA_W3 = models.FloatField()
    MNT_FORF_DATA_W4 = models.FloatField()
    MNT_FORF_DATA_W5 = models.FloatField()
    MNT_FORF_DATA_W6 = models.FloatField()
    MNT_FORF_DATA_W7 = models.FloatField()
    MNT_FORF_DATA_W8 = models.FloatField()
    MNT_FORF_DATA_W9 = models.FloatField()
    NB_FORF_DATA_W9 = models.IntegerField()
    USG_REVENUE_AMT_SMS_W9 = models.FloatField()
    NB_APPEL_M4_y = models.IntegerField()
    USG = models.FloatField()
    REVENU = models.FloatField()
    HANDSET = models.FloatField()
    MNT = models.FloatField()
    GROUPE = models.FloatField()
    NB = models.FloatField()
    VOLUME = models.FloatField()
    DURATION = models.FloatField()
    NUM = models.FloatField()
    DUREE = models.FloatField()

    def __str__(self):
        return self.USG_REVENUE_AMT_SMS_W9

class Prediction(models.Model):
    predicted_value = models.FloatField()
    category = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.predicted_value} ({self.category})'
    



class UsageData(models.Model):
    handset = models.IntegerField(choices=[(0, '2G'), (1, '3G'), (2, '4G')])
    offer_group = models.IntegerField(choices=[(1, 'JawekNet'), (2, 'TRANKIL'), (3, 'HADRANET'), (4, 'PASS ETUDIANT')])
    prediction = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

# models.py

from django.db import models

class DefaultModel(models.Model):
    # Define fields specific to your default model
    handset = models.IntegerField()
    offer_group = models.IntegerField()
    prediction = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

class ModelOption(models.Model):
    model_file = models.FileField(upload_to='models')
    model_type = models.CharField(max_length=50)
    uploaded_at = models.DateTimeField(auto_now_add=True)

# models.py

class TempCSVData(models.Model):
    client_id = models.CharField(max_length=255)
     #DATE_ACTIVATION = models.DateTimeField() 
    GROUPE_OFFRE = models.IntegerField()
    #CREDIT_CLEARANCE_DATE = models.DateTimeField()
    HANDSET = models.IntegerField()  # Assuming the first HANDSET field is correct
    MNT_FORF_DATA_W0 = models.FloatField()
    MNT_TRANSFERT_IN_M4 = models.FloatField()
    MNT_TRANSFERT_OUT_M4 = models.FloatField()
    MNT_RECHARGE_SUP5_W6 = models.FloatField()
    MNT_FORF_DATA_W1 = models.FloatField()
    MNT_FORF_DATA_W2 = models.FloatField()
    MNT_FORF_DATA_W3 = models.FloatField()
    MNT_FORF_DATA_W4 = models.FloatField()
    MNT_FORF_DATA_W5 = models.FloatField()
    MNT_FORF_DATA_W6 = models.FloatField()
    MNT_FORF_DATA_W7 = models.FloatField()
    MNT_FORF_DATA_W8 = models.FloatField()
    MNT_FORF_DATA_W9 = models.FloatField()
    NB_FORF_DATA_W9 = models.IntegerField()
    USG_REVENUE_AMT_SMS_W9 = models.FloatField()
    NB_APPEL_M4_y = models.IntegerField()
    USG = models.FloatField()
    REVENU = models.FloatField()
    HANDSET = models.FloatField()  # Assuming the second HANDSET field is correct
    MNT = models.FloatField()
    GROUPE = models.FloatField()
    NB = models.FloatField()
    VOLUME = models.FloatField()
    DURATION = models.FloatField()
    NUM = models.FloatField()
    DUREE = models.FloatField()
    # Add fields for other columns you expect in the CSV
