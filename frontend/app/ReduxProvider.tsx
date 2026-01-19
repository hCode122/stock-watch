'use client'

import { store } from "./state/store";
import { Provider } from "react-redux";

export const ReduxProvider = ({
    children
}: {children: React.ReactNode}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}