import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Strings } from 'src/app/enum/strings.enum';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Initialize with empty cart
  private _cart = new BehaviorSubject<any>({
    totalItem: 0,
    items: [],
    totalPrice: 0,
    total_delivery_charge: 100,
    tax: 15,
    taxAmount: 0,
    grandTotal: 0,
  });

  cartStoreName = Strings.CART_STORAGE;
  currency = Strings.CURRENCY;

  private storage = inject(StorageService);

  total_delivery_charge = 100;
  tax = 15; // in percentage

  get cart() {
    return this._cart.asObservable();
  }

  constructor() {
    this.loadCart();
  }

  getCart() {
    return this._cart.asObservable();
  }

  loadCart() {
    return this.storage.getStorage(this.cartStoreName).then((result: any) => {
      if (result && result.value) {
        try {
          const cart = JSON.parse(result.value);
          this._cart.next(cart);
        } catch (error) {
          console.error('Error parsing cart data:', error);
          this.clearCart();
        }
      }
    });
  }

  // Helper method to calculate cart totals
  private calculateTotals(items: any[]) {
    const totalItem = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = totalPrice * (this.tax / 100);
    const grandTotal = totalPrice + this.total_delivery_charge + taxAmount;

    return {
      totalItem,
      items,
      totalPrice,
      total_delivery_charge: this.total_delivery_charge,
      tax: this.tax,
      taxAmount,
      grandTotal,
    };
  }

  // Helper method to update cart
  private updateCart(updatedItems: any[]) {
    if (updatedItems.length === 0) {
      return this.clearCart();
    }

    const updatedCart = this.calculateTotals(updatedItems);
    this._cart.next(updatedCart);
    this.saveCart(updatedCart);
    return Promise.resolve(true);
  }

  addQuantity(item: any) {
    const currentCart = this._cart.value;
    const currentItems = currentCart?.items || [];
    const existingItemIndex = currentItems.findIndex((i: { id: any }) => i.id === item.id);
    let updatedItems = [];

    if (existingItemIndex >= 0) {
      updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += 1;
    } else {
      updatedItems = [...currentItems, item];
    }

    return this.updateCart(updatedItems);
  }

  subtractQuantity(item: any) {
    const currentCart = this._cart.value;
    const currentItems = currentCart?.items || [];
    const existingItemIndex = currentItems.findIndex((i: { id: any }) => i.id === item.id);

    if (existingItemIndex >= 0) {
      const updatedItems = [...currentItems];
      if (updatedItems[existingItemIndex].quantity > 1) {
        updatedItems[existingItemIndex].quantity -= 1;
      } else {
        updatedItems.splice(existingItemIndex, 1);
      }
      return this.updateCart(updatedItems);
    }

    return Promise.resolve(true);
  }

  removeItem(id: any) {
    const currentCart = this._cart.value;
    const updatedItems = currentCart.items.filter((item: any) => item.id !== id);
    return this.updateCart(updatedItems);
  }

  updateQuantity(id: any, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(id);
    }

    const currentCart = this._cart.value;
    const updatedItems = [...currentCart.items];
    const itemIndex = updatedItems.findIndex((item: any) => item.id === id);

    if (itemIndex >= 0) {
      updatedItems[itemIndex].quantity = quantity;
      return this.updateCart(updatedItems);
    }

    return Promise.resolve(false);
  }

  saveCart(data: any) {
    const cartData = JSON.stringify(data);
    this.storage.setStorage(this.cartStoreName, cartData);
  }

  clearCart() {
    const emptyCart = {
      totalItem: 0,
      items: [],
      totalPrice: 0,
      total_delivery_charge: this.total_delivery_charge,
      tax: this.tax,
      taxAmount: 0,
      grandTotal: 0,
    };

    this._cart.next(emptyCart);
    this.storage.removeStorage(this.cartStoreName);
    return Promise.resolve(true);
  }
}
