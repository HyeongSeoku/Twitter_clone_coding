import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import "./styles.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") //'root' 로 돼있으면 css 오류남 "root"로 변경
);

