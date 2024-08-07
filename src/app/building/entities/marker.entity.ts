import {BaseEntity} from "../../shared/models/base-entity";

interface BaseMarkerAttributes {
  x_percentage: number;
  y_percentage: number;
  angle: number;
  image_uri: string | null;
  floor_id: string;
}

export class UpinsertMarkerEntity implements BaseMarkerAttributes {
  x_percentage: number;
  y_percentage: number;
  angle: number;
  image_uri: string | null;
  floor_id: string;

  constructor(xPercentage: number, yPercentage: number, angle: number, imageUri: string | null, floorId: string) {
    this.x_percentage = xPercentage;
    this.y_percentage = yPercentage;
    this.angle = angle;
    this.image_uri = imageUri;
    this.floor_id = floorId;
  }
}

export class SelectMarkerEntity extends BaseEntity implements BaseMarkerAttributes {
  x_percentage: number;
  y_percentage: number;
  angle: number;
  image_uri: string | null;
  floor_id: string;

  constructor(id: string, xPercentage: number, yPercentage: number, angle: number, imageUri: string | null, floorId: string, createdAt: string, createdBy: string, updatedAt: string | null, updatedBy: string | null) {
    super(id, createdAt, createdBy, updatedAt, updatedBy);
    this.x_percentage = xPercentage;
    this.y_percentage = yPercentage;
    this.angle = angle;
    this.image_uri = imageUri;
    this.floor_id = floorId;
  }
}
