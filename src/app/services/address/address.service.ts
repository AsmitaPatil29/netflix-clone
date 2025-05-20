import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private _address = new BehaviorSubject<any>(null);

  get address() {
    return this._address.asObservable();
  }

  constructor() {}

  async addAddress(fromData: any) {
    try {
      let addresses = this._address.value;
      if (addresses?.length === 0) {
        FormData = { ...fromData, primary: true };
      }
      const add = {
        ...fromData,
        id: '1',
      };
      addresses = addresses.concat(add);
      this._address.next(addresses);
      return addresses;
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

 async getAddresses(): Promise<any[]> {
  try {
    const dummyData = [
      {
        pincode: '555555',
        id:2,
        address: '123 Main Street',
        house_no: '22',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        save_as: 'Home',
        landmark: 'abcd',
        primary: false,
      },
      {
        pincode: '667777',
         id:3,
        address: '123 Main Street',
        house_no: '22',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        save_as: 'Other',
        landmark: 'abcd',
        primary: true,
      },
      {
        pincode: '446466',
         id:5,
        address: '123 Main Street',
        house_no: '22',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        save_as: 'Work',
        landmark: 'abcd',
        primary: false,
      },
    ];
    this._address.next(dummyData);
    return dummyData;
  } catch (error) {
    console.error('Error getting addresses:', error);
    return []; // Always return an array, even on error
  }
}

}
