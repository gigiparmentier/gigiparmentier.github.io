//This should be installed as the file disable-add-on-signing.js in
//  your profile's "chrome" directory.

//Earlier versions of Firefox
try {
    Components.utils.import("resource://gre/modules/addons/XPIProvider.jsm", {}).eval("SIGNED_TYPES.clear()");
} catch(ex) {}
try {
    Components.utils.import("resource://gre/modules/addons/XPIInstall.jsm", {}).eval("SIGNED_TYPES.clear()");
} catch(ex) {}
try {
    Components.utils.import("resource://gre/modules/addons/XPIDatabase.jsm", {}).eval("SIGNED_TYPES.clear()");
} catch(ex) {}

//Tested on Firefox 66
const {XPCOMUtils} = ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetters(this, {
    XPIDatabase: "resource://gre/modules/addons/XPIDatabase.jsm",
});
XPIDatabase.SIGNED_TYPES.clear();

console.log('Add-on signing disabled.');
