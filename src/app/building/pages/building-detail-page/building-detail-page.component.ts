import {Component, DestroyRef, OnInit} from '@angular/core';
import {TranslocoPipe} from "@jsverse/transloco";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {faPlus, faSave} from '@fortawesome/free-solid-svg-icons';
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectBuildingModel, UpinsertBuildingModel} from "../../models/building.model";
import {ActivatedRoute} from "@angular/router";
import {BuildingService} from "../../services/building.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {PostgrestResponse, PostgrestSingleResponse} from "@supabase/supabase-js";
import {FloorService} from "../../services/floor.service";
import {combineLatestWith} from "rxjs";
import {SelectFloorModel} from "../../models/floor.model";
import {FloorsListComponent} from "../../components/floors-list/floors-list.component";

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

  public readonly faPlus = faPlus;
  public readonly faSave = faSave;
  public buildingForm: FormGroup;
  public floors: SelectFloorModel[];

  private _buildingId: string | null;

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _buildingService: BuildingService,
    private _destroyRef: DestroyRef,
    private _floorService: FloorService
  ) {
    this.buildingForm = this._buildForm();
    this.floors = [];
    this._buildingId = null;
  }

  public ngOnInit() {
    this._route.params
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (params) => {
          if (params['id']) {
            this._buildingId = params['id'];
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
        next: this._onLoadBuildingSuccess.bind(this)
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

  private _buildForm(building?: SelectBuildingModel) {
    return this._fb.group({
      name: this._fb.control(building?.name ?? null, [Validators.required])
    })
  }

  public onSaveClick() {
    this.buildingForm.markAllAsTouched();

    if (this.buildingForm.invalid) {
      return;
    }

    const name = this.buildingForm.get('name')!.value;
    const updateBuilding= new UpinsertBuildingModel(
      name
    );

    if(this._buildingId) {
      this._buildingService.update(this._buildingId, updateBuilding)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe();
      return;
    }


  }
}
