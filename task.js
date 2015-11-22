//  不再提醒
//cookie操作函数 javascript红宝书第631页
var CookieUtil = {

    get: function (name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null,
            cookieEnd;

        if (cookieStart > -1) {
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }

        return cookieValue;
    },

    set: function (name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        if (expires instanceof Date) {
            cookieText += "; expires=" + expires.toGMTString();
        }

        if (path) {
            cookieText += "; path=" + path;
        }

        if (domain) {
            cookieText += "; domain=" + domain;
        }

        if (secure) {
            cookieText += "; secure";
        }

        document.cookie = cookieText;
    },

    unset: function (name, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
    }

};
var infobar = document.querySelector(".infobar"),
    infobar_right = document.querySelector("#infobar-right");
infobar_right.onclick = function () {
    CookieUtil.set("no_more_info", "1");
    infobar.style.display = "none";
};
if (document.cookie.indexOf("no_more_info") > -1) {//如果用document.cookie.includes("no_more_info")的话在chrome和IE可以但火狐不兼容
    infobar.style.display = "none";
};
var video_mask = document.querySelector(".video-mask"),
    video_btn = video_mask.querySelector(".close-btn"),
    video=video_mask.querySelector("#video");
video_btn.onclick = function () {
    video_mask.style.display = "none";
    opacity.style.display = "none";
    video.pause();
}
var opacity = document.querySelector("#opacity");
var video_thumb = document.querySelector("#video-thumb");
video_thumb.onclick = function () {
    video_mask.style.display = "block";
    opacity.style.display = "block";
}
   
    
    
/*网上找的ajax方法*/
var ajax = function (url, options) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var method, queryString = '', requestURL = url;//requestURL是供GET方法时使用
    var keyValuePairs = [];
    var i, lenOfKeyvaluepairs;

    requestURL += (requestURL.indexOf('?') == -1 ? '?' : '&');
    method = options.type ? options.type : 'get';

    //处理传入的参数，编码并拼接
    if (options.data) {
        if (typeof options.data == 'string') {
            queryString = options.data;
            requestURL += queryString;
        }
        else {
            for (var p in options.data) {
                if (options.data.hasOwnProperty(p)) {
                    var key = encodeURIComponent(p);
                    var value = encodeURIComponent(options.data[p]);
                    keyValuePairs.push(key + '=' + value);
                }
            }
            lenOfKeyvaluepairs = keyValuePairs.length;
            queryString = keyValuePairs.join('&');
            requestURL += queryString;
        }
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                options.onsuccess(xhr);
            }
            else {
                if (options.onfail) {
                    options.onfail();
                }
                else {
                    alert('Sorry,your request is unsuccessful:' + xhr.statusText);
                }
            }
        }
    };
    if (method == 'get') {
        xhr.open(method, requestURL, true);
        xhr.send(null);
    }
    else {
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(queryString);
    }
};
 
     
//登录关注
var login = document.querySelector(".login-area"),
    login_close = login.querySelector('.close-btn'),
    login_btn = login.querySelector(".login-btn");

login_btn.onclick = function () {
    var account = login.querySelector("#account"),
        password = login.querySelector("#password"),
        accountValue = account.value.trim(),//trim用来去掉空格
        passwordValue = password.value.trim();
    if (!accountValue || !passwordValue) {
        alert("账号或密码填写不完整");
    } else {
        var ajaxOnsuccess = function (xhr) {
            if (xhr.responseText == "1") {
                CookieUtil.set('loginSuc', '1');
                login.style.display = "none";
                alert("登录成功");
            } else {
                alert("用户名或密码出错");
            }
        }
        var url = 'http://study.163.com/webDev/login.htm';
        var options = {
            data: {
                userName: md5(accountValue),
                password: md5(passwordValue)
            },
            onsuccess: ajaxOnsuccess
        };
        ajax(url, options);
    }

}
login_close.onclick = function () {
    login.style.display = "none";
    opacity.style.display = "none";
}

