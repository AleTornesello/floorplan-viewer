import {BaseModel} from "../../shared/models/base-model";
import {SelectBuildingModel} from "./building.model";

interface BaseMarkerAttributes {
  xPercentage: number;
  yPercentage: number;
  angle: number;
  imageUri: string | null;
  floorId: string;
}

export class UpinsertMarkerModel implements BaseMarkerAttributes {
  xPercentage: number;
  yPercentage: number;
  angle: number;
  imageUri: string | null;
  floorId: string;

  constructor(xPercentage: number, yPercentage: number, angle: number, imageUri: string | null, floorId: string) {
    this.xPercentage = xPercentage;
    this.yPercentage = yPercentage;
    this.angle = angle;
    this.imageUri = imageUri;
    this.floorId = floorId;
  }
}

export class SelectMarkerModel extends BaseModel implements BaseMarkerAttributes {
  xPercentage: number;
  yPercentage: number;
  angle: number;
  imageUri: string | null;
  floorId: string;

  constructor(id: string, xPercentage: number, yPercentage: number, angle: number, imageUri: string | null, floorId: string, createdAt: Date, createdBy: string, updatedAt: Date | null, updatedBy: string | null) {
    super(id, createdAt, createdBy, updatedAt, updatedBy);
    this.xPercentage = xPercentage;
    this.yPercentage = yPercentage;
    this.angle = angle;
    this.imageUri = imageUri;
    this.floorId = floorId;
  }

  public get valid(): boolean {
    return this.imageUri !== null && this.imageUri !== '';
  }
}
