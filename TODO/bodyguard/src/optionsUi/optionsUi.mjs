// @flow

import ReactDOM from 'react-dom';

import type { ComponentType } from '../libdefs';

export const BodyguardOptions: ComponentType<{}> = () => {
  return (
    <main>
      <h1 id="myHeading">{'preferences'}</h1>
      <p>{'TODO'}</p>
    </main>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<BodyguardOptions />);
