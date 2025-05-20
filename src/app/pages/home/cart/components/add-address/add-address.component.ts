import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonIcon,
  IonButton,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonItem,
  IonCheckbox,
  IonList,
  IonRow,
  IonCol, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, ticketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
  standalone: true,
imports: [IonSpinner, 
    IonContent,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonHeader,
    IonButton,
    IonIcon,
    IonInput,
    IonTextarea,
    IonItem,
    IonCheckbox,
    IonList,
    IonRow,
    IonCol,
    ReactiveFormsModule,
  ],
})
export class AddAddressComponent implements OnInit {
  addressForm!: FormGroup;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading=false;
  constructor() {
    addIcons({
      arrowBackOutline,
      ticketOutline,
    });
  }
  ngOnInit(): void {
    this.initForm();

  }
  initForm() {
    this.addressForm = new FormGroup({
      pincode: new FormControl(null, { validators: [Validators.required] }),
      address: new FormControl(null, { validators: [Validators.required] }),
      house_no: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required] }),
      state: new FormControl(null, { validators: [Validators.required] }),
      country: new FormControl(null, { validators: [Validators.required] }),
      save_as: new FormControl(null, { validators: [Validators.required] }),
      landmark: new FormControl(null, { validators: [] }),
      primary: new FormControl(false, { validators: [] }),
    });
  }

  dismiss(data: any) {
    this.close.emit(data);
  }

  saveAddress()
  {
   
    this.isLoading=true;
    console.log(this.addressForm.value);
    this.dismiss(this.addressForm.value)
  }
}
