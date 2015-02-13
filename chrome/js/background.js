// action when install
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        window.open('https://githunt.io/user/signin/github?from=extension');
    }else if(details.reason == "update"){
        // redirect somewhere when update
    }
});