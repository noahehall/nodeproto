const Actions = ({ onClick }) => (
  <footer id="actions" className="panel-section panel-section-footer" onClick={onClick}>
    <button type="button" id="save" type="button">Save</button>
    <button type="button" id="reset" type="button">Undo</button>
    <button type="button" id="clear" type="button">Trash</button>
  </footer>
);

export default Actions;
