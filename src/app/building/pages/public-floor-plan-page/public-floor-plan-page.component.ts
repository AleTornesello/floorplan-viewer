import {Component, DestroyRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BuildingService} from "../../services/building.service";
import {FloorService} from "../../services/floor.service";
import {MarkerService} from "../../services/marker.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {combineLatest, combineLatestWith, map, mergeMap} from "rxjs";
import {PostgrestResponse, PostgrestSingleResponse} from "@supabase/supabase-js";
import {SelectFloorModel} from "../../models/floor.model";
import {FloorPlanEditorComponent} from "../../components/floor-plan-editor/floor-plan-editor.component";
import {SelectMarkerModel} from "../../models/marker.model";
import {SelectBuildingModel} from "../../models/building.model";
import {GalleriaModule} from "primeng/galleria";
import {FormsModule} from "@angular/forms";
import {TranslocoService} from "@jsverse/transloco";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-public-floor-plan-page',
  standalone: true,
  imports: [
    FloorPlanEditorComponent,
    GalleriaModule,
    FormsModule
  ],
  templateUrl: './public-floor-plan-page.component.html',
  styleUrl: './public-floor-plan-page.component.scss'
})
export class PublicFloorPlanPageComponent {

  public floors: SelectFloorModel[];
  public markers: Map<string, SelectMarkerModel[]>;

  public selectedFloor: SelectFloorModel | null;
  public selectedMarker: SelectMarkerModel | null;

  public showGallery: boolean;

  private _buildingId: string | null;

  constructor(
    private _route: ActivatedRoute,
    private _buildingService: BuildingService,
    private _floorService: FloorService,
    private _markerService: MarkerService,
    private _destroyRef: DestroyRef,
    private _translateService: TranslocoService,
    private _messageService: MessageService
  ) {
    this._buildingId = null;
    this.floors = [];
    this.markers = new Map();

    this.selectedFloor = null;
    this.selectedMarker = null;

    this.showGallery = false;

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
              combineLatest(response.data!.map((floor) =>
                this._markerService.getAllByFloorId(floor.id)
                  .pipe(map((response: PostgrestResponse<SelectMarkerModel>) => ({
                    floor: floor,
                    markers: response.data ?? []
                  })))
              ))
            ))
        )
      )
      .subscribe({
        next: this._onLoadBuildingSuccess.bind(this),
        error: this._onLoadBuildingError.bind(this)
      });
  }

  private _onLoadBuildingSuccess(
    [building, floorsAndMarkers]: [
      PostgrestSingleResponse<SelectBuildingModel>,
      {
        floor: SelectFloorModel, markers: SelectMarkerModel[]
      }[]
    ]
  ) {
    this.floors = floorsAndMarkers.map((floorAndMarkers) => floorAndMarkers.floor);
    this.markers = new Map();
    floorsAndMarkers.forEach((floorAndMarkers) => {
      this.markers.set(floorAndMarkers.floor.id, floorAndMarkers.markers);
    });
    if (this.floors.length > 0) {
      this.selectedFloor = this.floors[0];
    }
  }

  private _onLoadBuildingError() {
    this._messageService.add({
      severity: 'error',
      summary: this._translateService.translate('common.error'),
      detail: this._translateService.translate('building.loadKo'),
    });
  }

  public get selectedFloorMarkers(): SelectMarkerModel[] {
    if (!this.selectedFloor) {
      return [];
    }
    return this.markers.get(this.selectedFloor.id) ?? [];
  }

  public onMarkerClick(marker: SelectMarkerModel) {
    this.selectedMarker = marker;
    this.showGallery = true;
  }

  public get markerGalleryImages(): string[] {
    if (!this.selectedMarker || !this.selectedMarker.imageUri) {
      return [];
    }
    return [this.selectedMarker.imageUri];
  }

  public get areThumbnailsVisible(): boolean {
    return this.markerGalleryImages.length > 1;
  }
}
