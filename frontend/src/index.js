import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import registerServiceWorker from './registerServiceWorker';

import Theme from './Theme'
import { MuiThemeProvider } from '@material-ui/core/styles';

ReactDOM.render(<MuiThemeProvider theme={ Theme }><App /></MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
