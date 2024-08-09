import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {InputSliderComponent} from "../../../shared/components/inputs/input-slider/input-slider.component";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {TranslocoPipe} from "@jsverse/transloco";
import {SelectMarkerModel} from "../../models/marker.model";

@Component({
  selector: 'app-floor-plan-editor',
  standalone: true,
  imports: [
    ButtonComponent,
    FaIconComponent,
    InputSliderComponent,
    InputTextComponent,
    TranslocoPipe
  ],
  templateUrl: './floor-plan-editor.component.html',
  styleUrl: './floor-plan-editor.component.scss'
})
export class FloorPlanEditorComponent {
  @ViewChild("floorPlanImage") floorPlanImage?: ElementRef<HTMLImageElement>;
  @ViewChild("markersOverlay") markersOverlay?: ElementRef<HTMLDivElement>;

  @Input({required: true}) floorPlanImageUri!: string;
  @Input({required: true}) markers: SelectMarkerModel[];

  @Output() onClick: EventEmitter<{ xPercentage: number; yPercentage: number }>;
  @Output() onMarkerClick: EventEmitter<SelectMarkerModel>;

  protected readonly faCamera = faCamera;

  constructor() {
    this.markers = [];
    this.onClick = new EventEmitter();
    this.onMarkerClick = new EventEmitter();
  }

  public onFloorPlanClick(event: MouseEvent) {
    const x = Math.max(0, event.offsetX);
    const y = Math.max(0, event.offsetY);
    const targetWith = (event.target as HTMLElement).offsetWidth;
    const targetHeight = (event.target as HTMLElement).offsetHeight;

    const xPercentage = (x / targetWith) * 100;
    const yPercentage = (y / targetHeight) * 100;

    this.onClick.emit({xPercentage, yPercentage});
  }

  public onMarkerClickEvent(event: MouseEvent, marker: SelectMarkerModel) {
    event.stopPropagation();
    this.onMarkerClick.emit(marker);
  }

  @HostListener("window:resize")
  public updateMarkersOverlayHeight() {
    if (!this.markersOverlay || !this.floorPlanImage) {
      return;
    }
    this.markersOverlay.nativeElement.style.height = this.floorPlanImage.nativeElement.offsetHeight + 'px'
  }
}
