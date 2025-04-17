import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderComponent } from './common/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'utility-calculator';
}
