import {CategoryEntity} from "../models/category.entity";
import {CategoryModel} from "../models/category.model";

export class CategoryMapper {
  public static toModel(entity: CategoryEntity) {
    return new CategoryModel(
      entity.id,
      entity.name,
      new Date(entity.created_at),
      entity.created_by,
      entity.updated_at ? new Date(entity.updated_at) : null,
      entity.updated_by
    )
  }

  public static toEntity(model: CategoryModel) {
    return new CategoryEntity(
      model.id,
      model.name,
      model.createdAt.toISOString(),
      model.createdBy,
      model.updatedAt ? model.updatedAt.toISOString() : null,
      model.updatedBy
    )
  }
}
