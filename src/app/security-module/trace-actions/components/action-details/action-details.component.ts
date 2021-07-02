import { TraceAction } from './../../models/trace-action.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.scss'],
})
export class ActionDetailsComponent implements OnInit {
  traceAction: TraceAction;
  beforeKeys: any;
  beforeValues: any;
  afterKeys: any;
  afterValues: any;
  before;
  after;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.traceAction = this.data.action;
    this.before = JSON.parse(this.traceAction.data_old);
    this.after = JSON.parse(this.traceAction.data_new);
  }
}
