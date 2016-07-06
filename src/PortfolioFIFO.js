var PortfolioFIFO = function () {
    this.fifo = [];
}

PortfolioFIFO.prototype = {
    push: function (symbol, amount, price) {
        if (!(symbol in this.fifo)) {
            this.fifo[symbol] = [];
        }
        this.fifo[symbol].push({amount: parseInt(amount), price: parseFloat(price).toFixed(2), close: undefined});
    },

    pop: function (symbol, amount) {
        if (!(symbol in this.fifo)) {
            return;
        }
        amount = parseInt(amount);

        while (amount > 0) {
            if (this.fifo[symbol].length == 0) {
                return;
            }

            var a = this.fifo[symbol][0].amount;
            if (a <= amount) {
                amount -= a;
                this.fifo[symbol].shift();
            } else {
                a -= amount;
                amount = 0;
                this.fifo[symbol][0].amount = a;
            }
        }
    },

    cost: function () {
        var cost = 0;
        for (var key in this.fifo) {
            cost += this.costForStock(key);
        }
        return cost;
    },

    costForStock: function (symbol) {
        var data = this.fifo[symbol];
        if (data == undefined) {
            return 0;
        }
        var cost = 0;
        for (var i = 0; i < data.length; i++) {
            cost += data[i].amount * data[i].price;
        }
        return cost;
    },

    amountOfStocks: function (symbol) {
        var data = this.fifo[symbol];
        if (data == undefined) {
            return 0;
        }
        var amount = 0;
        for (var i = 0; i < data.length; i++) {
            amount += data[i].amount;
        }
        return amount;
    },

    value: function () {
        var value = 0;
        for (var key in this.fifo) {
            value += this.valueForStock(key);
        }
        return value;
    },

    valueForStock: function (symbol) {
        var data = this.fifo[symbol];
        if (data == undefined) {
            return 0;
        }
        var value = 0;
        if(data.close != undefined) {
            for (var i = 0; i < data.length; i++) {
                value += data[i].amount * data.close;
            }
        }
        return value;
    },

    setClosePrice: function(symbol, closePrice) {
        this.fifo[symbol].close = closePrice;
    },

    clone: function () {
        return JSON.parse(JSON.stringify(this));
    },

    getStockAndClose: function() {
        var array = [];
        for(var key in this.fifo) {
            array[key] = this.fifo[key].close;
        }
        return array;
    }

}