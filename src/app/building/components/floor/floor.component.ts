import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectFloorModel, UpinsertFloorModel} from "../../models/floor.model";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {FloorService} from "../../services/floor.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SelectMarkerModel, UpinsertMarkerModel} from "../../models/marker.model";
import {MarkerService} from "../../services/marker.service";
import {PostgrestResponse} from "@supabase/supabase-js";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SliderModule} from "primeng/slider";
import {InputWrapperComponent} from "../../../shared/components/inputs/input-wrapper/input-wrapper.component";
import {InputSliderComponent} from "../../../shared/components/inputs/input-slider/input-slider.component";
import {SimpleDialogComponent} from "../../../shared/components/dialog/simple-dialog/simple-dialog.component";
import {
  ConfirmDeleteDialogComponent
} from "../../../shared/components/dialog/confirm-delete-dialog/confirm-delete-dialog.component";
import {FloorPlanEditorComponent} from "../floor-plan-editor/floor-plan-editor.component";
import {Message, MessageService} from "primeng/api";
import {MessagesModule} from "primeng/messages";

@Component({
  selector: 'app-floor',
  standalone: true,
  imports: [
    ButtonComponent,
    InputTextComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    FaIconComponent,
    SliderModule,
    FormsModule,
    InputWrapperComponent,
    InputSliderComponent,
    SimpleDialogComponent,
    ConfirmDeleteDialogComponent,
    FloorPlanEditorComponent,
    MessagesModule,
  ],
  templateUrl: './floor.component.html',
  styleUrl: './floor.component.scss'
})
export class FloorComponent implements OnInit {
  @ViewChild('confirmFloorDeleteDialog') confirmFloorDeleteDialog?: SimpleDialogComponent;
  @ViewChild('confirmMarkerDeleteDialog') confirmMarkerDeleteDialog?: SimpleDialogComponent;

  @Input({required: true}) set floor(value: SelectFloorModel) {
    this._floor = value;
    this.floorForm = this._buildForm(value);
    this._loadMarkers(this.floor.id);
  };

  get floor(): SelectFloorModel {
    return this._floor;
  }

  @Output() deleted: EventEmitter<void>;

  public floorForm: FormGroup;
  public existingMarkers: SelectMarkerModel[];
  protected readonly faTrash = faTrash;
  public selectedMarker: SelectMarkerModel | null;
  public markerFormMessages: Message[];


  private _floor!: SelectFloorModel;

  constructor(
    private _fb: FormBuilder,
    private _floorService: FloorService,
    private _destroyRef: DestroyRef,
    private _markerService: MarkerService,
    private _messageService: MessageService,
    private _translateService: TranslocoService
  ) {
    this.floorForm = this._buildForm();
    this.existingMarkers = [];
    this.selectedMarker = null;
    this.deleted = new EventEmitter();
    this.markerFormMessages = [];
  }

  public ngOnInit() {
    this.floorForm = this._buildForm(this.floor);
    this._loadMarkers(this.floor.id);
  }

