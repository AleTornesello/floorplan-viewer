import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [ButtonModule, SidebarModule, FontAwesomeModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  public sidebarVisible: boolean;
  public faBars: IconDefinition = faBars;
  public faUser: IconDefinition = faUser;

  constructor() {
    this.sidebarVisible = false;
  }

  public toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
