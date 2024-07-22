import { Component, Input } from '@angular/core';
import { NavigationItem } from '../default-layout/default-layout.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.scss',
})
export class BottomNavbarComponent {
  get items(): NavigationItem[] {
    return this._items.filter((item) => item.navbarVisible);
  }
  @Input({ required: true }) set items(items: NavigationItem[]) {
    this._items = items;
  }

  private _items!: NavigationItem[];

  constructor(private _route: ActivatedRoute) {}

  public isRouteActive(route: string | string[]): string {
    route = Array.isArray(route) ? `/${route.join('/')}` : route;
    const path =
      this._route.snapshot.url.length > 0
        ? this._route.snapshot.url[0].path
        : '/';
    return path === route ? 'active' : '';
  }
}
