/**
 * @file 可拖曳弹窗
 * @author yunkai
 * @description 定义一个窗口并且可以拖动和改变大小
 * @createDate 2018-11-24
 */

/**
 * 根据id 类名或标签获取元素的工具方法
 */
var get = {
    byId: function(id) {
        return typeof id === "string" ? document.getElementById(id) : id;
    },
    byClass: function(sClass, oParent) {
        //如果存在getElementsByClassName方法则使用，否则根据正则表达式搜索
        if(oParent.getElementsByClassName) {
            return oParent.getElementsByClassName(sClass);
        }
        else {
            var aClass = [];
            var reClass = new RegExp("(^| )" + sClass + "( |$)");
            var aElem = this.byTagName("*", oParent);
            for(var i = 0; i < aElem.length; i++) {
                reClass.test(aElem[i].className) && aClass.push(aElem[i]);
            }
            return aClass;
        }   
    },
    byTagName: function(elem, obj) {
        return (obj || document).getElementsByTagName(elem);
    }
};

//最小宽度和高度，用来还原窗口和保证内容的样式
var dragMinWidth = 250;
var dragMinHeight = 124;

/**
 * 用来处理拖动事件的函数
 * @method drag
 * @param {Element} oDrag 需要拖动的窗口元素
 * @param {Element} handle 触发拖动事件的元素
 */
function drag(oDrag, handle) {
    var disX = disY = 0;
    var oMin = get.byClass("min", oDrag)[0];//最小化按钮
    var oMax = get.byClass("max", oDrag)[0];//最大化按钮
    var oRevert = get.byClass("revert", oDrag)[0];//复原按钮
    var oClose = get.byClass("close", oDrag)[0];//关闭按钮

    handle = handle || oDrag;
    handle.style.cursor = "move";
    handle.onmousedown = function(event) {
        var event = event || window.event;//兼容IE，获取事件
        disX = event.clientX - oDrag.offsetLeft;
        disY = event.clientY - oDrag.offsetTop;

        document.onmousemove = function(event) {
            var event = event || window.event;
            var iL = event.clientX - disX;
            var iT = event.clientY - disY;
            //最大可拖动的范围
            var maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
            var maxT = document.documentElement.clientHeight - oDrag.offsetHeight;

            if(iL <= 0) {
                iL = 0;
            }
            else if(iL >= maxL) {
                iL = maxL;
            }
            if(iT <= 0) {
                iT = 0;
            }
            else if(iT >= maxT) {
                iT = maxT;
            }

            oDrag.style.left = iL + "px";
            oDrag.style.top = iT + "px";

            return false;
        };

        //鼠标松开，清除事件
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
            //释放鼠标捕获。IE才有
            if(this.releaseCapture)
                this.releaseCapture();
        };
        //设置鼠标捕获，IE才有
        if(this.setCapture) {
            this.setCapture();
        }
        return false;
    };
    //最大化按钮
    oMax.onclick = function() {
        oDrag.style.top = oDrag.style.left = 0;
        oDrag.style.width = document.documentElement.clientWidth - 2 + "px";
        oDrag.style.height = document.documentElement.clientWidth - 2 + "px";
        this.style.display = "none";
        oRevert.style.display = "block";
    };
    //还原按钮
    oRevert.onclick = function() {
        oDrag.style.width = dragMinWidth + "px";
        oDrag.style.height = dragMinHeight + "px";
        oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + "px";
        oDrag.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + "px";
        this.style.display = "none";
        oMax.style.display = "block";
    };
    //最小化按钮
    oMin.onclick = oClose.onclick = function() {
        oDrag.style.display = "none";
        var oA = document.createElement("a");
        oA.className = "open";
        oA.href = "javascript:;";
        oA.title = "还原";
        document.body.appendChild(oA);
        oA.onclick = function() {
            oDrag.style.display = "block";
            document.body.removeChild(this);
            this.onclick = null;
        };
    };
    //阻止冒泡
    oMin.onmousedown = oMax.onmousedown = oClose.onmousedown = function(event) {
        this.onfocus = function () {
            this.blur();//失去焦点
        };
        (event || window.event).cancelBubble = true;
    };
}

