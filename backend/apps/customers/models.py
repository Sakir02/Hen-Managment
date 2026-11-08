from django.db import models
from django.conf import settings
from apps.core.models import UUIDBaseModel

class Customer(UUIDBaseModel):
    name = models.CharField(max_length=200, db_index=True)
    phone = models.CharField(max_length=20, db_index=True)
    address = models.TextField(blank=True)
    photo = models.ImageField(upload_to='customers/photos/', null=True, blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='created_customers'
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='assigned_customers'
    )

    class Meta:
        db_table = 'customers'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.phone})"
