import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {from, map} from "rxjs";
import {SelectBuildingEntity} from "../entities/building.entity";
import {SelectBuildingMapper, UpinsertBuildingMapper} from "../mappers/building.mapper";
import {SelectBuildingModel, UpinsertBuildingModel} from "../models/building.model";
import {PostgrestResponse, PostgrestSingleResponse} from "@supabase/supabase-js";
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
    let buildingsSelect = this._supabaseService.supabase
      .from(this._relation)
      .select("*", {count: 'exact'})
      .order('created_at', {ascending: true});

    return from(buildingsSelect.returns<SelectBuildingEntity[]>().throwOnError())
      .pipe(
        map<PostgrestResponse<SelectBuildingEntity>, PostgrestResponse<SelectBuildingModel>>((response) => {
          return this._postgrestResponseParserService.parse<SelectBuildingEntity, SelectBuildingModel>(response, SelectBuildingMapper.toModel);
        })
      );
  }

  public getById(id: string) {
    let buildingSelect = this._supabaseService.supabase
      .from(this._relation)
      .select("*")
      .eq('id', id)
      .single();

    return from(buildingSelect.throwOnError())
      .pipe(
        map<PostgrestSingleResponse<SelectBuildingEntity>, PostgrestSingleResponse<SelectBuildingModel>>((response) => {
          return this._postgrestResponseParserService.parseSingle<SelectBuildingEntity, SelectBuildingModel>(response, SelectBuildingMapper.toModel);
        })
      );
  }

  public create(data: UpinsertBuildingModel) {
    let buildingInsert = this._supabaseService.supabase
      .from(this._relation)
      .insert(UpinsertBuildingMapper.toEntity(data));
    return from(buildingInsert.returns().select().single().throwOnError())
      .pipe(
        map<PostgrestSingleResponse<SelectBuildingEntity>, PostgrestSingleResponse<SelectBuildingModel>>((response) => {
          return this._postgrestResponseParserService.parseSingle<SelectBuildingEntity, SelectBuildingModel>(response, SelectBuildingMapper.toModel);
        })
      );
  }

  public update(buildingId: string, data: UpinsertBuildingModel) {
    let buildingUpdate = this._supabaseService.supabase
      .from(this._relation)
      .update(UpinsertBuildingMapper.toEntity(data))
      .eq("id", buildingId);
    return from(buildingUpdate.throwOnError());
  }
}
