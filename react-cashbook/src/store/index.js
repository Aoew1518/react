import { configureStore } from '@reduxjs/toolkit';

import billStore from './modules/billStore'

const store = configureStore({
    reducer: {
        billStore,
    },
});

export default store;