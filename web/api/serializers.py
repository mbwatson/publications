from rest_framework import serializers
from .models import Publication

class PublicationSerializer(serializers.HyperlinkedModelSerializer):
    # POST request to take many DOIs ?
    # def __init__(self, *args, **kwargs):
    #     many = kwargs.pop('many', True)
    #     super(PublicationSerializer, self).__init__(many=many, *args, **kwargs)

    url = serializers.HyperlinkedIdentityField(
        view_name='publication-detail',
        # format='html',
    )

    class Meta:
        model = Publication
        fields = ('url', 'doi', 'title', 'citation', 'container', 'pub_type', 'date')
        extra_kwargs = {
            'url': {
                'view_name': 'publication-detail',
                'lookup_field': 'doi'
            }
        }

