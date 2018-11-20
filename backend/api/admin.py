from django.contrib import admin
from .models import Publication

from crossref.restful import Works
works = Works()

admin.site.site_header = 'Publications Admin'

class PublicationAdmin(admin.ModelAdmin):
    list_display = ('doi', 'title')
    exclude = ('authors', 'title', 'citation', 'container', 'pub_type', 'date',)
    search_fields = (
        'title', 'doi', 'authors__employee__last_name' 'authors__employee__first_name'
    )

    class Meta:
        model = Publication

admin.site.register(Publication, PublicationAdmin)
