import {Component, DestroyRef, Input, OnInit} from '@angular/core';
import {SelectFloorModel, UpinsertFloorModel} from "../../models/floor.model";
import {faSave, faTrash} from "@fortawesome/free-solid-svg-icons";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslocoPipe} from "@jsverse/transloco";
import {FloorService} from "../../services/floor.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-floor',
  standalone: true,
  imports: [
    ButtonComponent,
    InputTextComponent,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
  templateUrl: './floor.component.html',
  styleUrl: './floor.component.scss'
})
export class FloorComponent implements OnInit {
  @Input({required: true}) floor!: SelectFloorModel;

  public floorForm: FormGroup;
  protected readonly faSave = faSave;
  protected readonly faTrash = faTrash;

  constructor(
    private _fb: FormBuilder,
    private _floorService: FloorService,
    private _destroyRef: DestroyRef
  ) {
    this.floorForm = this._buildForm();
  }

  public ngOnInit() {
    this.floorForm = this._buildForm(this.floor);
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
}
