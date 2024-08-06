import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {from, map} from "rxjs";
import {PostgrestResponse} from "@supabase/supabase-js";
import {PostgrestResponseParserService} from "../../shared/services/postgrest-response-parser.service";
import {SelectFloorEntity} from "../entities/floor.entity";
import {SelectFloorModel, UpinsertFloorModel} from "../models/floor.model";
import {SelectFloorMapper, UpinsertFloorMapper} from "../mappers/floor.mapper";
import {UpinsertBuildingMapper} from "../mappers/building.mapper";

@Injectable({
  providedIn: 'root'
})
export class FloorService {

  private readonly _relation = "floors";

  constructor(
    private _supabaseService: SupabaseService,
    private _postgrestResponseParserService: PostgrestResponseParserService
  ) {
  }

  public getAllByBuildingId(buildingId: string) {
    let floorSelect = this._supabaseService.supabase
      .from(this._relation)
      .select("*")
      .order('order', {ascending: true})
      .eq('building_id', buildingId);

    return from(floorSelect.returns<SelectFloorEntity[]>().throwOnError())
      .pipe(
        map<PostgrestResponse<SelectFloorEntity>, PostgrestResponse<SelectFloorModel>>((response) => {
          return this._postgrestResponseParserService.parse<SelectFloorEntity, SelectFloorModel>(response, SelectFloorMapper.toModel);
        })
      );
  }

  public create(data: UpinsertFloorModel) {
    let floorInsert = this._supabaseService.supabase
      .from(this._relation)
      .insert(UpinsertFloorMapper.toEntity(data));
    return from(floorInsert.throwOnError());
  }

  public update(floorId: string, data: UpinsertFloorModel) {
    let floorUpdate = this._supabaseService.supabase
      .from(this._relation)
      .update(UpinsertFloorMapper.toEntity(data))
      .eq("id", floorId);
    return from(floorUpdate.throwOnError());
  }
}
