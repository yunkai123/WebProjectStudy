var zIndex = 1;
window.onload = function() {
    //获取元素
    var oPhoto = this.document.getElementById("photo");
    var aThumb = oPhoto.getElementsByTagName("img");
    var oBox = document.getElementById("box");
    var aLi = oBox.getElementsByTagName("li");
    var oInput = this.document.getElementsByTagName("input")[0];

    var i = 0;
    var imgPath = 0;//第几个文件夹中的图片
    var oDateStart = null;
    var aPos = []; //位置
    var aData = []; 

    //0-15数组
    for(i = 0; i < 15; i++) {
        aData.push(i + 1);
    }

    //缩略图
    for(i = 0; i < aThumb.length; i++) {
        aThumb[i].index = i;
        aThumb[i].onmouseover = function() {
            this.className += " hover";
        };
        aThumb[i].onmouseout = function() {
            this.className = this.className.replace(/\shover/, "");
        };
        aThumb[i].onclick = function() {
            for(i = 0; i < aThumb.length; i++) {
                aThumb[i].className = "";
            }
            this.className = "selected";
            imgPath = this.index;
            oBox.innerHTML = "";
            oInput.value = "开始游戏";
            createMask();
            aData.sort(function(a, b) {return a - b});//按从小到大排序
            GAME(false);
        }
    }

    //创建遮罩层
    function createMask() {
        var oMask = document.createElement("div");
        oMask.id = "mask";
        oMask.style.zIndex = zIndex;
        oBox.appendChild(oMask);
    }
    createMask();

    function GAME(ran) {
        //随机排列数组
        ran && aData.sort(function(a, b) {return Math.random() > 0.5 ? -1: 1});

        //插入结构,用来将一块块拼图插入
        var oFragment = document.createDocumentFragment();
        for(i = 0; i < aData.length; i++) {
            var oLi = document.createElement("li");
            var oImg = document.createElement("img");
            oImg.src = "img/girl" + imgPath + "/" + aData[i] + ".png";
            oLi.appendChild(oImg);
            oFragment.appendChild(oLi);
        }
        oBox.appendChild(oFragment);
        oBox.style.background = "url(img/girl" + imgPath + "/bg.png) no-repeat";

        for(i = 0; i < aLi.length; i++) {
            aLi[i].index = i;//添加索引
            aLi[i].style.top = aLi[i].offsetTop + "px";
            aLi[i].style.left = aLi[i].offsetLeft + "px";
            aPos.push({"left":aLi[i].offsetLeft, "top":aLi[i].offsetTop});
        }
        for(i = 0; i < aLi.length; i++) {
            aLi[i].style.position = "absolute";
            aLi[i].style.margin = "0";
            drag(aLi[i]);
        }

        /**
         * 添加拖动的函数
         * @param {Element} obj 被拖动的对象
         * @param {Element} handle 拖动对象时需要点击的元素
         */
        function drag(obj ,handle) {
            var handle = handle || obj;
            handle.style.cursor = "move";
            handle.onmousedown = function(event) {
                var event = event || window.event;
                var disX = event.clientX - this.offsetLeft;
                var disY = event.clientY - this.offsetTop;
                var oNear = null;
                obj.style.zIndex = zIndex++;
                document.onmousemove = function(event) {
                    var event = event || window.event;
                    var iL = event.clientX - disX;
                    var iT = event.clientY - disY;
                    var maxL = obj.parentNode.clientWidth - obj.offsetWidth;
                    var maxT = obj.parentNode.clientHeight - obj.offsetHeight;

                    iL < 0 && (iL = 0);
                    iT < 0 && (iT < 0);
                    iL > maxL && (iL = maxL);
                    iT > maxT && (iT = maxT);
                    obj.style.left = iL + "px";
                    obj.style.top = iT + "px";

                    for(i = 0; i < aLi.length; i++) {
                        aLi[i].className = "";
                    }

                    oNear = findNearest(obj);
                    oNear && (oNear.className = "hig");
                    return false;
                };

                document.onmouseup = function() {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    if(oNear){ //存在最近的碰撞元素
                        var tIndex = obj.index;
                        obj.index = oNear.index;
                        oNear.index = tIndex;
                        //交换位置
                        startMove(obj, aPos[obj.index]); 
                        startMove(oNear, aPos[oNear.index], function() {
                            if(finish()) {
                                var iHour = iMin = iSec = 0;
                                var oDateNow = new Date();
                                var iRemain = parseInt((oDateNow.getTime() - oDateStart.getTime()) /1000);

                                iHour = parseInt(iRemain / 3600);
                                iRemain %= 3600;
                                iMin = parseInt(iRemain/ 60);
                                iRemain %= 60;
                                iSec = iRemain;

                                alert("\u606d\u559c\u60a8\uff0c\u62fc\u56fe\u5b8c\u6210\uff01\n\n\u7528\u65f6\uff1a" 
                                    + iHour  + "\u5c0f\u65f6" + iMin + "\u5206" + iSec + "\u79d2");
                                createMask();
                            }
                        });
                        oNear.className = "";
                    }
                    else {
                        startMove(obj, aPos[obj.index]);
                    }
                    handle.releaseCapture && handle.releaseCapture();
                };
                this.setCapture && this.setCapture();
                return false;
            };
        }

        /**
         * 找出最近的碰撞元素
         * @param {Element} obj 
         */
        function findNearest(obj) {
            var filterLi = [];//存放碰撞的元素
            var aDistance = [];//存放和碰撞元素的距离
    
            for(i = 0; i < aLi.length; i++) {
                aLi[i] != obj && (isButt(obj, aLi[i]) && (aDistance.push(getDistance(obj, aLi[i])),
                    filterLi.push(aLi[i])));
            }
            var minNum = Number.MAX_VALUE;
            var minLi = null;
    
            for(i = 0; i < aDistance.length; i++) {
                aDistance[i] < minNum && (minNum = aDistance[i], minLi = filterLi[i]);
            }
    
            return minLi;
    
        }
    } 
    GAME();

    //开始游戏
    oInput.onclick = function() {
        oDateStart = new Date();
        oBox.innerHTML = "";
        this.value = "\u91cd\u65b0\u5f00\u59cb"
        GAME(true);
    };

    /**
     * 拼图是否完成
     */
    function finish() {
        var aTemp = [];
        var success = true;
        aTemp.length = 0;

        for(i = 0; i < aLi.length; i++) {
            for(var j = 0; j < aLi.length; j++) {
                i == aLi[j]["index"] && aTemp.push(aLi[j].getElementsByTagName("img")[0].src.match(/(\d+)\./)[1]);
            }           
        }
        for(i = 1; i <= aTemp.length; i++) {
            if(i != aTemp[i - 1]) {
                success = false;
                break;
            }
        }
        return success;
    }
};


