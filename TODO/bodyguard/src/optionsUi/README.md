define preferences for your extension that users can change

is accesed via the options page for  an extension from the browsers addons manager
You can open the page programmatically by calling runtime.openOptionsPage().

JavaScript running in the page can use all the WebExtension APIs that the add-on has permissions for. In particular, you can use the storage API to persist preferences.

If you want to share data or functions between the JavaScript on your options page and your background script(s), you can do so directly by obtaining a reference to the Window of your background scripts by using extension.getBackgroundPage(), or a reference to the Window of any of the pages running within your extension with extension.getViews().

Alternately, you can communicate between the JavaScript for your options page and your background script(s) using runtime.sendMessage(), runtime.onMessage, or runtime.connect().

In general, you will want to store options changed on option pages using the storage API to either storage.sync() (if you want the settings synchronized across all instances of that browser that the user is logged into), or storage.local() (if the settings are local to the current machine/profile).

If you do so and your background script(s) (or content script(s)) need to know about the change, your script(s) might choose to add a listener to storage.onChanged.
