let myWindowId;

const buttonReset = document.getElementById('reset');
const buttonSave = document.getElementById('save');
const formActions = document.getElementById('actions');
const formBodyguard = document.getElementById('bodyguard-form');

const resetContent = () => {
  console.info('\n\n resetting content');

  try {
    const formFields = formBodyguard.elements;
    if (!formFields) return console.info('\n\n error retrieving formFields');;

    let tabUrl;

    browser.tabs.query({windowId: myWindowId, active: true})
      .then((tabs) => {
        tabUrl = tabs[0].url;

        return browser.storage.local.get(tabs[0].url)
      })
      .then((data) => {
        console.info('\n\n data', tabUrl,  typeof data[tabUrl])
        if (typeof data[tabUrl] !== 'string') return console.info('saved data[url] not a string')
        const filterRules = JSON.parse(data[tabUrl]);

        if (!filterRules) return console.info('\n\n error retrieving filter rules');

        console.info('\n\n got saved bodyguardRules', filterRules);

        Object.entries(filterRules).forEach(([name, value]) => {
          console.info('injecting previous values', name, value);

          if (formFields[name].type === 'checkbox') formFields[name].checked = value;
          else formFields[name].value = value;
        })
      })
  } catch (e) {
    console.info('\n\n error reseting content', e)
  }
}

formActions.addEventListener('click', e => {
  const formAction = e.target.id;
  if (!formAction) return console.info('\n\n error retrieving formAction');

  const formFields = formBodyguard.elements;

  browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
    switch (formAction) {
      case 'save': {
        const bodyGuardRules = {};
        [].forEach.call(formFields, field => {

          if (field.name && ['checkbox', 'text'].includes(field.type)) bodyGuardRules[field.name] = field.type === 'checkbox'
            ? field.checked
            : field.value;
        });

        browser.storage.local.set({ [tabs[0].url]: JSON.stringify(bodyGuardRules) });

        break;
      }
      case 'reset': {
        resetContent();

        break;
      }
    }

  });
})

// populate bodyGuard rules when sidebar loads
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
  resetContent();
});
