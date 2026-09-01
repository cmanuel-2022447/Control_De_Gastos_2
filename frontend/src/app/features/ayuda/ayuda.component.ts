import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from '../../shared/app-shell/app-shell.component';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, AppShellComponent],
  template: `<app-shell activePage="ayuda"><div class="construction"><div class="construction-mark">◉</div><h1>Ayuda</h1><p>Esta sección está en creación.</p></div></app-shell>`,
  styles: []
})
export class AyudaComponent {}