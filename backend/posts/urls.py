from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, random_quote

router = DefaultRouter()
router.register('posts', PostViewSet)

urlpatterns = [
    path('external/quote/', random_quote, name='random-quote'),
] + router.urls
