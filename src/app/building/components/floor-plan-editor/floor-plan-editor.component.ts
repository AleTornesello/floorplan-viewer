import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {InputSliderComponent} from "../../../shared/components/inputs/input-slider/input-slider.component";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {TranslocoPipe} from "@jsverse/transloco";
import {SelectMarkerModel} from "../../models/marker.model";
import {NgClass, NgStyle} from "@angular/common";

@Component({
  selector: 'app-floor-plan-editor',
  standalone: true,
  imports: [
    ButtonComponent,
    FaIconComponent,
    InputSliderComponent,
    InputTextComponent,
    TranslocoPipe,
    NgStyle,
    NgClass
  ],
  templateUrl: './floor-plan-editor.component.html',
  styleUrl: './floor-plan-editor.component.scss'
})
export class FloorPlanEditorComponent {
  @ViewChild("floorPlanImage") floorPlanImage?: ElementRef<HTMLImageElement>;
  @ViewChild("markersOverlay") markersOverlay?: ElementRef<HTMLDivElement>;
  @ViewChild("floorPlanImageContainer") floorPlanImageContainer?: ElementRef<HTMLDivElement>;

  @Input({required: true}) floorPlanImageUri!: string;
  @Input() verticalAlign: 'start' | 'center' | 'end';
  @Input() markers: SelectMarkerModel[];

  @Output() onClick: EventEmitter<{ xPercentage: number; yPercentage: number }>;
  @Output() onMarkerClick: EventEmitter<SelectMarkerModel>;

  protected readonly faCamera = faCamera;

  constructor() {
    this.markers = [];
    this.onClick = new EventEmitter();
    this.onMarkerClick = new EventEmitter();
    this.verticalAlign = 'center';
    this.markers = [];
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
    this._updateMarkersOverlayHeight();
  }

  @HostListener("window:resize")
  private _onWindowsResize() {
    // The methods must be called in the following order
    this._updateFloorPlanCanvasSizes();
    this._updateMarkersOverlayHeight();
  }

  private _updateMarkersOverlayHeight() {
    if (!this.markersOverlay || !this.floorPlanImage) {
      return;
    }

    const imageTop = this.floorPlanImage.nativeElement.offsetTop;
    const imageLeft = this.floorPlanImage.nativeElement.offsetLeft;

    this.markersOverlay.nativeElement.style.width = this.floorPlanImage.nativeElement.offsetWidth + 'px';
    this.markersOverlay.nativeElement.style.height = this.floorPlanImage.nativeElement.offsetHeight + 'px';
    this.markersOverlay.nativeElement.style.top = imageTop + 'px';
    this.markersOverlay.nativeElement.style.left = imageLeft + 'px';
  }

  private _updateFloorPlanCanvasSizes() {
    if (!this.floorPlanImageContainer || !this.floorPlanImage) {
      return;
    }

    const containerWidth = this.floorPlanImageContainer.nativeElement.offsetWidth;
    let imageWidth = this.floorPlanImage.nativeElement.naturalWidth;
    let scaleFactor = containerWidth / imageWidth;

    // console.log("imageX", imageWidth, "containerX", containerWidth, "scaleFactor", scaleFactor);

    const containerHeight = this.floorPlanImageContainer.nativeElement.offsetHeight;
    let imageHeight = this.floorPlanImage.nativeElement.naturalHeight;
    let newImageHeight = imageHeight * scaleFactor;

    // console.log("newImageY", newImageHeight, "containerY", containerHeight);

    if (newImageHeight > containerHeight) {
      scaleFactor = containerHeight / imageHeight;
      const newImageWidth = imageWidth * scaleFactor;

      this.floorPlanImage.nativeElement.style.height = containerHeight + "px";
      this.floorPlanImage.nativeElement.style.width = newImageWidth + "px";
      return;
    }

    this.floorPlanImage.nativeElement.style.height = newImageHeight + "px";
    this.floorPlanImage.nativeElement.style.width = containerWidth + "px";
  }

  public onImageLoad() {
    // The methods must be called in the following order
    this._updateFloorPlanCanvasSizes();
    this._updateMarkersOverlayHeight();
  }
}