var follow_action = function () {
    var url = 'http://study.163.com/webDev/attention.htm';
    var ajaxOnsuccess = function (xhr) {
        if (xhr.responseText == '1') {
            follow.style.display = "none";
            follow_cancel.style.display = "inline";
            num++;
            follow_area.querySelector("#fans-num").innerHTML = num;
            CookieUtil.set("followSuc", "1");
        }
    }
    var options = {
        onsuccess: ajaxOnsuccess
    };
    ajax(url, options);
}
var follow_cancel_action = function () {
    var url = 'http://study.163.com/webDev/attention.htm';
    var ajaxOnsuccess = function (xhr) {
        if (xhr.responseText == '1') {
            follow_cancel.style.display = "none";
            follow.style.display = "inline";
            num--;
            follow_area.querySelector("#fans-num").innerHTML = num;
            CookieUtil.unset("followSuc");
        }
    }
    var options = {
        onsuccess: ajaxOnsuccess
    };
    ajax(url, options);
}
     
//关注和取消关注点击按钮 
     
var follow_area = document.querySelector(".top-follow-area"),
    follow = follow_area.querySelector(".btn"),
    follow_cancel = follow_area.querySelector(".follow-cancel"),
    fans_num = follow_area.querySelector("#fans-num").innerHTML,
    num = parseInt(fans_num),
    cancel_btn = follow_cancel.querySelector(".btn-cancel");


follow.onclick = function () {
    if (document.cookie.indexOf("loginSuc") > -1) {

        follow_action();


    }
    else {
        login.style.display = "block";
        opacity.style.display = "block";
    }
}
cancel_btn.onclick = function () {
    follow_cancel_action();
}

  
//。
var getCourseLists=function(pageNo,psize,type,startPageIndex,currentPageIndex){
    var ajaxOnsuccess=function(xhr){
        
            
        var courseArea=document.querySelector('.course-display-area ul');
        var courseItemsLists=JSON.parse(xhr.responseText);
        var page_size=psize;
        var html_paragraph='';
        for(var i=0;i<page_size;i++){
            html_paragraph+='<li class="course-item"><img src=' + courseItemsLists.list[i]['bigPhotoUrl'] + ' alt="">'
            + '<div class="components"><p class="course-intro">' + courseItemsLists.list[i]['name'] + '</p>'
            + '<p class="course-tag">' + courseItemsLists.list[i]['categoryName'] + '</p>'
            + '<div class="num_of_people"><span class="enroll-people-num">' + courseItemsLists.list[i]['learnerCount'] + '</span></div>'
            + '<p class="course-price">¥ ' + courseItemsLists.list[i]['price'] + '</p></li>';

        }
        courseArea.innerHTML=html_paragraph;
        var totalPageCount=courseItemsLists.pagination.totlePageCount,
            navPageCount=totalPageCount<8?totalPageCount:8;

        var currentIndex=typeof currentPageIndex !='undefined'?currentPageIndex:pageNo-1;
        createPageNavigator(startPageIndex, totalPageCount,currentIndex, navPageCount );        

    };
    var url = 'http://study.163.com/webDev/couresByCategory.htm';
    var options = {
        data: {
            pageNo: pageNo,
            psize: psize,
            type: type
        },
        onsuccess: ajaxOnsuccess
    };
    ajax(url, options);
};
getCourseLists(1, 20, 10, 1);




var getHotRankingLists = (function () {

    var ajaxOnsuccess = function (xhr) {
        var hotRank = document.querySelector('.rank-list');
        var hotRankingLists = JSON.parse(xhr.responseText);
        var rank_html = '';
        for (var i = 0; i < 20; i++) { //返回20门课程
            rank_html +=
            '<li class="rank-list-item"><img src=' + hotRankingLists[i]['smallPhotoUrl'] + ' alt="">'
            + '<h4>' + hotRankingLists[i]['name'] + '</h4>'
            + '<div class="learner-count-area"><span class="learner-count">' + hotRankingLists[i]['learnerCount'] + '</span></div></li>';
        }
        hotRank.innerHTML = '<ul>' + rank_html + '</ul>';
    };

    var url = 'http://study.163.com/webDev/hotcouresByCategory.htm';
    var options = {
        onsuccess: ajaxOnsuccess
    };
    ajax(url, options);

})();

