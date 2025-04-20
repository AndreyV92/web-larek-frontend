import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Component } from './base/component';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	private readonly contentContainerElement: HTMLElement;

	private readonly closeButtonElement: HTMLButtonElement;

	constructor(
		containerElement: HTMLElement,
		private readonly eventDispatcher: IEvents
	) {
		super(containerElement);

		this.contentContainerElement = ensureElement<HTMLElement>(
			'.modal__content',
			containerElement
		) as HTMLElement;
		this.closeButtonElement = ensureElement<HTMLButtonElement>(
			'.modal__close',
			containerElement
		) as HTMLButtonElement;
		this.initializeEventListeners();
	}
	private initializeEventListeners(): void {
		this.container.addEventListener('click', () => this.closeModal());
		this.contentContainerElement.addEventListener('click', (event) => {
			event.stopPropagation();
		});
		this.closeButtonElement.addEventListener('click', () => this.closeModal());
	}

	get content(): HTMLElement {
		return this.contentContainerElement;
	}
	set content(newContent: HTMLElement | null) {
		this.contentContainerElement.replaceChildren(
			newContent || document.createTextNode('')
		);
	}

	closeModal(): void {
		this.container.classList.remove('modal_active');
		document.body.classList.remove('modal-open');
		this.content = null;
		console.log('Modal closed:', this.container);
		this.eventDispatcher.emit('modal:closed');
	}
	openModal(): void {
		this.container.classList.add('modal_active');
		document.body.classList.add('modal-open');
		console.log('Modal opened:', this.container);
		this.eventDispatcher.emit('modal:opened');
	}
	//

	//
	renderModal(modalData: IModalData): HTMLElement {
		this.content = modalData.content;
		this.openModal();
		return this.container;
	}

	logModalState(): void {
		console.log(
			`Modal state - Active: ${this.container.classList.contains(
				'modal_active'
			)}`
		);
	}
}
