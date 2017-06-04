import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { When } from './Provider';

export interface IWhenReadyCallback {
    (mounted: React.ReactElement<any>): any;
}

export const whenReady = (element: React.ReactElement<any>, callback: IWhenReadyCallback) => {
    renderToString(
        <When status="PENDING" onReady={(data: any) => {
            callback(
                <When status="READY" data={data}>
                    {element}
                </When>
            );
        }}>
            {element}
        </When>
    );
};