from django.shortcuts import render
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from .models import Publication
from .serializers import PublicationSerializer

class PublicationViewSet(viewsets.ModelViewSet):
    model = Publication
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    # lookup_field = 'doi'

    # def create(self, request, *args, **kwargs):
    #     doi = request.data.get('doi', '')
    #     if Publication.objects.filter(doi=doi):
    #         headers = { 'error': 'A record of thisz publication exists' }
    #         return Response('', status=status.HTTP_409_CONFLICT, headers=headers)
    #     serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)

    # def perform_create(self, serializer):
    #     if serializer.is_valid():
    #         doi = serializer.validated_data['doi']

    #         if doi != '':
    #             publications = Publication.objects.filter(doi=doi)
    #             if not publications:
    #                 publication = serializer.save()
    #             else:
    #                 publication = publications[0]
    #                 serializer = PublicationSerializer(publication)
    #             return Response(serializer.data)
    #         else:
    #             return Response(data={'message': 'Empty doi'},
    #                         status=status.HTTP_400_BAD_REQUEST)
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # def get_queryset(self):
    #     queryset = Publication.objects.all()
    #     doi = self.request.query_params.get('doi', None)
    #     if doi:
    #         queryset = queryset.filter(doi=doi)
    #     return queryset

    # def create(self, request, *args, **kwargs):
    #     try:
    #         serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
    #         serializer.is_valid(raise_exception=True)
    #         self.perform_create(serializer)
    #         headers = self.get_success_headers(serializer.data)
    #         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    #     except:
    #         headers = self.get_success_headers('')
    #         return Response('', status=status.HTTP_409_CONFLICT, headers=headers)
