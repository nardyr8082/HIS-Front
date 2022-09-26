import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-clinic-history-static-new-form',
  templateUrl: './clinic-history-static-new-form.component.html',
  styleUrls: ['./clinic-history-static-new-form.component.scss']
})
export class ClinicHistoryStaticNewFormComponent implements OnInit {
  currentItem='Television';
  constructor() { }

  ngOnInit(): void {
  }

}
