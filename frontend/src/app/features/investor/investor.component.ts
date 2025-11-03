import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-investor',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './investor.component.html',
  styleUrl: './investor.component.scss'
})
export class InvestorComponent {
  investorForm = {
    name: '',
    email: '',
    company: '',
    amount: '',
    message: ''
  };

  constructor(private router: Router) {}

  navigateToDemo(): void {
    this.router.navigate(['/home']);
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  submitInvestorForm(): void {
    console.log('Investor form submitted:', this.investorForm);
    // TODO: Implement actual form submission
    alert('Merci pour votre intérêt ! Nous vous contacterons bientôt.');
  }
}
