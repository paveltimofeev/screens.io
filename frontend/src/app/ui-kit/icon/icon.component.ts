import { OnInit, Component, Input } from '@angular/core';

export let IconMapping:Map<string, string> = new Map(
  [
    // key, icon
    ['Refresh', 'fas fa-redo'],
    ['Group by Scenarios', 'fas fa-object-ungroup'],
    ['List View', 'fas fa-th-list'],
    ['Show Differences', 'far fa-images'],
    ['Close', 'fas fa-times'],
    ['Search', 'fas fa-search'],
    ['Add Filters', 'fas fa-filter'],
    ['Nothing broken', 'far fa-thumbs-up'],
    ['Hamburger', 'fas fa-bars'],
    ['Help', 'far fa-question-circle'],
    ['External Link', 'fas fa-external-link-alt'],

    ['Run', 'fas fa-play'],
    ['Running Spinning', 'fas fa-circle-notch icon--running'],
    ['Passed', 'fas fa-check-circle'],
    ['Failed', 'fas fa-times-circle'],

    ['Delete', 'fas fa-trash'],
    ['Favorite', 'fa-heart'],
    ['Favorite Enabled', 'fas fa-heart'],
    ['Favorite Disabled', 'far fa-heart'],
  ]);

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html'
})
export class IconComponent implements OnInit{

  _icon:string;

  @Input()
  set icon(value:string) {
    this._icon = IconMapping.get(value)
  }

  @Input()
  customClass:string;

  ngOnInit (): void {

    if (this.customClass !== undefined) {

      this._icon = [
        this._icon,
        this.customClass
      ].join(' ')
    }
  }
}
