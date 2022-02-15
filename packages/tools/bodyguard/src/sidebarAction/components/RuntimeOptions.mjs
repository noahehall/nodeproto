// @flow

import { Form } from './Form';

import type { ComponentType } from '../../libdefs';

export const RuntimeOptions: ComponentType<{}> = () => (
  <article className="panel-section panel-section-list">
    <h2 className="panel-section-header">{'runtime options'}</h2>
    <Form />
  </article>
);
