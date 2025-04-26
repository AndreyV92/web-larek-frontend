import { Component } from './base/component';
import { ensureElement } from '../utils/utils';

import { IEvents } from './base/events';

interface IPage {
	catalog: HTMLElement[];

	counter: number;

	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _catalogElement: HTMLElement;
	protected _pageWrapper: HTMLElement;

	protected _basketElement: HTMLElement;
	protected _counterElement: HTMLElement;

	constructor(container: HTMLElement, protected eventHandlers: IEvents) {
		super(container);

		this._counterElement = ensureElement<HTMLElement>(
			'.header__basket-counter'
		);
		this._basketElement = ensureElement<HTMLElement>('.header__basket');

		this._catalogElement = ensureElement<HTMLElement>('.gallery');
		this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');

		this._basketElement.addEventListener('click', () => {
			this.eventHandlers.emit('basket:open');
		});
	}

	set catalog(items: HTMLElement[]) {
		this._catalogElement.replaceChildren(...items);
	}
	set locked(isLocked: boolean) {
		this.toggleClass(this._pageWrapper, 'page__wrapper_locked', isLocked);
	}

	public logElementInfo(element: HTMLElement): void {
		console.log(
			`Element Info - Tag: ${element.tagName}, Classes: ${Array.from(
				element.classList
			).join(', ')}`
		);
	}
	set counter(value: number) {
		this.setText(this._counterElement, value.toString());
	}
}
