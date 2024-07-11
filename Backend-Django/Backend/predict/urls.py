
from django.conf import settings
from django.db import router
from django.urls import include, path
from rest_framework import routers
from django.conf.urls.static import static

from predict import views

router = routers.DefaultRouter()
router.register('predict', views.ConsumptionView)
urlpatterns = [
#path('form/', views.forms, name='myform'),
    path('form/' , views.cxcontact),
    path('distribution/' , views.prediction_distribution),
    path('usage_data/', views.UsageDataListCreateView.as_view(), name='usage-data-list-create'),
    path('distribution2/', views.DistributionView.as_view(), name='distribution'),
    path('handset_distribution/', views.HandsetDistributionView.as_view(), name='handset-distribution'),
    path('offer_group_distribution/', views.OfferGroupDistributionView.as_view(), name='offer-group-distribution'),
    path('past_predictions/', views.past_predictions, name='past_predictions'),
    path('upload-model/', views.upload_model),
    path('make-prediction/', views.make_prediction, name='make_prediction'),
    path('list-models/', views.list_models, name='list_models'),
        path('handle-csv-upload/', views.handle_uploaded_file, name='handle-csv-upload'),




]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)