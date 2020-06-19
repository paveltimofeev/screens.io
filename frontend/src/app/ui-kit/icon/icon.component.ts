import { OnInit, Component, Input } from '@angular/core';

export let IconMapping:Map<string, string> = new Map(
  [
    // key, icon
    ['Refresh', 'fas fa-redo'],
    ['Group by Scenarios', 'fas fa-object-group'],
    ['List View', 'fas fa-th-list'],
    ['Show Differences', 'far fa-images'],
    ['Close', 'fas fa-times'],
    ['Search', 'fas fa-search'],
    ['Add Filters', 'fas fa-filter'],
    ['Nothing broken', 'far fa-thumbs-up'],
    ['Hamburger', 'fas fa-bars'],
    ['Help', 'far fa-question-circle'],
    ['External Link', 'fas fa-external-link-alt'],
    ['Sign Out', 'fas fa-sign-out-alt'],
    ['Check', 'fas fa-check'],

    ['Run', 'fas fa-play'],
    ['Running', 'fas fa-circle-notch fa-spin'],
    ['Running Spinning', 'fas fa-circle-notch fa-spin'],
    ['Passed', 'fas fa-check-circle'],
    ['Failed', 'fas fa-times-circle'],
    ['Approved', 'far fa-check-square'],

    ['Toggle On', 'fas fa-toggle-on'],
    ['Toggle Off', 'fas fa-toggle-off'],

    ['Reference', 'far fa-image'],
    ['Test', 'fas fa-image'],
    ['Difference', 'far fa-images'],
    ['Full Height', 'fas fa-arrows-alt-v'],
    ['Comparer', 'fas fa-columns'],
    ['Fill', 'fas fa-expand'],
    ['Fit', 'fas fa-compress-arrows-alt'],

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
