import {Component, DestroyRef, OnInit} from '@angular/core';
import {CategoryService} from "../../services/category.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {PostgrestResponse} from "@supabase/supabase-js";
import {CategoryModel} from "../../models/category.model";
import {CategoriesTabsComponent} from "../../components/categories-tabs/categories-tabs.component";

@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [
    CategoriesTabsComponent
  ],
  templateUrl: './library-page.component.html',
  styleUrl: './library-page.component.scss',
})
export class LibraryPageComponent implements OnInit {

  public categories: CategoryModel[];

  constructor(private _libraryService: CategoryService, private _destroyRef: DestroyRef) {
    this.categories = [];
  }

  public ngOnInit() {
    this._libraryService.getAllCategories()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onGetAllCategoriesSuccess.bind(this),
        error: this._onGetAllCategoriesError.bind(this)
      });
  }

  private _onGetAllCategoriesSuccess(response: PostgrestResponse<CategoryModel>) {
    this.categories = response.data ?? [];
  }

  private _onGetAllCategoriesError() {
  }
}