/**
 * 改变窗口大小的函数
 * @method resize
 * @param {element} oParent 需要改变大小的窗口元素
 * @param {element} handle 用来触发鼠标事件的元素
 * @param {boolean} isLeft handle元素是否左侧元素
 * @param {boolean} isTop  handle元素是否顶部元素
 * @param {boolean} lockX  X轴宽度是否可以改变
 * @param {boolean} lockY  Y轴高度是否可以改变
 */
function resize(oParent, handle, isLeft, isTop, lockX, lockY) {
    //鼠标按下事件
    handle.onmousedown = function(event) {
        var event = event || window.event;
        var disX = event.clientX - handle.offsetLeft;//鼠标事件位置距离元素的x轴距离
        var disY = event.clientY - handle.offsetTop;//鼠标事件位置距离元素的y轴距离
        var iParentTop = oParent.offsetTop;//父元素（窗口）顶部位置
        var iParentLeft = oParent.offsetLeft;//父元素左侧位置
        var iParentWidth = oParent.offsetWidth;//父元素宽度
        var iParentHeight = oParent.offsetHeight;//父元素高度
        //鼠标移动事件
        document.onmousemove = function(event) {
            var event = event || window.event;

            var iL = event.clientX - disX;//x轴移动距离
            var iT = event.clientY - disY;//y轴移动距离
            var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;//x轴最大可移动距离
            var maxH = document.documentElement.clientHeight - oParent.offsetTop - 2;//y轴最大可移动距离
            //调整大小后的元素宽度
            var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
            //调整大小后的元素高度
            var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;

            if(isLeft) { //窗口左侧定位发生变化
                oParent.style.left = iParentLeft + iL + "px";
            }
            if(isTop) { //窗口右侧定位发生变化
                oParent.style.top = iParentTop + iT + "px";
            }

            if(iW < dragMinWidth) {
                iW = dragMinWidth;
            } 
            else if(iW > maxW) {
                iW = maxW;
            }
            if(!lockX) {
                oParent.style.width = iW + "px";
            }

            if(iH < dragMinHeight) {
                iH = dragMinHeight;
            }
            else if(iH > maxH) {
                iH = maxH;
            }
            if(!lockY) {
                oParent.style.height = iH + "px";
            }

            //如果已经达到最小宽度或者高度，则清除事件
            if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) {
                document.onmousemove = null;
            }

            return false;
        }

        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };

        return false;
    }
};

window.onload = window.onresize = function() {
    //获取元素
    var oDrag = document.getElementById("drag");
	var oTitle = get.byClass("title", oDrag)[0];
	var oL = get.byClass("resizeL", oDrag)[0];
	var oT = get.byClass("resizeT", oDrag)[0];
	var oR = get.byClass("resizeR", oDrag)[0];
	var oB = get.byClass("resizeB", oDrag)[0];
	var oLT = get.byClass("resizeLT", oDrag)[0];
	var oTR = get.byClass("resizeTR", oDrag)[0];
	var oBR = get.byClass("resizeBR", oDrag)[0];
    var oLB = get.byClass("resizeLB", oDrag)[0]; 
    
    drag(oDrag, oTitle);
    //根据四角改变窗口大小
    resize(oDrag, oLT, true, true, false, false);
    resize(oDrag, oTR, false, true, false, false);
    resize(oDrag, oBR, false, false, false, false);
    resize(oDrag, oLB, true, false, false, false);
    //根据四边改变窗口大小
    resize(oDrag, oL, true, false, false, true);
	resize(oDrag, oT, false, true, true, false);
	resize(oDrag, oR, false, false, false, true);
    resize(oDrag, oB, false, false, true, false);
    //定位窗口的左侧和顶部，用来保证窗口居中
    oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + "px";
    oDrag.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + "px";
}