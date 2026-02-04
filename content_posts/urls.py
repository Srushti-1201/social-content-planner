from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PostViewSet,
    PostAnalyticsView,
    FetchImageView,
    RandomQuoteView,
    health,
    post_list,
    PostStatsView,
    post_stats,
    dashboard_stats,
)

router = DefaultRouter()
router.register(r"posts", PostViewSet, basename="posts")

urlpatterns = [
    path("health/", health, name="health"),
    path("analytics/", PostAnalyticsView.as_view(), name="post-analytics"),
    path("fetch_image/", FetchImageView.as_view(), name="fetch-image"),
    path("random_quote/", RandomQuoteView.as_view(), name="random-quote"),
    path("", post_list, name="post-list"),
    path("posts/stats/", PostStatsView.as_view(), name="post-stats"),
    path("dashboard/stats/", dashboard_stats, name="dashboard-stats"),
    path("stats-simple/", post_stats, name="post-stats-simple"),
    path("", include(router.urls)),
]