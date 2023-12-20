import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  CellClickedEvent,
  ColDef,
  GridReadyEvent,
  RowNodeTransaction,
} from 'ag-grid-community';
import { Observable, map } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { ButtonComponent } from './button/button.component';
import { ButtonDeleteComponent } from './button-delete/button-delete.component';
import * as Highcharts from 'highcharts';
// import * as Highcharts from 'highcharts/highcharts-gantt';
import * as StreamGraph from 'highcharts/modules/streamgraph';
import Streamgraph from 'highcharts/modules/streamgraph';
Streamgraph(Highcharts);
import DrilldownModule from 'highcharts/modules/drilldown';
DrilldownModule(Highcharts);
import Highcharts3D from 'highcharts/highcharts-3d';
Highcharts3D(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('800ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    trigger('snackBarInOut', [
      transition(':enter', [
        animate('300ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)' })),
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'angular-test';
  displayedColumns: string[] = [
    'demo-position',
    'edit',
    'name',
    'weight',
    'symbol',
    'type',
    'startdate',
    'enddate',
    'description',
    'select',
  ];

  columnsToDisplay = [
    'name',
    'weight',
    'symbol',
    'position',
    'type',
    'startdate',
    'enddate',
  ];

  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: PeriodicElement | null;

  showFiller = false;

  // dataSource = ELEMENT_DATA;

  selected = '';

  formmode = true;
  name: any;
  checked = true;
  disabled = true;
  data: any;
  // options: any;
  horizontalPosition: MatSnackBarHorizontalPosition =
    'start' || 'end' || 'left' || 'left' || 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom' || 'top';

  constructor(
    public dialog: MatDialog,
    public sheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  @ViewChild('csv') csv!: TemplateRef<any>;

  //----High Charts----//

  Highcharts: typeof Highcharts = Highcharts; // required
  StreamGraphs: typeof StreamGraph = StreamGraph;
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  PieChart: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'line',
    },
    title: {
      text: 'Complex Highcharts Chart',
    },
    caption: { text: '' },

    series: [
      {
        type: 'pie',
        name: 'Fruit',
        data: [
          { name: 'Apples', y: 5 },
          { name: 'Bananas', y: 3 },
          { name: 'Oranges', y: 2 },
          { name: 'Stawbery', y: 1 },
          { name: 'Gava', y: 8 },
          { name: 'Mangeos', y: 2 },
          { name: 'Cherry', y: 7 },
          { name: 'Garpes', y: 9 },
        ],
      },
    ],
  }; // required
  RandomData: Highcharts.Options = {
    chart: {
      type: 'spline',
      animation: Highcharts.SeriesPalettes, // don't animate in old IE
      marginRight: 10,
      events: {
        load: function () {
          // set up the updating of the chart each second
          const series = this.series[0];
          setInterval(function () {
            const x = new Date().getTime(), // current time
              y = Math.random();
            series.addPoint([x, y], true, true);
          }, 1000);
        },
      },
    },
    credits: {
      enabled: false,
    },
    time: {
      useUTC: true,
    },

    title: {
      text: 'Live random data',
    },

    accessibility: {
      announceNewData: {
        enabled: true,
        minAnnounceInterval: 15000,
        announcementFormatter: function (allSeries, newSeries, newPoint) {
          if (newPoint) {
            return 'New point added. Value: ' + newPoint.y;
          }
          return false;
        },
      },
    },

    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150,
    },

    yAxis: {
      title: {
        text: 'Value',
      },
      plotLines: [
        {
          value: 0,
          width: 1,
          color: '#808080',
        },
      ],
    },

    tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}',
    },

    legend: {
      enabled: false,
    },

    exporting: {
      enabled: false,
    },

    series: [
      {
        type: 'spline',
        name: 'Random data',
        data: (function () {
          // generate an array of random data
          const data = [],
            time = new Date().getTime();

          for (let i = -19; i <= 0; i += 1) {
            data.push({
              x: time + i * 1000,
              y: Math.random(),
            });
          }
          return data;
        })(),
      },
    ],
  };
  AreaChart: Highcharts.Options = {
    chart: {
      type: 'area',
    },
    credits: {
      enabled: false,
    },
    title: {
      text: 'Complex Highcharts Chart',
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
      ],
    },
    yAxis: {
      title: {
        text: 'Value',
      },
    },
    series: [
      {
        type: 'area',
        name: 'Series 1',
        data: [5, 10, 8, 15, 12, 15, 1, 5, 0, 25],
      },
      {
        type: 'area',
        name: 'Series 2',
        data: [3, 7, 5, 8, 10],
      },
      {
        type: 'area',
        name: 'Series 3',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        type: 'area',
        name: 'Series 4',
        data: [0, 5, 1, 20, 11],
      },
      {
        type: 'area',
        name: 'Series 5',
        data: [2, 4, 6, 8, 10],
      },
      {
        type: 'area',
        name: 'Series 6',
        data: [22, 3, 6, 8, 10, 9, 5, 20, 0, 25],
      },
    ],
  };
  PopulationChart: Highcharts.Options = {
    chart: { type: 'spline' },
    credits: {
      enabled: false,
    },
    title: {
      text: 'Historic and Estimated Worldwide Population Growth by Regions',
    },
    subtitle: { text: 'Source: Wikipedia.org' },
    tooltip: {
      valueSuffix: ' Million',
    },
    xAxis: {
      categories: [
        '1947',
        '1949',
        '1951',
        '1961',
        '1972',
        '1981',
        '1998',
        '2017',
        '2021',
      ],
    },
    yAxis: {
      title: { text: 'Million' },
      categories: [
        '30',
        '60',
        '90',
        '120',
        '150',
        '180',
        '210',
        '240',
        '270',
        '300',
        '330',
        '360',
        '390',
        '420',
        '450',
        '480',
        '510',
        '540',
        '570',
        '600',
      ],
    },

    series: [
      {
        type: 'areaspline',
        name: 'China',
        data: [null, 540, 553, 660.33, 862.8, 993.9, 1242, 1396, 1412],
      },
      {
        type: 'areaspline',
        name: 'India',
        data: [340, 348, 361, 456.4, 582.8, 712.9, 1021, 1354, 1408],
      },
      {
        type: 'areaspline',
        name: 'US',
        data: [14, 14.9, 15, 18.2, 20.9, 229.5, 276.1, 325.1, 331.9],
      },
      {
        type: 'areaspline',
        name: 'Pakistan',
        data: [32.5, 56.7, 75, 93, 65.3, 84.27, 145.5, 216.4, 231.4],
      },
      // { type: 'spline', name: 'Pakistan', data: [4] },
      // { type: 'spline', name: 'Pakistan', data: [5] },
    ],
  };
  Petroleum: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      options3d: {
        enabled: true,
        alpha: 0,
        beta: 0,
        depth: 50,
        viewDistance: 25,
      },
    },
    title: {
      text: 'Sales of petroleum products March, Norway',
      align: 'center',
    },
    xAxis: {
      categories: [
        'Jet fuel',
        'Duty-free diesel',
        'Petrol',
        'Diesel',
        'Gas oil',
      ],
    },
    yAxis: {
      title: {
        text: 'Million liters',
      },
    },
    tooltip: {
      valueSuffix: ' million liters',
    },
    plotOptions: {
      column: {
        borderRadius: '25%',
        borderColor: 'black',
      },
      pie: {
        borderColor: 'black',
      },
    },
    series: [
      {
        type: 'column',
        name: '2020',
        data: [59, 83, 65, 228, 184],
      },
      {
        type: 'column',
        name: '2021',
        data: [24, 79, 72, 240, 167],
      },
      {
        type: 'column',
        name: '2022',
        data: [58, 88, 75, 250, 176],
      },
      {
        type: 'spline',
        name: 'Average',
        data: [47, 83.33, 70.66, 239.33, 175.66],
        dashStyle: 'LongDash',
        marker: {
          lineWidth: 2,
          lineColor: Highcharts.getOptions().colors[3],
          fillColor: 'white',
        },
      },
      {
        type: 'pie',
        name: 'Total',
        data: [
          {
            name: '2020',
            y: 619,
            color: Highcharts.getOptions().colors[0], // 2020 color
            dataLabels: {
              enabled: true,
              distance: -50,
              format: '{point.total} M',
              style: {
                fontSize: '15px',
              },
            },
          },
          {
            name: '2021',
            y: 586,
            color: Highcharts.getOptions().colors[1], // 2021 color
          },
          {
            name: '2022',
            y: 647,
            color: Highcharts.getOptions().colors[2], // 2022 color
          },
        ],
        center: [75, 65],
        size: 100,
        innerSize: '70%',
        showInLegend: false,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };
  NegativeValues: Highcharts.Options = {
    chart: {
      type: 'column',
      // options3d: {
      //   enabled: true,
      //   alpha: 15,
      //   beta: 15,
      //   depth: 50,
      //   viewDistance: 25,
      // },
    },
    title: {
      text: 'Column chart with negative values',
    },
    xAxis: {
      categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas'],
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderRadius: '25%',
        borderColor: 'black',
      },
    },
    series: [
      {
        type: 'column',
        name: 'John',
        data: [5, 3, 4, 7, 2],
      },
      {
        type: 'column',
        name: 'Jane',
        data: [2, -2, -3, 2, 1],
      },
      {
        type: 'column',
        name: 'Joe',
        data: [3, 4, 4, -2, 5],
      },
    ],
  };
  ColumnwithDrilldown: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
    },
    title: {
      align: 'left',
      text: 'Browser market shares. January, 2022',
    },
    subtitle: {
      align: 'left',
      text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      title: {
        text: 'Total percent market share',
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%',
        },
      },
      column: {
        borderRadius: '25%',
        borderColor: 'black',
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
    },

    series: [
      {
        type: 'column',
        name: 'Browsers',
        colorByPoint: true,
        data: [
          {
            name: 'Chrome',
            y: 63.06,
            drilldown: 'Chrome',
          },
          {
            name: 'Safari',
            y: 19.84,
            drilldown: 'Safari',
          },
          {
            name: 'Firefox',
            y: 4.18,
            drilldown: 'Firefox',
          },
          {
            name: 'Edge',
            y: 4.12,
            drilldown: 'Edge',
          },
          {
            name: 'Opera',
            y: 2.33,
            drilldown: 'Opera',
          },
          {
            name: 'Internet Explorer',
            y: 0.45,
            drilldown: 'Internet Explorer',
          },
          {
            name: 'Other',
            y: 1.582,
            drilldown: null,
          },
        ],
      },
    ],
    drilldown: {
      breadcrumbs: {
        position: {
          align: 'right',
        },
      },
      series: [
        {
          type: 'column',
          name: 'Chrome',
          id: 'Chrome',
          data: [
            ['v65.0', 0.1],
            ['v64.0', 1.3],
            ['v63.0', 53.02],
            ['v62.0', 1.4],
            ['v61.0', 0.88],
            ['v60.0', 0.56],
            ['v59.0', 0.45],
            ['v58.0', 0.49],
            ['v57.0', 0.32],
            ['v56.0', 0.29],
            ['v55.0', 0.79],
            ['v54.0', 0.18],
            ['v51.0', 0.13],
            ['v49.0', 2.16],
            ['v48.0', 0.13],
            ['v47.0', 0.11],
            ['v43.0', 0.17],
            ['v29.0', 0.26],
          ],
        },
        {
          type: 'column',
          name: 'Firefox',
          id: 'Firefox',
          data: [
            ['v58.0', 1.02],
            ['v57.0', 7.36],
            ['v56.0', 0.35],
            ['v55.0', 0.11],
            ['v54.0', 0.1],
            ['v52.0', 0.95],
            ['v51.0', 0.15],
            ['v50.0', 0.1],
            ['v48.0', 0.31],
            ['v47.0', 0.12],
          ],
        },
        {
          type: 'column',
          name: 'Internet Explorer',
          id: 'Internet Explorer',
          data: [
            ['v11.0', 6.2],
            ['v10.0', 0.29],
            ['v9.0', 0.27],
            ['v8.0', 0.47],
          ],
        },
        {
          type: 'column',
          name: 'Safari',
          id: 'Safari',
          data: [
            ['v11.0', 3.39],
            ['v10.1', 0.96],
            ['v10.0', 0.36],
            ['v9.1', 0.54],
            ['v9.0', 0.13],
            ['v5.1', 0.2],
          ],
        },
        {
          type: 'column',
          name: 'Edge',
          id: 'Edge',
          data: [
            ['v16', 2.6],
            ['v15', 0.92],
            ['v14', 0.4],
            ['v13', 0.1],
          ],
        },
        {
          type: 'column',
          name: 'Opera',
          id: 'Opera',
          data: [
            ['v50.0', 0.96],
            ['v49.0', 0.82],
            ['v12.1', 0.14],
          ],
        },
      ],
    },
  };
  LargestCities: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'column',
      // options3d: {
      //   enabled: true,
      //   alpha: 15,
      //   beta: -15,
      //   depth: 50,
      //   viewDistance: 25,
      // },
    },
    title: {
      text: "World's largest cities per 2021",
    },
    subtitle: {
      text: 'Source: <a href="https://worldpopulationreview.com/world-cities" target="_blank">World Population Review</a>',
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif',
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Population (millions)',
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      pointFormat: 'Population in 2021: <b>{point.y:.1f} millions</b>',
    },
    series: [
      {
        type: 'column',
        name: 'Population',
        colors: [
          '#9b20d9',
          '#9215ac',
          '#861ec9',
          '#7a17e6',
          '#7010f9',
          '#691af3',
          '#6225ed',
          '#5b30e7',
          '#533be1',
          '#4c46db',
          '#4551d5',
          '#3e5ccf',
          '#3667c9',
          '#2f72c3',
          '#277dbd',
          '#1f88b7',
          '#1693b1',
          '#0a9eaa',
          '#03c69b',
          '#00f194',
        ],
        colorByPoint: true,
        groupPadding: 0,
        data: [
          ['Tokyo', 37.33],
          ['Delhi', 31.18],
          ['Shanghai', 27.79],
          ['Sao Paulo', 22.23],
          ['Mexico City', 21.91],
          ['Dhaka', 21.74],
          ['Cairo', 21.32],
          ['Beijing', 20.89],
          ['Mumbai', 20.67],
          ['Osaka', 19.11],
          ['Karachi', 16.45],
          ['Chongqing', 16.38],
          ['Istanbul', 15.41],
          ['Buenos Aires', 15.25],
          ['Kolkata', 14.974],
          ['Kinshasa', 14.97],
          ['Lagos', 14.86],
          ['Manila', 14.16],
          ['Tianjin', 13.79],
          ['Guangzhou', 13.64],
        ],
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y:.1f}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
      },
    ],
  };

  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {}; // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  //---Bottom Sheet--//

  @ViewChild('bottom') bottomsheet: TemplateRef<any>;

  openBottomSheet() {
    this.sheet.open(this.bottomsheet);
  }

  //--Snack Bar--//

  openSnackBar() {
    this._snackBar.open('Cannonball!!', 'Splash', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'custom-snackbar',
      // Add the animation state here
    });
  }

  //---Ag Grid----//

  @ViewChild('gridForm') gridForm!: TemplateRef<any>;

  girdmode = true;

  openGridform() {
    this.formmode = true;
    this.dialog.open(this.gridForm);
    this.gridform.reset();
  }

  addNew() {
    this.formmode = true;

    let row = {
      make: this.gridform.value.make,
      model: this.gridform.value.model,
      price: this.gridform.value.price,
    };

    this.rowData$ = this.rowData$.pipe(map((data) => [...data, row]));
    console.log(this.rowData$);

    this.gridform.reset();
    this.dialog.closeAll();
    this._snackBar.open('Your Entry Added Successfully!', '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  public columnDefs: ColDef[] = [
    // { field: 'make', rowGroup: true },
    { field: 'make' },
    { field: 'model' },
    {
      field: 'price',
      cellStyle: (params) => {
        if (params.value <= 32000) {
          return { color: 'white', backgroundColor: 'red' };
        }
        if (params.value >= 35000 && params.value <= 70000) {
          return { color: 'black', backgroundColor: 'orange' };
        }
        if (params.value >= 72000) {
          return { color: 'white', backgroundColor: 'yellowgreen' };
        }
        return null;
      },
    },
    {
      field: 'Edit',
      pinned: 'right',
      // cellRenderer: function (params) {
      //   return `<button mat-button color="primary" (click)="onedit()"></button>`;
      // },
      cellRenderer: ButtonComponent,
      cellRendererParams: {
        buttonText: 'Edit',
        // buttontext: 'Delete',
      },
    },
    {
      field: 'Delete',
      pinned: 'right',
      // cellRenderer: function (params) {
      //   return `<button mat-button color="primary" (click)="onedit()"></button>`;
      // },
      cellRenderer: ButtonDeleteComponent,
      cellRendererParams: {
        // buttonText: 'Edit',
        buttontext: 'Delete',
      },
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    editable: false,
  };

  public rowData$!: Observable<any[]>;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  onGridReady(params: GridReadyEvent) {
    this.rowData$ = this.http.get<any[]>(
      'https://www.ag-grid.com/example-assets/row-data.json'
    );
  }

  onCellClicked(e: any): void {
    // console.log(e.data);

    // this.dialog.open(this.gridForm);

    this.formmode = false;
    const del = e.column.getColId();

    console.log(del);

    if (del === 'Delete') {
      // alert('Working');
      var selectedRowData = this.agGrid.api.getSelectedRows();
      this.agGrid.api.applyTransaction({ remove: selectedRowData });
      this._snackBar.open('Your Entry Deleted Successfully!', '', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
      });
    }

    const col = e.column.getColId();

    if (col === 'Edit') {
      this.gridform.patchValue({
        make: e.data.make,
        model: e.data.model,
        price: e.data.price,
      });
      this.dialog.open(this.gridForm);
    }
  }

  updateSelectedRow() {
    let updaterow = {
      make: this.gridform.value.make,
      model: this.gridform.value.model,
      price: this.gridform.value.price,
    };

    let nodesToUpdate = this.agGrid.api.getSelectedNodes();
    nodesToUpdate.forEach((node) => {
      node.setData(updaterow);
    });

    // this.agGrid.api.redrawRows();

    this.dialog.closeAll();
    this.gridform.reset();

    this._snackBar.open('Your Entry is Updated Successfully!', '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }

  clearData() {
    const rowData: any[] = [];
    this.agGrid.api.forEachNode(function (node) {
      rowData.push(node.data);
    });
    const res = this.agGrid.api.applyTransaction({
      remove: rowData,
    })!;
    this.printResult(res);
  }

  printResult(res: RowNodeTransaction) {
    console.log('---------------------------------------');
    if (res.add) {
      res.add.forEach(function (rowNode) {
        console.log('Added Row Node', rowNode);
      });
    }
    if (res.remove) {
      res.remove.forEach(function (rowNode) {
        console.log('Removed Row Node', rowNode);
      });
    }
    if (res.update) {
      res.update.forEach(function (rowNode) {
        console.log('Updated Row Node', rowNode);
      });
    }
  }

  //---Tabel-----//

  @ViewChild(MatTable)
  table!: MatTable<PeriodicElement>;

  @ViewChild('myForm') myform!: TemplateRef<any>;
  dataSource = [...ELEMENT_DATA];

  openDialog() {
    this.formmode = true;
    this.dialog.open(this.myform);
    this.form.reset();
  }

  addNewElement() {
    this.formmode = true;

    let element = {
      // position: this.form.value.position,
      position: this.dataSource.length + 1,
      name: this.form.value.name,
      weight: this.form.value.weight,
      symbol: this.form.value.symbol,
      type: this.form.value.type,
      startdate: this.form.value.startdate,
      enddate: this.form.value.enddate,
      description: this.form.value.description,
    };

    console.log(element.startdate);
    console.log(element.enddate);

    this.dataSource.push(element);
    this.table.renderRows();
    this.form.reset();
    this.dialog.closeAll();
    this._snackBar.open('Your Entry Added Successfully', 'Thank You!', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 1000,
    });
  }

  addData() {
    const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    this.dataSource.push(ELEMENT_DATA[randomElementIndex]);
    this.table.renderRows();
  }

  deleteData(index: number) {
    if (index >= 0 && index < this.dataSource.length) {
      this.dataSource.splice(index, 1);
      this.table.renderRows();
    }
  }

  getErrorMessage() {
    if (this.form.hasError('required')) {
      return 'You must enter a value';
    }

    return this.form.hasError('name') ? 'Not a valid name' : '';
  }

  // removeData() {
  //   this.dataSource.pop();
  //   this.table.renderRows();
  // }

  onEdit(index: number) {
    this.formmode = false;

    this.form.patchValue({
      position: this.dataSource[index].position,
      name: this.dataSource[index].name,
      weight: this.dataSource[index].weight,
      symbol: this.dataSource[index].symbol,
      type: this.dataSource[index].type,
      description: this.dataSource[index].description,
      startdate: this.dataSource[index].startdate,
      enddate: this.dataSource[index].enddate,
    });

    this.dialog.open(this.myform);
  }

  // data = new MatTableDataSource(ELEMENT_DATA);

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.data.filter = filterValue.trim().toLowerCase();
  // }

  updateData() {
    const position = this.form.get('position').value;
    const updatedElement = {
      position: this.form.get('position').value,
      name: this.form.get('name').value,
      weight: this.form.get('weight').value,
      symbol: this.form.get('symbol').value,
      type: this.form.get('type').value,
      startdate: this.form.get('startdate').value,
      enddate: this.form.get('enddate').value,
      description: this.form.get('description').value,
    };

    const index = this.dataSource.findIndex(
      (element) => element.position === position
    );

    if (index !== -1) {
      this.dataSource.splice(index, 1, updatedElement);
      this.table.renderRows();
      this.dialog.closeAll();
      this.form.reset();
    }
  }

  selection = new SelectionModel<PeriodicElement>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  //----Form Groups-----//

  gridform = new FormGroup({
    make: new FormControl(),
    model: new FormControl(),
    price: new FormControl(),
  });

  form = new FormGroup({
    position: new FormControl(null),
    name: new FormControl(null),
    weight: new FormControl(null),
    symbol: new FormControl(null),
    type: new FormControl(null),
    startdate: new FormControl(null),
    enddate: new FormControl(null),
    description: new FormControl(),
  });
}

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
  type: string;
  startdate: any;
  enddate: any;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    type: 'Reactive non-metals',
    startdate: new Date(),
    enddate: new Date(),
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
  },
  {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    type: 'Nobel gases',
    startdate: new Date(),
    enddate: new Date(),
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`,
  },
  {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    type: 'Alkali metals',
    startdate: new Date(),
    enddate: new Date(),
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`,
  },
  {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    type: 'Alkaline earth metals',
    startdate: new Date(),
    enddate: new Date(),
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`,
  },
  {
    position: 5,
    name: 'Boron',
    weight: 10.811,
    symbol: 'B',
    type: 'Metalloids',
    startdate: new Date(),
    enddate: new Date(),
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`,
  },
  {
    position: 6,
    name: 'Carbon',
    weight: 12.0107,
    symbol: 'C',
    type: 'Reactive non-metals',
    startdate: new Date(),
    enddate: new Date(),
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`,
  },
  {
    position: 7,
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    type: 'Reactive non-metals',
    startdate: new Date(),
    enddate: new Date(),
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`,
  },
  {
    position: 8,
    name: 'Oxygen',
    weight: 15.9994,
    symbol: 'O',
    type: 'Reactive non-metals',
    startdate: new Date(),
    enddate: new Date(),
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`,
  },
  {
    position: 9,
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
    type: 'Reactive non-metals',
    startdate: new Date(),
    enddate: new Date(),
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`,
  },
  {
    position: 10,
    name: 'Neon',
    weight: 20.1797,
    symbol: 'Ne',
    type: 'Noble gases',
    startdate: new Date(),
    enddate: new Date(),
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`,
  },
  {
    position: 11,
    name: 'Sodium',
    weight: 22.99,
    symbol: 'Na',
    type: 'Alkali metals',
    startdate: new Date(),
    enddate: new Date(),
    description: `Sodium is a chemical element with the symbol Na and atomic number 11. It is a soft, silvery-white, highly reactive metal.
     Sodium is an alkali metal, being in group 1 of the periodic table.
      Its only stable isotope is ²³Na. The free metal does not occur in nature and must be prepared from compounds`,
  },
  {
    position: 12,
    name: 'Magnesium',
    weight: 24.305,
    symbol: 'Mg',
    type: 'Alkaline earth metals',
    startdate: new Date(),
    enddate: new Date(),
    description: `Magnesium is a chemical element with the symbol Mg and atomic number 12.
     It is a shiny gray metal having a low density, low melting point and high chemical reactivity.
     Like the other alkaline earth metals it occurs naturally only in combination with other elements and it almost always has an oxidation state of +2.`,
  },
];
