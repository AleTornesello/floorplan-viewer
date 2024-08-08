import {Component, DestroyRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BuildingService} from "../../services/building.service";
import {FloorService} from "../../services/floor.service";
import {MarkerService} from "../../services/marker.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {combineLatest, combineLatestWith, mergeMap} from "rxjs";
import {PostgrestResponse} from "@supabase/supabase-js";
import {SelectFloorModel} from "../../models/floor.model";

@Component({
  selector: 'app-public-floor-plan-page',
  standalone: true,
  imports: [],
  templateUrl: './public-floor-plan-page.component.html',
  styleUrl: './public-floor-plan-page.component.scss'
})
export class PublicFloorPlanPageComponent {

  private _buildingId: string | null;
  constructor(
    private _route: ActivatedRoute,
    private _buildingService: BuildingService,
    private _floorService: FloorService,
    private _markerService: MarkerService,
    private _destroyRef: DestroyRef
  ) {
    this._buildingId = null;

    this._route.params
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (params) => {
          if (params['id']) {
            this._buildingId = params['id'];
            this._loadBuilding(this._buildingId!);
          }
        }
      });
  }

  private _loadBuilding(id: string) {
    this._buildingService.getById(id)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        combineLatestWith(
          this._floorService.getAllByBuildingId(id, true)
            .pipe(mergeMap((response: PostgrestResponse<SelectFloorModel>) =>
              combineLatest(response.data!.map((floor) => this._markerService.getAllByFloorId(floor.id)))
            ))
        )
      )
      .subscribe();
  }
}
