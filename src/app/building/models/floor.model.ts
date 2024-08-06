import {BaseModel} from "../../shared/models/base-model";
import {SelectBuildingModel} from "./building.model";

interface BaseFloorAttributes {
  order: number;
  floorPlanImageUri: string | null;
  buildingId: string;
  name: string | null;
}

export class UpinsertFloorModel implements BaseFloorAttributes {
  order: number;
  floorPlanImageUri: string | null;
  buildingId: string;
  name: string | null;

  constructor(name: string | null, order: number, floorPlanImageUri: string | null, buildingId: string) {
    this.order = order;
    this.floorPlanImageUri = floorPlanImageUri;
    this.buildingId = buildingId;
    this.name = name;
  }
}

export class SelectFloorModel extends BaseModel implements BaseFloorAttributes {
  order: number;
  floorPlanImageUri: string | null;
  buildingId: string;
  name: string | null;

  constructor(id: string, name: string | null, order: number, floorPlanImageUri: string | null, buildingId: string, createdAt: Date, createdBy: string, updatedAt: Date | null, updatedBy: string | null) {
    super(id, createdAt, createdBy, updatedAt, updatedBy);
    this.order = order;
    this.floorPlanImageUri = floorPlanImageUri;
    this.buildingId = buildingId;
    this.name = name;
  }
}
