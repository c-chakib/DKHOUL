import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-static-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './static-page.component.html',
  styleUrl: './static-page.component.scss'
})
export class StaticPageComponent {
  title = '';
  subtitle = '';
  sections: Array<{ heading?: string; content: string }>= [];

  constructor(private route: ActivatedRoute) {
    const data = this.route.snapshot.data || {};
    this.title = data['title'] || '';
    this.subtitle = data['subtitle'] || '';
    this.sections = data['sections'] || [];
  }
}
