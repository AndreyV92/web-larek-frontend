import {
	ProductData,
	OrderPayload,
	OrderFormErrors,
	ContactInfo,
	DeliveryInfo,
	AppState as AppStateType,
} from '../types';
import { EventEmitter } from './base/events';

import { Model } from './base/modal';

//
export interface CatalogChangeEvent {
	products: ProductData[];
}

//

export class AppState extends Model<AppStateType> {
	basket: string[] = [];
	preview: string | null = null;
	order: Omit<OrderPayload, 'items' | 'total'> = {
		address: '',
		payment: '',

		email: '',
		phone: '',
	};
	orderError: OrderFormErrors = {};
	catalog: ProductData[] = [];

	constructor(
		initialState: Partial<AppStateType>,
		protected events: EventEmitter
	) {
		super(initialState, events);
		this.preview = initialState.preview || null;
		this.catalog = initialState.products || [];
		this.basket = [];
	}
	clearBasket(): void {
		this.basket = [];
		this.updateBasket();
	}

	addToBasket(productId: string): void {
		if (!this.basket.includes(productId)) {
			this.basket.push(productId);
			this.updateBasket();
		}
	}
	getBasketProducts(): ProductData[] {
		return this.catalog.filter((item) => this.basket.includes(item.id));
	}
	private updateBasket(): void {
		this.events.emit('basket:change', {
			products: this.getBasketProducts(),
			total: this.getTotal(),
		});
	}
	getTotal(): number {
		return this.getBasketProducts().reduce(
			(sum, product) => sum + (product.price || 0),
			0
		);
	}

	setCatalog(products: ProductData[]): void {
		this.catalog = products;
		this.events.emit('items:changed', { products: this.catalog });
	}
	setContactField(field: keyof ContactInfo, value: string): void {
		this.order[field] = value;
		this.validateContact();
	}
	contactReset(): void {
		this.order.email = '';
		this.order.phone = '';
		this.events.emit('contact:reset', this.order);
	}
	validateContact(): boolean {
		const errors: OrderFormErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		}
		this.orderError = errors;
		this.events.emit('contactsOrderFormErrors:change', errors);
		return Object.keys(errors).length === 0;
	}
	removeFromBasket(productId: string): void {
		const index = this.basket.indexOf(productId);
		if (index !== -1) {
			this.basket.splice(index, 1);
			this.updateBasket();
		}
	}
	setOrderField(field: keyof DeliveryInfo, value: string): void {
		this.order[field] = value;
		this.validateOrder();
	}
	validateOrder(): boolean {
		const errors: OrderFormErrors = {};
		console.log(this);
		if (!this.order.payment) {
			errors.payment = 'Укажите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Введите адресс';
		}
		this.orderError = errors;
		this.events.emit('orderOrderFormErrors:change', errors);
		return Object.keys(errors).length === 0;
	}

	orderReset(): void {
		console.log(this.order);
		this.order.payment = '';
		this.order.address = '';
		this.events.emit('order:reset', this.order);
	}
	setPreview(product: ProductData): void {
		this.preview = product.id;
		this.events.emit('preview:changed', product);
	}
	isSubmitDisabled(): boolean {
		return !this.validateOrder() || !this.validateContact();
	}
}
