import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TopbarComponent} from '../topbar/topbar.component';
import {BottomNavbarComponent} from '../bottom-navbar/bottom-navbar.component';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faBook, faBuilding} from '@fortawesome/free-solid-svg-icons';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

export interface NavigationItem {
  label: string;
  route: string | string[];
  icon: IconDefinition;
  sidebarVisible: boolean;
  navbarVisible: boolean;
}

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    BottomNavbarComponent,
    SidebarComponent,
    TranslocoModule,
    ToastModule,
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {
  public navigationItems: NavigationItem[];
  public sidebarVisible: boolean;

  constructor(private _translateService: TranslocoService) {
    this.navigationItems = [
      {
        label: this._translateService.translate('building.building'),
        route: '/',
        icon: faBuilding,
        sidebarVisible: true,
        navbarVisible: true,
      },
    ];
    this.sidebarVisible = false;
  }

  public onToggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  public onSidebarVisibleChange(visible: boolean) {
    this.sidebarVisible = visible;
  }
}
