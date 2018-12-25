/*
1.js的分层（功能）：jquery（tools） 组件（ui） 应用（app） mvc
2.js的规划（管理）：避免全局变量的方法（命名空间，闭包，面向对象）*/

window.onload = function () {
    hq.app.toTip();
    hq.app.toBanner();
    hq.app.toSel();
    hq.app.toSlide();
};

var hq = {};    //命名空间

hq.tools = {};
hq.tools.getByClass = function (oParent, sClass) {
    var aEle = document.getElementsByTagName('*');
    var arr = [];

    for (var i = 0; i < aEle.length; i++) {
        if (aEle[i].className == sClass) {
            arr.push(aEle[i])
        }
    }

    return arr;
}
hq.tools.getStyle = function (obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}

hq.ui = {};
hq.ui.toTextChange = function (obj, val) {
    obj.onfocus = function () {
        if (this.value == val) {
            this.value = '';
        }
    }
    obj.onblur = function () {
        if (this.value == '') {
            this.value = val;
        }
    }
}


hq.ui.fadeIn = function (obj) {

    var iCur = hq.tools.getStyle(obj, 'opacity');
    if (iCur == 1) {
        return false
    }
    ;

    var val = 0;
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var iSpeed = 5;
        if (val == 100) {
            clearInterval(obj.timer)
        } else {
            val += iSpeed;
            obj.style.opacity = val / 100;
        }

    }, 30)
}

hq.ui.fadeOut = function (obj) {

    var iCur = hq.tools.getStyle(obj, 'opacity');
    if (iCur == 0) {
        return false
    }
    ;

    var val = 100;
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var iSpeed = -5;
        if (val == 0) {
            clearInterval(obj.timer)
        } else {
            val += iSpeed;
            obj.style.opacity = val / 100;
        }

    }, 30)
}

hq.ui.slide = function (obj, old, target) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {

        var iSpeed = (target - old) / 10;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

        if (target == old) {
            clearInterval(obj.timer)
        } else {
            old += iSpeed;
            obj.style.left = old + 'px';
        }

    }, 30)
}


hq.app = {};

hq.app.toTip = function () {
    var oText1 = document.getElementById('text1');
    var oText2 = document.getElementById('text2');

    hq.ui.toTextChange(oText1, 'Search website');
    hq.ui.toTextChange(oText2, 'Search website');

}

hq.app.toBanner = function () {
    var oBanner = document.getElementById('banner');
    var aLi = oBanner.getElementsByTagName('li');

    var oPrevBg = hq.tools.getByClass(oBanner, 'prev-bg')[0];
    var oNextBg = hq.tools.getByClass(oBanner, 'next-bg')[0];

    var oPrev = hq.tools.getByClass(oBanner, 'prev')[0];
    var oNext = hq.tools.getByClass(oBanner, 'next')[0];

    var iNow = 0;

    var timer = setInterval(auto, 3000);

    function auto() {

        if (iNow == aLi.length - 1) {
            iNow = 0;
        } else {
            iNow++;
        }

        for (var i = 0; i < aLi.length; i++) {
            hq.ui.fadeOut(aLi[i]);
        }

        hq.ui.fadeIn(aLi[iNow]);
    }

    function autoPrev() {

        if (iNow == 0) {
            iNow = aLi.length - 1;
        } else {
            iNow--;
        }

        for (var i = 0; i < aLi.length; i++) {
            hq.ui.fadeOut(aLi[i]);
        }

        hq.ui.fadeIn(aLi[iNow]);
    }

    oPrevBg.onmouseover = oPrev.onmouseover = function () {
        oPrev.style.display = 'block';
        clearInterval(timer);
    }

    oNextBg.onmouseover = oNext.onmouseover = function () {
        oNext.style.display = 'block';
        clearInterval(timer);
    }

    oPrevBg.onmouseout = oPrev.onmouseout = function () {
        oPrev.style.display = 'none';
        timer = setInterval(auto, 3000);
    }

    oNextBg.onmouseout = oNext.onmouseout = function () {
        oNext.style.display = 'none';
        timer = setInterval(auto, 3000);
    }

    oPrev.onclick = function () {
        autoPrev();
    }

    oNext.onclick = function () {
        auto();
    }

}

hq.app.toSel = function () {
    var oSort = document.getElementById('sort');
    var oH2 = oSort.getElementsByTagName('h2');
    var aUl = hq.tools.getByClass(oSort, 'opation');

    for (var i = 0; i < oH2.length; i++) {
        oH2[i].index = i;
        oH2[i].onclick = function (ev) {

            var ev = ev || window.event;

            var This = this;
            for (var i = 0; i < aUl.length; i++) {
                aUl[i].style.display = 'none';
            }

            aUl[this.index].style.display = 'block';

            document.onclick = function () {
                aUl[This.index].style.display = 'none';
            }

            ev.cancelBubble = true;

        };

    }

    for (var i = 0; i < aUl.length; i++) {
        aUl[i].index = i;
        (function (ul) {

            var aLi = ul.getElementsByTagName('li');

            for (var i = 0; i < aLi.length; i++) {
                aLi[i].index = i;
                aLi[i].onmouseover = function () {
                    aLi[this.index].className = 'active';
                }

                aLi[i].onmouseout = function () {
                    aLi[this.index].className = '';
                }

                aLi[i].onclick = function (ev) {
                    var ev = ev || winodw.event;
                    // console.log(this.parentNode.index)
                    oH2[this.parentNode.index].innerHTML = this.innerHTML;
                    ev.cancelBubble = true;
                    this.parentNode.style.display = 'none';
                }
            }

        })(aUl[i]);
    }

}

hq.app.toSlide = function () {
    var oSlide = document.getElementById('slide');
    var oUl = oSlide.getElementsByTagName('ul')[0];
    var aLi = oUl.getElementsByTagName('li');

    var oPrev = oSlide.getElementsByClassName('prev')[0];
    var oNext = oSlide.getElementsByClassName('next')[0];

    var iNow = 0;
    var liWidht = aLi[0].offsetWidth;

    oUl.innerHTML += oUl.innerHTML;
    oUl.style.width = aLi.length * liWidht + 'px';

    oPrev.onclick = function () {

        if (iNow == 0) {
            iNow = aLi.length / 2;
            oUl.style.left = -oUl.offsetWidth / 2 + 'px';
        }

        hq.ui.slide(oUl, -iNow * liWidht, -(iNow - 1) * liWidht);

        iNow--;

    }

    oNext.onclick = function () {

        if (iNow == aLi.length / 2) {
            iNow = 0;
            oUl.style.left = 0;
        }

        hq.ui.slide(oUl, -iNow * liWidht, -(iNow + 1) * liWidht);

        iNow++;

    }

}
