import {Component, DestroyRef, Input} from '@angular/core';
import {SelectFloorModel, UpinsertFloorModel} from "../../models/floor.model";
import {FloorComponent} from "../floor/floor.component";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {TranslocoPipe} from "@jsverse/transloco";
import {FloorService} from "../../services/floor.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-floors-list',
  standalone: true,
  imports: [
    FloorComponent,
    ButtonComponent,
    TranslocoPipe
  ],
  templateUrl: './floors-list.component.html',
  styleUrl: './floors-list.component.scss'
})
export class FloorsListComponent {
  @Input({required: true}) floors: SelectFloorModel[];

  constructor(
  ) {
    this.floors = [];
  }
}
