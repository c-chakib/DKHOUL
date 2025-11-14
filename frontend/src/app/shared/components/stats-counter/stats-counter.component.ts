import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
  <span class="text-4xl md:text-5xl font-bold mb-3">{{displayValue}}</span>
      <div *ngIf="label" class="text-lg text-gray-500">{{label}}</div>
    </div>
  `,
  styles: [`
    .text-4xl { font-size: 2.25rem; }
    .md\\:text-5xl { font-size: 3rem; }
    .font-bold { font-weight: bold; }
    .mb-3 { margin-bottom: 0.75rem; }
  `]
})
export class StatsCounterComponent implements OnInit {
  @Input() value = 0;
  @Input() duration = 120;
  @Input() label = '';
  displayValue = 0;

  ngOnInit() {
    this.animateCounter();
  }

  animateCounter() {
    const start = 0;
    const end = this.value;
    const range = end - start;
    const minTimer = 10;
    const step = Math.ceil(range / 40); // 40 steps max
    const stepTime = Math.max(Math.floor(this.duration / (range / step)), minTimer);
    let current = start;
    const timer = setInterval(() => {
      current += step;
      if (current > end) current = end;
      this.displayValue = current;
      if (current >= end) {
        clearInterval(timer);
      }
    }, stepTime);
  }
}
