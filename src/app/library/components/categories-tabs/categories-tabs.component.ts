import {AfterViewChecked, Component, DestroyRef, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CategoryModel} from "../../models/category.model";
import {MsjRoute} from "../../../app.routes";
import {Router, RouterModule, UrlTree} from "@angular/router";
import {RouteUtilsService} from "../../../shared/services/route-utils.service";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {fromEvent} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

class ExpandedCategory extends CategoryModel {
  public route: UrlTree;

  constructor(category: CategoryModel, route: UrlTree) {
    super(category.id, category.name, category.createdAt, category.createdBy, category.updatedAt, category.updatedBy);
    this.route = route;
  }
}

@Component({
  selector: 'app-categories-tabs',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule],
  templateUrl: './categories-tabs.component.html',
  styleUrl: './categories-tabs.component.scss'
})
export class CategoriesTabsComponent implements OnInit, AfterViewChecked {
  @ViewChild("categoriesTabs") categoriesTabs?: ElementRef;

  @Input({required: true}) set categories(categories: CategoryModel[]) {
    this._categories = categories;
    this.onScroll();
  }

  public readonly faChevronLeft: IconDefinition = faChevronLeft;
  public readonly faChevronRight: IconDefinition = faChevronRight;
  public isLeftScrollVisible: boolean;
  public isRightScrollVisible: boolean;

  private _categories: CategoryModel[];

  constructor(
    private _router: Router,
    private _routeUtilsService: RouteUtilsService,
    private _destroyRef: DestroyRef
  ) {
    this._categories = [];
    this.isLeftScrollVisible = false;
    this.isRightScrollVisible = false;
  }

  public ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onWindowResize.bind(this)
      });
  }

  public ngAfterViewChecked() {
    this._calcVisibilities();
  }

  private _onWindowResize() {
    this._calcVisibilities();
  }

  public get expandedCategories(): ExpandedCategory[] {
    return this._categories.map(category => {
      const route = this._router.createUrlTree([MsjRoute.LIBRARY], {
        queryParams: {
          category: category.id
        }
      });
      return new ExpandedCategory(category, route)
    });
  }

  public isRouteActive(route: string | string[] | UrlTree): string {
    return this._routeUtilsService.isRouteActive(route);
  }

  public onScroll() {
    this._calcVisibilities();
  }

  private _calcVisibilities() {
    if (!this.categoriesTabs) {
      return;
    }
    this.isLeftScrollVisible = this.categoriesTabs.nativeElement.scrollLeft > 0;
    this.isRightScrollVisible = Math.ceil(this.categoriesTabs.nativeElement.scrollLeft) < this.categoriesTabs.nativeElement.scrollWidth - this.categoriesTabs.nativeElement.clientWidth
  }

  public onLeftScrollClick(): void {
    this.categoriesTabs?.nativeElement.scrollBy(-500, 0);
  }

  public onRightScrollClick(): void {
    this.categoriesTabs?.nativeElement.scrollBy(500, 0);
  }
}
