/**
  * SyncMessage
  * A Javascript library for syncronizing postMessage requests
  * https://github.com/fillippeyton/SyncMessage
  */
  
var SyncMessage = function(){
    _SyncMessage = this;
    _SyncMessage.actionKeyword = 'SyncMessage';

    _SyncMessage.request;
    _SyncMessage.requestWindow;
    _SyncMessage.requestOrigin;

    _SyncMessage.responseWindow;
    _SyncMessage.responseOrigin;

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    _SyncMessage.syncMessageRequestInit = function(responseWindow, responseOrigin, requestWindow){
        _SyncMessage.responseWindow = responseWindow;
        _SyncMessage.responseOrigin = responseOrigin;
        _SyncMessage.requestWindow = requestWindow;

        return {
            // Send, then receive
            postMessageRequest: function(message){
                _SyncMessage.request = $.Deferred();
                _SyncMessage.action = message.action = _SyncMessage.actionKeyword + '_' + message.action + '_' + guid();
                responseWindow.postMessage(message, _SyncMessage.responseOrigin);


                $(_SyncMessage.requestWindow).on('message onmessage', function(){
                    switch(event.data.action){
                        case _SyncMessage.action:
                            _SyncMessage.request.resolve(event.data);
                            break;
                    }
                });

                return _SyncMessage.request;
            }
        }
    }

    _SyncMessage.syncMessageResponseInit = function(responseWindow, responseOrigin, requestWindow, actions){
        _SyncMessage.responseWindow = responseWindow;
        _SyncMessage.responseOrigin = responseOrigin;
        _SyncMessage.requestWindow = requestWindow;

        // Retrieve, then send
        $(_SyncMessage.responseWindow).on('message onmessage', function(){
            var actionName = event.data.action.split('_')[1];
            if(event.data.action.indexOf(_SyncMessage.actionKeyword) > -1 &&
                actions.hasOwnProperty(actionName)){
                
                event.data.data.returnObject = actions[actionName]();

                _SyncMessage.requestWindow.postMessage(event.data, _SyncMessage.responseOrigin);
            }
        });
    }

    return _SyncMessage;
};