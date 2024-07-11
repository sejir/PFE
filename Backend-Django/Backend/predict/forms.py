from django import forms
from django.forms import ModelForm
from . models import Consumption, ModelOption

class consumptionFrom(forms.Form):   
    #DATE_ACTIVATION = forms.DateTimeField() 
    GROUPE_OFFRE = forms.IntegerField()
    #CREDIT_CLEARANCE_DATE = forms.DateTimeField()
    HANDSET = forms.IntegerField()  # Assuming the first HANDSET field is correct
    MNT_FORF_DATA_W0 = forms.FloatField()
    MNT_TRANSFERT_IN_M4 = forms.FloatField()
    MNT_TRANSFERT_OUT_M4 = forms.FloatField()
    MNT_RECHARGE_SUP5_W6 = forms.FloatField()
    MNT_FORF_DATA_W1 = forms.FloatField()
    MNT_FORF_DATA_W2 = forms.FloatField()
    MNT_FORF_DATA_W3 = forms.FloatField()
    MNT_FORF_DATA_W4 = forms.FloatField()
    MNT_FORF_DATA_W5 = forms.FloatField()
    MNT_FORF_DATA_W6 = forms.FloatField()
    MNT_FORF_DATA_W7 = forms.FloatField()
    MNT_FORF_DATA_W8 = forms.FloatField()
    MNT_FORF_DATA_W9 = forms.FloatField()
    NB_FORF_DATA_W9 = forms.IntegerField()
    USG_REVENUE_AMT_SMS_W9 = forms.FloatField()
    NB_APPEL_M4_y = forms.IntegerField()
    USG = forms.FloatField()
    REVENU = forms.FloatField()
    HANDSET = forms.FloatField()  # Assuming the second HANDSET field is correct
    MNT = forms.FloatField()
    GROUPE = forms.FloatField()
    NB = forms.FloatField()
    VOLUME = forms.FloatField()
    DURATION = forms.FloatField()
    NUM = forms.FloatField()
    DUREE = forms.FloatField()
# forms.py
class ModelUploadForm(forms.ModelForm):
    class Meta:
        model = ModelOption
        fields = ['model_file', 'model_type']

from .models import TempCSVData

class CSVUploadForm(forms.Form):
    csv_file = forms.FileField()
    