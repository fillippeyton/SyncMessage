# SyncMessage
A way to syncronously send/capture postMessages. This script was created primarily to facilitate communications between an Iframe and its parent frame. It uses Jquery's Deferred object do allow the postMessages to be captured.

### Requirements
In order for this script to work, Jquery is needed. Both windows that are communicating require this script, but need a different initialization in order for bidirectional communication to work. Also, I've structured the postMessage's message with an object. The structure is as follows:
var message = {
	action: 'actionName', // developer-defined name describing the postMessage
	data: { // any number/type of object properties to pass the target window
		propertyA: 'foo',
		propertyB: 123,
		propertyC: {}
	}
}

SyncMessage prepends a keyword, as well as appends a guid to the `action` in order to tell that the postMessage was send/received by SyncMessage.

### Initial Setup
```
// Window A (Requester Window)
var syncMessage = new SyncMessage();
var syncMessageRequestObject = syncMessage.syncMessageRequestInit(responderWindow, responderWindowOrigin, requesterWindow);

// Send postMessage to Window B
var syncMessageRequest = syncMessageRequestObject.postMessageRequest({
    action: 'yourAction',
    data: {}
});

// Do something on resolution of syncMessageRequest
syncMessageRequest.done(function(data){
    console.log(data);
});

// Window B (Responder Window)
var syncMessage = new SyncMessage();
syncMessage.syncMessageResponseInit(responderWindow, requesterWindowOrigin, requesterWindow, dataFunctionReference);
```

### Possible Enhancements
* Deferred object returned from `syncMessageResponseInit`
* Dynamic merging of original postMessage message and data returned from responder window