from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import Hen, HenImage
from .serializers import HenSerializer, HenImageSerializer, validate_image_file
from apps.customers.models import Customer
from apps.access_control.permissions import (
    CanViewHen, CanCreateHen, CanUpdateHen, CanDeleteHen
)
from apps.audit.models import AuditLog

class CustomerHenListCreateView(generics.ListCreateAPIView):
    serializer_class = HenSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [CanCreateHen()]
        return [CanViewHen()]

    def get_queryset(self):
        customer_id = self.kwargs.get('customer_id')
        queryset = Hen.objects.filter(customer_id=customer_id)
        hen_type = self.request.query_params.get('type')
        if hen_type:
            queryset = queryset.filter(type=hen_type.upper())
        return queryset

    def perform_create(self, serializer):
        customer = get_object_or_404(Customer, id=self.kwargs.get('customer_id'))
        hen = serializer.save(customer=customer, created_by=self.request.user)

        AuditLog.log(
            action='CREATE',
            entity_type='Hen',
            entity_id=str(hen.id),
            user=self.request.user,
            new_values={
                'hen_number': hen.hen_number,
                'type': hen.type,
                'weight': str(hen.weight),
                'rate_applied': str(hen.rate_applied),
                'customer_id': str(customer.id)
            },
            request=self.request
        )

class HenDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hen.objects.all()
    serializer_class = HenSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [CanUpdateHen()]
        elif self.request.method == 'DELETE':
            return [CanDeleteHen()]
        return [CanViewHen()]

    def perform_update(self, serializer):
        old_instance = self.get_object()
        old_values = {
            'weight': str(old_instance.weight),
            'type': old_instance.type,
            'notes': old_instance.notes
        }
        hen = serializer.save()

        AuditLog.log(
            action='UPDATE',
            entity_type='Hen',
            entity_id=str(hen.id),
            user=self.request.user,
            old_values=old_values,
            new_values={
                'weight': str(hen.weight),
                'type': hen.type,
                'notes': hen.notes
            },
            request=self.request
        )

    def perform_destroy(self, instance):
        AuditLog.log(
            action='DELETE',
            entity_type='Hen',
            entity_id=str(instance.id),
            user=self.request.user,
            old_values={'hen_number': instance.hen_number, 'weight': str(instance.weight)},
            request=self.request
        )
        instance.delete()

class HenImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [CanUpdateHen]

    def post(self, request, id):
        hen = get_object_or_404(Hen, id=id)
        files = request.FILES.getlist('images')

        if not files:
            return Response(
                {'success': False, 'message': 'No image files provided in request.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        created_images = []
        for f in files:
            validate_image_file(f)
            img = HenImage.objects.create(hen=hen, image=f)
            created_images.append(img)

        # Set primary image if not set
        if not hen.image and created_images:
            hen.image = created_images[0].image
            hen.save(update_fields=['image'])

        AuditLog.log(
            action='UPDATE',
            entity_type='Hen',
            entity_id=str(hen.id),
            user=request.user,
            new_values={'uploaded_images_count': len(created_images)},
            request=request
        )

        serializer = HenImageSerializer(created_images, many=True, context={'request': request})
        return Response({
            'success': True,
            'message': f'{len(created_images)} images uploaded successfully.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)

class HenImageDeleteView(APIView):
    permission_classes = [CanDeleteHen]

    def delete(self, request, hen_id, image_id):
        image = get_object_or_404(HenImage, id=image_id, hen_id=hen_id)
        image.delete()

        AuditLog.log(
            action='DELETE',
            entity_type='HenImage',
            entity_id=str(image_id),
            user=request.user,
            old_values={'hen_id': str(hen_id)},
            request=request
        )

        return Response({
            'success': True,
            'message': 'Image deleted successfully.'
        }, status=status.HTTP_200_OK)
