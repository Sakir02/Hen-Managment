from .models import FieldPermission

class FieldPermissionSerializerMixin:
    """
    Dynamically filters serializer fields based on user's active role field permissions.
    """
    def get_field_permission_map(self):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return {}
        if request.user.is_superuser:
            return {}

        model_name = self.Meta.model.__name__
        roles = request.user.user_roles.values_list('role_id', flat=True)
        rules = FieldPermission.objects.filter(role_id__in=roles, model_name=model_name)

        # Merge rules: READ_WRITE > READ_ONLY > HIDDEN
        field_map = {}
        priority = {'HIDDEN': 1, 'READ_ONLY': 2, 'READ_WRITE': 3}
        for rule in rules:
            current = field_map.get(rule.field_name, 'HIDDEN')
            if priority.get(rule.access_level, 0) > priority.get(current, 0):
                field_map[rule.field_name] = rule.access_level
        return field_map

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and request.user and request.user.is_superuser:
            return data

        field_map = self.get_field_permission_map()
        for field, access in field_map.items():
            if access == 'HIDDEN' and field in data:
                del data[field]
        return data

    def validate(self, attrs):
        attrs = super().validate(attrs)
        request = self.context.get('request')
        if request and request.user and request.user.is_superuser:
            return attrs

        field_map = self.get_field_permission_map()
        for field, access in field_map.items():
            if access in ('HIDDEN', 'READ_ONLY') and field in attrs:
                # Do not permit writing to read-only or hidden fields
                del attrs[field]
        return attrs
