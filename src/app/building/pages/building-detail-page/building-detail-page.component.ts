import {Component, DestroyRef, OnInit} from '@angular/core';
import {TranslocoPipe} from "@jsverse/transloco";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {faCopy, faPlus, faSave} from '@fortawesome/free-solid-svg-icons';
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectBuildingModel, UpinsertBuildingModel} from "../../models/building.model";
import {ActivatedRoute, Router} from "@angular/router";
import {BuildingService} from "../../services/building.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {PostgrestResponse, PostgrestSingleResponse} from "@supabase/supabase-js";
import {FloorService} from "../../services/floor.service";
import {combineLatestWith} from "rxjs";
import {SelectFloorModel, UpinsertFloorModel} from "../../models/floor.model";
import {FloorsListComponent} from "../../components/floors-list/floors-list.component";
import {FpRoute} from "../../../app.routes";

@Component({
  selector: 'app-building-detail-page',
  standalone: true,
  imports: [
    TranslocoPipe,
    ToolbarModule,
    ButtonComponent,
    InputTextComponent,
    ReactiveFormsModule,
    FloorsListComponent
  ],
  templateUrl: './building-detail-page.component.html',
  styleUrl: './building-detail-page.component.scss'
})
export class BuildingDetailPageComponent implements OnInit {

  protected readonly faPlus = faPlus;
  protected readonly faSave = faSave;
  protected readonly faCopy = faCopy;
  public buildingForm: FormGroup;
  public floors: SelectFloorModel[];
  public buildingId: string | null;
  public buildingUri: string | null;

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _buildingService: BuildingService,
    private _destroyRef: DestroyRef,
    private _floorService: FloorService,
    private _router: Router
  ) {
    this.buildingForm = this._buildForm();
    this.floors = [];
    this.buildingId = null;
    this.buildingUri = null;
  }

  public ngOnInit() {
    this._route.params
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (params) => {
          if (params['id']) {
            this.buildingId = params['id'];
            this.buildingUri = `${location.origin}/${this.buildingId}`
            this._loadBuilding(params['id']);
          }
        }
      });
  }

  private _loadBuilding(buildingId: string) {
    this._buildingService.getById(buildingId)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        combineLatestWith(this._floorService.getAllByBuildingId(buildingId))
      )
      .subscribe({
        next: this._onLoadBuildingSuccess.bind(this),
        error: this._onLoadBuildingError.bind(this)
      })
  }

  private _onLoadBuildingSuccess([buildingResponse, floorsResponse]: [
    PostgrestSingleResponse<SelectBuildingModel>,
    PostgrestResponse<SelectFloorModel>
  ]) {
    if (!buildingResponse.data || !floorsResponse.data) {
      return;
    }
    this.buildingForm = this._buildForm(buildingResponse.data);
    this.floors = floorsResponse.data;
  }

  private _onLoadBuildingError() {
    // TODO: show error message
  }

  private _buildForm(building?: SelectBuildingModel) {
    return this._fb.group({
      name: this._fb.control(building?.name ?? null)
    })
  }

  public onSaveClick() {
    this.buildingForm.markAllAsTouched();

    if (this.buildingForm.invalid) {
      return;
    }

    const name = this.buildingForm.get('name')!.value;
    const upinsertBuilding= new UpinsertBuildingModel(
      name
    );

    if(this.buildingId) {
      this._buildingService.update(this.buildingId, upinsertBuilding)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: this._onUpdateBuildingSuccess.bind(this),
          error: this._onUpdateBuildingError.bind(this)
        });
      return;
    }

    this._buildingService.create(upinsertBuilding)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onCreateBuildingSuccess.bind(this),
        error: this._onCreateBuildingError.bind(this)
      });
  }

  private _onUpdateBuildingSuccess() {
    // TODO: show success message
  }

  private _onUpdateBuildingError() {
    // TODO: show error message
  }

  private _onCreateBuildingSuccess(response: PostgrestSingleResponse<SelectBuildingModel>) {
    // TODO: show success message
    debugger
    this._router.navigate([FpRoute.ADMIN, FpRoute.BUILDINGS, response.data!.id]);
  }

  private _onCreateBuildingError() {
    // TODO: show error message
  }

  public onAddFloorClick() {
    const lastGreaterOrder = this.floors.reduce((agg, floor) => Math.max(floor.order, agg), 0)
    const newFloor = new UpinsertFloorModel(
      null,
      lastGreaterOrder + 1,
      null,
      this.buildingId!
    );
    this._floorService.create(newFloor)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._loadBuilding(this.buildingId!);
        }
      });
  }

  public onCopyUriClick() {
    navigator.clipboard.writeText(this.buildingUri!);
  }

  public get isNewBuilding() {
    return !this.buildingId;
  }

  public onFloorDeleted() {
    this._loadBuilding(this.buildingId!);
  }
}
