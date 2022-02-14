// @flow

const Form = () => (
  <form id="bodyguard-form" className="panel-section panel-section-formElements">
    <fieldset className="filter-rule">
      <legend>
        FILTER RULES{' '}
        <button className="browser-style" type="button" name="add" disabled>
          +
        </button>
      </legend>

      <div className="panel-formElements-item">
        <label
          className="browser-style label text"
          title="will manage all network requests whose URL includes string"
        >
          <span>URLS MATCHING</span>
          <input type="url" name="matching" required />
        </label>
      </div>

      <fieldset className="filter-rule">
        <legend>
          PROXY RULES{' '}
          <button className="browser-style" type="button" name="add" disabled>
            +
          </button>
        </legend>

        <small className="browser-style text">
          Each matched URL will fall through all proxy rules.{' '}
        </small>

        <div className="panel-formElements-item filter-rule-group">
          <div className="group">
            <label className="browser-style label text" title="string to find in the URL">
              <span>FIND</span>
              <input type="text" name="find" />
            </label>
          </div>

          <div className="group">
            <label className="browser-style label text" title="string to inject into the URL">
              <span>REPLACE</span>
              <input type="text" name="replace" />
            </label>
          </div>

          <div className="group flex">
            <label
              className="browser-style label checkbox"
              title="if checked: reject this request and return 404"
            >
              <input type="checkbox" name="reject" />
              <span>REJECT</span>
            </label>

            <label
              className="browser-style label checkbox"
              title="if checked: will log requests to the debug section"
            >
              <input type="checkbox" name="debug" />
              LOG
            </label>

            <label
              className="browser-style label checkbox"
              title="if checked: all rules will be active"
            >
              <input type="checkbox" name="active" />
              ACTIVE
            </label>
          </div>
        </div>
      </fieldset>

      <div className="panel-formElements-item">
        <label
          className="browser-style label checkbox"
          title="If checked filter rules apply to all open tabs"
          disabled
        >
          <input type="checkbox" name="is-global" disabled checked />
          Global Filter Rule?
        </label>
      </div>
      <div className="panel-formElements-item">
        <button className="browser-style" type="button" name="del" disabled>
          DELETE
        </button>
      </div>
    </fieldset>
  </form>
);

export default Form;
