//订阅发布对象
var observe = {
    HandlerList: {},
    //订阅事件
    on: function (type, fun) {
        this.HandlerList[type] = this.HandlerList[type] || [];
        this.HandlerList[type].push(fun);
    },
    //触发事件
    fire: function (type, e) {
        if (!this.HandlerList[type]) {
            return;
        }
        for (var i = 0; i < this.HandlerList[type].length; i++) {
            this.HandlerList[type][i].call(e.target, e);
        }
    },
    //移除事件
    off: function (type, fun) {
        if (!this.HandlerList[type]) {
            return;
        }
        for (var i = 0; i < this.HandlerList[type].length; i++) {
            if (this.HandlerList[type][i] == fun) {
                break;
            }
        }
        this.HandlerList[type].splice(i, 1);
    },
    //把一个对象变为订阅发布对象
    makeObervable: function (obj) {
        for (var i in this) {
            if (typeof this[i] == "function" && this.hasOwnProperty(i)) {
                obj[i] = this[i];
            }
        }
    }
};
function formatTime(timestamps) {
    if (typeof timestamps != 'number') {
        throw new Error('请传入一个数字');
    }
    var hours = Math.floor(timestamps / 3600);
    hours = hours <= 9 ? ('0' + hours) : hours;
    var minutes = Math.floor((timestamps % 3600) / 60);
    minutes = minutes <= 9 ? ('0' + minutes) : minutes;
    var seconds = timestamps - hours * 3600 - minutes * 60;
    seconds = seconds <= 9 ? ('0' + seconds) : seconds;
    return hours + ':' + minutes + ':' + seconds;
}