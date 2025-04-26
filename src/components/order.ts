import { OrderPayload, ContactInfo } from '../types';

import { IEvents } from './base/events';

import { Form } from './form';

import { ensureAllElements, ensureElement } from '../utils/utils';

export class Order extends Form<OrderPayload> {
	private _addressInput: HTMLInputElement;

	private _payment: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);
		this._payment = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.container
		);

		this._payment.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
			});
		});
		this._payment.forEach((button) => {
			button.addEventListener('click', () => {
				const paymentMethod = button.name;
				this.payment = paymentMethod;
				this.events.emit('order.payment:change', {
					field: 'payment',
					value: paymentMethod,
				});
			});
		});
	}

	public reset(): void {
		Object.values(this._inputs).forEach((input) => {
			input.value = '';
		});

		this.setText(this._errors, '');
		Object.keys(this._inputs).forEach((key) => {
			const errorElement = this._inputs[key]?.nextElementSibling as HTMLElement;
			if (errorElement) {
				this.setText(errorElement, '');
			}
		});
		this.setDisabled(this._submit, true);

		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});
	}
	set payment(name: string) {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
}

export class Contact extends Form<ContactInfo> {
	private _emailInput: HTMLInputElement;

	private _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
	set phone(value: string) {
		this._phoneInput.value = value;
	}
	set email(value: string) {
		this._emailInput.value = value;
	}
}
