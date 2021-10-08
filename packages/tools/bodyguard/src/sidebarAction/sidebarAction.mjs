import React from 'react';
import ReactDOM from 'react-dom';
import 'webextension-polyfill';

let myWindowId;

let debugElement, formActions, formBodyguard;

export default function SidebarAction () {
  const stripUrl = url => url.split('?')[0]

  React.useEffect(() => {
    if (!debugElement || !formActions || !formBodyguard) {
      debugElement = document.getElementById('bodyguard-debug');
      formActions = document.getElementById('actions');
      formBodyguard = document.getElementById('bodyguard-form');
    }
  },[debugElement, formActions, formBodyguard]);

  const handleInternalMsg = ({ type, message } = {}) => {
    if (type === 'DEBUG')
      debugElement.textContent = debugElement.textContent += '\r\n\r\n' + message.join('\r\n↑↓\r\n')
  }

  const msgListener = (data = {}, sender) => {
    switch (data.type) {
      case 'DEBUG':
      case 'SIDEBAR': {
        handleInternalMsg(data);

        return Promise.resolve('done');
      }
      default: return false;
    }
  }

  const addMsgListener = () => {
    debugElement.textContent = '';
    browser.runtime.onMessage.removeListener(msgListener);
    browser.runtime.onMessage.addListener(msgListener);
  }

  const resetContent = () => {
    const formFields = formBodyguard.elements;

    if (!formFields) return console.error('\n\n error retrieving formFields');

    browser.tabs.query({ windowId: myWindowId, active: true })
      // get tab url
      .then(tabs => stripUrl(tabs[0].url))
      // get data from storage
      .then(url => browser.storage.local.get().then(data => {
        const bodyguardRules = data.global;

        if (typeof bodyguardRules === 'undefined') return console.info('TODO: setup global + activate tab rules', bodyguardRules, url)

        Object.entries(bodyguardRules).forEach(([name, value]) => {
          if (formFields[name].type === 'checkbox') formFields[name].checked = value;
          else formFields[name].value = value;
        })
      }))
  }

  React.useEffect(() => {
    if (!debugElement || !formActions || !formBodyguard) return void 0;

    // populate bodyGuard rules when sidebar loads
    browser.windows.getCurrent({populate: true}).then((windowInfo) => {
      myWindowId = windowInfo.id;

      resetContent();
      addMsgListener();
    });

    formActions.addEventListener('click', e => {
    const formAction = e.target.id;
    if (!formAction) return console.error('\n\n error retrieving formAction');

    browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
      const formFields = formBodyguard.elements;

      switch (formAction) {
        case 'save': {
          const bodyguardRules = {};
          [].forEach.call(formFields, field => {
            if (
              field.name
              && ['checkbox', 'text', 'url'].includes(field.type)
            ) bodyguardRules[field.name] = field.type === 'checkbox'
              ? field.checked
              : field.value;
          });

          browser.storage.local.set({
            global: bodyguardRules,
            activateTab: [stripUrl(tabs[0].url)],
          });

          addMsgListener();

          break;
        }
        case 'reset': {
          resetContent();

          break;
        }
        case 'clear': {
          browser.storage.local.set({ [stripUrl(tabs[0].url)]: {} });
          [].forEach.call(formFields, field => {
            // force setting true until we have type to develop per tab settings
            if (field.name === 'is-global') field.value = true;
            else if (field.value) field.value = '';
            else if (field.checked) field.checked = false;
          });
        }
      }

    });
  });
  }, [
    debugElement,
    formActions,
    formBodyguard,
    resetContent,
    addMsgListener,
  ])


  return (
    <>
      <header className="panel-section panel-section-header">
        <h1 className="text-section-header">SETUP</h1>
      </header>
      <main className="panel-section panel-section-list">
        <p className="browser-style panel-list-item">
          configure & debug UI applications network requests with @nodeproto/bodyguard
        </p>
        <article className="panel-section panel-section-list">
          <h2 className="panel-section-header">runtime options</h2>
          <form id="bodyguard-form" className="panel-section panel-section-formElements">
            <fieldset className="filter-rule">
              <legend>FILTER RULES <button className="browser-style" type="button" name="add" disabled>+</button></legend>

              <div className="panel-formElements-item">
                <label className="browser-style label text" title="will manage all network requests whose URL includes string">
                  <span>URLS MATCHING</span>
                  <input type="url" name="matching"  required />
                </label>
              </div>

              <fieldset className="filter-rule">
                <legend>PROXY RULES <button className="browser-style" type="button" name="add" disabled>+</button></legend>

                <small className="browser-style text">Each matched URL will fall through all proxy rules. </small>

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
                    <label className="browser-style label checkbox" title="if checked: reject this request and return 404">
                      <input type="checkbox" name="reject" />
                      <span>REJECT</span>
                    </label>

                    <label className="browser-style label checkbox" title="if checked: will log requests to the debug section">
                      <input type="checkbox" name="debug" />
                      LOG
                    </label>

                    <label className="browser-style label checkbox" title="if checked: all rules will be active">
                      <input type="checkbox" name="active" />
                      ACTIVE
                    </label>
                  </div>
                </div>
              </fieldset>

              <div className="panel-formElements-item">
                <label className="browser-style label checkbox" title="If checked filter rules apply to all open tabs" disabled>
                  <input type="checkbox" name="is-global" disabled checked />
                  Global Filter Rule?
                </label>
              </div>
              <div className="panel-formElements-item">
                <button className="browser-style" type="button" name="del" disabled>DELETE</button>
              </div>
            </fieldset>
          </form>
        </article>

        <aside className="panel-section-list">
          <h2 className="panel-section-header">debug</h2>
          <p className="panel-list-item">check LOG on any filter rule to view the matching requests</p>
          <code className="panel-list-item log" id="bodyguard-debug"></code>
        </aside>

        <footer id="actions" className="panel-section panel-section-footer">
          <button type="button" id="save" type="button">Save</button>
          <button type="button" id="reset" type="button">Undo</button>
          <button type="button" id="clear" type="button">Trash</button>
        </footer>
      </main>
    </>
  );
}

const containerID = 'root';
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SidebarAction />);
