from django.urls import path
from .views import (
    CustomerHenListCreateView,
    HenDetailView,
    HenImageUploadView,
    HenImageDeleteView,
)

urlpatterns = [
    path('customers/<uuid:customer_id>/hens/', CustomerHenListCreateView.as_view(), name='customer-hens-list-create'),
    path('hens/<uuid:pk>/', HenDetailView.as_view(), name='hen-detail'),
    path('hens/<uuid:id>/images/', HenImageUploadView.as_view(), name='hen-image-upload'),
    path('hens/<uuid:hen_id>/images/<uuid:image_id>/', HenImageDeleteView.as_view(), name='hen-image-delete'),
]
