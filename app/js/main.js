main(['backTop'], function (backTop) {

    $(document).ready(function () {
        $('#fullpage').fullpage({
            sectionsColor: ['', 'orange', '', '#243342', '#008080', '#1A1A1A'], // 位每一个section设置背景色
            scrollingSpeed: 700, // 滚动速度默认700
            // verticalCentered:false,   //默认为true
            anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'],  // 定义锚链接用户可以快速打开定位页，默认为[]
            css3: true, // 默认为true是否使用css3动画
            loopBottom: true,
            fixedElements: '#header', // 无效?
            navigation: true,    // 是否显示导航，默认为false。如果设置为true，会显示小圆点，作为导航。
            navigationPosition: 'right', // 导航小圆点的位置，可以设置为left或right。
            navigationTooltips: ['攀登', '选择', '技术栈', '技术栈', '技术栈', '联系我'],   // 导航小圆点的tooltips设置鼠标经过时显示的名字，默认为[]，注意按照顺序设置。


            afterLoad: function (anchorLink, index) {
                   // console.log(anchorLink+' '+index);
                if (index === 1) {
                   		$('#first-main-title').removeClass('fadeOutLeft').addClass('fadeInLeft');
                   		$('#first-sub-title').removeClass('fadeOutRight').addClass('fadeInRight');
                } else if (index === 2) {
                	$('.img-item1').removeClass('fadeOutLeft').addClass('fadeInLeft');
                	$('.img-item2').removeClass('fadeOutUp').addClass('fadeInUp');
                	$('.img-item3').removeClass('fadeOutRight').addClass('fadeInRight');
                	$('.txt').removeClass('bounceOut').addClass('bounceIn');
                } else if (index === 3 || index === 4 || index === 5) {
                	$('.title1').removeClass('fadeOut').addClass('fadeIn');
                	$('.javalogo').removeClass('fadeOut').addClass('fadeIn');
                	$('.ul-items').children().removeClass('bounceOutRight').addClass('bounceInRight');
                } else if (index === 6) {
                	$('.lastpage').removeClass('fadeOut').addClass('fadeIn');
                }
            },

            onLeave: function (index, nextIndex, direction) {
                console.log(index + ' ' + nextIndex + ' ' + direction);
                if (index === 1) {
                   		$('#first-main-title').removeClass('fadeInLeft').addClass('fadeOutLeft');
                   		$('#first-sub-title').removeClass('fadeInRight').addClass('fadeOutRight');
                } else if (index === 2) {
                	$('.img-item1').removeClass('fadeInLeft').addClass('fadeOutLeft');
                	$('.img-item2').removeClass('fadeInUp').addClass('fadeOutUp');
                	$('.img-item3').removeClass('fadeInRight').addClass('fadeOutRight');
                	$('.txt').removeClass('bounceIn').addClass('bounceOut');
                } else if (index === 3 || index === 4 || index === 5) {
                	$('.title1').removeClass('fadeIn').addClass('fadeOut');
                	$('.javalogo').removeClass('fadeIn').addClass('fadeOut');
                	$('.ul-items').children().removeClass('bounceInRight').addClass('bounceOutRight');
                } else if (index === 6) {
                	$('.lastpage').removeClass('fadeIn').addClass('fadeOut');
                }
            },

            afterRender: function () {
            	$('#loading').fadeOut(500);
            },

        });
    });
});


