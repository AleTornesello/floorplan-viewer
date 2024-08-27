import {Component, DestroyRef, OnInit} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/table/generic-table/generic-table.component";
import {GenericTableColumn, GenericTableSortEvent} from "../../../shared/models/table";
import {SelectBuildingModel} from "../../models/building.model";
import {BuildingService} from "../../services/building.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TranslocoService} from "@jsverse/transloco";
import {TableCellDirective} from "../../../shared/directives/table-cell.directive";
import {DateFormatPipe} from "../../../shared/pipes/date-format.pipe";
import {AvoidEmptyValuePipe} from "../../../shared/pipes/avoid-empty-value.pipe";
import {PostgrestResponse} from "@supabase/supabase-js";
import {
  CommonTableActionsComponent
} from "../../../shared/components/table/common-table-actions/common-table-actions.component";
import {Router} from "@angular/router";
import {FpRoute} from "../../../app.routes";

@Component({
  selector: 'app-buildings-page',
  standalone: true,
  imports: [
    GenericTableComponent,
    TableCellDirective,
    DateFormatPipe,
    AvoidEmptyValuePipe,
    CommonTableActionsComponent
  ],
  templateUrl: './buildings-page.component.html',
  styleUrl: './buildings-page.component.scss',
})
export class BuildingsPageComponent implements OnInit {
  public columns: GenericTableColumn[];
  public buildings: SelectBuildingModel[];
  public totalBuildings: number;

  private _sortField: string;
  private _sortDescOrder: boolean;

  constructor(
    private _buildingService: BuildingService,
    private _destroyRef: DestroyRef,
    private _translateService: TranslocoService,
    private _router: Router
  ) {
    this.buildings = [];
    this.totalBuildings = 0;
    this.columns = [
      {
        field: 'name',
        header: this._translateService.translate('building.name'),
        sortable: true
      },
      {
        field: 'createdAt',
        header: this._translateService.translate('building.createdAt'),
        sortable: true,
        width: '200px',
        sortStrategy(field: string, desc: boolean): GenericTableSortEvent[] {
          return [
            {
              field: 'created_at',
              desc
            }
          ];
        }
      },
      {
        field: 'updatedAt',
        header: this._translateService.translate('building.updatedAt'),
        sortable: true,
        width: '200px',
        sortStrategy(field: string, desc: boolean): GenericTableSortEvent[] {
          return [
            {
              field: 'updated_at',
              desc
            }
          ];
        }
      },
      {
        field: 'actions',
        header: '',
        sortable: false,
        class: 'text-right',
        width: 30,
      },
    ];

    this._sortField = 'created_at';
    this._sortDescOrder = false;
  }

  public ngOnInit() {
    this._loadBuildings();
  }

  private _loadBuildings() {
    this._buildingService.getAll(
      this._sortField,
      this._sortDescOrder,
    )
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onLoadBuildingSuccess.bind(this),
        error: this._onLoadBuildingError.bind(this)
      });
  }

  private _onLoadBuildingSuccess(response: PostgrestResponse<SelectBuildingModel>) {
    this.buildings = response.data ?? [];
    this.totalBuildings = response.count ?? 0;
  }

  private _onLoadBuildingError(error: any) {
    console.error(error);
  }

  public goToDetail(item: SelectBuildingModel) {
    this._router.navigate([FpRoute.ADMIN, FpRoute.BUILDINGS, item.id]);
  }

  public onAddBuildingClick() {
    this._router.navigate([FpRoute.ADMIN, FpRoute.BUILDINGS, FpRoute.NEW]);
  }

  public onSort(event: GenericTableSortEvent[] | null) {
    if(!event) {
      this._sortField = 'created_at';
      this._sortDescOrder = false;
    } else {
      this._sortField = event[0].field as string;
      this._sortDescOrder = event[0].desc;
    }

    this._loadBuildings();
  }
}
