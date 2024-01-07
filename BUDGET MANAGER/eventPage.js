var contextMenuItem ={
    "id": "spendMoney",
    "title":"SpendMoney",
    "contexts":["selection"]

};
chrome.contextMenus.create(contextMenuItem);

function isInt(value){
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value,10));
}

chrome.contextMenus.onClicked.addListener(function(clickData){
    clickData.selectionText = clickData.selectionText.replace(/,/g,'')
    if(clickData.menuItemId == "spendMoney" && clickData.selectionText){
        if(isInt(clickData.selectionText)){
            chrome.storage.sync.get(['total','limit'],function(budget){
                var newTotal = 0;
                if(budget.total){
                    newTotal += parseInt(budget.total);
                }
                if((budget.total-clickData.selectionText)>=budget.limit){
                    newTotal -= parseInt(clickData.selectionText);
                }
                else{
                    var notifOptions ={
                        type: 'basic',
                        iconUrl:'icon128.png',
                        title: 'Limit Reached!',
                        message:'Restricted! You would reach your limit Balance'
                    };
                    chrome.notifications.create('limitNotif',notifOptions)
                }

                chrome.storage.sync.set({'total':newTotal})

            })
        }
    }
});

chrome.storage.onChanged.addListener(function(changes,storageName){
    var Badge_value=  changes.total.newValue.toString()
    chrome.action.setBadgeText({ text: Badge_value})
})