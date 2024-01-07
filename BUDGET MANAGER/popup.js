
class BudgetTracker {
    constructor() {
        this.initialize();
    }

    initialize() {
        $(() => {
            this.loadBudgetFromStorage();
            $('#spendAmount').click(() => this.handleSpendAmountClick());
            $('#withdraw').click(() => this.handleWithdrawClick());
        });
    }

    loadBudgetFromStorage() {
        chrome.storage.sync.get(['total', 'limit'], (budget) => {
            this.updateTotalAndLimit(budget.total || 0, budget.limit || 0);
        });
    }

    handleSpendAmountClick() {
        chrome.storage.sync.get(['total', 'limit'], (budget) => {
            const currentTotal = budget.total ? parseInt(budget.total) : 0;
            const amount = parseInt($('#amount').val());

            if (!isNaN(amount)) {
                const newTotal = currentTotal + amount;
                this.updateTotalAndLimit(newTotal, budget.limit);
            }
        });
    }

    handleWithdrawClick() {
        chrome.storage.sync.get(['total', 'limit'], (budget) => {
            const currentTotal = budget.total ? parseInt(budget.total) : 0;
            const amount = parseInt($('#amount').val());

            if (!isNaN(amount)) {
                if (amount > currentTotal) {
                    this.showLimitNotification('Oops! Looks like you have reached your limit !');
                } else {
                    const remainingTotal = currentTotal - amount;

                    if (remainingTotal >= budget.limit) {
                        this.updateTotalAndLimit(remainingTotal, budget.limit);
                    } else {
                        this.showLimitNotification(`The limit of ₹${budget.limit} should be maintained!`);
                    }
                }
            }
        });
    }

    updateTotalAndLimit(newTotal, limit) {
        chrome.storage.sync.set({ 'total': newTotal }, () => {
            $('#total').text(newTotal);
            $('#amount').val('');
        });

        $('#limit').text(limit);
    }

    showLimitNotification(message) {
        const notifOptions = {
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'Limit Reached!',
            message: message
        };
        chrome.notifications.create('limitNotif', notifOptions);
        $('#amount').val('');
    }
}

$(function() {
    const budgetTracker = new BudgetTracker();
});

