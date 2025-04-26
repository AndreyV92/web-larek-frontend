import { ensureElement } from './../utils/utils';

import { SuccessResponse } from '../types';

import { Component } from './base/component';

interface SuccessResponseActions {
	onSuccessClick?: () => void;
}

export class Success extends Component<SuccessResponse> {
	private readonly closeButton: HTMLButtonElement;

	private readonly totalDisplay: HTMLElement;

	constructor(
		containerElement: HTMLElement,
		private readonly actions?: SuccessResponseActions
	) {
		super(containerElement);

		this.totalDisplay = ensureElement<HTMLElement>(
			'.order-success__description',
			containerElement
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			containerElement
		);
		this.closeButton.addEventListener('click', () => {
			this.actions?.onSuccessClick?.();
		});
	}

	set totalAmount(total: number) {
		this.setText(this.totalDisplay, `Списано ${total} синапсов`);
	}

	render(responseData: SuccessResponse): HTMLElement {
		this.totalAmount = responseData.total;
		return this.container;
	}
}
