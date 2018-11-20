from django.db import models
import requests
from crossref.restful import Works

works = Works()

# Publications

class PublicationManager(models.Manager):
    def create_publication(self, doi):
        publication = self.create(doi=doi)
        return publication

class Publication(models.Model):
    doi = models.CharField(max_length=63, blank=False, unique=True)
    title = models.CharField(max_length=255, blank=True)
    citation = models.TextField(blank=True, null=False, default='Unavailable')
    container = models.CharField(max_length=127, blank=True, null=True)
    pub_type = models.CharField(max_length=63, blank=True, null=True)
    date = models.DateField(null=True)

    def __str__(self):
        return f'{self.title} ({self.doi})'

    def __repr__(self):
        return str(self.doi)

    def _fetch_citation(self, citation_format='apa'):
        url = f'http://dx.doi.org/{self.doi}'
        headers = {
            'Accept': 'text/bibliography; style=apa',
        }
        citation = requests.get(url, headers=headers)
        citation.encoding = 'utf-8'
        return citation.text or None
    
    def zeroPad(val):
        return f'{val}' if val > 10 else f'0{val}'

    def dateFromYYYYMDList(self, dateParts):
        try:
            yyyy, m, d = dateParts.get('date-parts', '')[0]
        except:
            return ''
        return f'{yyyy}-{"%02d" % m}-{"%02d" % d}'

    def save(self, *args, **kwargs):
        work = works.doi(doi=self.doi)
        title = work.get('title', '')
        self.title =  title[0] if title != '' else ''
        self.citation = self._fetch_citation()
        self.type = work.get('type', '')
        container = work.get('container-title', '')
        self.container =  container[0] if container != '' else ''
        self.pub_type = work.get('type', '')
        self.date = self.dateFromYYYYMDList(work.get('created',''))
        super(Publication, self).save(*args, **kwargs)
