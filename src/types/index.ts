export interface AppState {
	basket: ProductData[];
	order: OrderPayload;
	orderResponse: OrderResponse | null;
	preview: string | null;
	products: ProductData[];
}
export type ApiResponseList<Type> = {
	total: number;
	items: Type[];
};
export interface BasketState {
	items: HTMLElement[];
	price: number;
	selected: string[];
}
export interface DeliveryInfo {
	payment: string;
	address: string;
}
export interface ContactInfo {
	phone: string;
	email: string;
}

export interface ProductData {
	id: string;
	price: number | null;
	description: string;
	image: string;
	title: string;
	category: string;
}

export interface OrderPayload extends DeliveryInfo, ContactInfo {
	total: number;
	items: string[];
}

export interface SuccessResponse {
	total: number;
}
export type OrderFormErrors = Partial<
	Omit<Record<keyof OrderPayload, string>, 'items'>
>;
export interface OrderResponse {
	id: string;
	total: number;
}

export interface CardEventHandlers {
	onClick?: (event: MouseEvent) => void;
	onAddToBasket?: (item: ProductData) => void;
	onRemoveFromBasket?: (item: ProductData) => void;
}
