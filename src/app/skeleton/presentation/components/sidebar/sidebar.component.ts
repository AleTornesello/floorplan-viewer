import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { NavigationItem } from '../default-layout/default-layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, RouterModule } from '@angular/router';

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

  constructor(private _route: ActivatedRoute) {
    this.visible = false;
    this.visibleChange = new EventEmitter<boolean>();
  }

  public onVisibleChange(visible: boolean) {
    this.visible = visible;
    this.visibleChange.emit(visible);
  }

  public isRouteActive(route: string | string[]): string {
    route = Array.isArray(route) ? `/${route.join('/')}` : route;
    const path =
      this._route.snapshot.url.length > 0
        ? this._route.snapshot.url[0].path
        : '/';
    return path === route ? 'active' : '';
  }
}
