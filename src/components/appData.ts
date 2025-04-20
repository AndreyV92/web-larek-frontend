import { EventEmitter } from './base/events';
import { Model } from './base/modal';
import {
	DeliveryInfo,
	ContactInfo,
	OrderPayload,
	AppState as AppStateType,
	ProductData,
	OrderFormErrors,
} from '../types';
export interface CatalogChangeEvent {
	products: ProductData[];
}

export class AppState extends Model<AppStateType> {
	orderError: OrderFormErrors = {};
	order: Omit<OrderPayload, 'items' | 'total'> = {
		phone: '',
		email: '',
		payment: '',
		address: '',
	};
	preview: string | null = null;
	catalog: ProductData[] = [];
	basket: string[] = [];

	constructor(
		initialState: Partial<AppStateType>,
		protected events: EventEmitter
	) {
		super(initialState, events);
		this.preview = initialState.preview || null;
		this.basket = [];
		this.catalog = initialState.products || [];
	}
	clearBasket(): void {
		this.basket = [];
		this.updateBasket();
	}
	removeBasket(productId: string): void {
		const index = this.basket.indexOf(productId);
		if (index !== -1) {
			this.basket.splice(index, 1);
			this.updateBasket();
		}
	}
	addBasket(productId: string): void {
		if (!this.basket.includes(productId)) {
			this.basket.push(productId);
			this.updateBasket();
		}
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
	getBasketProducts(): ProductData[] {
		return this.catalog.filter((item) => this.basket.includes(item.id));
	}

	setOrderField(field: keyof DeliveryInfo, value: string): void {
		this.order[field] = value;
		this.validateOrder();
	}
	setCatalog(products: ProductData[]): void {
		this.catalog = products;
		this.events.emit('items:changed', { products: this.catalog });
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

	setContactField(field: keyof ContactInfo, value: string): void {
		this.order[field] = value;
		this.validateContact();
	}
	setPreview(product: ProductData): void {
		this.preview = product.id;
		this.events.emit('preview:changed', product);
	}
	isSubmitDisabled(): boolean {
		return !this.validateOrder() || !this.validateContact();
	}

	contactReset(): void {
		this.order.phone = '';
		this.order.email = '';

		this.events.emit('contact:reset', this.order);
	}
	orderReset(): void {
		this.order.address = '';
		this.order.payment = '';

		this.events.emit('order:reset', this.order);
	}
}
