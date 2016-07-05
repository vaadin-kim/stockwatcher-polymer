var Portfolio = function () {

    this.performance = [];
    this.dateToIndexMap = [];

    var index = 0;
    for (var i = 0; i < 30; i++) {
        var date = moment().subtract(30 - i, 'days');
        if (date.day() != 0 && date.day() != 6) {
            var formattedDate = date.format("YYYY-MM-DD");
            this.performance[index] = {date: formattedDate, portfolio: new PortfolioFIFO()};
            this.dateToIndexMap[formattedDate] = index;
            index++;
        }
    }
}

Portfolio.prototype = {
    buyStock: function (symbol, amount, price, date) {
        var dateObject = moment(date, "YYYY-MM-DD");
        if (dateObject.isBefore(this.performance[0].date)) {
            for (var i = 0; i < this.performance.length; i++) {
                this.performance[i].portfolio.push(symbol, amount, price);
            }
        } else {
            for (var i = 0; i < 30; i++) {
                var formattedDate = dateObject.format("YYYY-MM-DD");
                if (formattedDate in this.dateToIndexMap) {
                    this.performance[this.dateToIndexMap[formattedDate]].portfolio.push(symbol, amount, price);
                }
                dateObject.add(1, 'days');
            }
        }
    },

    sellStock: function (symbol, amount, date) {
        // Adjust date to a weekday
        var dateObject = moment(date, "YYYY-MM-DD");
        if (dateObject.isBefore(this.performance[0].date)) {
            for (var i = 0; i < this.performance.length; i++) {
                this.performance[i].portfolio.pop(symbol, amount);
            }
        } else {
            for (var i = 0; i < this.performance.length; i++) {
                var formattedDate = dateObject.format("YYYY-MM-DD");
                if (formattedDate in this.dateToIndexMap) {
                    this.performance[i].portfolio.pop(symbol, amount);
                }
                dateObject.add(1, 'days');
            }
        }
    },

    cost: function (date) {
        if (date in this.dateToIndexMap) {
            var dayData = this.performance[this.dateToIndexMap[date]];
            return dayData.portfolio.cost();
        } else {
            console.log("cost(): Oops. Didn't find day in history data [" + date + "]");
            return 0;
        }
    },

    value: function (date) {
        if (date in this.dateToIndexMap) {
            var dayData = this.performance[this.dateToIndexMap[date]];
            return dayData.portfolio.value();
        } else {
            console.log("value(): Oops. Didn't find day in history data [" + date + "]");
            return 0;
        }
    },

    setClosePrice: function (symbol, closePrice, date) {
        if (date in this.dateToIndexMap) {
            var dayData = this.performance[this.dateToIndexMap[date]];
            dayData.portfolio.setClosePrice(symbol, closePrice);
        } else {
            console.log("setClosePrice(): Oops. Didn't find day in history data [" + date + "]");
        }
    },

    getHistoryPerformance: function () {
        var history = [];
        for (var i = 0; i < this.performance.length; i++) {
            var value = this.performance[i].portfolio.value();
            var cost = this.performance[i].portfolio.cost();
            var relative = (100 * value / cost).toFixed(3);
            history.push(relative);
        }
        return history;
    },

    _adjustToWeekday: function (moment) {
        if (moment.day() == 0) {
            moment.add(1, 'days');
        } else if (date.day() == 6) {
            moment.add(2, 'days');
        }
        return moment;
    }
};