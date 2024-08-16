import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {finalize, from, map} from "rxjs";
import {PostgrestResponse} from "@supabase/supabase-js";
import {PostgrestResponseParserService} from "../../shared/services/postgrest-response-parser.service";
import {SelectMarkerModel, UpinsertMarkerModel} from "../models/marker.model";
import {SelectMarkerEntity} from "../entities/marker.entity";
import {SelectMarkerMapper, UpinsertMarkerMapper} from "../mappers/marker.mapper";
import {LoaderStatusService} from "../../shared/services/loader-status.service";

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  private readonly _relation = "markers";

  constructor(
    private _supabaseService: SupabaseService,
    private _postgrestResponseParserService: PostgrestResponseParserService,
    private _loaderStatusService: LoaderStatusService
  ) {
  }

  public getAllByFloorId(floorId: string, onlyValid: boolean = false, showLoader: boolean = true) {
    if (showLoader) {
      this._loaderStatusService.show();
    }
    let markersSelect = this._supabaseService.supabase
      .from(this._relation)
      .select("*")
      .order('created_by', {ascending: true})
      .eq('floor_id', floorId);

    if (onlyValid) {
      markersSelect = markersSelect
        .not('image_uri', 'is', null)
        .neq('image_uri', '');
    }

    return from(markersSelect.returns<SelectMarkerEntity[]>().throwOnError())
      .pipe(
        map<PostgrestResponse<SelectMarkerEntity>, PostgrestResponse<SelectMarkerModel>>((response) => {
          return this._postgrestResponseParserService.parse<SelectMarkerEntity, SelectMarkerModel>(response, SelectMarkerMapper.toModel);
        }),
        finalize(() => {
          if (showLoader) {
            this._loaderStatusService.hide();
          }
        })
      );
  }

  public create(data: UpinsertMarkerModel, showLoader: boolean = true) {
    if (showLoader) {
      this._loaderStatusService.show();
    }
    let markerInsert = this._supabaseService.supabase
      .from(this._relation)
      .insert(UpinsertMarkerMapper.toEntity(data));
    return from(markerInsert.throwOnError())
      .pipe(finalize(() => {
        if (showLoader) {
          this._loaderStatusService.hide();
        }
      }));
  }


  public update(markerId: string, data: UpinsertMarkerModel, showLoader: boolean = true) {
    if (showLoader) {
      this._loaderStatusService.show();
    }
    let markerUpdate = this._supabaseService.supabase
      .from(this._relation)
      .update(UpinsertMarkerMapper.toEntity(data))
      .eq("id", markerId);
    return from(markerUpdate.throwOnError())
      .pipe(finalize(() => {
        if (showLoader) {
          this._loaderStatusService.hide();
        }
      }));
  }

  public delete(markerId: string, showLoader: boolean = true) {
    if (showLoader) {
      this._loaderStatusService.show();
    }
    let markerDelete = this._supabaseService.supabase
      .from(this._relation)
      .delete()
      .eq("id", markerId);
    return from(markerDelete.throwOnError())
      .pipe(finalize(() => {
        if (showLoader) {
          this._loaderStatusService.hide();
        }
      }));
  }
}
