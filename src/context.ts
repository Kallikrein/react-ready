import { string, shape, func, object, oneOfType, Requireable } from 'prop-types';

export interface IReadyContextReadyStatus {
    status: 'READY'
    data: {
        [key: string]: any;
    };
}

export interface IReadyContextPendingStatus {
    status: 'PENDING'
    register: (key: string) => (data: any) => void
}

export type ReadyContext = IReadyContextReadyStatus | IReadyContextPendingStatus

export interface IInjectedReadyContext {
    ready?: ReadyContext;
};

export interface IReadyPropTypeContext {
    ready: Requireable<any>;
}

export const readyContextType: IReadyPropTypeContext = {
    ready: oneOfType([
        shape({
            status: string,
            data: object
        }),
        shape({
            status: string,
            register: func
        })
    ])
};
