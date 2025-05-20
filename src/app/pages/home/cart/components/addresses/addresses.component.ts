import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IonRadio, // Add this
  IonRadioGroup,
     IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonHeader
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { arrowBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonRadio,
    IonRadioGroup
  ],
})
export class AddressesComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();

  @Input() addressData: any[] = [];

  constructor() {
    addIcons({
      arrowBackOutline,
    });
  }

  ngOnInit() {}
  dismiss(data: any) {
    this.close.emit(data);
  }

  selectAddress(data: any) {
    this.close.emit(data);
  }
}
