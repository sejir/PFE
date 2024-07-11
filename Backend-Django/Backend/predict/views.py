from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import status 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.http import HttpRequest 
from rest_framework.parsers import JSONParser
from .models import Consumption, Prediction, UsageData
from .serializers import ConsumptionSerializer, UsageDataSerializer
from django.db.models import Count
from django.contrib import messages
from rest_framework import generics
from django.contrib.auth.decorators import permission_required
from django.shortcuts import render
from django.http import JsonResponse
from .forms import ModelUploadForm
from django.contrib.auth.decorators import permission_required, login_required
from .models import DefaultModel, ModelOption
from django.db import models  # Add this import

import joblib
import numpy as np
import tensorflow as tf
from django.views.decorators.csrf import csrf_exempt  # Import csrf_exempt decorator if CSRF is not needed

#import safetensor
import pandas as pd
from django.conf import settings
import os
from .forms import consumptionFrom
import pickle
class ConsumptionView(viewsets.ModelViewSet):
    queryset = Consumption.objects.all()
    serializer_class = ConsumptionSerializer

def mean_scaling(data):
    # Calculate the mean and standard deviation of each feature
                  means = np.mean(data, axis=0)
                  stds = np.std(data, axis=0)
    
    # Perform mean scaling
                  scaled_data = (data - means) / stds
    
                  return scaled_data, means, stds

def predict_status(df):
               
# Assuming X is your dataset
  current_dir = os.path.dirname(os.path.abspath(__file__))
  X_scaled, means, stds = mean_scaling(df)
  model_file = os.path.join(current_dir, 'mlp_model.h5')
#a corriger
  scaler_file = os.path.join(current_dir, 'scaling_params.pkl')

  if not os.path.exists(model_file):
     raise FileNotFoundError(f"Model file not found: {model_file}")
  if not os.path.exists(scaler_file):
     raise FileNotFoundError(f"Scaler file not found: {scaler_file}")

  model = tf.keras.models.load_model(model_file)
          # Load the scaler
      
  y_pred = model.predict(df)
    # Predict using the loaded model
  y_pred_list = y_pred.tolist()

  return y_pred_list
  #return y_pred

def handle_prediction(form_data):
    data_dict = {key: [value] for key, value in form_data.items()}
    df = pd.DataFrame(data_dict)
    processed_df = df
    status = predict_status(processed_df)
    return status



import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Consumption  # Import your Consumption model

import json
from django.http import JsonResponse

