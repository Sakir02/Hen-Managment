import uuid
from django.db import models
from django.conf import settings
from decimal import Decimal
from apps.core.models import UUIDBaseModel
from apps.rates.models import RateSetting

class Hen(UUIDBaseModel):
    TYPE_CHOICES = (
        ('MARGA', 'Marga (Male)'),
        ('MARGEE', 'Margee (Female)'),
    )

    customer = models.ForeignKey(
        'customers.Customer',
        on_delete=models.CASCADE,
        related_name='hens'
    )
    hen_number = models.CharField(max_length=50, db_index=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, db_index=True)
    weight = models.DecimalField(max_digits=8, decimal_places=3, help_text="Weight in kilograms (e.g. 2.850)")
    rate_applied = models.DecimalField(max_digits=10, decimal_places=2, help_text="Locked rate per kg at creation")
    image = models.ImageField(upload_to='hens/photos/', null=True, blank=True, help_text="Primary thumbnail image")
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='created_hens'
    )

    class Meta:
        db_table = 'hens'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.hen_number} ({self.get_type_display()} - {self.weight}kg)"

    @property
    def total_amount(self):
        if self.weight and self.rate_applied:
            return (self.weight * self.rate_applied).quantize(Decimal('0.01'))
        return Decimal('0.00')

    def save(self, *args, **kwargs):
        if not self.rate_applied:
            current_rate = RateSetting.get_current_rate(self.type)
            if current_rate:
                self.rate_applied = current_rate
            else:
                self.rate_applied = Decimal('0.00')
        super().save(*args, **kwargs)

class HenImage(models.Model):
    """
    Supports multiple photo attachments per hen (tag photos, body condition, batch shots).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hen = models.ForeignKey(Hen, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='hens/photos/%Y/%m/')
    caption = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'hen_images'
        ordering = ['created_at']

    def __str__(self):
        return f"Image for Hen #{self.hen.hen_number}"
