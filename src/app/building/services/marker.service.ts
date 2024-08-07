import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {from, map} from "rxjs";
import {PostgrestResponse} from "@supabase/supabase-js";
import {PostgrestResponseParserService} from "../../shared/services/postgrest-response-parser.service";
import {SelectFloorEntity} from "../entities/floor.entity";
import {SelectFloorModel, UpinsertFloorModel} from "../models/floor.model";
import {SelectFloorMapper, UpinsertFloorMapper} from "../mappers/floor.mapper";
import {UpinsertBuildingMapper} from "../mappers/building.mapper";
import {SelectMarkerModel, UpinsertMarkerModel} from "../models/marker.model";
import {SelectMarkerEntity} from "../entities/marker.entity";
import {SelectMarkerMapper, UpinsertMarkerMapper} from "../mappers/marker.mapper";

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  private readonly _relation = "markers";

  constructor(
    private _supabaseService: SupabaseService,
    private _postgrestResponseParserService: PostgrestResponseParserService
  ) {
  }

  public getAllByFloorId(floorId: string) {
    let markersSelect = this._supabaseService.supabase
      .from(this._relation)
      .select("*")
      .order('created_by', {ascending: true})
      .eq('floor_id', floorId);

    return from(markersSelect.returns<SelectMarkerEntity[]>().throwOnError())
      .pipe(
        map<PostgrestResponse<SelectMarkerEntity>, PostgrestResponse<SelectMarkerModel>>((response) => {
          return this._postgrestResponseParserService.parse<SelectMarkerEntity, SelectMarkerModel>(response, SelectMarkerMapper.toModel);
        })
      );
  }

  public create(data: UpinsertMarkerModel) {
    let markerInsert = this._supabaseService.supabase
      .from(this._relation)
      .insert(UpinsertMarkerMapper.toEntity(data));
    return from(markerInsert.throwOnError());
  }
}
