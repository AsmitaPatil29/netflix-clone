import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCol,
  IonRow,
  IonThumbnail,
  IonImg,
  IonCard,
  IonLabel,
  IonText,
  IonIcon,
  IonSearchbar,
  IonBadge,
  IonButtons,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { bagHandle } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonButtons,
    IonSearchbar,
    IonIcon,
    IonText,
    IonCard,
    IonImg,
    IonRow,
    IonCol,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    RouterLink,
    CommonModule,
    IonButton,
    IonBadge,
  ],
})
export class HomePage {
  items: any[] = [];

  // allItems: any[] = [];
  allItems: any;
  query!: string;
  private api = inject(ApiService);
  private cartService = inject(CartService);
  quantity = 1;
  cartSub!: Subscription;
  constructor() {
    addIcons({
      bagHandle,
    });
  }

  ngOnInit() {
    this.getItems();
    this.getQuantity();
  }

  getQuantity() {
    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        this.quantity = cart ? cart?.totalItem : 0;
      },
    });
  }

  getItems() {
    // this.allItems=this.api.getProducts();
    this.api.getProducts().subscribe((res) => {
      // this.items = [this.allItems];
      this.allItems = res;
      this.items = this.allItems.products;
      console.log(this.items);
    });
  }
  onSearchChange(e: any) {
    console.log(e.detail.value);
    // this.items = this.allItems.products.filter((item:any) => {
    //   return item.title.toLowerCase().includes(e.detail.value.toLowerCase());
    // });

    this.query = e.detail.value.toLowerCase();
    this.querySearch();
  }
  querySearch() {
    this.items = [];
    if (this.query.length > 0) {
      this.searchItems();
    } else {
      this.items = [...this.allItems.products];
    }
  }
  searchItems() {
    this.items = this.allItems.products.filter((item: any) => {
      return item.title.toLowerCase().includes(this.query);
    });
  }
  ngOnDestroy() {
    if(this.cartSub)
    {
      this.cartSub.unsubscribe();
    }
  }
}
