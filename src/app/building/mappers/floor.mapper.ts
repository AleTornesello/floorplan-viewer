import {SelectFloorEntity, UpinsertFloorEntity} from "../entities/floor.entity";
import {SelectFloorModel, UpinsertFloorModel} from "../models/floor.model";
import dayjs from "dayjs";

export class SelectFloorMapper {
  public static toModel(entity: SelectFloorEntity) {
    return new SelectFloorModel(
      entity.id,
      entity.name,
      entity.order,
      entity.floor_plan_image_uri,
      entity.building_id,
      new Date(entity.created_at),
      entity.created_by,
      entity.updated_at ? dayjs(entity.updated_at).toDate() : null,
      entity.updated_by
    )
  }

  public static toEntity(model: SelectFloorModel) {
    return new SelectFloorEntity(
      model.id,
      model.name,
      model.order,
      model.floorPlanImageUri,
      model.buildingId,
      model.createdAt.toISOString(),
      model.createdBy,
      model.updatedAt ? model.updatedAt.toISOString() : null,
      model.updatedBy
    )
  }
}

export class UpinsertFloorMapper {
  public static toModel(entity: UpinsertFloorEntity) {
    return new UpinsertFloorModel(
      entity.name,
      entity.order,
      entity.floor_plan_image_uri,
      entity.building_id
    )
  }

  public static toEntity(model: UpinsertFloorModel) {
    return new UpinsertFloorEntity(
      model.name,
      model.order,
      model.floorPlanImageUri,
      model.buildingId
    )
  }
}
