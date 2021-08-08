// @flow

import ReactDOM from 'react-dom';

const containerID: string = 'root';
const helloWorld: string = 'yolo wurl';
const container = document.getElementById(containerID);
const root = ReactDOM.createRoot(container);
root.render(<h1>{helloWorld}</h1>);
