from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from .models import SocialPost
from .serializers import SocialPostSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Avg, Sum
import requests
from decouple import config
from rest_framework import status
from rest_framework.decorators import api_view
from .logger import setup_logger

logger = setup_logger()

class PostViewSet(ModelViewSet):
    queryset = SocialPost.objects.all().order_by("-created_at")
    serializer_class = SocialPostSerializer
    filter_backends = [SearchFilter]
    search_fields = ["title", "content"]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if isinstance(data.get("scheduled_time"), str) and not data.get("scheduled_time").strip():
            data["scheduled_time"] = None
        if data.get("engagement_score") in ["", None]:
            data["engagement_score"] = 0
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        if isinstance(data.get("scheduled_time"), str) and not data.get("scheduled_time").strip():
            data["scheduled_time"] = None
        if data.get("engagement_score") in ["", None]:
            data["engagement_score"] = 0
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class PostAnalyticsView(APIView):
    def get(self, request, *args, **kwargs):
        platform_stats = SocialPost.objects.values('platform').annotate(count=Count('id'))
        status_stats = SocialPost.objects.values('status').annotate(count=Count('id'))
        engagement_stats = SocialPost.objects.values('platform').annotate(avg_engagement=Avg('engagement_score'))
        total_posts = SocialPost.objects.count()
        total_engagement = SocialPost.objects.aggregate(total_engagement=Sum('engagement_score'))['total_engagement']

        return Response({
            'platform_stats': platform_stats,
            'status_stats': status_stats,
            'engagement_stats': engagement_stats,
            'total_posts': total_posts,
            'total_engagement': total_engagement,
        })

class FetchImageView(APIView):
    def get(self, request, *args, **kwargs):
        # Replace with your Unsplash Access Key
        access_key = config('UNSPLASH_ACCESS_KEY', default=None)
        if not access_key:
            return Response({"error": "Unsplash API key not configured"}, status=500)

        query = request.query_params.get('query', 'social media')
        url = f"https://api.unsplash.com/photos/random?query={query}&client_id={access_key}"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            return Response({"url": data["urls"]["regular"]})
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=500)


class RandomQuoteView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Try quotable.io first with SSL verification disabled for local dev
            response = requests.get("https://api.quotable.io/random", verify=False, timeout=5)
            response.raise_for_status()
            data = response.json()
            return Response({"content": data["content"], "author": data.get("author", "Unknown")})
        except:
            # Fallback to a simpler API if quotable.io fails
            try:
                response = requests.get("https://zenquotes.io/api/random", verify=False, timeout=5)
                response.raise_for_status()
                data = response.json()
                if data and len(data) > 0:
                    return Response({"content": data[0]["q"], "author": data[0].get("a", "Unknown")})
            except:
                # Final fallback - return a hardcoded inspirational quote
                quotes = [
                    {"content": "The best time to plant a tree was 20 years ago. The second best time is now.", "author": "Chinese Proverb"},
                    {"content": "Your limitation—it's only your imagination.", "author": "Unknown"},
                    {"content": "Great things never come from comfort zones.", "author": "Unknown"},
                    {"content": "Success doesn't just find you. You have to go out and get it.", "author": "Unknown"},
                    {"content": "Dream it. Wish it. Do it.", "author": "Unknown"},
                ]
                import random
                return Response(random.choice(quotes))

@api_view(['GET', 'POST'])
def post_list_create(request):
    # Handle the "CREATE" button click
    if request.method == 'POST':
        serializer = SocialPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # If it fails, print the error to your terminal so you can see it!
        print("❌ Validation Error:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handle listing posts (for the Dashboard)
    elif request.method == 'GET':
        posts = SocialPost.objects.all().order_by('-created_at')
        serializer = SocialPostSerializer(posts, many=True)
        return Response(serializer.data)
