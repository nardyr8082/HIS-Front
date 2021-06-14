import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forbidden-access',
  templateUrl: './forbidden-access.component.html',
  styleUrls: ['./forbidden-access.component.scss'],
})
export class ForbiddenAccessComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit() {
    var lock = document.querySelector('#lock');
    var key = document.querySelector('#key');
  }

  onBacktoHome() {
    this.location.back();
  }
}
