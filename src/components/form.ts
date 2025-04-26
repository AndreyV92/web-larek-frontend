import { IEvents } from './base/events';
import { Component } from './base/component';
import { ensureElement } from '../utils/utils';

interface IFormState<T> {
	errors: Partial<Record<keyof T, string>>;
	valid: boolean;
}

export class Form<T> extends Component<IFormState<T>> {
	protected _errors: HTMLElement;
	protected _submit: HTMLButtonElement;
	protected _inputs: Record<string, HTMLInputElement> = {};
	protected _paymentButtons: HTMLButtonElement[] = [];

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.getAllElements<HTMLInputElement>('input[name]').forEach((input) => {
			this._inputs[input.name] = input;
		});
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);

		this.addEventHandler(this.container, 'input', (e) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this._paymentButtons =
			this.getAllElements<HTMLButtonElement>('[data-payment]');
		this.addEventHandler(this.container, 'submit', (e) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});

		this._paymentButtons.forEach((button) => {
			this.addEventHandler(button, 'click', () => {
				const field = 'payment' as keyof T;
				const value = button.getAttribute('data-payment') || '';
				this.onInputChange(field, value);
			});
		});
	}

	protected onInputChange(field: keyof T, value: string): void {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
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

		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});

		this.setDisabled(this._submit, true);
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}
	set errors(errors: Partial<Record<keyof T, string>>) {
		Object.keys(errors).forEach((key) => {
			const input = this._inputs[key];
			const errorElement = input?.nextElementSibling as HTMLElement;
			if (errorElement) {
				this.setText(errorElement, errors[key as keyof T] || '');
			}
		});
		const errorMessages = Object.values(errors).filter(Boolean).join('; ');
		this.setText(this._errors, errorMessages);
	}

	render(state: Partial<T> & IFormState<T>): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });

		Object.entries(inputs).forEach(([key, value]) => {
			const input = this._inputs[key];
			if (input) input.value = value as string;
		});

		return this.container;
	}
}
