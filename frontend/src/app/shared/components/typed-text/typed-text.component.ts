import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-typed-text',
  standalone: true,
  template: `
  <span class="text-2xl md:text-3xl text-white mb-8 font-bold">
      {{displayed}}
      <span class="typed-cursor">|</span>
    </span>
  `,
  styles: [`
    .text-2xl { font-size: 1.5rem; }
    .md\\:text-3xl { font-size: 1.875rem; }
    .text-white { color: #fff; }
    .mb-8 { margin-bottom: 2rem; }
    .font-bold { font-weight: bold; }
    .typed-cursor { animation: blink 1s infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  `]
})
export class TypedTextComponent implements OnInit {
  @Input() texts: string[] = [];
  @Input() typeSpeed = 60;
  @Input() backSpeed = 40;
  @Input() loop = true;
  displayed = '';
  private textIndex = 0;
  private charIndex = 0;
  private typing = true;

  ngOnInit() {
    this.typeNext();
  }

  typeNext() {
    if (this.texts.length === 0) return;
    const currentText = this.texts[this.textIndex];
    if (this.typing) {
      if (this.charIndex < currentText.length) {
        this.displayed += currentText[this.charIndex++];
        setTimeout(() => this.typeNext(), this.typeSpeed);
      } else {
        this.typing = false;
        setTimeout(() => this.typeNext(), 1000);
      }
    } else {
      if (this.charIndex > 0) {
        this.displayed = this.displayed.slice(0, -1);
        this.charIndex--;
        setTimeout(() => this.typeNext(), this.backSpeed);
      } else {
        this.typing = true;
        this.textIndex = (this.textIndex + 1) % this.texts.length;
        setTimeout(() => this.typeNext(), 500);
      }
    }
  }
}
