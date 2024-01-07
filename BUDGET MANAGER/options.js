// $(function(){
//     $('#saveLimit').click(function(){
//         var limit=$('#limit').val();
//         if(limit){
//             chrome.storage.sync.set({'limit': limit}, function(){
//                 // $('#limit').text(limit)
//                 var resetNotif = {
//                     type: 'basic',
//                     iconUrl: 'icon48.png',
//                     title: 'Account Limit Updated',
//                     message: "Your Account Limit has been changed to "+limit+" !"
//                 };
//                 chrome.notifications.create('limitNotif',resetNotif)
//                 // close();
                
//             })
//         }
//     });

//     $('#resetTotal').click(function(){
//         chrome.storage.sync.set({'total':0},function(){
//             var resetNotif = {
//                 type: 'basic',
//                 iconUrl: 'icon48.png',
//                 title: 'Total spend reset',
//                 message: "Your Total spend has been reset to 0!."
//             };
//             chrome.notifications.create('totalNotif',resetNotif)
//             // close();
//         })
//     });

//     chrome.storage.sync.get('limit',function(budget){
//         $('#limit').val(budget.limit)
//     })
    
// })
class BudgetManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        $(() => {
            $('#saveLimit').click(() => this.saveLimit());
            $('#resetTotal').click(() => this.resetTotal());
            this.loadLimitFromStorage();
        });
    }

    loadLimitFromStorage() {
        chrome.storage.sync.get('limit', (budget) => {
            $('#limit').val(budget.limit || 0);
        });
    }

    saveLimit() {
        const limit = $('#limit').val();
        
        if (limit) {
            chrome.storage.sync.set({ 'limit': limit }, () => {
                this.showNotification('Account Limit Updated', `Your Account Limit has been changed to ${limit} !`, 'icon48.png', 'limitNotif');
            });
        }
    }

    resetTotal() {
        chrome.storage.sync.set({ 'total': 0 }, () => {
            this.showNotification('Total spend reset', 'Your Total spend has been reset to 0!.', 'icon48.png', 'totalNotif');
        });
    }

    showNotification(title, message, iconUrl, notificationId) {
        const notifOptions = {
            type: 'basic',
            iconUrl: iconUrl,
            title: title,
            message: message
        };
        chrome.notifications.create(notificationId, notifOptions);
    }
}

$(function() {
    const budgetManager = new BudgetManager();
});
