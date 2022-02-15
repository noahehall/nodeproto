// @flow

import type { ComponentType } from '../../libdefs';

export const Actions: ComponentType<{
  onClick: Function,
}> = ({ onClick }) => (
  <footer id="actions" className="panel-section panel-section-footer" onClick={onClick}>
    <button type="button" id="save">
      {'Save'}
    </button>
    <button type="button" id="reset">
      {'Undo'}
    </button>
    <button type="button" id="clear">
      {'Trash'}
    </button>
  </footer>
);
