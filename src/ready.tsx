import * as React from 'react';

import {readyContextType, IInjectedReadyContext} from './context';

export type Component<P> = React.StatelessComponent<P> | React.ComponentClass<P>;

export interface IReadyDataStatus<D> {
    status: 'READY';
    data: D;
}

export interface IReadyPendingStatus<D> {
    status: 'PENDING';
    done(data: D): void;
}

export type ReadyInjectedProp<D> = IReadyDataStatus<D> | IReadyPendingStatus<D>;

export interface IReadyInjectedProps<D> {
    ready: ReadyInjectedProp<D>;
}

export interface IReadyPropsOptions {
    dataKey: string;
}

function setData<D>(data: D) {
    const ready: IReadyDataStatus<D> = {
        status: 'READY',
        data
    };
    return () => ({ready});
}

export function ready <P, D> (DecoratedComponent: Component<P & IReadyInjectedProps<D>>) {
    class Ready extends React.Component<P & IReadyPropsOptions, IReadyInjectedProps<D>> {

        static contextTypes = readyContextType;

        constructor(props: P & IReadyPropsOptions, context: IInjectedReadyContext) {
            super(props, context);
            let ready: ReadyInjectedProp<D>;
            if (context.ready === undefined) {
                ready = {
                    status: 'PENDING',
                    done: (data: D) => {
                        this.setState(setData(data))
                    }
                }
            } else if (context.ready.status === 'PENDING') {
                ready = {
                    status: 'PENDING',
                    done: context.ready.register(this.props.dataKey) as (data: D) => void
                };
            } else if (context.ready.status === 'READY' || true) {
                ready = {
                    status: 'READY',
                    data: context.ready.data[this.props.dataKey] as D
                };
            }
            this.state = {ready};
        }

        render () {
            return <DecoratedComponent {...this.props as any} ready={this.state.ready}/>
        }
    }
    return Ready as React.ComponentClass<P & IReadyPropsOptions>;
};
