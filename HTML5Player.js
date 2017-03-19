(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("requires a window with a document");
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

        this.opts = $.extend({autoplay: false, volume: 0.5, loop: false, canMove: true}, opts);
        this._el = this.opts.$el;
        this._$loading = this._el.find('#loading');
        this._video = this._el.find('#video1');
        console.log(this._video[0].networkState)
        this.isfirstloading = true;
        $.each(['autoplay', 'loop'], function (i, item) {
            if (self.opts[item]) {
                self._video.attr(item, item)
            }
        });
        this.setVolume(this.opts.volume);
        this.changeVolumeBar(this.opts.volume);
        this.bindEvent();
    }
    var api = h5VideoPlayer.prototype.init.prototype = h5VideoPlayer.api = h5VideoPlayer.prototype;

    //播放
    api.play = function () {
        // if (!this._ready) {
        //     return;
        // }
        this._paused = false;
        this._video[0].play();
    }

    //暂停
    api.pause = function () {
        // if (!this._ready) {
        //     return;
        // }
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
        return Math.floor(this._video[0].currentTime);
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
        val = val.toFixed(2);
        if (this._video[0].muted) {
            return;
        }
        this._video[0].volume = Math.min(1, Math.max(0, +val || 0));
    };

    //得到视频总播放时间长度
    api.getDuration = function () {
        return parseInt(this._video[0].duration);
    };

    //进入全屏 在移动端有问题
    api.enterFullScreen = function () {
        var self = this;
        $.each(['requestFullScreen', 'webkitRequestFullScreen', 'mozRequestFullScreen', 'msRequestFullscreen'], function (index, method) {
            if (self._video[0][method]) {
                self._video[0][method]();
            }
        });
    }

    //退出全屏 在移动端有问题
    api.exitFullScreen = function () {
        var self = this;
        $.each(['exitFullscreen', 'webkitCancelFullScreen', 'mozCancelFullScreen', 'msCancelFullscreen'], function (index, method) {
            if (self._video[0][method]) {
                self._video[0][method]();
            }
        });
    }

    api.bindEvent = function () {
        var self = this;

        this._video.on('loadedmetadata', function () {
            self._ready = true;
            console.log(self._ready)
            self._paused = self.opts.autoplay ? false : true;
            self._el.find('.scale_panel .curTime').html(formatTime(self.getCurrentTime()))
            self._el.find('.scale_panel .totalTime').html(formatTime(self.getDuration()))

        })
        // this._video.on('loadeddata', function () {
        //     self._ready = true;
        //     console.log(self._ready, 2)
        // })
        // this._video.on('loadstart', function () {
        //     self._ready = true;
        //     console.log(self._ready, 3)
        // })

        this._video.on('timeupdate', function () {
            self._el.find('.scale_panel .curTime').html(formatTime(self.getCurrentTime()))
            self.changeProgressBar();
        })

        this._video.on('canplaythrough', function () {
            self._$loading.hide();
        })

        this._video.on('canplay', function () {
            console.log('canplay')
            self._$loading.hide();
        })

        this._video.on('ended', function () {
            self.reset();
        })
        this._el.find('#pause').click(function () {
            if (self.isfirstloading) {
                self._$loading.show();
                var timer = setInterval(function () {
                    var currentTime = self._video[0].currentTime; // 检测当前的播放时间
                    $('#log').html(currentTime)
                    if (currentTime > 0) {
                        self._$loading.hide();
                        clearInterval(timer);
                    }
                }, 100);
            }
            self.isfirstloading = false;
            self._ready = true;
            if (self._paused) {
                self.play();
            } else {
                self.pause();
            }

        });

        this._el.find('.fullScreen').click(function () {
            if (self._fullScreen) {
                self.exitFullScreen();
                self._fullScreen = false;
            } else {
                self.enterFullScreen();
                self._fullScreen = true;
            }
        });

        this._el.find('#volumeBtn').on('touchstart', function (e) {
            var originEvent = e.originalEvent;
            var x = originEvent.touches[0].clientX;
            var l = this.offsetLeft;
            var max = self._el.find('.volumeBar').innerWidth() - $(this).innerWidth();
            var to;
            //按钮拖动
            $doc.on('touchmove', docMove)

            function docMove(e) {
                var originEvent = e.originalEvent;
                var thisX = originEvent.touches[0].clientX;
                to = Math.min(max, Math.max(-2, l + (thisX - x)));
                self.setVolume(Math.max(0, to / max));
                console.log(Math.max(0, to / max))
                self.changeVolumeBar();
                $doc.on('touchend', function docUp() {
                    $doc.unbind('mousemove', docMove);
                    $doc.unbind('mouseup', docUp);
                })
            }
        })

        if (self.opts.canMove) {
            this._el.find('#btn').on('touchstart', function (e) {
                var originEvent = e.originalEvent;
                var x = originEvent.touches[0].clientX;
                var l = this.offsetLeft;
                var max = self._el.find('#bar').innerWidth() - $(this).innerWidth();
                var to;
                //按钮拖动
                $doc.on('touchmove', docMove)

                function docMove(e) {
                    self._$loading.show();
                    var originEvent = e.originalEvent;
                    var thisX = originEvent.touches[0].clientX;
                    to = Math.min(max, Math.max(-2, l + (thisX - x)));
                    self.setCurrentTime(Math.round(self.getDuration() * Math.max(0, to / max)));
                    self.changeProgressBar();
                    //没有下面这句，某些手机浏览器不触发touchend事件
                    e.preventDefault();
                    $doc.on('touchend', function docUp() {
                        var time =self.getDuration() * Math.max(0, to / max);
                        self.setCurrentTime(Math.round(time));
                        self.play();
                        var timer = setInterval(function () {
                            var currentTime = self._video[0].currentTime; // 检测当前的播放时间
                            $('#log').html(currentTime+'----'+time)
                            if (currentTime - time >=0.5) {
                                self._$loading.hide();
                                clearInterval(timer);
                            }
                        }, 100);
                        $doc.unbind('touchmove', docMove);
                        $doc.unbind('touchend', docUp);
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

    //更新音量条状态
    api.changeVolumeBar = function () {
        var x = parseInt(this._el.find('.volumeBar').innerWidth() * this.getVolume());
        this._el.find('.curVolumeBar').css('width', Math.max(0, x) + 'px');
        this._el.find('.volume').html(Math.round(this.getVolume() * 100));
        this._el.find('#volumeBtn').css('left', x + 'px');
    }

    api.reset = function () {
        this._paused = true;
        this.setCurrentTime(0);
    }


    var strundefined = typeof undefined;

    if (typeof noGlobal === strundefined) {
        window.h5VideoPlayer = h5VideoPlayer;
    }
    return h5VideoPlayer
}));

