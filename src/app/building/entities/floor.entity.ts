import {BaseEntity} from "../../shared/models/base-entity";
import {SelectBuildingEntity} from "./building.entity";

interface BaseFloorAttributes {
  order: number;
  floor_plan_image_uri: string | null;
  building_id: string;
  name: string | null;
}

export class UpinsertFloorEntity implements BaseFloorAttributes {
  order: number;
  floor_plan_image_uri: string | null;
  building_id: string;
  name: string | null;

  constructor(name: string | null, order: number, floorPlanImageUri: string | null, buildingId: string) {
    this.order = order;
    this.floor_plan_image_uri = floorPlanImageUri;
    this.building_id = buildingId;
    this.name = name;
  }
}

export class SelectFloorEntity extends BaseEntity implements BaseFloorAttributes {
  order: number;
  floor_plan_image_uri: string | null;
  building_id: string;
  name: string | null;

  constructor(id: string, name: string | null, order: number, floorPlanImageUri: string | null, buildingId: string, createdAt: string, createdBy: string, updatedAt: string | null, updatedBy: string | null) {
    super(id, createdAt, createdBy, updatedAt, updatedBy);
    this.order = order;
    this.floor_plan_image_uri = floorPlanImageUri;
    this.building_id = buildingId;
    this.name = name;
  }
}
