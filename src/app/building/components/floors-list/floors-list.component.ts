import {Component, Input} from '@angular/core';
import {SelectFloorModel} from "../../models/floor.model";
import {FloorComponent} from "../floor/floor.component";

@Component({
  selector: 'app-floors-list',
  standalone: true,
  imports: [
    FloorComponent
  ],
  templateUrl: './floors-list.component.html',
  styleUrl: './floors-list.component.scss'
})
export class FloorsListComponent {
  @Input({required: true}) floors: SelectFloorModel[];

  constructor() {
    this.floors = [];
  }
}
