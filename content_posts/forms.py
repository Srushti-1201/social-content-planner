from django import forms
from .models import SocialPost

class SocialPostForm(forms.ModelForm):
    class Meta:
        model = SocialPost
        fields = "__all__"