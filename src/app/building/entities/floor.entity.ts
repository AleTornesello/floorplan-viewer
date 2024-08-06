import {BaseEntity} from "../../shared/models/base-entity";
import {SelectBuildingEntity} from "./building.entity";

interface BaseFloorAttributes {
  order: number;
  floor_plan_image_uri: string;
  building_id: string;
  name: string;
}

export class UpinsertFloorEntity implements BaseFloorAttributes {
  order: number;
  floor_plan_image_uri: string;
  building_id: string;
  name: string;

  constructor(name: string, order: number, floorPlanImageUri: string, buildingId: string) {
    this.order = order;
    this.floor_plan_image_uri = floorPlanImageUri;
    this.building_id = buildingId;
    this.name = name;
  }
}

export class SelectFloorEntity extends BaseEntity implements BaseFloorAttributes {
  order: number;
  floor_plan_image_uri: string;
  building_id: string;
  name: string;

  constructor(id: string, name: string, order: number, floorPlanImageUri: string, buildingId: string, createdAt: string, createdBy: string, updatedAt: string | null, updatedBy: string | null) {
    super(id, createdAt, createdBy, updatedAt, updatedBy);
    this.order = order;
    this.floor_plan_image_uri = floorPlanImageUri;
    this.building_id = buildingId;
    this.name = name;
  }
}
