import {BaseModel} from "../../shared/models/base-model";

interface BaseBuildingAttributes {
  name: string;
}

export class UpinsertBuildingModel implements BaseBuildingAttributes {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export class SelectBuildingModel extends BaseModel implements BaseBuildingAttributes {
  name: string;

  constructor(id: string, name: string, createdAt: Date, createdBy: string, updatedAt: Date | null, updatedBy: string | null) {
    super(id, createdAt, createdBy, updatedAt, updatedBy);
    this.name = name;
  }
}
