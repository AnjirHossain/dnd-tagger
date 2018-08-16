import React from 'react';
import ReactDOM from 'react-dom';
import './views/styles/index.css';
import App from './views/containers/App';
import registerServiceWorker from './views/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
