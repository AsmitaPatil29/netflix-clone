import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonBadge,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner, IonText } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  alertCircleOutline,
  businessOutline,
  cartOutline,
  checkmarkCircle,
  closeCircle,
  heartOutline,
  pricetagOutline,
  removeCircleOutline,
  shareSocialOutline,
  star,
  bag,
  bagHandle,
} from 'ionicons/icons';
import { CartService } from 'src/app/services/cart/cart.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
  standalone: true,
  imports: [IonText, 
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonBadge,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    RouterLink,
  ],
})
export class ItemDetailPage implements OnInit {
  itemId: string;
  item: any;
  isLoading: boolean = true;
  selectedQuantity: number = 0; // For selecting how many to add
  cartQuantity: number = 0; // For displaying total cart quantity

  activeImageIndex: number = 0;
  cartSub!: Subscription;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: true,
    autoplay: {
      delay: 3000,
    },
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public cartService: CartService
  ) {
    this.itemId = this.route.snapshot.paramMap.get('id') || '';

    addIcons({
      heartOutline,
      shareSocialOutline,
      bagHandle,
      star,
      checkmarkCircle,
      closeCircle,
      businessOutline,
      pricetagOutline,
      removeCircleOutline,
      addCircleOutline,
      cartOutline,
      alertCircleOutline,
      bag,
    });
  }

  
  ngOnInit() {
  this.loadItemDetails();
  this.setupCartSubscription();
}

ionViewWillEnter() {
  // This will run every time the page becomes active
  if (this.item) {
    this.updateSelectedQuantity();
  }
}

setupCartSubscription() {
  // Subscribe to cart changes for badge updates
  this.cartSub = this.cartService.cart.subscribe(cart => {
    this.cartQuantity = cart ? cart.totalItem : 0;
    
    // Also update selected quantity if item exists
    if (this.item) {
      if (cart && cart.items) {
        const existingItem = cart.items.find((i: any) => i.id === this.item.id);
        if (existingItem) {
          this.selectedQuantity = existingItem.quantity;
        } else {
          // Item not in cart, set to default
          this.selectedQuantity = 0;
        }
      } else {
        // No items in cart
        this.selectedQuantity = 0;
      }
    }
  });
}

updateSelectedQuantity() {
  if (!this.item) return;
  
  this.cartService.cart.subscribe((cart) => {
    if (cart && cart.items) {
      const existingItem = cart.items.find((i: any) => i.id === this.item.id);
      if (existingItem) {
        this.selectedQuantity = existingItem.quantity;
      } else {
        // Item not in cart, set to default
        this.selectedQuantity = 0;
      }
    } else {
      // No items in cart
      this.selectedQuantity = 0;
    }
  }).unsubscribe();
}

loadItemDetails() {
  this.isLoading = true;
  this.apiService.getProductById(this.itemId).subscribe(
    (data) => {
      this.item = data;
      this.isLoading = false;
      // Update selected quantity from cart
      this.updateSelectedQuantity();
    },
    (error) => {
      console.error('Error fetching item details:', error);
      this.isLoading = false;
    }
  );
}

async addToCart() {
  if (!this.item) return;

  // Check if item already exists in cart
  let existingItem: any = null;
  this.cartService.cart
    .subscribe((cart) => {
      if (cart && cart.items) {
        existingItem = cart.items.find((i: any) => i.id === this.item.id);
      }
    });

  if (existingItem) {
    // If item exists in cart, update its quantity
    await this.cartService.updateQuantity(this.item.id, this.selectedQuantity);
  } else {
    // If item doesn't exist in cart, add it
    const itemToAdd = {
      ...this.item,
      quantity: this.selectedQuantity,
    };
    await this.cartService.addQuantity(itemToAdd);
  }
}
// Update these methods in your item-detail.page.ts file

increaseQuantity() {
  // Only allow increasing if we haven't reached stock limit
  if (this.selectedQuantity < 10 && this.selectedQuantity < this.item.stock) {
    this.selectedQuantity++;
  }
}

decreaseQuantity() {
  console.log(this.selectedQuantity)
  if (this.selectedQuantity >= 0) {
    this.selectedQuantity--;
  }
}

setActiveImage(index: number) {
  this.activeImageIndex = index;
}

ngOnDestroy() {
  if (this.cartSub) {
    this.cartSub.unsubscribe();
  }
}

}