//每5秒滚动一次

  var autoRoll=function(){ 
      for (var i = 0; i < 10; i++) {
            (function (j) {
                setTimeout(function () {
                    var allItems=document.querySelector('.rank-list ul').childNodes;
                    var topItem=allItems[j];
                    topItem.style.transition='height 500ms';
                    topItem.style.overflow='hidden';
                    topItem.style.height='0';   
                    topItem.style.marginBottom='0px';
               }, j*5000);
             })(i);
        } ; 
  }
  setTimeout(autoRoll,5000);
  setInterval(function(){
      autoRoll();
      var allItems=document.querySelector('.rank-list ul').childNodes;
      for(var x=0;x<20;x++){allItems[x].style.cssText='';
          clearTimeout();}
  },55000);

    

    

var pageNavigatorSwitch = (function () {
    var page_nav_btn = document.querySelector('.page-nav-btn');
    page_nav_btn.addEventListener('click', function (e) {
        var targetIndex;
        var startPageIndex, lastPageIndex, currentPageIndex;
        var pageItems = page_nav_btn.querySelectorAll('.item');
        var tab_items = document.querySelectorAll('.tab-btn');
        currentPageIndex = getCurrentIndex(pageItems);
        var current_tab_index = getCurrentIndex(tab_items);
        var current_type = parseInt(tab_items[current_tab_index].getAttribute('data-type'));
        startPageIndex = parseInt(pageItems[0].innerHTML);
        lastPageIndex = parseInt(pageItems[pageItems.length - 1].innerHTML);

        if (e.target.className == 'item') {
            targetIndex = parseInt(e.target.getAttribute('data-skip-to'));
            getCourseLists(targetIndex + 1, 20, current_type, startPageIndex);
        }
        else if (e.target.className == 'last-page') {
            if (currentPageIndex > 0) {
                getCourseLists(currentPageIndex, 20, current_type, startPageIndex);
            }
            else if (currentPageIndex == 0) { 
                if (startPageIndex == 3) {
                    getCourseLists(2, 20, current_type, 1, 1);
                }
                else {
                    getCourseLists(startPageIndex - 1, 20, current_type, startPageIndex - pageItems.length, pageItems.length - 1);
                }
            }
            else return;
        }
        else if (e.target.className == 'next-page') {
            if (currentPageIndex < pageItems.length - 1) {
                getCourseLists(currentPageIndex + 2, 20, current_type, startPageIndex);
            }
            else if (currentPageIndex == pageItems.length - 1) {
                var boundryValue = 16; 
                if (lastPageIndex == boundryValue) {
                    getCourseLists(boundryValue + 1, 20, current_type, 11, 6);
                }
                else {
                    getCourseLists(lastPageIndex + 1, 20, current_type, lastPageIndex + 1, 0);
                }
            }
            else return;
        }
    }, false);
})();

var tabSwitch = (function () {
    var tab_btn_area = document.querySelector('.tab-btn-area');
    var tab_items = tab_btn_area.querySelectorAll('li');
    var len = tab_items.length, i;

    tab_btn_area.addEventListener('click', function (e) {
        var currentTabIndex = getCurrentIndex(tab_items);
        var type;
        for (i = 0; i < len; i++) {
            if (tab_items[i].contains(e.target)) {
                if (currentTabIndex == i) {
                    break;
                }
                else {
                    type = parseInt(tab_items[i].getAttribute('data-type'));
                    getCourseLists(1, 20, type, 1);
                    removeClass(tab_items[currentTabIndex], 'active');
                    addClass(tab_items[i], 'active');
                }
            }
        }

    }, false)

})();



