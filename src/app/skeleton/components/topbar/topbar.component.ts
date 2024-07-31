import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faBars, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [ButtonModule, FontAwesomeModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  @Output() toggleSidebar: EventEmitter<void>;
  public faBars: IconDefinition = faBars;
  public faUser: IconDefinition = faUser;

  constructor() {
    this.toggleSidebar = new EventEmitter();
  }

  public onToggleSidebarButtonClick() {
    this.toggleSidebar.emit();
  }
}
