import { DomSanitizer } from '@angular/platform-browser';
import { environment } from './../../../environments/environment';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';

export interface IFile {
  id: number;
  type: string;
  file: string;
  orinalName: string;
  size: Number;
}

@Component({
  selector: 'app-galery-files',
  templateUrl: './galery-files.component.html',
  styleUrls: ['./galery-files.component.scss'],
})
export class GaleryFilesComponent implements OnInit, AfterViewInit {
  config: SwiperConfigInterface = {};
  files: IFile[] = [];
  apiUrl = environment.imageUrl;
  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true,
  };

  @Input() set _files(value) {
    if (value) {
      this.files = [...value];
      let timeout = setTimeout(() => {
        this.showData = true;
        clearTimeout(timeout);
      }, 150);
    }
  }

  showData = false;

  constructor(public sanitazer: DomSanitizer) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      speed: 500,
      effect: 'slide',
    };
  }

  onPlayVideo(file: IFile) {
    let elemnt = document.getElementById('video-' + file.id) as HTMLVideoElement;
    elemnt.play();
    let data = document.getElementById('overlay-' + file.id);
    data.style.display = 'none';
    elemnt.controls = true;
  }
  onPauseVideo(file: IFile) {
    let data = document.getElementById('overlay-' + file.id);
    data.style.display = 'unset';
    let elemnt = document.getElementById('video-' + file.id) as HTMLVideoElement;
    elemnt.controls = false;
  }
}
