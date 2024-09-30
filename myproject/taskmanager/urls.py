from django.urls import path, include
from .views import TodoView, RegisterAPI, LoginAPI
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'tasks', TodoView)

urlpatterns = [
  path('api/register/', RegisterAPI.as_view()),
  path('api/login/', LoginAPI.as_view()),
  path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
  path('api/', include(router.urls))
]
