'use strict';

let myWindowId;
const stripUrl = url => url.split('?')[0]

const formActions = document.getElementById('actions');
const formBodyguard = document.getElementById('bodyguard-form');

const resetContent = () => {
  const formFields = formBodyguard.elements;

  if (!formFields) return console.error('\n\n error retrieving formFields');;

  browser.tabs.query({ windowId: myWindowId, active: true })
    // get tab url
    .then(tabs => stripUrl(tabs[0].url))
    // get data from storage
    .then(url => browser.storage.local.get().then(data => {
      const bodyguardRules = data[url];

      if (typeof bodyguardRules === 'undefined') return console.info('bodyguardRules for this URL is undefined, TODO: setup global rules', bodyguardRules, url)

      Object.entries(bodyguardRules).forEach(([name, value]) => {
        if (formFields[name].type === 'checkbox') formFields[name].checked = value;
        else formFields[name].value = value;
      })
    }))
}

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

        browser.storage.local.set({ [stripUrl(tabs[0].url)]: bodyguardRules });

        break;
      }
      case 'reset': {
        resetContent();

        break;
      }
      case 'clear': {
        browser.storage.local.set({ [stripUrl(tabs[0].url)]: {} });
        [].forEach.call(formFields, field => {
          if (field.value) field.value = '';
          else if (field.checked) field.checked = false;
        });
      }
    }

  });
})

// populate bodyGuard rules when sidebar loads
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
  resetContent();
});
