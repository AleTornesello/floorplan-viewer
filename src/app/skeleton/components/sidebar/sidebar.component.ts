import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SidebarModule} from 'primeng/sidebar';
import {NavigationItem} from '../default-layout/default-layout.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterModule} from '@angular/router';
import {RouteUtilsService} from "../../../shared/services/route-utils.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarModule, FontAwesomeModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() visible: boolean;
  get items(): NavigationItem[] {
    return this._items.filter((item) => item.sidebarVisible);
  }
  @Input({ required: true }) set items(items: NavigationItem[]) {
    this._items = items;
  }

  private _items!: NavigationItem[];
  @Output() visibleChange: EventEmitter<boolean>;

  constructor(private _routeUtilsService: RouteUtilsService) {
    this.visible = false;
    this.visibleChange = new EventEmitter<boolean>();
  }

  public onSidebarHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  public isRouteActive(route: string | string[]): string {
    return this._routeUtilsService.isRouteActive(route);
  }
}
