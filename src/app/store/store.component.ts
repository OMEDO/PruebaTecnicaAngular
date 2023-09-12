import { Component, OnInit } from '@angular/core';
import { productos } from 'src/assets/data/data';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  constructor() { }

  productos = [...productos]
  totales: {  price_without_tax: number, tax: number, shipping_fee: number }[] = [];

  
  ngOnInit(): void {
     this.calcularTotales();
  }

  
  agregarProducto(item_id: number) {
    const producto = this.productos.find((p: any) => p.item_id === item_id);

    if (producto) {
      const cantidadActual = Number(producto.quantity);
      let originalPrice = parseFloat(producto.original_price)
      if (cantidadActual < 9) {
        producto.quantity = String(cantidadActual + 1);
        producto.price_without_tax = (originalPrice * (cantidadActual + 1)).toFixed(2);
        this.calcularTotales();
      }
    }
  }

  quitarProducto(item_id: number) {
    const producto = this.productos.find((p: any) => p.item_id === item_id);
    if (producto) {
      let cantidadActual = Number(producto.quantity);
      let originalPrice = parseFloat(producto.original_price)
      if (cantidadActual > 0) {
        cantidadActual--; 
        producto.quantity = String(cantidadActual);
        producto.price_without_tax = (originalPrice * cantidadActual).toFixed(2);
        this.calcularTotales();
      }
    }
  }

  calcularTotales() {
    const total = this.productos.reduce((acc, producto) => {
      const price_without_tax = parseFloat(producto.price_without_tax);
      const tax = parseFloat(producto.tax) * Number(producto.quantity); // Multiplica tax por la cantidad
      const shipping_fee = parseFloat(producto.shipping_fee) * Number(producto.quantity);
      return {
        price_without_tax: acc.price_without_tax + price_without_tax,
        tax: acc.tax + tax,
        shipping_fee: acc.shipping_fee + shipping_fee
      };
    }, { price_without_tax: 0, tax: 0, shipping_fee: 0 });

    if (this.totales.length > 0) {
      this.totales[0] = total;
    } else {
      this.totales.push(total);
    }
  }

  borrarProducto(item_id: number) {
    const producto = this.productos.find((p: any) => p.item_id === item_id);

    if (producto) {
      producto.quantity = "0";
      producto.price_without_tax = "0"
      const index = this.productos.findIndex((p: any) => p.item_id === item_id);

      if (index !== -1) {
        this.totales.splice(index, 1);
      }

      this.calcularTotales();
    }
  }


  borrarTodo() {
    this.productos.forEach((producto: any) => {
      producto.quantity = "0";
      producto.price_without_tax = "0";
    });

    this.totales = [];
    
    this.productos = [];  
    this.calcularTotales(); 
  }

  recargarDatos() {
    this.productos = [...productos];
    this.calcularTotales(); 
  }


}





