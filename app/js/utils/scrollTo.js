/**
 * 定义一个滚动到指定位置的工具模块
 * Created by sunben960729 on 2016/9/17.
 */
define('scrollTo', function () {
    function ScrollTo (opts) {/* 用户参数*/
        this.opts = $.extend({}, ScrollTo.DEFAULTS, opts);// 用 opts 覆盖默认参数放到{}中并返回
        this.$el = $('html, body'); // 多次应用的元素需要缓存(对于不同函数中都使用的通过成员变量缓存)
    }

    ScrollTo.prototype.move = function () { // 添加方法（静态每个构造函数仅生成1份）
        var opts = this.opts, // 对于内部使用的通过局部变量储存
            dest = opts.dest;

        if ($(window).scrollTop() !== dest) {
            if (!this.$el.is(':animated')) {
                this.$el.animate({
                    scrollTop: dest,
                }, opts.speed);
            }
        }
    };

    ScrollTo.prototype.go = function () { // 添加方法（静态每个构造函数仅生成1份）
        var dest = this.opts.dest; // 缓存变量

        if ($(window).scrollTop() !== dest) {
            this.$el.scrollTop(dest);
        }
    };

    ScrollTo.DEFAULTS = {    /* 定义静态变量默认配置项*/
        dest: 0,    // 默认滚动到的位置
        speed: 800,   // 默认滚动速度
    };

    return {
        ScrollTo: ScrollTo,
    };

});
