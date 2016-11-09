
define('backTop', ['scrollTo'], function (scrollTo) {
    function BackTop (el, opts) {/* 用户参数*/
        this.opts = $.extend({}, BackTop.DEFAULTS, opts);
        this.$el = $(el);
        this.scroll = new scrollTo.ScrollTo({
            dest: 0,
            speed: this.opts.speed,
        });



        if (this.opts.mode === 'move') {
            this.$el.click($.proxy(this._move, this));
        } else {
            this.$el.click($.proxy(this._go, this));
        }

        $(window).on('scroll', $.proxy(this._checkPosition, this));
    }

    BackTop.DEFAULTS = {
        mode: 'move',
        pos: $(window).height(),
        speed: 800,
    };

    BackTop.prototype._move = function () {
        this.scroll.move();
    };

    BackTop.prototype._go = function () {
        this.scroll.go();
    };

    BackTop.prototype._checkPosition = function () {
        var $el = this.$el;

        if ($(window).scrollTop() > this.opts.pos) {
            $el.fadeIn();
        } else {
            $el.fadeOut();
        }
    };

    return {
        BackTop: BackTop,
    };

});
