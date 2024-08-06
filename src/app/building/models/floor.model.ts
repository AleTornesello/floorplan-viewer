import {BaseModel} from "../../shared/models/base-model";
import {SelectBuildingModel} from "./building.model";

interface BaseFloorAttributes {
  order: number;
  floorPlanImageUri: string;
  buildingId: string;
  name: string;
}

export class UpinsertFloorModel implements BaseFloorAttributes {
  order: number;
  floorPlanImageUri: string;
  buildingId: string;
  name: string;

  constructor(name: string, order: number, floorPlanImageUri: string, buildingId: string) {
    this.order = order;
    this.floorPlanImageUri = floorPlanImageUri;
    this.buildingId = buildingId;
    this.name = name;
  }
}

export class SelectFloorModel extends BaseModel implements BaseFloorAttributes {
  order: number;
  floorPlanImageUri: string;
  buildingId: string;
  name: string;

  constructor(id: string, name: string, order: number, floorPlanImageUri: string, buildingId: string, createdAt: Date, createdBy: string, updatedAt: Date | null, updatedBy: string | null) {
    super(id, createdAt, createdBy, updatedAt, updatedBy);
    this.order = order;
    this.floorPlanImageUri = floorPlanImageUri;
    this.buildingId = buildingId;
    this.name = name;
  }
}