@csrf_exempt
def cxcontact(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from request body
            raw_data = request.body.decode('utf-8')
            form_data = json.loads(raw_data)
            
            handset = form_data.get('HANDSET')
            offer_group = form_data.get('GROUPE_OFFRE')
            

            # Example of handling specific fields
            predicted_value = handle_prediction(form_data)
            predicted_value=predicted_value[0][0]
            if predicted_value is None:
                category = 'Unknown'  # Example: Handle cases where prediction fails
            elif predicted_value == 0:
                category = 'Very Low'
            elif 0 < predicted_value < 1:
                category = 'Low'
            elif 1 <= predicted_value < 3:
                category = 'Medium'
            elif 3 <= predicted_value < 5:
                category = 'High'
            else:
                category = 'Very High'
            handset = int(handset)
            offer_group = int(offer_group)
            
            pre = UsageData.objects.create(
                handset=handset,
                offer_group=offer_group,
                prediction=predicted_value  # Ensure prediction is saved as a string
            )
            # Handle prediction logic and categorization here
            
            # Example of saving prediction to database
            # Replace with your actual model and logic
            prediction = Prediction.objects.create(
                predicted_value=predicted_value,
                category=category
            )
            
            return JsonResponse({'predicted_value': predicted_value, 'category': category})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

            # Return the predicted status as JSON response
"""return JsonResponse({'predicted_value': status[0][0]})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)"""

def prediction_distribution(request):
    try:
        # Fetch distribution of predictions by category
        categories = ['Very Low', 'Low', 'Medium', 'High', 'Very High']
        distribution = {
            category: Prediction.objects.filter(category=category).count()
            for category in categories
        }
        
        return JsonResponse({'distribution': distribution})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
HANDSET_CHOICES = {
    0: '2G',
    1: '3G',
    2: '4G',
    'default': 'Unknown Handset',
}

OFFER_GROUP_CHOICES = {
    1: 'JawekNet',
    2: 'TRANKIL',
    3: 'HADRANET',
    4: 'PASS ETUDIANT',
    'default': 'Unknown Offer Group',
}


class UsageDataListCreateView(generics.ListCreateAPIView):
    queryset = UsageData.objects.all()
    serializer_class = UsageDataSerializer

class DistributionView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        distribution = UsageData.objects.values('prediction').annotate(count=Count('prediction')).order_by('prediction')
        return Response(distribution)

class HandsetDistributionView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        distribution = UsageData.objects.values('handset').annotate(count=Count('handset')).order_by('handset')
        # Map the handset integers to their string labels with a default for unknown values
        for item in distribution:
            item['handset'] = HANDSET_CHOICES.get(item['handset'], HANDSET_CHOICES['default'])
        return Response(distribution)

class OfferGroupDistributionView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        distribution = UsageData.objects.values('offer_group').annotate(count=Count('offer_group')).order_by('offer_group')
        # Map the offer_group integers to their string labels with a default for unknown values
        for item in distribution:
            item['offer_group'] = OFFER_GROUP_CHOICES.get(item['offer_group'], OFFER_GROUP_CHOICES['default'])
        return Response(distribution)
    

def past_predictions(request):
    predictions = UsageData.objects.all().order_by('-created_at')
    predictions_list = []
    for prediction in predictions:
        predictions_list.append({
            'handset': HANDSET_CHOICES.get(prediction.handset, 'Unknown Handset'),
            'offer_group': OFFER_GROUP_CHOICES.get(prediction.offer_group, 'Unknown Offer Group'),
            'prediction': prediction.prediction,
            'created_at': prediction.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    return JsonResponse({'predictions': predictions_list})



@csrf_exempt
def upload_model(request):
    if request.method == 'POST':
        model_form = ModelUploadForm(request.POST, request.FILES)
        if model_form.is_valid():
            model_form.save()
            return JsonResponse({'message': 'Model uploaded successfully'}, status=200)
        return JsonResponse({'error': model_form.errors}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def list_models(request):
    models = ModelOption.objects.all()
    model_data = [{'model_type': model.model_type} for model in models]
    return JsonResponse({'models': model_data})
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from django.conf import settings
import tensorflow as tf

@csrf_exempt
def make_prediction(request):
    if request.method == 'POST':
        try:
            raw_data = request.body.decode('utf-8')
            data = json.loads(raw_data)

            model_type = data.get('model_type')
            input_data = data.get('data')

            if not model_type:
                return JsonResponse({'error': 'Model type is undefined'}, status=400)

            # Retrieve the model file from the database using the model_type
            try:
                model_option = ModelOption.objects.get(model_type=model_type)
            except ModelOption.DoesNotExist:
                return JsonResponse({'error': 'Model type not found'}, status=400)

            model_path = model_option.model_file.path
            
            # Load the model
            model = tf.keras.models.load_model(model_path)
            
            # Log the input data
            print(input_data)

            # Convert input_data to a format suitable for prediction
            # For simplicity, assume input_data is a dictionary of features
            input_features = [list(input_data.values())]
            data_dict = {key: [value] for key, value in input_data.items()}
            df = pd.DataFrame(data_dict)
            processed_df = df

            # Make prediction
            prediction = model.predict(processed_df)
            predicted_value = float(prediction[0][0])
            if predicted_value is None:
                category = 'Unknown'  # Example: Handle cases where prediction fails
            elif predicted_value == 0:
                category = 'Classe:Very Low            Offre à promouvoir:TRANKIL'
                link = 'https://www.tunisietelecom.tn/particulier/mobile/offres-prepayees/trankil/'
            elif 0 < predicted_value < 1:
                category = 'Classe:Low            Offre à promouvoir:TRANKIL   ' 
                link = 'https://www.tunisietelecom.tn/particulier/mobile/offres-prepayees/trankil/'
            elif 1 <= predicted_value < 3:
                category = 'Classe:Medium           Offre à promouvoir:HADRANET'
                link = 'https://www.tunisietelecom.tn/particulier/mobile/offres-prepayees/hadranet/'
            elif 3 <= predicted_value < 5:
                category = 'Classe:High            Offre à promouvoir:PASS ETUDIANT '
                link = 'https://www.tunisietelecom.tn/particulier/mobile/offres-prepayees/passetudiant/'
            else:
                category = 'Classe:Very High   Offre à promouvoir:Jaweknet'
                link = 'https://www.tunisietelecom.tn/particulier/mobile/offres-prepayees/jaweknet/'

            return JsonResponse({'predicted_value': predicted_value,'Esitmation':category, 'Link': link})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

# views.py

from django.shortcuts import render
from .forms import CSVUploadForm
from .models import TempCSVData
# views.py

from django.http import JsonResponse
from .models import TempCSVData
import pandas as pd
import tensorflow as tf
import json

def handle_uploaded_file(csv_file):
    try:
        df = pd.read_csv(csv_file)
        results = []
        
        for index, row in df.iterrows():
            # Extract relevant data from CSV row
            client_id = row['Client_id']
            GROUPE_OFFRE = row['GROUPE_OFFRE']
            HANDSET = row['HANDSET']
            MNT_FORF_DATA_W0 = row['MNT_FORF_DATA_W0']
            MNT_TRANSFERT_IN_M4 = row['MNT_TRANSFERT_IN_M4']
            MNT_TRANSFERT_OUT_M4 = row['MNT_TRANSFERT_OUT_M4']
            MNT_RECHARGE_SUP5_W6 = row['MNT_RECHARGE_SUP5_W6']
            MNT_FORF_DATA_W1 = row['MNT_FORF_DATA_W1']
            MNT_FORF_DATA_W2 = row['MNT_FORF_DATA_W2']
            MNT_FORF_DATA_W3 = row['MNT_FORF_DATA_W3']
            MNT_FORF_DATA_W4 = row['MNT_FORF_DATA_W4']
            MNT_FORF_DATA_W5 = row['MNT_FORF_DATA_W5']
            MNT_FORF_DATA_W6 = row['MNT_FORF_DATA_W6']
            MNT_FORF_DATA_W7 = row['MNT_FORF_DATA_W7']
            MNT_FORF_DATA_W8 = row['MNT_FORF_DATA_W8']
            MNT_FORF_DATA_W9 = row['MNT_FORF_DATA_W9']
            NB_FORF_DATA_W9 = row['NB_FORF_DATA_W9']
            USG_REVENUE_AMT_SMS_W9 = row['USG_REVENUE_AMT_SMS_W9']
            NB_APPEL_M4_y = row['NB_APPEL_M4_y']
            USG = row['USG']
            REVENU = row['REVENU']
            HANDSET = row['HANDSET']
            MNT = row['MNT']
            GROUPE = row['GROUPE']
            NB = row['NB']
            VOLUME = row['VOLUME']
            DURATION = row['DURATION']
            NUM = row['NUM']
            DUREE = row['DUREE']

            # Prepare input data for prediction
            input_data = {
                'GROUPE_OFFRE': GROUPE_OFFRE,
                'HANDSET': HANDSET,
                'MNT_FORF_DATA_W0': MNT_FORF_DATA_W0,
                'MNT_TRANSFERT_IN_M4': MNT_TRANSFERT_IN_M4,
                'MNT_TRANSFERT_OUT_M4': MNT_TRANSFERT_OUT_M4,
                'MNT_RECHARGE_SUP5_W6': MNT_RECHARGE_SUP5_W6,
                'MNT_FORF_DATA_W1': MNT_FORF_DATA_W1,
                'MNT_FORF_DATA_W2': MNT_FORF_DATA_W2,
                'MNT_FORF_DATA_W3': MNT_FORF_DATA_W3,
                'MNT_FORF_DATA_W4': MNT_FORF_DATA_W4,
                'MNT_FORF_DATA_W5': MNT_FORF_DATA_W5,
                'MNT_FORF_DATA_W6': MNT_FORF_DATA_W6,
                'MNT_FORF_DATA_W7': MNT_FORF_DATA_W7,
                'MNT_FORF_DATA_W8': MNT_FORF_DATA_W8,
                'MNT_FORF_DATA_W9': MNT_FORF_DATA_W9,
                'NB_FORF_DATA_W9': NB_FORF_DATA_W9,
                'USG_REVENUE_AMT_SMS_W9': USG_REVENUE_AMT_SMS_W9,
                'NB_APPEL_M4_y': NB_APPEL_M4_y,
                'USG': USG,
                'REVENU': REVENU,
                'HANDSET': HANDSET,
                'MNT': MNT,
                'GROUPE': GROUPE,
                'NB': NB,
                'VOLUME': VOLUME,
                'DURATION': DURATION,
                'NUM': NUM,
                'DUREE': DUREE,
            }

            # Make prediction using the loaded model
            prediction = make_prediction_from_input(input_data)

            # Example: Assign prediction results to variables
            predicted_value = prediction['predicted_value']
            estimation = prediction['Estimation']
            link = prediction['Link']

            # Append result to list
            results.append({'client_id': client_id, 'prediction': predicted_value, 'estimation': estimation, 'link': link})

            # Save to TempCSVData model if needed
            TempCSVData.objects.create(client_id=client_id)

        return results

    except Exception as e:
        return {'error': str(e)}

def make_prediction_from_input(input_data):
    try:
        # Retrieve model file path from the database (assumed loaded in make_prediction view)
        model_option = ModelOption.objects.get(model_type='your_model_type')  # Update with your model_type
        model_path = model_option.model_file.path

        # Load the model
        model = tf.keras.models.load_model(model_path)

        # Convert input_data to a format suitable for prediction
        data_dict = {key: [value] for key, value in input_data.items()}
        df = pd.DataFrame(data_dict)
        processed_df = df  # Adjust data preprocessing as needed

        # Make prediction
        prediction = model.predict(processed_df)
        predicted_value = float(prediction[0][0])

        # Determine category and link based on predicted_value
        if predicted_value is None:
            category = 'Unknown'
            link = ''
        elif predicted_value == 0:
            category = 'Classe:Very Low            Offre à promouvoir:TRANKIL'
            link = 'https://www.tunisietelecom.tn/particulier/mobile/offres-prepayees/trankil/'
        elif 0 < predicted_value < 1:
            category = 'Classe:Low            Offre à promouvoir:TRANKIL   '
            link = 'https://www.tunisietelecom.tn/particulier/mobile/offres-prepayees/trankil/'
        elif 1 <= predicted_value < 3:
            category = 'Classe:Medium           Offre à promouvoir:HADRANET'
            link = 'https://www.tunisietelecom.tn/particulier/mobile/offres-prepayees/hadranet/'
        elif 3 <= predicted_value < 5:
            category = 'Classe:High            Offre à promouvoir:PASS ETUDIANT '
            link = 'https://www.tunisietelecom.tn/particulier/mobile/offres-prepayees/passetudiant/'
        else:
            category = 'Classe:Very High   Offre à promouvoir:Jaweknet'
            link = 'https://www.tunisietelecom.tn/particulier/mobile/offres-prepayees/jaweknet/'

        return {'predicted_value': predicted_value, 'Estimation': category, 'Link': link}

    except Exception as e:
        return {'error': str(e)}
