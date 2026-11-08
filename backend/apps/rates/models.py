from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.core.models import BaseModel

class RateSetting(BaseModel):
    HEN_TYPE_CHOICES = (
        ('MARGA', 'Marga (Male)'),
        ('MARGEE', 'Margee (Female)'),
    )

    hen_type = models.CharField(max_length=20, choices=HEN_TYPE_CHOICES, db_index=True)
    rate_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    effective_from = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True, db_index=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='updated_rates'
    )

    class Meta:
        db_table = 'rate_settings'
        ordering = ['-effective_from']

    def __str__(self):
        return f"{self.get_hen_type_display()}: ₹{self.rate_per_kg}/kg"

    @classmethod
    def get_current_rate(cls, hen_type):
        active_rate = cls.objects.filter(hen_type=hen_type, is_active=True).first()
        if active_rate:
            return active_rate.rate_per_kg
        return None
