import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';
import { Meta, Title } from '@angular/platform-browser';

class MockMeta {
  tags: any[] = [];
  updateTag(tag: any) {
    const existingIndex = this.tags.findIndex(t => t.name === tag.name || t.property === tag.property);
    if (existingIndex > -1) this.tags[existingIndex] = tag; else this.tags.push(tag);
  }
}
class MockTitle {
  value = '';
  setTitle(v: string) { this.value = v; }
  getTitle() { return this.value; }
}

describe('SeoService', () => {
  let service: SeoService;
  let meta: MockMeta;
  let title: MockTitle;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SeoService,
        { provide: Meta, useClass: MockMeta },
        { provide: Title, useClass: MockTitle }
      ]
    });
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta) as unknown as MockMeta;
    title = TestBed.inject(Title) as unknown as MockTitle;
  });

  it('should set default meta on reset', () => {
    service.resetToDefaults();
    expect(title.getTitle()).toContain('DKHOUL');
  });

  it('should update custom meta tags', () => {
    service.updateMetaTags({ title: 'Custom Title', description: 'Desc' });
    expect(title.getTitle()).toBe('Custom Title');
  });

  it('should build service meta', () => {
    service.updateServiceSeo({ title: 'Camel Ride', description: 'Amazing desert experience', images: ['img.jpg'], _id: '123' });
    expect(title.getTitle()).toContain('Camel Ride');
  });
});
