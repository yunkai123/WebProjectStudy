//判断元素是否含有某个类
function hasClass(ele, clas) {
    return ele.className.match(new RegExp("(\\s|^)" + clas + "(\\s|$)"));
}
//为元素添加类
function addClass(ele, clas) {
    if(!this.hasClass(ele, clas)) {
        ele.className += " " + clas;
    }
}

//删除元素中的某个类
function removeClass(ele, clas) {
    if(hasClass(ele, clas)) {
        removeClass(ele, clas);
    }
    else {
        addClass(ele, clas);
    }
}

function popAlert(obj, head) {
    //判断浏览器是否为IE
    var isIE = (document.all) ? true : false;
    var isIE6 = isIE && !window.XMLHttpRequest;//IE6及一下版本不支持该对象
    //获取弹窗
    obj.style.position = !isIE6 ? "fixed" : "absolute";
    obj.style.zIndex = "999999"; //堆叠顺序，在最前面
    obj.style.display = "block"; //块状元素
    obj.style.left = obj.style.top = "50%"; //顶部和左侧定位到网页一半的地方
    //使弹窗居中
    obj.style.marginTop = -obj.offsetHeight / 2 + "px";
    obj.style.marginLeft = -obj.offsetWidth / 2 + "px";
    //创建灰色背景遮罩层
    var layer = document.createElement("div");
    layer.id = "layer";
    layer.style.width = layer.style.height = "100%";//覆盖全部父元素
    layer.style.position = !isIE6 ? "fixed" : "absolute";
    layer.style.top = layer.style.left = 0;
    layer.style.backgroundColor = "#888";
    layer.style.zIndex = "999998"; //仅在弹窗后面
    layer.style.opacity = "0.6"; //透明度
    document.body.appendChild(layer);
    //鼠标按住可移动
    alertMove(head);
    //弹窗主体在IE下的样式布局
    function alertIestyle() {
        obj.style.width = Math.max(document.documentElement.scrollWidth, 
            document.documentElement.clientWidth) + "px";
        obj.style.height = Math.max(document.documentElement.scrollHeight, 
            document.documentElement.clientHeight) + "px";
    }
    //灰色遮罩在IE下的样式布局
    function layerIeStyle() {
        layer.style.marginTop = document.documentElement.scrollTop - layer.offsetHeight / 2 + "px";
        layer.style.marginLeft  = document.documentElement.scrollLeft - layer.offsetWidth / 2 + "px";
    }
    if(isIE) {
        layer.style.filter = "alpha(opacity=60)";
    }
    if(isIE6) {
        layerIeStyle();
        alertIestyle();
        window.attachEvent("onscroll", alertIestyle);//绑定事件
        window.attchEvent("onresize", layerIeStyle);
    }

    function alertMove(obj) {
        var onOff = false;//鼠标按下的标志
        var l = 0; t = 0; x = 0; y = 0;
        var parent = obj.parentNode;//head的父元素就是弹窗
        obj.onmousedown = function(event) {
            var ev = event || window.event;
            x = ev.clientX;
            y = ev.clientY;
            l = parseInt(parent.offsetLeft);
            t = parseInt(parent.offsetTop);
            
            onOff = true;
            obj.style.cursor = "move";

            document.onmousemove = function(event) {
                if(onOff) {
                    var ev = event || window.event;
                    var moveX = l - (x - ev.clientX);
                    var moveY = t - (y - ev.clientY);                    

                    //设置拖动范围，防止跑到页面外,非必需
                    var pageW = document.documentElement.clientWidth;
                    var pageH = document.documentElement.clientHeight;
                    var dialogW = parent.offsetWidth;
                    var dialogH = parent.offsetHeight;
                    var maxX = pageW - dialogW;
                    var maxY = pageH - dialogH; 
                    moveX = Math.min(Math.max(0, moveX), maxX);
                    moveY = Math.min(Math.max(0, moveY), maxY);

                    parent.style.left = moveX + "px";
                    parent.style.top = moveY + "px";
                    parent.style.marginTop = "";
                    parent.style.marginLeft = "";
                }
            };
            document.onmouseup = function() {
                if(onOff) {
                    onOff = false;
                }
            }
        }
    }
}