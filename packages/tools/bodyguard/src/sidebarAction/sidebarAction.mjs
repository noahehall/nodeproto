// @flow

import { css, Global } from '@emotion/react';
import { useEffect, useState } from 'react';
import { logIt } from '@nodeproto/shared';

import ReactDOM from 'react-dom';

import {
  getBrowserLocalStorage,
  getBrowserTabs,
  getBrowserWindow,
  getOnMessage,
  handleInternalMsg,
  setBrowserLocalStorage,
  stripUrl,
} from '../shared/utils';

import Actions from './components/Actions';
import Debug from './components/Debug';
import globalStyles from './globalStyles';
import Header from './components/Header';
import RuntimeOptions from './components/RuntimeOptions';

import type { ComponentType } from '../libdefs';

let myWindowId: string = '';

const onMessage = getOnMessage();
const storage = getBrowserLocalStorage();

export const SidebarAction: ComponentType<any> = () => {
  const [{ debugElement, formActions, formBodyguard }, setElements] = useState({});

  useEffect(() => {
    if (!debugElement || !formActions || !formBodyguard) {
      setElements({
        debugElement: document.getElementById('bodyguard-debug'),
        formActions: document.getElementById('actions'),
        formBodyguard: document.getElementById('bodyguard-form'),
      });
    }
  }, [debugElement, formActions, formBodyguard, setElements]);

  useEffect(() => {
    if (!debugElement || !formActions || !formBodyguard) return void 0;

    (async () => {
      // populate Bodyguard rules when sidebar loads
      const windowInfo = await getBrowserWindow();
      myWindowId = windowInfo.id;

      resetContent();
      addMsgListener();
    })();
  }, [addMsgListener, debugElement, formActions, formBodyguard, resetContent]);

  const msgListener = (data = {}, sender) => {
    switch (data.type) {
      case 'DEBUG':
      case 'SIDEBAR': {
        handleInternalMsg(data, debugElement);

        return Promise.resolve('done');
      }
      default:
        return false;
    }
  };

  const addMsgListener = () => {
    debugElement.textContent = '';
    onMessage.removeListener(msgListener);
    onMessage.addListener(msgListener);
  };

  const resetContent = () => {
    const formFields = formBodyguard.elements;

    if (!formFields) return console.error('\n\n error retrieving formFields');

    getBrowserTabs().then((tabs) => {
      const url = stripUrl(tabs[0].url);

      getBrowserLocalStorage().then((data) => {
        console.info('\n\n reset url', url);

        const bodyguardRules = data.global;

        if (typeof bodyguardRules === 'undefined')
          return console.info('TODO: setup global + activate tab rules', bodyguardRules, url);

        Object.entries(bodyguardRules).forEach(([name, value]) => {
          if (formFields[name].type === 'checkbox') formFields[name].checked = value;
          else formFields[name].value = value;
        });
      });
    });
  };

  const actionsOnClick = (e) => {
    console.info('\n\n formactions click', e.target.id);

    const formAction = e.target.id;
    if (!formAction) return console.error('\n\n error retrieving formAction');

    getBrowserTabs().then((tabs) => {
      console.info('\n\n tabs', tabs);
      const formFields = formBodyguard.elements;

      switch (formAction) {
        case 'save': {
          const bodyguardRules = {};
          [].forEach.call(formFields, (field) => {
            if (field.name && ['checkbox', 'text', 'url'].includes(field.type))
              bodyguardRules[field.name] = field.type === 'checkbox' ? field.checked : field.value;
          });

          setBrowserLocalStorage({
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
          setBrowserLocalStorage({ [stripUrl(tabs[0].url)]: {} });
          [].forEach.call(formFields, (field) => {
            // force setting true until we have type to develop per tab settings
            if (field.name === 'is-global') field.value = true;
            else if (field.value) field.value = '';
            else if (field.checked) field.checked = false;
          });

          break;
        }
        default:
          console.error('\n\n unknown formAction', e.target.id);
      }
    });
  };

  return (
    <>
      <Global styles={globalStyles} />
      <Header />
      <main className="panel-section panel-section-list">
        <p className="browser-style panel-list-item">
          configure & debug UI applications network requests with @nodeproto/bodyguard
        </p>

        <RuntimeOptions />
        <Debug />
        <Actions onClick={actionsOnClick} />
      </main>
    </>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SidebarAction />);
