import { CommonModule, DecimalPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  output,
} from '@angular/core';
import { IonHeader } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { Strings } from 'src/app/enum/strings.enum';
import { addIcons } from 'ionicons';
import { arrowBackOutline, ticketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,DecimalPipe],
})
export class CouponsComponent implements OnInit {
  @Input() orderTotal!: number;
  @Output() close: EventEmitter<any> = new EventEmitter();
  coupons: any[] = [];
  isLoading: boolean = false;
  currency = Strings.CURRENCY;

  private apiService = inject(ApiService);

  constructor() {
    addIcons({
      arrowBackOutline,
      ticketOutline,
    });
  }

  ngOnInit(): void {
    this.getCoupons();
  }

 getCoupons() {
  try {
    this.isLoading = true;
    const coupons = this.apiService.getCoupons();
    
    if (coupons?.length > 0) {
      // Map over coupons and add saved amount
      this.coupons = coupons.map((c:any) => {
        c.saved = this.getSavedAmount(c);
        return c;
      });
    }
    
    this.isLoading = false;
  } catch (e) {
    this.isLoading = false;
    console.log(e);
  }
}

  closeModal(data: any) {
    console.log("modal",data)
    this.close.emit(data);
  }
   getSavedAmount(coupon: any) {
    let amt = 0;
    if(coupon?.minimumOrderAmount) {
      amt = this.orderTotal - coupon.minimumOrderAmount;
      if(amt < 0) return amt;
    }
    amt = coupon?.isPercentage ? (this.orderTotal * (coupon?.discount / 100)) : coupon?.discount;
    if(coupon?.upto_discount) {
      console.log('check amt: ', amt);
      amt = (amt >= coupon.upto_discount) ? coupon.upto_discount : amt;
    }
    return amt;
  }
}
