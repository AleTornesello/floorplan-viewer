import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {finalize, from, map} from "rxjs";
import {SelectBuildingEntity} from "../entities/building.entity";
import {SelectBuildingMapper, UpinsertBuildingMapper} from "../mappers/building.mapper";
import {SelectBuildingModel, UpinsertBuildingModel} from "../models/building.model";
import {PostgrestResponse, PostgrestSingleResponse} from "@supabase/supabase-js";
import {PostgrestResponseParserService} from "../../shared/services/postgrest-response-parser.service";
import {LoaderStatusService} from "../../shared/services/loader-status.service";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  private readonly _relation = "buildings";

  constructor(
    private _supabaseService: SupabaseService,
    private _postgrestResponseParserService: PostgrestResponseParserService,
    private _loaderStatusService: LoaderStatusService
  ) {
  }

  public getAll(
    page: number,
    itemsPerPage: number,
    sortField: string,
    sortDescOrder: boolean,
    showLoader: boolean = true
  ) {
    if (showLoader) {
      this._loaderStatusService.show();
    }
    let buildingsSelect = this._supabaseService.supabase
      .from(this._relation)
      .select("*", {count: 'exact'})
      .order(sortField, {ascending: !sortDescOrder})
      .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

    return from(buildingsSelect.returns<SelectBuildingEntity[]>().throwOnError())
      .pipe(
        map<PostgrestResponse<SelectBuildingEntity>, PostgrestResponse<SelectBuildingModel>>((response) => {
          return this._postgrestResponseParserService.parse<SelectBuildingEntity, SelectBuildingModel>(response, SelectBuildingMapper.toModel);
        }),
        finalize(() => {
          if (showLoader) {
            this._loaderStatusService.hide();
          }
        })
      );
  }

  public getById(id: string, showLoader: boolean = true) {
    if (showLoader) {
      this._loaderStatusService.show();
    }
    let buildingSelect = this._supabaseService.supabase
      .from(this._relation)
      .select("*")
      .eq('id', id)
      .single();

    return from(buildingSelect.throwOnError())
      .pipe(
        map<PostgrestSingleResponse<SelectBuildingEntity>, PostgrestSingleResponse<SelectBuildingModel>>((response) => {
          return this._postgrestResponseParserService.parseSingle<SelectBuildingEntity, SelectBuildingModel>(response, SelectBuildingMapper.toModel);
        }),
        finalize(() => {
          if (showLoader) {
            this._loaderStatusService.hide();
          }
        })
      );
  }

  public create(data: UpinsertBuildingModel, showLoader: boolean = true) {
    if (showLoader) {
      this._loaderStatusService.show();
    }
    let buildingInsert = this._supabaseService.supabase
      .from(this._relation)
      .insert(UpinsertBuildingMapper.toEntity(data));
    return from(buildingInsert.returns().select().single().throwOnError())
      .pipe(
        map<PostgrestSingleResponse<SelectBuildingEntity>, PostgrestSingleResponse<SelectBuildingModel>>((response) => {
          return this._postgrestResponseParserService.parseSingle<SelectBuildingEntity, SelectBuildingModel>(response, SelectBuildingMapper.toModel);
        }),
        finalize(() => {
          if (showLoader) {
            this._loaderStatusService.hide();
          }
        })
      );
  }

  public update(buildingId: string, data: UpinsertBuildingModel, showLoader: boolean = true) {
    if (showLoader) {
      this._loaderStatusService.show();
    }
    let buildingUpdate = this._supabaseService.supabase
      .from(this._relation)
      .update(UpinsertBuildingMapper.toEntity(data))
      .eq("id", buildingId);
    return from(buildingUpdate.throwOnError())
      .pipe(finalize(() => {
        if (showLoader) {
          this._loaderStatusService.hide();
        }
      }));
  }
}
