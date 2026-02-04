from django.contrib import admin
from django.urls import path, include
from content_posts import views as content_views

urlpatterns = [
    path("", content_views.post_list, name="post_list_root"),
    path("create/", content_views.create_post, name="create_post"),
    path("admin/", admin.site.urls),
    path("api/", include("content_posts.urls")),
    path("dashboard/", content_views.dashboard, name="dashboard"),
]
