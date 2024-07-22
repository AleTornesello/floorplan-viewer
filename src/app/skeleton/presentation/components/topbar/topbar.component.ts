import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [ButtonModule, FontAwesomeModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  @Output() toggleSidebar: EventEmitter<boolean>;
  public sidebarVisible: boolean;
  public faBars: IconDefinition = faBars;
  public faUser: IconDefinition = faUser;

  constructor() {
    this.sidebarVisible = false;
    this.toggleSidebar = new EventEmitter();
  }

  public onToggleSidebarButtonClick() {
    this.sidebarVisible = !this.sidebarVisible;
    this.toggleSidebar.emit(this.sidebarVisible);
  }
}
