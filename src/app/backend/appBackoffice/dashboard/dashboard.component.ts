import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { TABLE_CONFIGURATION } from './dashboard-table-configuration';
import { DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import {ChartOptions, ChartType, ChartDataset} from 'chart.js';
import {StockMoveService} from "../../../stock-modules/stock-moves/services/stock-move.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  //public barChartLabels: Array<any> = [];
  public barChartLabels: any[] = ['Usuarios', 'Nivel Organización', 'Unidad Salud', 'Departamento', 'Puesto de Trabajo', 'Pacientes'];
  public moveLabels: string[] = [''];
  public tipoLabels: string[] = [''];
  public barChartLabels1: any[] = ['Usuarios', 'Nivel Organización', 'Unidad Salud', 'Departamento', 'Puesto de Trabajo', 'Pacientes'];
  public barChartType: ChartType = 'bar';
  public barChartData: Array<any> = [
    { data: [], label: 'Datos Generales' }
  ];
  public moveData: Array<any> = [
    { data: [], label: 'Almacén Movimiento' }
  ];
  public tipoData: Array<any> = [
    { data: [], label: 'Almacén Tipo Movimiento' }
  ];
  data: any = [];
  dataCount = 0;
  configuration = TABLE_CONFIGURATION;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  loading = false;
  constructor(public dashboardService: DashboardService, public stockMoveService: StockMoveService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe((resp) => {
      this.data = resp.dataCount;
      for (let i = 0; i < this.data.length; i++) {
        //this.barChartLabels[i] = this.data[i].name;
        this.barChartData[0].data[i] = this.data[i].count;
      }
      this.barChartLabels = this.barChartLabels1;
      this.dataCount = resp.count;
    });

    this.stockMoveService.getStockMove({}, 'id', 'asc', 1, 10000).subscribe((resp) => {
      console.log('Move:', resp);
      const datos = resp.results;
    let moveL = [];
    let tipoL = [];
      let mov = [];
      let tipo = [];
      for (let i = 0; i < datos.length; i++) {
        if (i === 0) {
          tipo.push(datos[0].tipo_de_movimiento.id);
          mov.push(datos[0].almacen.id);
          let auxMov = datos.filter( data => (data.almacen.id === datos[0].almacen.id));
          let infLong = auxMov.length;
          moveL.push(datos[0].almacen.nombre);
          this.moveLabels = moveL;
          this.moveData[0].data[0] = infLong;
          let auxTipo = datos.filter( data => (data.tipo_de_movimiento.id === datos[0].tipo_de_movimiento.id));
          let infLongTipo = auxTipo.length;
          tipoL.push(datos[0].tipo_de_movimiento.descripcion);
          this.tipoLabels = tipoL;
          this.tipoData[0].data[0] = infLongTipo;
          continue;
        }
        //existe mas de una ocurencia
        if (mov.indexOf(datos[i].almacen.id) === -1 ) {
          mov.push(datos[i].almacen.id);
          let auxMov = datos.filter( data => (data.almacen.id === datos[i].almacen.id));
          let long = this.moveData[0].data.length;
          let infLong = auxMov.length;
          let longLabel = this.moveLabels.length;
          this.moveLabels[longLabel] = datos[i].almacen.nombre;
          this.moveData[0].data[long] = infLong;
        }
        if (tipo.indexOf(datos[i].tipo_de_movimiento.id) === -1 ) {
          tipo.push(datos[i].tipo_de_movimiento.id);
          let auxTipo = datos.filter( data => (data.tipo_de_movimiento.id === datos[i].tipo_de_movimiento.id));
          let long = this.tipoData[0].data.length;
          let infLong = auxTipo.length;
          let longLabel = this.tipoLabels.length;
          this.tipoLabels[longLabel] = datos[i].tipo_de_movimiento.descripcion;
          //this.tipoLabels.push(datos[i].tipo_de_movimiento.descripcion);
          this.tipoData[0].data[long] = infLong;
        }
      }
    });
    console.log('label mov', this.moveLabels);
    console.log('label tipo', this.tipoLabels);
    console.log('data mov', this.moveData);
    console.log('data tipo', this.tipoData);
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
  }
  public chartClicked(e: any): void {
    console.log('clicked', e);
  }
  public chartHovered(e: any): void {
    console.log('hovered', e);
  }
}
