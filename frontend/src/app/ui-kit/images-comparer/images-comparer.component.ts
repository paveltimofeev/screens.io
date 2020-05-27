import { Component, Input } from '@angular/core';

declare var juxtapose;

@Component({
  selector: 'app-image-comparer',
  templateUrl: './images-comparer.component.html',
  styleUrls: ['./images-comparer.component.css']
})
export class ImagesComparerComponent {

  slider;
  _firstImageUrl:string;
  _secondImageUrl:string;

  @Input()
  set firstImageUrl(value: string) {
    this._firstImageUrl = value;
    this.initSlider();
  }

  @Input()
  set secondImageUrl(value: string) {
    this._secondImageUrl = value;
    this.initSlider();
  }

  constructor() { }

  initSlider() {

    if (!this._firstImageUrl || !this._secondImageUrl) {
      return;
    }

    console.log('init slider');

    const sliderOptions = {
      animate: true,
      showLabels: false,
      showCredits: false,
      startingPosition: "50%",
      makeResponsive: true
    };

    try {

      this.slider = new juxtapose.JXSlider(
        '#comparer-container', [
          { src: this._firstImageUrl },
          { src: this._secondImageUrl }
        ],
        sliderOptions
      );
    }
    catch (e) {

      console.error(e)
    }
  }
}
