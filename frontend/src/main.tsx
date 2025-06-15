import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'

import {Provider} from 'react-redux';
import {store} from "./app/store.ts";
import {Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <Toaster position="top-right" reverseOrder={false}/>
            <App/>
        </Provider>
    </StrictMode>
)
