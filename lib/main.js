const {Cc, Ci, Cu} = require("chrome");
const {devtools} = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});
const {EventParsers} = devtools.require("devtools/toolkit/event-parsers");



var parser = {  
  id: "knockout events", // Unique id
  hasListeners: function(node) {
    // Hunt for node's listeners and return true as soon as one is 
    // encountered.
    
    let global = node.ownerGlobal.wrappedJSObject;
    let ko = global.ko;
    
    return ko.bindingProvider.instance.nodeHasBindings(node) && 'click' in ko.bindingProvider.instance.getBindingAccessors(node, ko.contextFor(node));
  },
  getListeners: function(node) {
    // Hunt for node's listeners and return an array of objects
    // representing those listeners. Each object should look like this:
    let global = node.ownerGlobal.wrappedJSObject;
    let ko = global.ko;
    
    let bindings = ko.bindingProvider.instance.getBindingAccessors(node, ko.contextFor(node));
    
    return [{
      type: "click",
      handler: bindings.click(),
      // These tags will be displayed as attributes in the events popup.
      tags: "Knockout", 
      // Hide or show fields
      hide: {               
        debugger: false, // Debugger icon
        type: false, // Event type e.g. click
        filename: false,
        capturing: false,
        dom0: true
      },
      //override: {
      // The following can be overridden:
        //type: "click",
        //origin: "http://www.mozilla.com",
        //searchString: 'onclick="doSomething()"',
        //DOM0: false,
        //capturing: true
      //}
    }];
  },
  normalizeHandler: function(fnDO) {  
    // Take a handler debug object and use the debugger to walk the scope 
    // chain to discover the function you would like to be displayed.
    // See https://hg.mozilla.org/integration/fx-team/diff/9add1ec0251d/toolkit/devtools/event-parsers.js#l1.98 for an example.
    return fnDO;
  }
};

let eventParsers = new EventParsers();
eventParsers.registerEventParser(parser);