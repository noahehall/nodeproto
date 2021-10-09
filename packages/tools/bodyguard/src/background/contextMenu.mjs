// Put all the javascript code here, that you want to execute in background.
// TODO: fix all this shit

console.info('\n\n @nodeproto/bodyguard.contextMenu.mjs');

// copypasta
// ^ @see https://github.com/mdn/webextensions-examples/blob/master/menu-demo/background.js
// ^^ error related
// function onCreated() {
//   if (browser.runtime.lastError) {
//     console.log(`Error: ${browser.runtime.lastError}`);
//   } else {
//     console.log("Item created successfully");
//   }
// }
// function onRemoved() {
//   console.log("Item removed successfully");
// }
// function onError(error) {
//   console.log(`Error: ${error}`);
// }
// // ^^ menu creation
// browser.menus.create({
//   id: "log-selection",
//   title: browser.i18n.getMessage("menuItemSelectionLogger"),
//   contexts: ["selection"]
// }, onCreated);
// browser.menus.create({
//   id: "remove-me",
//   title: browser.i18n.getMessage("menuItemRemoveMe"),
//   contexts: ["all"]
// }, onCreated);
// browser.menus.create({
//   id: "separator-1",
//   type: "separator",
//   contexts: ["all"]
// }, onCreated);
// browser.menus.create({
//   id: "greenify",
//   type: "radio",
//   title: browser.i18n.getMessage("menuItemGreenify"),
//   contexts: ["all"],
//   checked: true,
//   icons: {
//     "16": "icons/paint-green-16.png",
//     "32": "icons/paint-green-32.png"
//   }
// }, onCreated);
// browser.menus.create({
//   id: "bluify",
//   type: "radio",
//   title: browser.i18n.getMessage("menuItemBluify"),
//   contexts: ["all"],
//   checked: false,
//   icons: {
//     "16": "icons/paint-blue-16.png",
//     "32": "icons/paint-blue-32.png"
//   }
// }, onCreated);
// browser.menus.create({
//   id: "separator-2",
//   type: "separator",
//   contexts: ["all"]
// }, onCreated);
// var checkedState = true;
// browser.menus.create({
//   id: "check-uncheck",
//   type: "checkbox",
//   title: browser.i18n.getMessage("menuItemUncheckMe"),
//   contexts: ["all"],
//   checked: checkedState
// }, onCreated);
// browser.menus.create({
//   id: "open-sidebar",
//   title: browser.i18n.getMessage("menuItemOpenSidebar"),
//   contexts: ["all"],
//   command: "_execute_sidebar_action"
// }, onCreated);
// browser.menus.create({
//   id: "tools-menu",
//   title: browser.i18n.getMessage("menuItemToolsMenu"),
//   contexts: ["tools_menu"],
// }, onCreated);

// // ^^ utility
// /*
// Set a colored border on the document in the given tab.
// Note that this only work on normal web pages, not special pages
// like about:debugging.
// */
// var blue = 'document.body.style.border = "5px solid blue"';
// var green = 'document.body.style.border = "5px solid green"';

// function borderify(tabId, color) {
//   browser.tabs.executeScript(tabId, {
//     code: color
//   });
// }
// /*
// Toggle checkedState, and update the menu item's title
// appropriately.
// Note that we should not have to maintain checkedState independently like
// this, but have to because Firefox does not currently pass the "checked"
// property into the event listener.
// */
// function updateCheckUncheck() {
//   checkedState = !checkedState;
//   if (checkedState) {
//     browser.menus.update("check-uncheck", {
//       title: browser.i18n.getMessage("menuItemUncheckMe"),
//     });
//   } else {
//     browser.menus.update("check-uncheck", {
//       title: browser.i18n.getMessage("menuItemCheckMe"),
//     });
//   }
// }
// // ^^ event handlers
// /*
// The click event listener, where we perform the appropriate action given the
// ID of the menu item that was clicked.
// */
// browser.menus.onClicked.addListener((info, tab) => {
//   switch (info.menuItemId) {
//     case "log-selection":
//       console.log(info.selectionText);
//       break;
//     case "remove-me":
//       var removing = browser.menus.remove(info.menuItemId);
//       removing.then(onRemoved, onError);
//       break;
//     case "bluify":
//       borderify(tab.id, blue);
//       break;
//     case "greenify":
//       borderify(tab.id, green);
//       break;
//     case "check-uncheck":
//       updateCheckUncheck();
//       break;
//     case "open-sidebar":
//       console.log("Opening my sidebar");
//       break;
//     case "tools-menu":
//       console.log("Clicked the tools menu item");
//       break;
//   }
// });
