import {Component, DestroyRef, Input, OnInit} from '@angular/core';
import {SelectFloorModel, UpinsertFloorModel} from "../../models/floor.model";
import {faCamera, faSave, faTrash} from "@fortawesome/free-solid-svg-icons";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslocoPipe} from "@jsverse/transloco";
import {FloorService} from "../../services/floor.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SelectMarkerModel, UpinsertMarkerModel} from "../../models/marker.model";
import {MarkerService} from "../../services/marker.service";
import {PostgrestResponse} from "@supabase/supabase-js";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-floor',
  standalone: true,
  imports: [
    ButtonComponent,
    InputTextComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    FaIconComponent,
  ],
  templateUrl: './floor.component.html',
  styleUrl: './floor.component.scss'
})
export class FloorComponent implements OnInit {
  @Input({required: true}) floor!: SelectFloorModel;

  public floorForm: FormGroup;
  public existingMarkers: SelectMarkerModel[];
  protected readonly faSave = faSave;
  protected readonly faTrash = faTrash;

  private _markersIdToUpdate: string[];

  constructor(
    private _fb: FormBuilder,
    private _floorService: FloorService,
    private _destroyRef: DestroyRef,
    private _markerService: MarkerService
  ) {
    this.floorForm = this._buildForm();
    this.existingMarkers = [];
    this._markersIdToUpdate = [];
  }

  public ngOnInit() {
    this.floorForm = this._buildForm(this.floor);
    this._loadMarkers(this.floor.id);
  }

  private _loadMarkers(floorId: string) {
    this._markerService.getAllByFloorId(this.floor.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onMarkersLoadSuccess.bind(this),
        error: this._onMarkersLoadError.bind(this)
      });
  }

  private _onMarkersLoadSuccess(response: PostgrestResponse<SelectMarkerModel>) {
    this.existingMarkers = response.data ?? [];
    // TODO: Show success message
  }

  private _onMarkersLoadError() {
    // TODO: Show error message
  }

  private _buildForm(floor?: SelectFloorModel) {
    return this._fb.group({
      name: [floor?.name, [Validators.required]],
      floorPlanImageUri: [floor?.floorPlanImageUri, [Validators.required]],
    })
  }

  public onFloorPlanImageUriChange() {

  }

  public onSaveClick() {
    this.floorForm.markAllAsTouched();

    if(this.floorForm.invalid) {
      return;
    }

    const name = this.floorForm.get('name')!.value;
    const floorPlanImageUri = this.floorForm.get('floorPlanImageUri')!.value;

    const newFloorData = new UpinsertFloorModel(
      name,
      this.floor.order,
      floorPlanImageUri,
      this.floor.buildingId
    )

    this._floorService.update(this.floor.id, newFloorData)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onUpdateSuccess.bind(this),
        error: this._onUpdateError.bind(this)
      });
  }

  private _onUpdateSuccess() {
    // TODO: Show success message
  }

  private _onUpdateError() {
    // TODO: Show error message
  }

  public onImageClick(event: MouseEvent) {
    event.preventDefault();

    const x = Math.max(0, event.offsetX);
    const y = Math.max(0, event.offsetY);
    const targetWith = (event.target as HTMLElement).offsetWidth;
    const targetHeight = (event.target as HTMLElement).offsetHeight;

    const xPercentage = (x / targetWith) * 100;
    const yPercentage = (y / targetHeight) * 100;

    this._createMarker(
      xPercentage,
      yPercentage,
      0,
      null,
      this.floor.id
    )
  }

  private _createMarker(xPercentage: number, yPercentage: number, angle: number, imageUri: string | null, floorId: string) {
    const newMarker = new UpinsertMarkerModel(
      xPercentage,
      yPercentage,
      angle,
      imageUri,
      floorId
    )
    this._markerService.create(newMarker)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onMarkerCreateSuccess.bind(this),
        error: this._onMarkerCreateError.bind(this)
      });
  }

  private _onMarkerCreateSuccess() {
    this._loadMarkers(this.floor.id);
  }

  private _onMarkerCreateError() {
    // TODO: Show error message
  }

  protected readonly faCamera = faCamera;
}
