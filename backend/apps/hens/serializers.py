import os
from rest_framework import serializers
from decimal import Decimal
from .models import Hen, HenImage
from apps.access_control.field_permissions import FieldPermissionSerializerMixin

MAX_IMAGE_SIZE_MB = 5
ALLOWED_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp')

def validate_image_file(file_obj):
    if file_obj.size > MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise serializers.ValidationError(f"Image {file_obj.name} exceeds {MAX_IMAGE_SIZE_MB}MB size limit.")
    ext = os.path.splitext(file_obj.name)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise serializers.ValidationError(f"Invalid image format {ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")
    return file_obj

class HenImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HenImage
        fields = ('id', 'image', 'caption', 'created_at')
        read_only_fields = ('id', 'created_at')

class HenSerializer(FieldPermissionSerializerMixin, serializers.ModelSerializer):
    images = HenImageSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = Hen
        fields = (
            'id',
            'customer',
            'hen_number',
            'type',
            'type_display',
            'weight',
            'rate_applied',
            'total_amount',
            'image',
            'images',
            'notes',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'total_amount', 'created_at', 'updated_at')

    def create(self, validated_data):
        request = self.context.get('request')
        hen = super().create(validated_data)

        # Handle multiple uploaded image files
        if request and hasattr(request, 'FILES'):
            uploaded_files = request.FILES.getlist('images')
            for f in uploaded_files:
                validate_image_file(f)
                HenImage.objects.create(hen=hen, image=f)

            # Auto-assign primary thumbnail image if not set
            if not hen.image and uploaded_files:
                hen.image = uploaded_files[0]
                hen.save(update_fields=['image'])

        return hen

    def update(self, instance, validated_data):
        request = self.context.get('request')
        hen = super().update(instance, validated_data)

        if request and hasattr(request, 'FILES'):
            uploaded_files = request.FILES.getlist('images')
            for f in uploaded_files:
                validate_image_file(f)
                HenImage.objects.create(hen=hen, image=f)

        return hen
