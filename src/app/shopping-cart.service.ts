import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from '../../node_modules/angularfire2/database';
import { Product } from './models/product';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { ShoppingCart } from './models/shopping-cart';



@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) {}


 private create() {
return this.db.list('/shopping-carts').push({
dateCreated : new Date().getTime()
});
  }

async getCart():Promise<FirebaseObjectObservable<ShoppingCart>> {
  let cartId = await this.getOrCreateCartId();
return this.db.object('/shopping-carts/' + cartId);

}


private async getOrCreateCartId():Promise<string> {
  let cartId = localStorage.getItem('cartId');
  if(cartId) return cartId; 

    let result = await this.create();
    localStorage.setItem('cartId', result.key);
  return result.key;
}

async addToCart(product: Product)  {
  this.updateItemQuantity(product,1);
}


async removeFromCart(product: Product)  {
 this.updateItemQuantity(product,-1);  
  }


  private async updateItemQuantity(product: Product, change:number)  {
    let cartId = await this.getOrCreateCartId();
    let item$ =   this.db.object('/shopping-carts/' +cartId+ '/items/' + product.$key);
    
    let itemsubs =  item$.subscribe(item => {
     item$.update({product:product, quantity : (item.quantity || 0) + change });
    
    itemsubs.unsubscribe();
    }); 
    
    }


}
