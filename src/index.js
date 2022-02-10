import React from "react";
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux';
import {createBrowserHistory} from "history";

// source
import './css/index.css';
import App from './shared/App';
import store from './redux/configureStore';

let history = createBrowserHistory()
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
        <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
export {history}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
