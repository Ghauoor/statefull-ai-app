import React from 'react';

import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';

import MetaAI from './src/MetaAI';
import {persistor, store} from './src/redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MetaAI />
      </PersistGate>
    </Provider>
  );
};

export default App;
