import {Component, DestroyRef, ViewChild} from '@angular/core';
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
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {MessageService} from "primeng/api";
import {EmptyMessageComponent} from "../../../shared/components/empty-message/empty-message.component";
import {RingSpinnerComponent} from "../../../shared/components/ring-spinner/ring-spinner.component";
import {GalleryComponent, GalleryImage} from "../../../shared/components/gallery/gallery.component";

@Component({
  selector: 'app-public-floor-plan-page',
  standalone: true,
  imports: [
    FloorPlanEditorComponent,
    GalleriaModule,
    FormsModule,
    TranslocoPipe,
    EmptyMessageComponent,
    RingSpinnerComponent,
    GalleryComponent
  ],
  templateUrl: './public-floor-plan-page.component.html',
  styleUrl: './public-floor-plan-page.component.scss'
})
export class PublicFloorPlanPageComponent {

  @ViewChild('carousel') carousel?: GalleryComponent;

  public floors: SelectFloorModel[];
  public markers: Map<string, SelectMarkerModel[]>;

  public selectedFloor: SelectFloorModel | null;
  public selectedMarker: SelectMarkerModel | null;

  // public showGallery: boolean;
  public buildingLoading: boolean;

  public buildingId: string | null;

  constructor(
    private _route: ActivatedRoute,
    private _buildingService: BuildingService,
    private _floorService: FloorService,
    private _markerService: MarkerService,
    private _destroyRef: DestroyRef,
    private _translateService: TranslocoService,
    private _messageService: MessageService
  ) {
    this.buildingId = null;
    this.floors = [];
    this.markers = new Map();

    this.selectedFloor = null;
    this.selectedMarker = null;

    // this.showGallery = false;
    this.buildingLoading = false;

    this._route.params
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (params) => {
          if (params['id']) {
            this.buildingId = params['id'];
            this._loadBuilding(this.buildingId!);
          }
        }
      });
  }

  private _loadBuilding(id: string) {
    this.buildingLoading = true;
    this._buildingService.getById(id)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        combineLatestWith(
          this._floorService.getAllByBuildingId(id, true)
            .pipe(mergeMap((response: PostgrestResponse<SelectFloorModel>) =>
              combineLatest(response.data!.map((floor) =>
                this._markerService.getAllByFloorId(floor.id, true)
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
    this.buildingLoading = false;
  }

  private _onLoadBuildingError() {
    this._messageService.add({
      severity: 'error',
      summary: this._translateService.translate('common.error'),
      detail: this._translateService.translate('building.loadKo'),
    });
    this.buildingLoading = false;
  }

  public get selectedFloorMarkers(): SelectMarkerModel[] {
    if (!this.selectedFloor) {
      return [];
    }
    return this.markers.get(this.selectedFloor.id) ?? [];
  }

  public onMarkerClick(event: { marker: SelectMarkerModel, index: number }) {
    this.selectedMarker = event.marker;
    this.carousel?.show(event.index);
    // this.showGallery = true;
  }

  public get galleryImages(): GalleryImage[] {
    if (!this.selectedFloor) {
      return [];
    }
    return this.markers.get(this.selectedFloor.id)?.map((marker, index) => ({
      id: marker.id,
      imageUri: marker.imageUri as string,
      label: marker.name,
      index
    })) ?? [];
  }

  public get areThumbnailsVisible(): boolean {
    return this.galleryImages.length > 1;
  }

  public onFloorPreviewClick(floor: SelectFloorModel) {
    this.selectedFloor = floor;
  }

  public onImagePreviewClick(image: GalleryImage) {
    this.carousel?.show(image.index);
  }
}
