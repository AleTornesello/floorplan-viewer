import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-empty-message',
  templateUrl: './empty-message.component.html',
  styleUrls: ['./empty-message.component.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
})
export class EmptyMessageComponent {
  @Input() title: string | undefined;
  @Input({ required: true }) message!: string;
  @Input() icon: IconDefinition;
  @Input() shrink: boolean;
  @Input() iconContainerClass: string | string[] | undefined;

  constructor() {
    this.icon = faInfo;
    this.shrink = false;
  }
}