  private _loadMarkers(floorId: string) {
    this._markerService.getAllByFloorId(floorId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onMarkersLoadSuccess.bind(this),
        error: this._onMarkersLoadError.bind(this)
      });
  }

  private _onMarkersLoadSuccess(response: PostgrestResponse<SelectMarkerModel>) {
    this.existingMarkers = response.data ?? [];
  }

  private _onMarkersLoadError() {
    this._messageService.add({
      severity: 'error',
      summary: this._translateService.translate('common.error'),
      detail: this._translateService.translate('building.floor.marker.loadKo'),
    });
  }

  private _buildForm(floor?: SelectFloorModel) {
    return this._fb.group({
      name: this._fb.control(floor?.name),
      floorPlanImageUri: this._fb.control(floor?.floorPlanImageUri),
    });
  }

  public onFloorPlanImageUriChange() {
    this._saveFloor();
  }

  public onFloorNameChange() {
    this._saveFloor();
  }

  private _saveFloor() {
    const name = this.floorForm.get('name')!.value;
    const floorPlanImageUri = this.floorForm.get('floorPlanImageUri')!.value;

    const newFloorData = new UpinsertFloorModel(
      name,
      this.floor.order,
      floorPlanImageUri,
      this.floor.buildingId
    )

    this._floorService.update(this.floor.id, newFloorData, false)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onFloorUpdateSuccess.bind(this),
        error: this._onFloorUpdateError.bind(this)
      });
  }

  private _onFloorUpdateSuccess() {
    // this._messageService.add({
    //   severity: 'success',
    //   summary: this._translateService.translate('common.error'),
    //   detail: this._translateService.translate('building.floor.updateOk'),
    // });
  }

  private _onFloorUpdateError() {
    this._messageService.add({
      severity: 'error',
      summary: this._translateService.translate('common.error'),
      detail: this._translateService.translate('building.floor.updateKo'),
    });
  }

  public onImageClick(event: { xPercentage: number, yPercentage: number }) {
    this._createMarker(
      event.xPercentage,
      event.yPercentage,
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
    this._messageService.add({
      severity: 'success',
      summary: this._translateService.translate('common.info'),
      detail: this._translateService.translate('building.floor.marker.createOk'),
    });
  }

  private _onMarkerCreateError() {
    this._messageService.add({
      severity: 'error',
      summary: this._translateService.translate('common.error'),
      detail: this._translateService.translate('building.floor.marker.createKo'),
    });
  }

  public onMarkerClick(marker: SelectMarkerModel) {
    this.selectedMarker = marker;
    this.markerFormMessages = [];

    if (!this.selectedMarker.imageUri || this.selectedMarker.imageUri === '') {
      this.markerFormMessages = [
        {
          severity: 'error',
          detail: this._translateService.translate('building.floor.marker.invalidMarker')
        }
      ]
    }
  }

  public onMarkerImageUriChanged() {
    this._saveSelectedMarker();
  }

  public onMarkerAngleSlideEnd() {
    this._saveSelectedMarker();
  }

  private _saveSelectedMarker() {
    if (!this.selectedMarker) {
      return;
    }

    const newMarker = new UpinsertMarkerModel(
      this.selectedMarker.xPercentage,
      this.selectedMarker.yPercentage,
      this.selectedMarker.angle,
      this.selectedMarker.imageUri,
      this.selectedMarker.floorId
    )
    this._markerService.update(this.selectedMarker.id, newMarker, false)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onMarkerUpdateSuccess.bind(this),
        error: this._onMarkerUpdateError.bind(this)
      });
  }

  private _onMarkerUpdateSuccess() {
  }

  private _onMarkerUpdateError() {
    this._messageService.add({
      severity: 'success',
      summary: this._translateService.translate('common.info'),
      detail: this._translateService.translate('building.floor.marker.loadKo'),
    });
  }

  public onFloorDeleteClick() {
    this.confirmFloorDeleteDialog?.show();
  }

  public onMarkerDeleteClick() {
    this.confirmMarkerDeleteDialog?.show();
  }

  public onFloorDeleteConfirm() {
    this._floorService.delete(this.floor.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onFloorDeleteSuccess.bind(this),
        error: this._onFloorDeleteError.bind(this)
      })
  }

  private _onFloorDeleteSuccess() {
    this.deleted.emit();
    this.confirmFloorDeleteDialog?.close();
    this._messageService.add({
      severity: 'success',
      summary: this._translateService.translate('common.info'),
      detail: this._translateService.translate('building.floor.deleteOk'),
    });
  }

  private _onFloorDeleteError() {
    this._messageService.add({
      severity: 'error',
      summary: this._translateService.translate('common.error'),
      detail: this._translateService.translate('building.floor.deleteKo'),
    });
  }

  public onMarkerDeleteConfirm() {
    this._markerService.delete(this.selectedMarker!.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onMarkerDeleteSuccess.bind(this),
        error: this._onMarkerDeleteError.bind(this)
      });
  }

  private _onMarkerDeleteSuccess() {
    this._loadMarkers(this.floor.id);
    this.confirmMarkerDeleteDialog?.close();
    this.selectedMarker = null;
    this._messageService.add({
      severity: 'success',
      summary: this._translateService.translate('common.info'),
      detail: this._translateService.translate('building.floor.marker.deleteOk'),
    });
  }

  private _onMarkerDeleteError() {
    this._messageService.add({
      severity: 'error',
      summary: this._translateService.translate('common.error'),
      detail: this._translateService.translate('building.floor.marker.deleteKo'),
    });
  }
}
