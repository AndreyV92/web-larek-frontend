export interface BasketState {
	items: HTMLElement[];
	price: number;
	selected: string[];
}
export type ApiResponseList<Type> = {
	total: number;
	items: Type[];
};

export interface ProductData {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
export interface AppState {
	products: ProductData[];
	basket: ProductData[];
	order: OrderPayload;
	orderResponse: OrderResponse | null;
	preview: string | null;
}

export interface ContactInfo {
	phone: string;
	email: string;
}
export interface DeliveryInfo {
	address: string;
	payment: string;
}

export interface OrderResponse {
	id: string;
	total: number;
}
export interface OrderPayload extends DeliveryInfo, ContactInfo {
	total: number;
	items: string[];
}

export type OrderFormErrors = Partial<
	Omit<Record<keyof OrderPayload, string>, 'items'>
>;

export interface SuccessResponse {
	total: number;
}

export interface CardEventHandlers {
	onAddToBasket?: (item: ProductData) => void;
	onRemoveFromBasket?: (item: ProductData) => void;
	onClick?: (event: MouseEvent) => void;
}
