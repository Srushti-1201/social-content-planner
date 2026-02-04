from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.db.models import Count, Avg, Sum
from django.db import transaction
import requests
import random
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data.pop("scheduled_time", None)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        platform_stats = list(Post.objects.values('platform').annotate(count=Count('id')))
        status_stats = list(Post.objects.values('status').annotate(count=Count('id')))
        engagement_stats = list(Post.objects.values('platform').annotate(avg_engagement=Avg('engagement_score')))
        
        return Response({
            'platform_stats': platform_stats,
            'status_stats': status_stats,
            'engagement_stats': engagement_stats,
            'total_posts': Post.objects.count(),
            'total_engagement': Post.objects.aggregate(total=Sum('engagement_score'))['total'] or 0,
        })
    
    @action(detail=False, methods=['get'])
    def fetch_image(self, request):
        # Return placeholder image for now
        return Response({
            'url': 'https://picsum.photos/800/600',
            'thumbnail': 'https://picsum.photos/400/300',
            'author': 'Placeholder',
            'description': 'Random image'
        })

    @action(detail=False, methods=['post'])
    def generate_engagement(self, request):
        """Generate random engagement scores for all posts"""
        try:
            with transaction.atomic():
                posts = Post.objects.all()
                updated_count = 0
                for post in posts:
                    # Generate random engagement score based on platform
                    platform_multipliers = {
                        'Facebook': 1.0,
                        'Instagram': 1.5,
                        'Twitter': 0.8,
                        'LinkedIn': 1.2,
                    }
                    multiplier = platform_multipliers.get(post.platform, 1.0)
                    score = int(random.randint(100, 1000) * multiplier)
                    post.engagement_score = score
                    post.save(update_fields=['engagement_score'])
                    updated_count += 1
                
            return Response({
                'success': True,
                'message': f'Generated engagement scores for {updated_count} posts',
                'updated_count': updated_count
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def random_quote(request):
    # Fallback quotes in case external API fails
    FALLBACK_QUOTES = [
        {"content": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
        {"content": "Life is what happens when you're busy making other plans.", "author": "John Lennon"},
        {"content": "The future belongs to those who believe in the beauty of their dreams.", "author": "Eleanor Roosevelt"},
        {"content": "It does not matter how slowly you go as long as you do not stop.", "author": "Confucius"},
        {"content": "In the end, it's not the years in your life that count. It's the life in your years.", "author": "Abraham Lincoln"}
    ]
    
    try:
        r = requests.get("https://api.quotable.io/random", timeout=5)
        if r.status_code == 200:
            return Response(r.json())
    except Exception:
        pass
    
    # Return a fallback quote if the external API fails
    import random
    return Response(random.choice(FALLBACK_QUOTES))
