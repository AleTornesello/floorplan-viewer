import {Injectable} from '@angular/core';
import {Router, UrlSerializer, UrlTree} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RouteUtilsService {

  constructor(private _urlSerializer: UrlSerializer, private _router: Router) {
  }

  public isRouteActive(route: string | string[] | UrlTree): string {
    if (Array.isArray(route)) {
      route = `/${route.join('/')}`;
    } else if (route instanceof UrlTree) {
      route = this._urlSerializer.serialize(route);
    }

    return this._router.url === route ? 'active' : '';
  }
}