var createPageNavigator = function (startPageIndex, totalPage, currentItemIndex, size) {

    var page_nav_btn = document.querySelector('.page-nav-btn');
    var last_page_btn_tmpl = '<li class="last-page"><</li>';
    var next_page_btn_tmpl = '<li class="next-page">></li>';
    var lastPageIndex;
    var i,
        len = size,
        page_nav_items = '';

    if (startPageIndex !== 1 || currentItemIndex !== 0) {
        page_nav_items += last_page_btn_tmpl;
    }
    for (i = 0; i < len; i++) {
        var pageIndexValue = startPageIndex + i;
        if (i == len - 1) {
            lastPageIndex = pageIndexValue;
        }

        page_nav_items += '<li class="item" data-skip-to="' + i + '">' + pageIndexValue + '</li>';
    }
    if (lastPageIndex != totalPage - 1 || currentItemIndex != size - 1) {
        page_nav_items += next_page_btn_tmpl;
    }
    page_nav_btn.innerHTML = page_nav_items;
    addClass(page_nav_btn.querySelectorAll('.item')[currentItemIndex], 'active');

}

    
// 轮播图
//先来几个class操作的函数
 function addClass(obj, cls){
    var obj_class = obj.className,//获取 class 内容.
    blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
    obj.className = added;//替换原来的 class.
}
 
function removeClass(obj, cls){
    var obj_class = ' '+obj.className+' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc        bcd' -> ' abc        bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc        bcd ' -> ' abc bcd '
    removed = obj_class.replace(' '+cls+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
}
 
function hasClass(obj, cls){
    var obj_class = obj.className,//获取 class 内容.
    obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
    x = 0;
    for(x in obj_class_lst) {
        if(obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
            return true;
        }
    }
    return false;
}


var cWidth = document.body.clientWidth,
    cHeight = cWidth / 1652 * 460,
    carousel_image = document.querySelector(".carousel-image"),
    image_item = carousel_image.children,
    pointer=document.querySelector(".pointer").children;
carousel_image.style.width = cWidth + "px";
carousel_image.style.height = cHeight + "px";//自适应
    
    var animate=function(targetIndex,currentIndex){
        image_item[currentIndex].style.opacity=0;
        removeClass(pointer[currentIndex],"active");
        image_item[targetIndex].style.opacity=1;
        addClass(pointer[targetIndex],"active");
    }

    var getCurrentIndex=function(items){
        var currentIndex;
        for(var i=0,len=items.length;i<len;i++){
         if(hasClass(items[i],"active")) {
             currentIndex=i;
             break;
         }
            
        }
        return currentIndex;
    };
    var autoAnimate=function(){
        var currentIndex=getCurrentIndex(pointer),targetIndex;
        if(currentIndex==pointer.length-1) targetIndex=0;
        else targetIndex=currentIndex+1;
        animate(targetIndex,currentIndex);          
    }
    var autoAnimate_start=setInterval(autoAnimate,5000);
    carousel_image.onmouseover=function(){
        clearInterval(autoAnimate_start);   
    }
     carousel_image.onmouseout=function(){
          autoAnimate_start=setInterval(autoAnimate,5000);
     }
    //  这个按钮要闭包
     var pointer_click=function(i){
         return function(){
             var currentIndex=getCurrentIndex(pointer);
            animate(i,currentIndex);
            }
         
     }
       for(var i=0;i<pointer.length;i++){
           pointer[i].onclick=pointer_click(i);
       }
       
       

 
 //改变窗口宽度时窄屏效果；但是会重新渲染界面，因此需刷新下
 //红宝书614页--函数节流
  function throttle(method, context) {
     clearTimeout(method.tId);
     method.tId = setTimeout(function(){
         method.call(context);
     }, 100);
 }
 var reloadFunc=function(){window.location.reload();};
  window.onresize = function(){
    throttle(reloadFunc);
}


