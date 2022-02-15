// @flow

// dude I need to refactor this file

import { css, Global } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
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

import type { ComponentType, InternalMsgType } from '../libdefs';

let myWindowId: string = '';

const onMessage = getOnMessage();
const storage = getBrowserLocalStorage();

export const addMsgListener = (el: HTMLElement, listener: Function): void => {
  el.textContent = '';
  onMessage.removeListener(listener);
  onMessage.addListener(listener);
};

export const SidebarAction: ComponentType<any> = () => {
  const [{ debugElement, formActions, formBodyguard }, setElements] = useState({});

  const msgListener = useCallback(
    // TODO: i think sender === debugElement
    (data: InternalMsgType, sender) => {
      switch (data.type) {
        case 'DEBUG':
        case 'SIDEBAR': {
          if (debugElement) handleInternalMsg(data, debugElement);

          return Promise.resolve('done');
        }
        default:
          return false;
      }
    },
    [debugElement]
  );

  const resetContent = useCallback(async () => {
    // $FlowFixMe[incompatible-use] .elements missing in HTMLFormElement
    // $FlowFixMe[prop-missing] .elements missing in HTMLFormElement
    const formFields = formBodyguard.elements;

    if (!formFields) return console.error('\n\n error retrieving formFields');

    const tabs = await getBrowserTabs();

    const url = stripUrl(tabs[0].url);

    const data = await getBrowserLocalStorage();

    const bodyguardRules = data.global;

    if (typeof bodyguardRules === 'undefined')
      return console.info('TODO: setup global + activate tab rules', bodyguardRules, url);

    Object.entries(bodyguardRules).forEach(([name, value]) => {
      // $FlowFixMe[prop-missing] .type & .checked missing in HTMLElement
      if (formFields[name].type === 'checkbox') formFields[name].checked = value;
      // $FlowFixMe[prop-missing] .value missing in HTMLElement
      else formFields[name].value = value;
    });
  }, [formBodyguard]);

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
      addMsgListener(debugElement, msgListener);
    })();
  }, [debugElement, formActions, formBodyguard, resetContent, msgListener]);

  const actionsOnClick = async (e) => {
    const formAction = e.target.id;
    if (!formAction) return console.error('\n\n error retrieving formAction');

    const tabs = await getBrowserTabs();

    // $FlowFixMe[prop-missing] .elements missing
    // $FlowFixMe[incompatible-use] .elements missing
    const formFields: HTMLCollection<HTMLElement> = formBodyguard.elements;

    switch (formAction) {
      case 'save': {
        const bodyguardRules = {};
        // $FlowFixMe[method-unbinding] doesnt like [].forEach, investigate this
        [].forEach.call(formFields, (field) => {
          if (field.name && ['checkbox', 'text', 'url'].includes(field.type))
            bodyguardRules[field.name] = field.type === 'checkbox' ? field.checked : field.value;
        });

        setBrowserLocalStorage({
          global: bodyguardRules,
          activateTab: [stripUrl(tabs[0].url)],
        });

        if (debugElement) addMsgListener(debugElement, msgListener);

        break;
      }
      case 'reset': {
        resetContent();

        break;
      }
      case 'clear': {
        setBrowserLocalStorage({ [stripUrl(tabs[0].url)]: {} });
        // $FlowFixMe[method-unbinding] doesnt like [].forEach, investigate this
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
  };

  return (
    <>
      <Global styles={globalStyles} />
      <Header />
      <main className="panel-section panel-section-list">
        <p className="browser-style panel-list-item">
          {'configure & debug UI applications network requests with @nodeproto/bodyguard'}
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
