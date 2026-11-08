from django.db import models
from django.conf import settings
from apps.core.models import BaseModel

class Permission(models.Model):
    code = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=100)
    module = models.CharField(max_length=50, db_index=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'acl_permissions'
        ordering = ['module', 'code']

    def __str__(self):
        return f"{self.module}: {self.code}"

class Role(BaseModel):
    code = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_system = models.BooleanField(default=False)
    permissions = models.ManyToManyField(Permission, related_name='roles', blank=True)

    class Meta:
        db_table = 'acl_roles'
        ordering = ['name']

    def __str__(self):
        return self.name

class UserRole(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role_users')
    assigned_at = models.DateTimeField(auto_now_add=True)
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='assigned_roles'
    )

    class Meta:
        db_table = 'acl_user_roles'
        unique_together = ('user', 'role')

    def __str__(self):
        return f"{self.user.email} -> {self.role.name}"

class FieldPermission(models.Model):
    ACCESS_LEVELS = (
        ('READ_WRITE', 'Read & Write'),
        ('READ_ONLY', 'Read Only'),
        ('HIDDEN', 'Hidden'),
    )

    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='field_permissions')
    model_name = models.CharField(max_length=50, db_index=True)
    field_name = models.CharField(max_length=50)
    access_level = models.CharField(max_length=20, choices=ACCESS_LEVELS, default='READ_WRITE')

    class Meta:
        db_table = 'acl_field_permissions'
        unique_together = ('role', 'model_name', 'field_name')

    def __str__(self):
        return f"{self.role.name} - {self.model_name}.{self.field_name}: {self.access_level}"
