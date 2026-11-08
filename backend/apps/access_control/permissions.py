from rest_framework import permissions

def check_user_permission(user, permission_code):
    if not user or not user.is_authenticated:
        return False
    if user.is_superuser:
        return True
    return user.user_roles.filter(role__permissions__code=permission_code).exists()

class HasDynamicPermission(permissions.BasePermission):
    required_permission = None

    def has_permission(self, request, view):
        perm = getattr(view, 'required_permission', self.required_permission)
        if not perm:
            return True
        return check_user_permission(request.user, perm)

def make_permission_class(permission_code):
    return type(
        f"HasPermission_{permission_code}",
        (permissions.BasePermission,),
        {
            'has_permission': lambda self, request, view: check_user_permission(request.user, permission_code)
        }
    )

# Predefined permission classes
CanViewCustomer = make_permission_class('CUSTOMER_VIEW')
CanCreateCustomer = make_permission_class('CUSTOMER_CREATE')
CanUpdateCustomer = make_permission_class('CUSTOMER_UPDATE')
CanDeleteCustomer = make_permission_class('CUSTOMER_DELETE')

CanViewHen = make_permission_class('HEN_VIEW')
CanCreateHen = make_permission_class('HEN_CREATE')
CanUpdateHen = make_permission_class('HEN_UPDATE')
CanDeleteHen = make_permission_class('HEN_DELETE')

CanViewPayment = make_permission_class('PAYMENT_VIEW')
CanCreatePayment = make_permission_class('PAYMENT_CREATE')
CanUpdatePayment = make_permission_class('PAYMENT_UPDATE')
CanDeletePayment = make_permission_class('PAYMENT_DELETE')

CanViewRates = make_permission_class('RATE_VIEW')
CanUpdateRates = make_permission_class('RATE_UPDATE')

CanViewAuditLogs = make_permission_class('AUDIT_LOG_VIEW')
CanManageUsers = make_permission_class('USER_MANAGE')
CanManageRoles = make_permission_class('ROLE_MANAGE')
