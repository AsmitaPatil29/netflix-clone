import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://dummyjson.com/products';
  items: any;

  
  coupons = [
    {
      id: '1',
      code: 'TRYNEW',
      discount: 20,
      isPercentage: true,
      description: 'Use code TRYNEW & get 20% off',
      isActive: true,
      expiryDate: "2023-08-15T18:30:00",
      minimumOrderAmount: 499,
      upto_discount: 200,
    },
    {
      id: '2',
      code: 'FREESHIP',
      discount: 100,
      isPercentage: false,
      description: 'Flat ₹100 off',
      isActive: true,
      expiryDate: "2023-09-30T23:59:59",
    },
    {
      id: '3',
      code: 'SALE50',
      discount: 50,
      isPercentage: true,
      description: 'Big Sale - Flat 50% off on everything',
      isActive: true,
      expiryDate: "2023-08-31T23:59:59",
      minimumOrderAmount: 1000,
      upto_discount: 550,
    },
    {
      id: '4',
      code: 'NEW50',
      discount: 50,
      isPercentage: true,
      description: 'New customer offer - Flat 50% off on everything',
      isActive: true,
      expiryDate: "2023-08-31T23:59:59",
      minimumOrderAmount: 399,
      upto_discount: 250,
    },
  ];

  constructor(private http: HttpClient) {}

  // ✅ Fetch all products
  // getProducts(): Observable<{ products: Product[] }> {
  //   return this.http.get<{ products: Product[] }>(this.apiUrl);
  // }
  getProducts()
  {
    return this.http.get(this.apiUrl);
  }
  
  getProductById(id: string)
  {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getCoupons()
  {
    return this.coupons.filter(coupon => coupon.isActive);
  }
}