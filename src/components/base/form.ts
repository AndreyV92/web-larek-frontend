import { ensureElement } from '../../utils/utils';
import { Component } from './component';
import { IEvents } from './events';

interface IFormState<T> {
	errors: Partial<Record<keyof T, string>>;

	valid: boolean;
}

export class Form<T> extends Component<IFormState<T>> {
	protected _errors: HTMLElement;
	protected _submit: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});

		this.container
			.querySelectorAll<HTMLButtonElement>('[data-payment]')
			.forEach((button) => {
				button.addEventListener('click', () => {
					const field = 'payment' as keyof T;
					const value = button.getAttribute('data-payment') || '';
					this.onInputChange(field, value);
				});
			});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}
	protected onInputChange(field: keyof T, value: string): void {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}
	set errors(errors: Partial<Record<keyof T, string>>) {
		Object.keys(errors).forEach((key) => {
			const input = this.container.querySelector<HTMLInputElement>(
				`[name="${key}"]`
			);
			const errorElement = input?.nextElementSibling as HTMLElement;
			if (errorElement) {
				errorElement.textContent = errors[key as keyof T] || '';
			}
		});
		const errorMessages = Object.values(errors).filter(Boolean).join('; ');
		this.setText(this._errors, errorMessages);
	}

	render(state: Partial<T> & IFormState<T>): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });

		Object.entries(inputs).forEach(([key, value]) => {
			const input = this.container.querySelector<HTMLInputElement>(
				`[name="${key}"]`
			);
			if (input) input.value = value as string;
		});

		return this.container;
	}
}
