window.onload = function() {
    initNumXY(200, 160, 40, 40);
    var hour_line = document.getElementById("hour-line");
    var minute_line = document.getElementById("minute-line");
    var second_line = document.getElementById("second-line");

    function setTime() {
        var date = new Date();
        var s = date.getSeconds();
        var m = date.getMinutes() + s / 60;
        var h = date.getHours() + m / 60;

        hour_line.style.transform = " rotate( " + (h * 30 - 90) + "deg ) ";
        minute_line.style.transform = " rotate( " + (m * 6 - 90) + "deg ) ";
        second_line.style.transform = " rotate( " + (s * 6 - 90 ) + "deg ) ";
    }

    setTime();//设置时间，不加这句开始会有一下停顿
    setInterval(setTime, 1000);

    //定位数字的位置，R：大圆的半径，r：数字所在位置小圆的半径，w: 数字的宽， h:数字的高
    function initNumXY(R, r, w, h) {
        var numXY = [
            {
                "left" : R + 0.5 * r - 0.5 * w,
                "top" : R - 0.5 * r * 1.73205 - 0.5 * h
            },
            {
                "left" : R + 0.5 * r * 1.73205 - 0.5 * w,
                "top" : R - 0.5 * r - 0.5 * h
            },
            {
                "left" : R + r - 0.5 * w,
                "top" : R - 0.5 * h
            },
            {
                "left" : R + 0.5 * r * 1.73205 - 0.5 * w,
                "top" : R + 0.5 * r - 0.5 * h
            },
            {
                "left" : R + 0.5 * r - 0.5 * w,
                "top" : R + 0.5 * r * 1.73205 - 0.5 * h
            },
            {
                "left" : R - 0.5 * w,
                "top" : R + r - 0.5 * h
            },
            {
                "left" : R - 0.5 * r - 0.5 * w,
                "top" : R + 0.5 * r * 1.73205 - 0.5 * h
            },
            {
                "left" : R - 0.5 * r * 1.73205 - 0.5 * w,
                "top" : R + 0.5 * r - 0.5 * h
            },
            {
                "left" : R - r - 0.5 * w,
                "top" : R - 0.5 * h
            },
            {
                "left" : R - 0.5 * r * 1.73205 - 0.5 * w,
                "top" : R - 0.5 * r - 0.5 * h
            },
            {
                "left" : R - 0.5 * r - 0.5 * w,
                "top": R - 0.5 * r * 1.73205 - 0.5 * h
            },
            {
                "left" : R - 0.5 * w,
                "top" : R - r - 0.5 * h
            }
        ];

        var clock = document.getElementById("clock");
        //钟表上添加数字
        for(var i = 1; i <= 12; i++) {
            if(i % 3 == 0) {
                clock.innerHTML += "<div class='clock-num em_num'>" + i + "</div>";
            } else {
                clock.innerHTML += "<div class='clock-num'>" + i + "<div>";
            }
            
        }

        var clock_num = document.getElementsByClassName("clock-num");
        //定位
        for(var i = 0; i < clock_num.length; i++) {
            
            clock_num[i].style.left = numXY[i].left + 'px';
            clock_num[i].style.top = numXY[i].top + 'px';
            
        }

        //钟表上添加刻度
        var ul = document.createElement("ul");
        ul.setAttribute("id", "list");
        clock.appendChild(ul);
        for(var i = 0; i < 60; i++) {
            var li = document.createElement("li");
            li.style.transform = "rotate( "+ i * 6 +"deg )";
            ul.appendChild(li);
        }
    }
}