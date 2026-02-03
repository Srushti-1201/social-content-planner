from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, PostAnalyticsView, FetchImageView, RandomQuoteView

router = DefaultRouter()
router.register(r"posts", PostViewSet, basename="posts")

urlpatterns = [
    path("health/", lambda r: JsonResponse({"status": "ok"})),
    path("posts/analytics/", PostAnalyticsView.as_view(), name="post-analytics"),
    path("posts/fetch_image/", FetchImageView.as_view(), name="fetch-image"),
    path("posts/random_quote/", RandomQuoteView.as_view(), name="random-quote"),
    path("", include(router.urls)),
]
