import {SelectMarkerEntity, UpinsertMarkerEntity} from "../entities/marker.entity";
import {SelectMarkerModel, UpinsertMarkerModel} from "../models/marker.model";
import dayjs from "dayjs";

export class SelectMarkerMapper {
  public static toModel(entity: SelectMarkerEntity) {
    return new SelectMarkerModel(
      entity.id,
      entity.x_percentage,
      entity.y_percentage,
      entity.angle,
      entity.image_uri,
      entity.floor_id,
      new Date(entity.created_at),
      entity.created_by,
      entity.updated_at ? dayjs(entity.updated_at).toDate() : null,
      entity.updated_by
    )
  }

  public static toEntity(model: SelectMarkerModel) {
    return new SelectMarkerEntity(
      model.id,
      model.xPercentage,
      model.yPercentage,
      model.angle,
      model.imageUri,
      model.floorId,
      model.createdAt.toISOString(),
      model.createdBy,
      model.updatedAt ? model.updatedAt.toISOString() : null,
      model.updatedBy
    )
  }
}

export class UpinsertMarkerMapper {
  public static toModel(entity: UpinsertMarkerEntity) {
    return new UpinsertMarkerModel(
      entity.x_percentage,
      entity.y_percentage,
      entity.angle,
      entity.image_uri,
      entity.floor_id,
    )
  }

  public static toEntity(model: UpinsertMarkerModel) {
    return new UpinsertMarkerEntity(
      model.xPercentage,
      model.yPercentage,
      model.angle,
      model.imageUri,
      model.floorId,
    )
  }
}
