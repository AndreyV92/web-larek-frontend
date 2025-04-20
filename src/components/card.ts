import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';

import { ProductData } from '../types';
import { Component } from './base/component';

interface ICardEventHandlers {
	onRemoveFromBasket?: (item: ProductData) => void;
	onAddToBasket?: (item: ProductData) => void;
	onClick?: (event: MouseEvent) => void;
}

interface ICard extends ProductData {
	identifierCard?: string;
}

export class Card extends Component<ICard> {
	private _productItem: ProductData;
	private _isAddedToBasket: boolean;
	private _identifierCard?: HTMLElement;

	private _categoryElement?: HTMLElement;
	private _priceElement: HTMLElement;
	private _descriptionElement?: HTMLElement;
	private _imageElement?: HTMLImageElement;
	private _titleElement: HTMLElement;
	private _buttonElement?: HTMLButtonElement;

	constructor(
		containerElement: HTMLElement,
		product: ProductData,
		actionHandlers: ICardEventHandlers
	) {
		super(containerElement);
		this._isAddedToBasket = false;
		this._productItem = product;

		this._imageElement = containerElement.querySelector('.card__image');
		this._titleElement = ensureElement<HTMLElement>(
			'.card__title',
			containerElement
		);
		this._identifierCard = containerElement.querySelector(
			'.basket__item-index'
		);
		this._descriptionElement = containerElement.querySelector('.card__text');

		this._categoryElement = containerElement.querySelector('.card__category');
		this._priceElement = ensureElement<HTMLElement>(
			'.card__price',
			containerElement
		);
		this._buttonElement =
			containerElement.querySelector<HTMLButtonElement>('.card__button');

		this._initializeEventHandlers(actionHandlers);
		this._renderProduct(product);
	}

	private _handleBasketToggle(actions: ICardEventHandlers): void {
		if (this._isAddedToBasket) {
			actions.onRemoveFromBasket?.(this._productItem);
		} else {
			actions.onAddToBasket?.(this._productItem);
		}
		this.updateButtonState(!this._isAddedToBasket);
	}

	private _renderProduct(product: ProductData): void {
		this.cardId = product.id;
		this.cardTitle = product.title;
		this.cardImage = product.image;
		this.cardDescription = product.description;
		this.cardCategory = product.category;
		this.cardPrice = product.price || 0;
	}

	public updateButtonState(isInBasket: boolean): void {
		this._isAddedToBasket = isInBasket;
		if (this._buttonElement) {
			this.setText(
				this._buttonElement,
				isInBasket ? 'Удалить из корзины' : 'Купить'
			);
		}
	}
	private _initializeEventHandlers(actions: ICardEventHandlers): void {
		if (actions.onClick) {
			this.addEventHandler(this.container, 'click', actions.onClick);
		}
		if (this._buttonElement) {
			this.addEventHandler(this._buttonElement, 'click', (event) => {
				event.stopPropagation();
				this._handleBasketToggle(actions);
			});
		}
	}
	private _disableButtonForFreeItems(price: number): void {
		if (!price && this._buttonElement) {
			this.setDisabled(this._buttonElement, true);
		} else if (this._buttonElement) {
			this.setDisabled(this._buttonElement, false);
		}
	}

	set cardImage(value: string) {
		this.setImage(this._imageElement, value, this.cardTitle);
	}

	set cardTitle(value: string) {
		this.setText(this._titleElement, value);
	}
	get cardId(): string {
		return this.container.dataset.id || '';
	}
	set cardCategory(value: string) {
		if (this._categoryElement) {
			this.setText(this._categoryElement, value);
			this.toggleClass(this._categoryElement, settings[value] || '', true);
		}
	}
	set cardId(value: string) {
		this.setAttribute(this.container, 'data-id', value);
	}

	set cardDescription(value: string) {
		this.setText(this._descriptionElement, value);
	}

	set cardPrice(value: number) {
		this.setText(this._priceElement, value ? `${value} синапсов` : 'Бесценно');
		this._disableButtonForFreeItems(value);
	}

	getContainer(): HTMLElement {
		return this.container;
	}
}
