(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
    var $doc = $(window.document)

    function h5VideoPlayer(opts) {

        return new h5VideoPlayer.prototype.init(opts)
    }

    h5VideoPlayer.prototype.init = function (opts) {
        var self = this;
        if (!opts.$el) {
            throw 'should have a jQuery video element'
        }
        this.opts = $.extend({autoplay: false, volume: 10, loop: false, canMove: true}, opts);
        this._el = this.opts.$el;
        this._$loading=this._el.find('#loading');
        this._video = this._el.find('#video1')
        $.each(['autoplay', 'loop'], function (i, item) {
            if (self.opts[item]) {
                self._video.attr(item, item)
            }
        });
        this.bindEvent();
    }
    var api = h5VideoPlayer.prototype.init.prototype = h5VideoPlayer.api = h5VideoPlayer.prototype;

    //播放
    api.play = function () {
        if (!this._ready) {
            return;
        }
        this._paused = false;
        this._video[0].play();
    }

    //暂停
    api.pause = function () {
        if (!this._ready) {
            return;
        }
        this._paused = true;
        this._video[0].pause();
    }

    //设置静音与否
    api.mute = function (muted) {
        muted = arguments.length === 0 ? true : !!muted;
        this._video[0].muted = muted;
    };

    //获取当前播放时间
    api.getCurrentTime = function () {
        return this._video[0].currentTime;
    };

    api.setCurrentTime = function (val) {
        this._video[0].currentTime = val;
    };

    //返回音量
    api.getVolume = function () {
        return this._video[0].volume;
    };

    //设置音量
    api.setVolume = function (val) {
        if (this._video[0].muted) {
            return;
        }
        this._video[0].volume = Math.min(1, Math.max(0, +val || 0));
    };

    //得到视频总播放时间长度
    api.getDuration = function () {
        return this._video[0].duration;
    };

    //进入全屏
    api.enterFullScreen = function (val) {

    }

    //退出全屏
    api.exitFullScreen = function () {

    }

    api.bindEvent = function () {
        var self = this;

        this._video.on('loadedmetadata', function () {
            self._ready = true;
            self._paused = self.opts.autoplay ? false : true;
            self._el.find('#totleTime').html(self.getDuration())
        })

        this._video.on('timeupdate', function () {
            self.changeProgressBar();
        })

        this._video.on('canplaythrough', function () {
            self._$loading.hide();
        })

        this._el.find('#pause').click(function () {
            if (self._paused) {
                self.play();
            } else {
                self.pause();
            }
        })

        if (self.opts.canMove) {
            this._el.find('#btn').on('mousedown', function (e) {
                var x = e.clientX;
                var l = this.offsetLeft;
                var max = self._el.find('#bar').innerWidth() - $(this).innerWidth();
                var to;
                //按钮拖动
                $doc.on('mousemove', docMove)


                function docMove(e) {
                    self._$loading.show();
                    var thisX = e.clientX;
                    to = Math.min(max, Math.max(-2, l + (thisX - x)));
                    self.setCurrentTime(Math.round(self.getDuration() * Math.max(0, to / max)));
                    self.changeProgressBar();
                    $doc.on('mouseup', function () {
                        self.setCurrentTime(Math.round(self.getDuration() * Math.max(0, to / max)));
                        self.play();
                        $doc.unbind('mousemove', docMove);
                    })
                }
            })
        }
    }

    //更新进度条状态
    api.changeProgressBar = function () {
        var persent = parseInt(this.getCurrentTime() / this.getDuration() * 100);
        var x = parseInt(this._el.find('#bar').innerWidth() * persent / 100);
        this._el.find('.curBar').css('width', Math.max(0, x) + 'px');
        this._el.find('#title').html(persent + '%');
        this._el.find('#btn').css('left', x + 'px');
    }


    var strundefined = typeof undefined;

    if (typeof noGlobal === strundefined) {
        window.h5VideoPlayer = h5VideoPlayer;
    }
    return h5VideoPlayer
}));

