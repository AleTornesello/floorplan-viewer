import {SelectBuildingEntity} from "../entities/building.entity";
import {SelectBuildingModel} from "../models/building.model";
import dayjs from "dayjs";

export class BuildingMapper {
  public static toModel(entity: SelectBuildingEntity) {
    return new SelectBuildingModel(
      entity.id,
      entity.name,
      new Date(entity.created_at),
      entity.created_by,
      entity.updated_at ? dayjs(entity.updated_at).toDate() : null,
      entity.updated_by
    )
  }

  public static toEntity(model: SelectBuildingModel) {
    return new SelectBuildingEntity(
      model.id,
      model.name,
      model.createdAt.toISOString(),
      model.createdBy,
      model.updatedAt ? model.updatedAt.toISOString() : null,
      model.updatedBy
    )
  }
}
