import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {from, map} from "rxjs";
import {SelectBuildingEntity} from "../entities/building.entity";
import {BuildingMapper} from "../mappers/building.mapper";
import {SelectBuildingModel} from "../models/building.model";
import {PostgrestResponse} from "@supabase/supabase-js";
import {PostgrestResponseParserService} from "../../shared/services/postgrest-response-parser.service";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  private readonly _relation = "buildings";

  constructor(
    private _supabaseService: SupabaseService,
    private _postgrestResponseParserService: PostgrestResponseParserService
  ) {
  }

  public getAll() {
    let noteAlertsSelect = this._supabaseService.supabase
      .from(this._relation)
      .select("*", {count: 'exact'})
      .order('created_at', {ascending: true});

    return from(noteAlertsSelect.returns<SelectBuildingEntity[]>().throwOnError())
      .pipe(
        map<PostgrestResponse<SelectBuildingEntity>, PostgrestResponse<SelectBuildingModel>>((response) => {
          return this._postgrestResponseParserService.parse<SelectBuildingEntity, SelectBuildingModel>(response, BuildingMapper.toModel);
        })
      );
  }
}
