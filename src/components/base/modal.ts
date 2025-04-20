import { IEvents } from './events';

// model!
export const isModel = <T>(obj: unknown): obj is Model<T> => {
	return obj instanceof Model;
};

export abstract class Model<T> {
	protected state: Partial<T>;

	constructor(data: Partial<T>, protected events: IEvents) {
		this.state = { ...data };
	}
	setState(updates: Partial<T>, event?: string): void {
		this.state = { ...this.state, ...updates };
		if (event) {
			this.emitChanges(event, updates);
		}
	}
	getState(): Partial<T> {
		return { ...this.state };
	}
	protected emitChanges(event: string, payload: Partial<T> = {}): void {
		this.events.emit(event, payload);
	}
}
