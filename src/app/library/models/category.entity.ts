export class CategoryEntity {
  id: number;
  name: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;

  constructor(id: number, name: string, created_at: string, created_by: string, updated_at: string | null, updated_by: string | null) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
    this.created_by = created_by;
    this.updated_at = updated_at;
    this.updated_by = updated_by;
  }
}