/**
 * 求2个元素中心之间的距离
 * @param {Element} obj1 
 * @param {Element} obj2 
 */
function getDistance(obj1, obj2) {
    var a = (obj1.offsetLeft + obj2.offsetWidth / 2) - (obj2.offsetLeft + obj2.offsetWidth / 2);
    var b = (obj1.offsetTop + obj1.offsetHeight / 2) - (obj2.offsetTop + obj2.offsetHeight / 2);
    return Math.sqrt(a * a + b * b);
}

/**
 * 碰撞检测
 * @param {Element} obj1 
 * @param {Element} obj2 
 */
function isButt(obj1, obj2) {
    var l1 = obj1.offsetLeft;
    var t1 = obj1.offsetTop;
    var r1 = obj1.offsetLeft + obj1.offsetWidth;
    var b1 = obj1.offsetTop + obj1.offsetHeight;

    var l2 = obj2.offsetLeft;
    var t2 = obj2.offsetTop;
    var r2 = obj2.offsetLeft + obj2.offsetWidth;
    var b2 = obj2.offsetTop + obj2.offsetHeight;

    return !(r1 < l2 || b1 < t2 || r2 < l1 || b2 < t1);
}

/**
 * 获取最终样式
 * @param {Element} obj 元素
 * @param {string} attr 属性
 */
function getStyle(obj, attr) {
    return parseFloat(obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]);
}

//运动框架
function startMove(obj, pos, onEnd) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        doMove(obj, pos, onEnd);
    }, 30);
}

/**
 * 移动元素
 * @param {Element} obj 要移动的元素
 * @param {Object} pos 最终位置 {"left":"", "top": ""}
 * @param {function} onEnd 移动结束后要执行的函数，可选
 */
function doMove(obj, pos, onEnd) {
    var iCurL = getStyle(obj, "left");
    var iCurT = getStyle(obj, "top");
    var iSpeedL = (pos.left - iCurL) / 5;
    var iSpeedT = (pos.top - iCurT) / 5;
    iSpeedL = iSpeedL > 0 ? Math.ceil(iSpeedL) : Math.floor(iSpeedL);
    iSpeedT = iSpeedT > 0 ? Math.ceil(iSpeedT) : Math.floor(iSpeedT);

    if(pos.left == iCurL && pos.top == iCurT) { //如果到达最终位置
        clearInterval(obj.timer);
        onEnd && onEnd();
    }
    else { //没到达则继续
        obj.style.left = iCurL + iSpeedL + "px";
        obj.style.top = iCurT + iSpeedT + "px";
    }
}