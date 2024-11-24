import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  providers: [AuthGuard],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'site_de_casal_web';
}
