from rest_framework import serializers
from .models import Consumption, ModelOption, Prediction, UsageData

class ConsumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consumption
        fields = '__all__'
class UsageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageData
        fields = '__all__'
class ModelOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelOption
        fields = '__all__'