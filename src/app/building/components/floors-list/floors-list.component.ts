import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectFloorModel} from "../../models/floor.model";
import {FloorComponent} from "../floor/floor.component";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {TranslocoPipe} from "@jsverse/transloco";

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

  @Output() deleted: EventEmitter<void>;

  constructor() {
    this.floors = [];
    this.deleted = new EventEmitter();
  }

  public onFloorDeleted() {
    this.deleted.emit();
  }
}
