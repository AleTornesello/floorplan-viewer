import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {from, map} from "rxjs";
import {CategoryEntity} from "../models/category.entity";
import {CategoryMapper} from "../mappers/category.mapper";
import {CategoryModel} from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly _relation = "categories";

  constructor(private _supabaseService: SupabaseService) {
  }

  public getAllCategories() {
    let noteAlertsSelect = this._supabaseService.supabase
      .from(this._relation)
      .select("*")
      .order('name', {ascending: true});

    return from(noteAlertsSelect.returns<CategoryEntity[]>().throwOnError())
      .pipe(
        map((response: any) => ({
          ...response,
          data: response.data?.map((contact: CategoryEntity) => CategoryMapper.toModel(contact)) as CategoryModel[] ?? []
        })),
      );
  }
}
