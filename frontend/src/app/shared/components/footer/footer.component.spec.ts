import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        RouterTestingModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
    
    const compiled = fixture.nativeElement as HTMLElement;
    const copyrightText = compiled.querySelector('.copyright')?.textContent;
    expect(copyrightText).toContain(currentYear.toString());
  });

  it('should have default language as French', () => {
    expect(component.currentLanguage).toBe('fr');
  });

  it('should change language to English', () => {
    spyOn(console, 'log');
    component.changeLanguage('en');
    
    expect(component.currentLanguage).toBe('en');
    expect(console.log).toHaveBeenCalledWith('Footer language changed to:', 'en');
  });

  it('should change language to Arabic', () => {
    spyOn(console, 'log');
    component.changeLanguage('ar');
    
    expect(component.currentLanguage).toBe('ar');
    expect(console.log).toHaveBeenCalledWith('Footer language changed to:', 'ar');
  });

  it('should render brand logo with Arabic letter', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const arabicLetter = compiled.querySelector('.arabic-letter');
    
    expect(arabicLetter).toBeTruthy();
    expect(arabicLetter?.textContent).toBe('د');
  });

  it('should render brand name DKHOUL', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brandName = compiled.querySelector('.brand-name');
    
    expect(brandName).toBeTruthy();
    expect(brandName?.textContent).toBe('DKHOUL');
  });

  it('should render brand tagline', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tagline = compiled.querySelector('.brand-tagline');
    
    expect(tagline).toBeTruthy();
    expect(tagline?.textContent).toBe('Welcome to Morocco');
  });

  it('should render footer description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const description = compiled.querySelector('.footer-description');
    
    expect(description).toBeTruthy();
    expect(description?.textContent).toContain('marketplace marocaine');
  });

  it('should render social media icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const socialIcons = compiled.querySelectorAll('.social-icon');
    
    expect(socialIcons.length).toBeGreaterThan(0);
  });

  it('should have facebook social link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const socialLinks = compiled.querySelectorAll('.social-icon');
    const facebookLink = Array.from(socialLinks).find(link => 
      link.getAttribute('href')?.includes('facebook')
    );
    
    expect(facebookLink).toBeTruthy();
    expect(facebookLink?.getAttribute('target')).toBe('_blank');
  });

  it('should render footer grid with columns', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerGrid = compiled.querySelector('.footer-grid');
    
    expect(footerGrid).toBeTruthy();
  });

  it('should render footer titles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerTitles = compiled.querySelectorAll('.footer-title');
    
    expect(footerTitles.length).toBeGreaterThan(0);
  });

  it('should render footer links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerLinks = compiled.querySelectorAll('.footer-links');
    
    expect(footerLinks.length).toBeGreaterThan(0);
  });

  it('should render footer bottom section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerBottom = compiled.querySelector('.footer-bottom');
    
    expect(footerBottom).toBeTruthy();
  });

  it('should render language selector', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const languageSelector = compiled.querySelector('.language-selector');
    
    expect(languageSelector).toBeTruthy();
  });

  it('should handle multiple language changes', () => {
    component.changeLanguage('en');
    expect(component.currentLanguage).toBe('en');
    
    component.changeLanguage('ar');
    expect(component.currentLanguage).toBe('ar');
    
    component.changeLanguage('fr');
    expect(component.currentLanguage).toBe('fr');
  });
});
