import {
	ApiResponseList as ProductListResponse,
	ProductData as ProductData,
	OrderResponse as OrderResponse,
	OrderPayload as OrderPayload,
} from '../types';
import { Api as BaseApi } from './base/api';

export interface AppApiInterface {
	fetchProductList: () => Promise<ProductData[]>;

	processOrderSubmission: (payload: OrderPayload) => Promise<OrderResponse>;
}

export class AppApi extends BaseApi implements AppApiInterface {
	readonly contentDeliveryUrl: string;

	constructor(
		contentDeliveryUrl: string,
		apiBaseUrl: string,
		config?: RequestInit
	) {
		super(apiBaseUrl, config);
		this.contentDeliveryUrl = contentDeliveryUrl;
	}

	fetchProductList(): Promise<ProductData[]> {
		return this.get('/product').then((data: ProductListResponse<ProductData>) =>
			data.items.map((item) => ({
				...item,
				image: `${this.contentDeliveryUrl}${item.image}`,
			}))
		);
	}
	processOrderSubmission(payload: OrderPayload): Promise<OrderResponse> {
		return this.post('/order', payload).then(
			(response: OrderResponse) => response
		);
	}
}
