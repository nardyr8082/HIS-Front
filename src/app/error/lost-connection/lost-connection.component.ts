import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lost-connection',
  templateUrl: './lost-connection.component.html',
  styleUrls: ['./lost-connection.component.scss'],
})
export class LostConnectionComponent implements OnInit {
  constructor(public location: Location) {}

  ngOnInit() {}
}
