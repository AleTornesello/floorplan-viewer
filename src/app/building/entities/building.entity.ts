import {BaseEntity} from "../../shared/models/base-entity";

interface BaseBuildingAttributes {
  name: string;
}

export class UpinsertBuildingEntity implements BaseBuildingAttributes {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class SelectBuildingEntity extends BaseEntity implements BaseBuildingAttributes {
  name: string;

  constructor(id: string, name: string, created_at: string, created_by: string, updated_at: string | null, updated_by: string | null) {
    super(id, created_at, created_by, updated_at, updated_by);
    this.name = name;
  }
}
