import * as React from 'react';
import { readyContextType, ReadyContext, IReadyPropTypeContext, IInjectedReadyContext } from './context';

export interface IData {
    [key: string]: any;
}

export interface IWhenPropsPendingStatus {
    status: 'PENDING';
    onReady(data: IData): void;
}

export interface IWhenPropsReadyStatus {
    status: 'READY';
    data: IData;
}

export type WhenProps = IWhenPropsPendingStatus | IWhenPropsReadyStatus;

export class When extends React.Component<WhenProps, {}> {
    
    static childContextTypes: IReadyPropTypeContext = readyContextType;

    private _callbacks = 0;
    private _data: IData = {};
    private _register = (key: string) => {
        const {onReady} = this.props as IWhenPropsPendingStatus;
        const self = this;
        self._callbacks++;
        return (data: any) => {
            setTimeout(() => {
                self._callbacks--;
                self._data[key] = data;
                if (self._callbacks === 0) {
                    onReady(self._data);
                }
            }, 0);
        };
    }

    public getChildContext(): IInjectedReadyContext | undefined {
        const ready: ReadyContext | null =
        this.props.status === 'PENDING' ? {
            status: 'PENDING',
            register: this._register
        } :
        this.props.status === 'READY' ? {
            status: 'READY',
            data: this.props.data
        } : null;
        if (ready === null) {
            console.warn('Missing explicit status prop, other props will be ignored and the Provider will be a no op.')
            return;
        }
        return {ready};
    }
    render() {
        return React.Children.only(this.props.children);
    }
}
