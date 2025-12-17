import { Component } from '@angular/core';

import { ButtonComponent as AppButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AppButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeadersComponent {}
