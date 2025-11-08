import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  currentLanguage = 'fr'; // Default language

  changeLanguage(lang: string): void {
    this.currentLanguage = lang;
    // TODO: Implement actual language change logic with i18n
    console.log('Footer language changed to:', lang);
  }
}
