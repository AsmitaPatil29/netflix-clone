import { Component, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonThumbnail,
  IonImg,
  IonText,
  IonCol,
  IonRow,
  IonList,
  IonListHeader,
  IonItemGroup,
  IonSkeletonText,
  IonFooter,
  IonTabButton,
  IonModal,
  IonItemDivider,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { addIcons } from 'ionicons';
import {
  trashOutline,
  camera,
  add,
  remove,
  bagHandle,
  bagHandleOutline,
  locationOutline,
} from 'ionicons/icons';
import { CouponsComponent } from './components/coupons/coupons.component';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { AddressesComponent } from './components/addresses/addresses.component';
import { AddressService } from 'src/app/services/address/address.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    IonItemDivider,
    IonModal,
    IonFooter,
    IonItemGroup,
    IonListHeader,
    IonList,
    IonRow,
    IonCol,
    IonText,
    IonImg,
    IonCard,
    IonIcon,
    IonButton,
    IonLabel,
    IonItem,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonThumbnail,
    CouponsComponent,
    AddAddressComponent,
    AddressesComponent,
  ],
})
export class CartPage implements OnInit {
  @ViewChild('coupon_modal') coupon_modal!: IonModal;
  selectedCoupon!: any;
  applyCoupon = false;

  isSelectedAddress = false;
  isAddAddress = false;
  address!: any;
  @ViewChild('add_address_modal') add_address_modal!: IonModal;

  @ViewChild('address_modal') address_modal!: IonModal;
  addressdata: any[] = [];
  addressSub!: Subscription;

  isCheckoutToShippingaddress = false;

  previous!: string;
  cartSub!: Subscription;
  private router = inject(Router);
  public cartservice = inject(CartService);
  private addressService = inject(AddressService);
  model: any;
  constructor() {
    addIcons({
      trashOutline,
      add,
      remove,
      locationOutline,
      bagHandleOutline,
      camera,
      bagHandle,
    });
  }

  ngOnInit() {
    this.checkUrl();
    this.cartSub = this.cartservice.cart.subscribe({
      next: (cart) => {
        console.log('model', this.model);
        this.model = cart;
      },
    });
    this.getAddresses();

    this.addressSub = this.addressService.address.subscribe({
      next: (addresses) => {
        this.addressdata = addresses;
      },
    });

    console.log(this.addressdata);
  }

  async getAddresses() {
    try {
      // Cast the result to an array to fix TypeScript error
      const addresses = (await this.addressService.getAddresses()) as any[];

      if (addresses && addresses.length > 0) {
        // Find the primary address
        this.address = addresses.find(
          (address: any) => address.primary === true
        );

        // if (this.address) {
        //   this.isSelectedAddress = true;
        // }
      }
    } catch (e) {
      console.error('Error getting addresses:', e);
    }
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
    this.addressSub.unsubscribe();
  }

  checkUrl() {
    const route_url = this.router.url;
    const urlParts = route_url.split('/');
    urlParts.pop();
    this.previous = urlParts.join('/') || '/home'; // Add fallback to /home
  }

  addQuantity(item: any) {
    this.cartservice.addQuantity(item).then(() => {
      if (this.selectedCoupon) {
        this.applyCouponDiscount();
      }
    });
  }

  subtractQuantity(item: any) {
    this.cartservice.subtractQuantity(item).then(() => {
      if (this.selectedCoupon) {
        this.applyCouponDiscount();
      }
    });
  }

  closeCouponModal(coupon: any, couponModal: IonModal) {
    if (coupon) {
      this.selectedCoupon = coupon;
      console.log('selectedCoupon', this.selectedCoupon);
      this.applyCouponDiscount();
    }
    couponModal.dismiss();
  }

  removeCoupon() {
    if (this.selectedCoupon) {
      this.selectedCoupon = null;
      // Restore original grand total from cart service
      this.model.grandTotal = this.calculateGrandTotal();
      // Update the cart in the service
      this.updateCartInService();
    }
  }

  // Helper method to apply coupon discount
  applyCouponDiscount() {
    if (!this.selectedCoupon || !this.model) return;

    // Calculate original grand total
    const originalGrandTotal = this.calculateGrandTotal();

    // Apply discount
    this.model.grandTotal = originalGrandTotal - this.selectedCoupon.saved;

    // Update the cart in the service
    this.updateCartInService();
  }

  // Helper method to calculate grand total without discount
  calculateGrandTotal() {
    return this.model.totalPrice + this.model.total_delivery_charge;
  }

  // Helper method to update the cart in the service
  updateCartInService() {
    // Create a copy of the current cart to update
    const updatedCart = { ...this.model };

    // Update the cart in the service
    this.cartservice.saveCart(updatedCart);
  }
  checkout() {
    console.log(this.isAddAddress);
    if (!this.address) {
      this.isAddAddress = true;
      this.isCheckoutToShippingaddress = true;
    } else {
      //navigate To payment
      this.navigateToPayment();
    }
  }
  closeAddAddressModal(AddressData: any) {
    this.add_address_modal.dismiss();

    if (AddressData) {
      this.address = AddressData;

      if (this.isCheckoutToShippingaddress) {
        this.isCheckoutToShippingaddress = false;
        this.navigateToPayment();
      }
    }
  }
  closeAddressModal(add: any) {
    this.address_modal.dismiss();
    if (add) {
      if (add === 1) {
        this.isAddAddress = true;
      } else {
        this.address = add;

        //navigate to payment
      }
    }
  }

  navigateToPayment() {}
}
