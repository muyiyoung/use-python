riot.tag("weather", '<div class="w-header"> <span class="y-icon icon-location" onclick="{changeLocation}" ga_event="mh_change_city">&nbsp;{options.city}</span> <span class="wind">{options.wind}</span> <span class="air" riot-style="background: {options.level}">{options.air}</span> </div> <ul class="y-box days-weather {show: options.weather_show}"> <li class="y-left day"> <span class="title">今天</span> <div title="{options.weather.current_condition}" class="weather-icon weather-icon-{options.weather.weather_icon_id}"></div> <span class="temperature"> <em>{options.weather.low_temperature}</em>&#176; &#47; <em>{options.weather.high_temperature}</em>&#176; </span> </li> <li class="y-left day"> <span class="title">明天</span> <div title="{options.weather.tomorrow_condition}" class="weather-icon weather-icon-{options.weather.tomorrow_weather_icon_id}"></div> <span class="temperature"> <em>{options.weather.tomorrow_low_temperature}</em>&#176; &#47; <em>{options.weather.tomorrow_high_temperature}</em>&#176; </span> </li> <li class="y-left day"> <span class="title">后天</span> <div title="{options.weather.dat_condition}" class="weather-icon weather-icon-{options.weather.dat_weather_icon_id}"></div> <span class="temperature"> <em>{options.weather.dat_low_temperature}</em>&#176; &#47; <em>{options.weather.dat_high_temperature}</em>&#176; </span> </li> </ul> <div class="y-box city-select {show: !options.weather_show}"> <div class="y-box"> <div class="y-left select-style"> <p class="y-box"> <span class="y-left name">{options.current_province}</span> <span class="y-right y-icon icon-more" onclick="{showProvinces}"></span> </p> <div class="y-box province-list {show: options.province_show}"> <a class="y-left item" href="javascript:;" each="{item, i in options.locations}" onclick="{changeProvince}"> {item} </a> </div> </div> <div class="y-right select-style"> <p class="y-box"> <span class="y-left name">{options.current_city}</span> <span class="y-right y-icon icon-more" onclick="{showCities}"></span> </p> <div class="y-box city-list {show: options.city_show}"> <a class="y-left item" href="javascript:;" each="{item, i in options.cities}" onclick="{changeCity}"> {item} </a> </div> </div> </div> <div class="y-box action"> <a href="javascript:;" class="y-left ok-btn" onclick="{onSubmitClick}">确定</a> <a href="javascript:;" class="y-right cancel-btn" onclick="{onCancelClick}">取消</a> </div> </div>', 'class="y-weather"', function() {
    function t(t) {
        var e = !0;
        return t >= 0 && 50 >= t ? {
            c: e ? "#5cbf4c" : "#5c8828",
            t: "优"
        } : t >= 51 && 100 >= t ? {
            c: e ? "#5cbf4c" : "#5c8828",
            t: "良"
        } : t >= 101 && 150 >= t ? {
            c: e ? "#ff9f2d" : "#c58120",
            t: "轻度污染"
        } : t >= 151 && 200 >= t ? {
            c: e ? "#ff9f2d" : "#c58120",
            t: "中度污染"
        } : t >= 201 && 300 >= t ? {
            c: e ? "#ff5f5f" : "#cf3d3d",
            t: "重度污染"
        } : t >= 301 ? {
            c: e ? "#ff5f5f" : "#cf3d3d",
            t: "严重污染"
        } : {
            c: "rgba( 214, 117, 3, 0.8 )",
            t: "其他"
        }
    }
    this.options = {
        current_province: "北京",
        current_city: "北京",
        province_show: !1,
        city_show: !1,
        weather_show: !0
    },
    riot.observable(this),
    this.on("weatherChange", function(t) {
        this._renderWeather(t)
    }),
    this.init = function() {
        this._getCities()
    }
    .bind(this),
    this.showProvinces = function() {
        this.options.city_show = !1,
        this.options.province_show = !this.options.province_show
    }
    .bind(this),
    this.showCities = function() {
        this.options.province_show = !1,
        this.options.city_show = !this.options.city_show
    }
    .bind(this),
    this.changeLocation = function() {
        this.options.weather_show = !1
    }
    .bind(this),
    this.changeProvince = function(t) {
        this.options.city_show = !1,
        this.options.province_show = !1,
        this.options.current_province = t.item.item,
        this._renderCities(t.item.item)
    }
    .bind(this),
    this.changeCity = function(t) {
        this.options.city_show = !1,
        this.options.province_show = !1,
        this.options.current_city = t.item.item
    }
    .bind(this),
    this.onSubmitClick = function() {
        var t = this;
        this.options.weather_show = !0,
        this._getWeather({
            city: t.options.current_city
        })
    }
    .bind(this),
    this.onCancelClick = function() {
        this.options.weather_show = !0
    }
    .bind(this),
    this._getWeather = function(t) {
        var e = this;
        http({
            url: "/stream/widget/local_weather/data/",
            method: "GET",
            data: t,
            success: function(t) {
                t = t || {},
                "success" === t.message && (e._renderWeather(t.data.weather),
                Cookies.set("WEATHER_CITY", t.data.city, {
                    expires: 100
                }),
                e.parent && e.parent.trigger("weatherChange", t.data.weather))
            }
        })
    }
    .bind(this),
    this._renderWeather = function(e) {
        this.options.weather = e,
        this.options.city = e.city_name,
        this.options.wind = e.wind_direction + e.wind_level + "级",
        this.options.air = e.quality_level + " " + e.aqi,
        this.options.level = t(e.aqi).c,
        this.update()
    }
    .bind(this),
    this._getCities = function() {
        var t = this;
        http({
            url: "/stream/widget/local_weather/city/",
            method: "GET",
            success: function(e) {
                e = e || {},
                "success" === e.message && (t.options.locations = e.data,
                t._renderCities(t.options.current_province))
            }
        })
    }
    .bind(this),
    this._renderCities = function(t) {
        this.options.cities = this.options.locations[t];
        for (var e in this.options.cities) {
            this.options.current_city = e;
            break
        }
        this.update()
    }
    .bind(this),
    this.on("mount", function() {
        this.init()
    })
}),
riot.tag("nav", '<div class="nav"> <ul class="y-box nav-list" ga_event="mh_channel"> <li each="{options.navItem}" class="y-left nav-item"> <a class="nav-link {active: location.pathname == url}" href="{url}" target="_blank" ga_event="mh_channel_{en}">{name}</a> </li> <li class="y-left nav-item nav-more"> <a class="nav-link" href="javascript:;"> 更多<i class="y-icon icon-more"></i> </a> <div class="nav-layer"> <ul class="nav-more-list"> <li each="{options.navMore}" class="nav-more-item"> <a href="{url}" target="_blank" ga_event="mh_channel_{en}">{name}</a> </li> </ul> </div> </li> </ul> </div>', function() {
    this.options = {
        navItem: [{
            name: "推荐",
            url: "/",
            en: "recommend"
        }, {
            name: "热点",
            url: "/ch/news_hot/",
            en: "hot"
        }, {
            name: "视频",
            url: "/ch/video/",
            en: "video"
        }, {
            name: "图片",
            url: "/ch/news_image/",
            en: "image"
        }, {
            name: "娱乐",
            url: "/ch/news_entertainment/",
            en: "entertainment"
        }, {
            name: "科技",
            url: "/ch/news_tech/",
            en: "tech"
        }, {
            name: "汽车",
            url: "/ch/news_car/",
            en: "car"
        }, {
            name: "体育",
            url: "/ch/news_sports/",
            en: "sports"
        }, {
            name: "财经",
            url: "/ch/news_finance/",
            en: "finance"
        }, {
            name: "军事",
            url: "/ch/news_military/",
            en: "military"
        }, {
            name: "国际",
            url: "/ch/news_world/",
            en: "world"
        }, {
            name: "时尚",
            url: "/ch/news_fashion/",
            en: "fashion"
        }, {
            name: "旅游",
            url: "/ch/news_travel/",
            en: "travel"
        }],
        navMore: [{
            name: "探索",
            url: "/ch/news_discovery/",
            en: "discovery"
        }, {
            name: "育儿",
            url: "/ch/news_baby/",
            en: "baby"
        }, {
            name: "养生",
            url: "/ch/news_regimen/",
            en: "regimen"
        }, {
            name: "美文",
            url: "/ch/news_essay/",
            en: "essay"
        }, {
            name: "游戏",
            url: "/ch/news_game/",
            en: "game"
        }, {
            name: "历史",
            url: "/ch/news_history/",
            en: "history"
        }, {
            name: "美食",
            url: "/ch/news_food/",
            en: "food"
        }]
    }
}),
riot.tag("wsearch", '<div name="searchBox" class="wsearch"> <form name="searchForm" action="/search/" method="get" target="_blank" onsubmit="{onSearchClick}"> <div name="inputbox" class="y-box input-group"> <input class="y-left input-text" name="keyword" value="{options.keyword}" autocomplete="off" ga_event="mh_search" type="text" placeholder="请输入关键字" onkeyup="{onKeyup}" onfocus="{onFocus}" onblur="{onBlur}"> <div class="y-right btn-submit"> <button type="submit" href="javascript:;"> <i class="y-icon icon-search" ga_event="mh_search"></i> </button> </div> </div> </form> <div class="layer {layer-show: options.layershow}" if="{options.suggestList.length > 0}"> <ul ga_event="mh_search"> <li each="{item, i in options.suggestList}" class="search-item" onclick="{onSearchItemClick}"> <a href="javascript:;"> <i if="{options.isHotwords}" class="search-no search-no-{i+1}">{i + 1}</i> <i if="{!options.isHotwords}" class="search-sug"></i> <span class="search-txt">{item}</span> </a> </li> </ul> </div> </div>', function(t) {
    function e(t) {
        (t >= 65 && 90 >= t || t >= 48 && 57 >= t || t >= 96 && 111 >= t || t >= 186 && 222 >= t || 8 == t || 46 == t || 32 == t || 13 == t) && (clearTimeout(s),
        s = setTimeout(function() {
            s = null,
            i(),
            n.update()
        }, 200)),
        n.update()
    }
    function i() {
        var t = n.keyword.value;
        "" != t.trim() && http({
            url: "/search/sug/",
            data: {
                keyword: t
            },
            method: "get",
            success: function(t) {
                "success" == t.message ? (n.options.suggestList = t.data,
                n.options.layershow = !0) : n.options.suggestList = [],
                n.options.isHotwords = !1,
                n.update()
            }
        })
    }
    var n = this
      , a = [];
    this.options = {
        suggestList: [],
        keyword: "",
        searchTip: "大家都在搜：",
        layershow: !1,
        isHotwords: !1
    },
    this.on("mount", function() {
        this.init()
    }),
    this.init = function() {
        !t.noHot && this._getHotWords()
    }
    .bind(this),
    this._getHotWords = function() {
        http({
            url: "/hot_words/",
            method: "GET",
            success: function(t) {
                t = t.hot_words || t || [],
                _.isArray(t) && 0 !== t.length && (n.options.suggestList = a = t,
                n.options.isHotwords = !0,
                n.options.keyword = n.options.searchTip + t[0],
                n.update())
            }
        })
    }
    .bind(this),
    this.onKeyup = function(t) {
        "" == this.keyword.value.trim() ? (this.options.isHotwords = !0,
        this.options.suggestList = a) : e(t.keyCode)
    }
    .bind(this),
    this.onFocus = function() {
        this.inputbox.style["border-color"] = "#ed4040",
        this.options.keyword = "",
        this.options.layershow = !0
    }
    .bind(this),
    this.onBlur = function() {
        this.inputbox.style["border-color"] = "#e8e8e8",
        this.options.layershow = !1
    }
    .bind(this),
    this.onSearchClick = function() {
        var t, e = this.keyword.value;
        return e ? (t = e.slice(0, 6),
        t !== this.options.searchTip || (this.options.keyword = e.slice(6),
        this.options.keyword) ? !0 : (this.keyword.focus(),
        !1)) : (this.keyword.focus(),
        !1)
    }
    .bind(this),
    this.onSearchItemClick = function(t) {
        this.options.keyword = t.item.item,
        this.update(),
        this.searchForm.submit()
    }
    .bind(this);
    var s = null
}),
riot.tag("wtopbar", '<div class="y-box wtopbar"> <ul class="y-left" if="{opts.home}"> <li class="tb-item"> <a class="tb-link" href="http://app.toutiao.com/news_article/" target="_blank" ga_event="mh_nav_others">下载APP</a> </li> <li class="tb-item weather" if="{opts.home}"> <a class="tb-link" href="javascript:;"> <span>&nbsp;{ options.city }</span> <span class="city_state">{ options.state }</span> <span class="city_temperature"> <em>{options.low}</em>&#176; &nbsp;&#47;&nbsp; <em>{options.top}</em>&#176; </span> <i class="y-icon icon-more"></i> </a> <div class="weather-box"> <div riot-tag="weather"></div> </div> </li> </ul> <div class="y-left y-nav-topbar" riot-tag="nav" if="{!opts.home}"></div> <ul class="y-right"> <li class="tb-item userbox"> <div riot-tag="wuserbox" userinfo="{opts.userInfo}" abtype="{opts.abType}" pageid="{opts.pageId}"></div> </li> <li class="tb-item"> <a onclick="{feedbackClick}" class="tb-link" href="javascript:void(0)">反馈</a> </li> <li class="tb-item"> <a class="tb-link" href="https://mp.toutiao.com/profile_introduction/infringement/complain" ga_event="mh_nav_complain" target="_blank">投诉侵权</a> </li> <li class="tb-item more"> <a class="tb-link" href="/about/">头条产品</a> <div class="layer"> <ul> <li> <a href="https://www.wukong.com" class="layer-item" ga_event="mh_nav_others" target="_blank">问答</a> </li> <li> <a href="https://mp.toutiao.com/" class="layer-item" target="_blank" ga_event="mh_nav_others">头条号</a> </li> <li> <a href="https://tuchong.com/" class="layer-item" target="_blank" ga_event="mh_nav_others">图虫</a> </li> <li> <a href="https://stock.tuchong.com/?source=ttweb" target="_blank" ga_event="mh_nav_others" class="layer-item">正版图库</a> </li> <li> <a href="https://ad.toutiao.com/promotion/?source2=pchometop" class="layer-item" target="_blank" ga_event="mh_nav_ad">广告投放</a> </li> </ul> </div> </li> </ul> <div id="J_userFeedback"></div> </div>', function(t) {
    this.options = {
        city: "",
        state: "",
        top: 0,
        low: 0,
        userInfo: t.userInfo
    };
    var e = this.tags.weather;
    this.tags.userFeedback,
    this.init = function() {
        if (this.opts.home) {
            var t = Cookies.get("WEATHER_CITY") || "";
            this._getWeather({
                city: t
            })
        }
    }
    .bind(this),
    this._getWeather = function(t) {
        var i = this;
        http({
            url: "/stream/widget/local_weather/data/",
            method: "GET",
            data: t,
            success: function(t) {
                t = t || {},
                "success" === t.message && (i._renderWeather(t.data.weather),
                e && e.trigger("weatherChange", t.data.weather))
            }
        })
    }
    .bind(this),
    this._renderWeather = function(t) {
        this.options.weather = t,
        this.options.city = t.city_name,
        this.options.state = t.current_condition,
        this.options.top = t.high_temperature,
        this.options.low = t.low_temperature,
        this.update()
    }
    .bind(this),
    this.init(),
    this.on("weatherChange", function(t) {
        this._renderWeather(t)
    }),
    this.on("mount", function() {
        var t = utils.getHashValue("#userFeedback");
        1 == t && riot.mount(".wtopbar #J_userFeedback", "userFeedback", {})
    }),
    this.feedbackClick = function() {
        riot.mount(".wtopbar #J_userFeedback", "userFeedback", {})
    }
    .bind(this)
}),
riot.tag("wuserbox", '<div class="y-box wuserbox"> <a if="{options.id && options.isPgc}" class="y-left new-article" href="http://mp.toutiao.com/new_article/" ga_event="mh_write">发文</a> <div if="{options.id}" class="y-right username"> <a ga_event="mh_nav_user" class="user-head" href="//www.toutiao.com/c/user/{options.id}/" target="_blank" rel="nofollow"> <div class="user-image"> <img onload="this.style.opacity=1;" riot-src="{options.avatarUrl}"> </div> <span>{options.name}</span> </a> <div class="user-layer"> <ul ga_event="mh_nav_user"> <li><a href="//www.toutiao.com/c/user/{options.id}/?tab=favourite" class="layer-item" target="_blank" rel="nofollow">我的收藏</a></li> <li><a href="//www.toutiao.com/c/user/relation/{options.id}/?tab=following" class="layer-item" target="_blank" rel="nofollow">我的关注</a></li> <li><a href="//www.toutiao.com/c/user/relation/{options.id}/?tab=followed" class="layer-item" target="_blank" rel="nofollow">我的粉丝</a></li> <li> <a href="https://sso.toutiao.com/logout/" class="layer-item" rel="nofollow">退出</a> </li> </ul> </div> </div> <div if="{!options.id}" class="nav-login"> <a ga_event="nav_login" href="javascript:;" onclick="{onLoginClick}"> <span>登录</span> </a> <div if="{options.alertMsg}" class="y-box login-layer"> <div class="y-left login-alert-icon"></div> <div class="y-right"> <p>手机号登录上线啦！！！</p> <p>登录同步头条App阅读兴趣，推荐更精准！</p> </div> <span onclick="{msgCloseClick}"> <i class="y-icon icon-dislikenewfeed"></i> </span> </div> </div> </div>', function(t) {
    var e = this;
    t.pageid,
    t.abtype,
    this.options = {
        id: t.userinfo.id,
        name: t.userinfo.name,
        avatarUrl: t.userinfo.avatarUrl,
        isPgc: t.userinfo.isPgc || !1,
        alertMsg: !1
    },
    this.onLoginClick = function() {
        window.location.href = "https://sso.toutiao.com/login/"
    }
    .bind(this),
    window.on("userChange", function(t) {
        t && (e.options.id = t.user_id,
        e.options.name = t.name,
        e.options.avatarUrl = t.avatar_url,
        e._isPgc(),
        e.update())
    }),
    this._isPgc = function() {
        var t = this;
        http({
            url: "/user/pgc_info/",
            method: "get",
            cache: !1,
            success: function(e) {
                e = e || {},
                "success" === e.message && e.data.is_pgc_author && (t.options.isPgc = !0,
                t.update())
            }
        })
    }
    .bind(this)
}),
riot.tag("login", '<div class="login-dialog {hide: options.hide}"> <a class="btn" href="javascript:;" onclick="{hide}"> <i class="icon icon-close"></i> </a> <div class="login-dialog-header"> <h3>邮箱登录</h3> </div> <div class="login-dialog-inner" data-node="inner"> <div class="login-pannel bottom-line"> <form action="/auth/login/" method="POST" onsubmit="{onFormSubmit}"> <ul> <li> <div class="input-group"> <div class="input"> <label>邮箱</label> <input class="name" name="name_or_email" type="text" placeholder="请使用您的注册邮箱" autocomplete="off" spellcheck="false"> </div> </div> </li> <li> <div class="input-group"> <div class="input"> <label>密码</label> <input class="password" name="password" type="password" data-node="password" placeholder="密码" autocomplete="off" spellcheck="false"> </div> </div> </li> <li class="captcha-box {show: options.captchaImg}"> <div class="input-group"> <div class="input"> <input class="password" name="captcha" type="text" data-node="captcha" placeholder="验证码" autocomplete="off" spellcheck="false"> <img name="captchaImg" riot-src="{options.captchaImg}"> </div> </div> </li> <li> <div class="input-group"> <input type="checkbox" name="remember_me" checked="" style="vertical-align:top"> <label for="remember_me" class="label">记住账号</label> </div> </li> <li> <div class="input-group" style="text-align: center;"> <input type="submit" class="submit-btn" value="登录"> <p class="{error: options.errorMsg}">{options.errorMsg}</p> </div> </li> </ul> </form> </div> <div class="login-dialog-header"> <h3>合作网站账号登录</h3> </div> <div class=""> <ul class="y-box sns_login_list" onclick="{onSnsLoginClick}"> <li class="sinaweibo"> <a href="javascript:;" data-pid="sina_weibo" ga_event="login_sina_weibo"> <i class="icon"></i> 新浪微博 </a> </li> <li class="qqweibo"> <a href="javascript:;" data-pid="qq_weibo" ga_event="login_tencnet_weibo"> <i class="icon"></i> 腾讯微博 </a> </li> <li class="qzone"> <a href="javascript:;" data-pid="qzone_sns" ga_event="login_qqzone"> <i class="icon"></i> QQ空间 </a> </li> <li class="renren"> <a href="javascript:;" data-pid="renren_sns" ga_event="login_renren"> <i class="icon"></i> 人人网 </a> </li> <li class="weixin"> <a href="javascript:;" style="margin-right:0;" data-pid="weixin" ga_event="login_wechat"> <i class="icon"></i> 微信 </a> </li> </ul> </div> </div> </div> <div class="mask {hide: options.hide}"></div>', function(t) {
    var e = this;
    riot.observable(this),
    this.options = {
        hide: !0,
        errorMsg: "",
        captchaImg: ""
    },
    this.curSpec = {
        successCb: t.successCb || function() {}
        ,
        errorCb: t.errorCb || function() {}
    },
    this.hide = function() {
        this.options.hide = !0,
        this.update()
    }
    .bind(this),
    this.onFormSubmit = function(t) {
        t.preventDefault();
        var e = this
          , i = http.serialize(t.currentTarget);
        user.loginByLoc({
            data: i,
            successCb: function(t) {
                "function" == typeof e.curSpec.successCb && e.curSpec.successCb(t),
                e.hide()
            },
            errorCb: function(t) {
                e.password.value = "",
                t = t || {};
                var i = t.data || {};
                e.options.errorMsg = i.description || "登录失败",
                i.captcha ? (e.captcha.value = "",
                e.options.captchaImg = "data:image/gif;base64," + i.captcha) : (e.captcha.value = "",
                e.options.captchaImg = ""),
                "function" == typeof e.curSpec.errorCb && e.curSpec.errorCb(t),
                e.update()
            }
        })
    }
    .bind(this),
    this.onSnsLoginClick = function(t) {
        var e = utils.getTarget(t)
          , i = utils.getAttribute(e, "data-pid") || utils.getAttribute(e.parentNode, "data-pid");
        this.hide(),
        user.loginByOther(i, this.curSpec)
    }
    .bind(this),
    window.on("login", function(t) {
        e.options.hide = !1,
        t = t || {},
        e.curSpec = {
            successCb: t.successCb || function() {}
            ,
            errorCb: t.errorCb || function() {}
        },
        e.update()
    })
}),
riot.tag("userFeedback", '<div class="feedback_dialog"> <div class="dialog-header"> <h3>意见反馈</h3> </div> <div class="dialog-inner"> <div class="feedback_panel"> <form onsubmit="{onFormSubmit}"> <p class="label">联系方式（必填）</p> <div class="input-group"> <input class="email" placeholder="您的邮箱/QQ号" type="text" name="feedback-email"> </div> <p class="label">您的意见（必填）</p> <div class="input-group"> <textarea style="height:100px;" name="feedback-content" class="content" maxlength="140" placeholder="请填写您的意见，不超过140字"></textarea> </div> <div class="input-group"> <input type="submit" class="{submit-btn:true,disabled:disabled}" value="提交" __disabled="{disabled}"> <span class="error">{msg}</span> <a class="close" href="javascript:void(0);" onclick="{hide}">[关闭]</a> </div> </form> </div> </div> </div>', 'class="userFeedback"', function() {
    this.message = {
        success: "已提交,感谢您的意见",
        fail: "提交错误,请稍后重试",
        mail_error: "请输入正确的联系方式",
        content_error: "请输入您的意见",
        content_length_error: "意见长度超出限制"
    };
    var t = this;
    this.msg = "",
    this.disabled = !1,
    this.showMessage = function(t) {
        this.msg = this.message[t],
        this.update()
    }
    .bind(this),
    this.hide = function() {
        this.unmount(!0)
    }
    .bind(this),
    this.onFormSubmit = function() {
        var e = this["feedback-email"]
          , i = this["feedback-content"];
        return e.value.length < 5 ? (e.focus(),
        this.showMessage("mail_error")) : "" === i.value ? (i.focus(),
        this.showMessage("content_error")) : (this.msg = "",
        this.disabled = !0,
        this.update(),
        void http({
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken")
            },
            url: "/post_message/",
            method: "post",
            data: {
                appkey: "web",
                uuid: e.value,
                content: "[" + window.location.host + "]" + i.value
            },
            success: function(n) {
                return "success" !== n.message ? t.showMessage("fail") : (e.value = "",
                i.value = "",
                t.disabled = !1,
                t.showMessage("success"),
                void setTimeout(function() {
                    t.hide()
                }, 1e3))
            },
            error: function() {
                t.disabled = !1,
                t.update(),
                t.showMessage("fail")
            }
        }))
    }
    .bind(this)
}),
riot.tag("toast", '<div name="toast" class="toast-inner" style="opacity: 10; filter:alpha(opacity=1000);"> <span>{opts.msg}</span> </div>', 'class="toast"', function() {
    var t = this;
    this.on("mount", function() {
        var e = this.toast
          , i = e.clientWidth
          , n = e.clientHeight
          , a = new TAnimation;
        e.style.cssText += "margin-top:-" + n / 2 + "px;margin-left:-" + i / 2 + "px",
        a.animate({
            el: e,
            prop: "opacity",
            to: 0,
            transitionDuration: 2e3
        }, function() {
            t.unmount(!0)
        })
    })
}),
riot.tag("raw", "", function(t) {
    this.root.innerHTML = t.content
}),
riot.tag("subchannel", '<ul name="subchannel" style="" ga_event="subchannel_click" class="sub-list {sub-list-suspension: options.isTop}"> <li class="sub-item {sub-selected: item.is_current}" each="{item, i in opts.subchannels}"> <a href="/ch/{{item.category}}/">{{item.name}}</a> </li> </ul>', 'if="{opts.subchannels}" class="subchannel"', function(t) {
    this.options = {
        suspension: t.suspension || !1,
        isTop: !1
    },
    this.init = function() {
        var t = this;
        if (this.options.suspension) {
            var e = document.getElementById("subchannel")
              , i = e.clientWidth;
            this.subchannel.style.width = i + "px",
            utils.on(window, "scroll", _.throttle(function() {
                var i = utils.scrollTop()
                  , n = utils.offset(e);
                t.options.isTop = i > n.top ? !0 : !1,
                t.update()
            }, 30))
        }
    }
    .bind(this),
    this.init()
}),
riot.tag("loading", '<div if="{options.cssAnimation}" class="loading ball-pulse"> <div></div> <div></div> <div></div> <span>{options.msg}&sdot;&sdot;&sdot;</span> </div> <div if="{!options.cssAnimation}" class="loading loading-normal"> <img src="//s3b.pstatp.com/toutiao/resource/toutiao_web/static/style/image/loading_50c5e3e.gif" alt=""> <span>{options.msg}&sdot;&sdot;&sdot;</span> </div>', function(t) {
    var e = utils.cssAnimationSupport();
    this.options = {
        cssAnimation: e,
        msg: t.msg || "推荐中"
    }
}),
riot.tag("verification", '<div class="code-header">输入验证码，继续浏览文章</div> <div class="y-box input-code"> <input type="text" autocomplete="false" name="code" id="" onkeydown="{onKeyDown}" placeholder="输入验证码"> <img riot-src="data:image/gif;base64,{options.captcha}"> </div> <p if="{options.error}" class="error-msg">验证码错误，请重试</p> <div class="ok-btn" onclick="{onOkClick}">确认</div>', 'if="{options.show}" id="verification"', function(t) {
    var e = this
      , i = t.noCheck;
    this.options = {
        error: !1,
        show: !1,
        captcha: ""
    },
    this.onOkClick = function() {
        var t = this;
        return "" !== t.code.value ? i ? (t.options.show = !1,
        window.trigger("codeVerificationSuccess", {
            captcha: t.code.value
        }),
        void t.update()) : void http({
            url: "/api/article/check_captcha/",
            method: "POST",
            data: {
                code: t.code.value
            },
            success: function(e) {
                "success" === e.message ? (t.options.show = !1,
                window.trigger("codeVerificationSuccess")) : (t.options.error = !0,
                t.options.captcha = e.data.captcha),
                t.update()
            }
        }) : void 0
    }
    .bind(this),
    this.onKeyDown = function(t) {
        var e = utils.getKeyCode(t);
        return 13 == e ? this.onOkClick() : !0
    }
    .bind(this),
    window.on("codeVerification", function(t) {
        e.options.show = !0,
        e.options.captcha = t.captcha || "",
        e.update()
    })
}),
!function(t) {
    var e = {};
    e.getHoney = function() {
        var t = Math.floor((new Date).getTime() / 1e3)
          , e = t.toString(16).toUpperCase()
          , i = md5(t).toString().toUpperCase();
        if (8 != e.length)
            return {
                as: "479BB4B7254C150",
                cp: "7E0AC8874BB0985"
            };
        for (var n = i.slice(0, 5), a = i.slice(-5), s = "", o = 0; 5 > o; o++)
            s += n[o] + e[o];
        for (var r = "", c = 0; 5 > c; c++)
            r += e[c + 3] + a[c];
        return {
            as: "A1" + s + e.slice(-3),
            cp: e.slice(0, 3) + r + "E1"
        }
    }
    ,
    t.ascp = e
}(window, document),
!function() {
    var t = {};
    t.getAds = function(t) {
        http({
            url: "/api/web_ads/",
            method: "get",
            success: function(e) {
                "success" === e.status && e.data.length > 0 && t && t(e.data)
            }
        })
    }
    ,
    window.ADModel = t
}(window, document),
!function(t, e) {
    function i(t) {
        var i, n = new RegExp("(^| )" + t + "=([^;]*)(;|$)");
        return (i = e.cookie.match(n)) ? unescape(i[2]) : null
    }
    function n() {
        return (new Date).getTime()
    }
    function a(t, e, i) {
        var a, s, o, r, c = 0;
        i || (i = {});
        var l = function() {
            c = i.leading === !1 ? 0 : n(),
            a = null,
            r = t.apply(s, o),
            a || (s = o = null)
        }
          , u = function() {
            var u = n();
            c || i.leading !== !1 || (c = u);
            var d = e - (u - c);
            return s = this,
            o = arguments,
            0 >= d || d > e ? (a && (clearTimeout(a),
            a = null),
            c = u,
            r = t.apply(s, o),
            a || (s = o = null)) : a || i.trailing === !1 || (a = setTimeout(l, d)),
            r
        };
        return u.cancel = function() {
            clearTimeout(a),
            c = 0,
            a = s = o = null
        }
        ,
        u
    }
    function s(t, e, i) {
        if (t.addEventListener)
            return t.addEventListener(e, i, !1),
            i;
        if (t.attachEvent) {
            var n = function() {
                var e = window.event;
                e.target = e.srcElement,
                i.call(t, e)
            };
            return t.attachEvent("on" + e, n),
            n
        }
    }
    function o(t, e) {
        if (!t)
            return "";
        var i = t.getAttribute(e);
        return i ? i : ""
    }
    function r(t, e, i) {
        t && t.setAttribute(e, i)
    }
    function c() {
        return window.innerHeight && window.innerWidth ? {
            winWidth: window.innerWidth,
            winHeight: window.innerHeight
        } : document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth ? {
            winWidth: document.documentElement.clientWidth,
            winHeight: document.documentElement.clientHeight
        } : void 0
    }
    function l(t) {
        var e = t.getBoundingClientRect();
        return e.top + 16 < v.winHeight && e.bottom > 16
    }
    function u(t) {
        var e = XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")
          , i = (t.type || "get").toUpperCase()
          , n = t.url
          , a = t.data;
        if (n) {
            var s = [];
            for (var o in a)
                s.push(o + "=" + a[o]);
            "GET" === i ? (n = n + "?" + s.join("&") + "&_=" + Math.random(),
            e.open(i, n, !0),
            e.send()) : (e.open(i, n, !0),
            e.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
            e.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
            e.send(s.join("&"))),
            e.onload = function() {
                (e.status >= 200 && e.status < 300 || 304 == e.status) && t.success && t.success.call(e, e.responseText)
            }
        }
    }
    function d(t) {
        u({
            url: m,
            type: "POST",
            data: {
                value: t.value,
                tag: "embeded_ad",
                label: t.label,
                is_ad_event: "1",
                log_extra: t.extra,
                category: "web",
                utm_source: i("utm_source"),
                csrfmiddlewaretoken: i("csrftoken")
            },
            success: function() {}
        }),
        taAnalysis && taAnalysis.send("event", {
            ev: "feed_ad_" + t.label
        })
    }
    function h(t) {
        var e = new Image;
        e.src = t
    }
    function g() {
        for (var t, e = 0, i = f.length; i > e; e++) {
            var n = f[e];
            l(n) ? 1 != o(n, "ad_show") && (r(n, "ad_show", 1),
            t = {
                value: o(n, "ad_id"),
                extra: o(n, "ad_extra") || p(n),
                label: "show",
                track: o(n, "ad_track")
            },
            t.track && h(t.track),
            d(t)) : r(n, "ad_show", 0)
        }
    }
    function p(t) {
        if (!t)
            return "";
        var e = t.querySelectorAll("#ad_extra")[0];
        return e.innerText || ""
    }
    var m = "/action_log/"
      , f = []
      , v = c()
      , _ = {};
    _.setAds = function(t) {
        f = t,
        g()
    }
    ,
    _.sendMsg = function(t) {
        d(t)
    }
    ,
    s(t, "scroll", a(function() {
        g()
    }, 150)),
    s(t, "resize", a(function() {
        v = c()
    }, 150)),
    t.tAdMonitor = _
}(window, document),
!function(t) {
    function e(t) {
        var e, i = 1, n = 0;
        if (t)
            for (i = 0,
            e = t.length - 1; e >= 0; e--)
                n = t.charCodeAt(e),
                i = (i << 6 & 268435455) + n + (n << 14),
                n = 266338304 & i,
                i = 0 != n ? i ^ n >> 21 : i;
        return i
    }
    function i() {
        var t = m;
        if (t)
            return t;
        var i = new Date - 0
          , n = window.location.href
          , a = e(n);
        return t = "" + i + a + Math.random() + Math.random() + Math.random() + Math.random(),
        t = t.replace(/\./g, "").substring(0, 32),
        m = t,
        t
    }
    function n(t) {
        var e, i = v[t];
        if (e = {
            qihu_ad_id: t,
            article_genre: "ad",
            single_mode: !0,
            ad_label: "聚效广告",
            source_url: i.curl || "",
            image_url: i.img || "",
            title: i.title || "",
            source: i.src || "",
            behot_time: Math.floor((new Date).getTime() / 1e3)
        },
        i.assets && i.assets.length) {
            e.image_list = [];
            for (var n = 0; n < i.assets.length; n++) {
                var a = i.assets[n];
                e.image_list.push({
                    url: a.img,
                    source_url: a.curl
                })
            }
            e.has_gallery = !0,
            e.single_mode = !1
        }
        return e
    }
    function a(t) {
        var e = [];
        for (var i in t)
            e.push(encodeURIComponent(i) + "=" + encodeURIComponent(t[i]));
        return e.join("&")
    }
    function s(t) {
        if (t = t || {},
        !t.url)
            return !1;
        var e = document.getElementsByTagName("head")[0]
          , i = a(t.data)
          , n = document.createElement("script");
        n.setAttribute("async", ""),
        e.appendChild(n),
        n.src = t.url + "?" + i
    }
    function o(t) {
        s({
            url: S,
            data: {
                jsonp: "_qihu_jsonpFun_",
                type: 1,
                of: 4,
                newf: 1,
                showid: T,
                uid: i(),
                scheme: window.location.protocol.slice(0, -1),
                impct: t,
                time: "ts_" + +new Date
            }
        })
    }
    function r() {
        for (var t, e = 0, i = w.length; i > e; e++)
            t = w[e],
            utils.isContentInView(t, p) ? 1 != utils.getAttribute(t, "ad_show") && (utils.setAttribute(t, "ad_show", 1),
            c(utils.getAttribute(t, "qihu_ad_id"), b, "show")) : utils.setAttribute(t, "ad_show", 0)
    }
    function c(e, i, n, a) {
        var s, o = v[e];
        if (o) {
            s = "show" == n ? o.imptk : o.clktk;
            for (var r = 0, c = s.length; c > r; r++)
                t._ad_qihu_img_ = new Image,
                t._ad_qihu_img_.src = s[r];
            var l = i + "_" + n;
            a && (l += "_" + a),
            taAnalysis && taAnalysis.send("event", {
                ev: l
            })
        }
    }
    function l() {
        var t = tStorage.get(y)
          , e = tStorage.decode(t);
        _.isArray(e) && (v = e)
    }
    function u() {
        var t = tStorage.get(k)
          , e = window.parseInt(t);
        C = e >= 0 && e < v.length ? e : -1
    }
    function d() {
        return v.length - (f + 1) < 2 && o(5),
        f + 1 < v.length ? n(++f) : null
    }
    function h() {
        return l(),
        u(),
        (-1 === C && 0 === v.length || C + 2 >= v.length) && (A || (A = !0,
        o(x))),
        C + 1 < v.length ? (tStorage.set(k, ++C),
        n(C)) : null
    }
    var g = {}
      , p = 10
      , m = 0
      , f = -1
      , v = []
      , w = []
      , b = ""
      , y = "__qihu_ads__"
      , k = "__qihu_ads_index__"
      , C = -1
      , x = 10
      , A = !1
      , T = "P5AcFE"
      , M = "http://show.g.mediav.com/s"
      , B = "https://show-g.mediav.com/s"
      , S = 0 === window.location.protocol.indexOf("https") ? B : M;
    window._qihu_jsonpFun_ = function(t) {
        t && t.ads && t.ads.length && (v = v.concat(t.ads),
        A && (A = !1,
        tStorage && tStorage.set(y, tStorage.encode(t.ads)),
        tStorage && tStorage.set(k, -1)),
        taAnalysis && taAnalysis.send("event", {
            ev: "feed_qihu_adshow_count",
            ext_id: t.ads.length
        }))
    }
    ,
    g.insertAd = function(t, e) {
        "video" === e && (T = "o4wUxb");
        var i, n = "video" === e ? h() : d(), a = !1;
        if (n && t.length) {
            for (var s = 0, o = t.length; o > s; s++)
                if (t[s].ad_id) {
                    a = !0,
                    t[s] = n;
                    break
                }
            a || (i = t.length > 3 ? 3 : t.length,
            t.splice(i, 0, n))
        }
    }
    ,
    g.setMonitorAds = function(t, e) {
        w = t,
        b = e,
        r()
    }
    ,
    g.reportData = function(t, e, i, n) {
        c(t, e, i, n)
    }
    ,
    utils.on(t, "scroll", _.throttle(function() {
        r()
    }, 200)),
    t.adQihu = g
}(window, document),
riot.tag("carouselBox", '<div id="carouselList" style="float: left;"></div> <div id="carouselTab" style="float: right;"></div>', 'class="y-box carouselBox"', function() {
    function t() {
        var t = document.getElementById("J_carousel");
        null != t && (t.style.display = "none")
    }
    var e = this;
    this.on("mount", function() {
        http({
            url: "/api/pc/focus/",
            method: "get",
            success: function(i) {
                if ("success" == i.message) {
                    var n = i.data.pc_feed_focus;
                    !n.length && t(),
                    n.length && riot.mount(".carouselBox #carouselList", "carouselList", {
                        list: n.slice(0, 6)
                    }),
                    n.length && riot.mount(".carouselBox #carouselTab", "carouselTab", {
                        list: n.slice(0, 6)
                    })
                } else
                    t();
                e.update()
            }
        })
    })
}),
riot.tag("carouselList", '<ul class="carousel-list" ga_event="focus_list_click" onmouseover="{onItemHover}" onmouseleave="{onItemLeave}"> <li each="{item, i in options.list}" class="carousel-item {carousel-item-active: i == options.current}" style="opacity: 0.1; filter:alpha(opacity=10);"> <a href="{item.display_url}" target="_blank"> <img data-src="{item.image_url}" alt=""> <p class="title">{item.title}</p> </a> </li> </ul>', 'class="carouselList"', function(t) {
    function e(t) {
        var e = document.querySelectorAll(".carousel-list li");
        itemCur = e[t],
        itemCur && (window.trigger("focusListItemChanged", t),
        i(itemCur),
        n(itemCur),
        o.animate({
            el: itemCur,
            prop: "opacity",
            to: 1,
            transitionDuration: 450,
            animationFun: "easeBothStrong"
        }, function() {}))
    }
    function i(t) {
        t.style.opacity = .1,
        t.style.filter = "alpha(opacity=10)"
    }
    function n(t) {
        var e = t.querySelectorAll("img")[0]
          , i = e.getAttribute("data-src");
        i && (e.src = i,
        e.removeAttribute("data-src"))
    }
    var a = this
      , s = null
      , o = new TAnimation;
    this.options = {
        current: 0,
        list: t.list,
        total: t.list.length
    },
    this.on("mount", function() {
        e(0),
        a.start()
    }),
    this.onItemHover = function() {
        this.stop()
    }
    .bind(this),
    this.onItemLeave = function() {
        this.start()
    }
    .bind(this),
    this.start = function() {
        s && a.stop(),
        s = setInterval(function() {
            a.next(),
            a.update()
        }, 5e3)
    }
    .bind(this),
    this.stop = function() {
        clearInterval(s),
        s = null
    }
    .bind(this),
    this.prev = function() {
        this.options.current > 0 ? this.options.current-- : this.options.current = this.options.total - 1,
        e(this.options.current)
    }
    .bind(this),
    this.next = function() {
        this.options.current < this.options.total - 1 ? this.options.current++ : this.options.current = 0,
        e(this.options.current)
    }
    .bind(this),
    window.on("focusTabItemChanged", function(t, i) {
        if ("enter" == i) {
            if (a.stop(),
            a.options.current === t)
                return;
            a.options.current = t,
            e(t),
            a.update()
        } else
            "leave" == i && a.start()
    })
}),
riot.tag("carouselTab", '<ul class="tab-list"> <li class="tab-item {tab-item-active: i == options.current}" onmouseenter="{onTabHover}" onmouseleave="{onTabLeave}" each="{item, i in options.tabs}"> {item} </li> </ul>', 'class="carouselTab"', function() {
    var t = this;
    this.options = {
        tabs: ["要闻", "社会", "娱乐", "体育", "军事", "明星"],
        current: 0
    },
    this.onTabHover = function(t) {
        this.options.current = t.item.i,
        window.trigger("focusTabItemChanged", t.item.i, "enter"),
        taAnalysis && taAnalysis.send("event", {
            ev: "focus_tab_hover"
        })
    }
    .bind(this),
    this.onTabLeave = function(t) {
        window.trigger("focusTabItemChanged", t.item.i, "leave")
    }
    .bind(this),
    window.on("focusListItemChanged", function(e) {
        t.options.current !== e && (t.options.current = e,
        t.update())
    })
}),
riot.tag("wchannel", '<div class="wchannel {wchannel-fixed: options.isSuspendion}" ga_event="left-channel-click"> <a class="logo" href="/"> <img src="//s3.pstatp.com/toutiao/resource/ntoutiao_web/static/image/logo_271e845.png" alt=""> </a> <ul> <li each="{item, i in options.navItem}" onclick="{onItemClick}"> <a class="wchannel-item {active: item.url == options.tag}" href="{item.url}" target="{_blank: item.independent}" ga_event="channel_{item.icon}_click"> <span>{item.name}</span> </a> </li> <li class="wchannel-more"> <a href="javascript:;" class="wchannel-item"> <span>更多</span> </a> <div class="wchannel-more-layer"> <ul> <li each="{item, i in options.navMore}"> <a class="y-left wchannel-item" href="{item.url}" target="{_blank: item.independent}" ga_event="channel_{item.icon}_click"> <span>{item.name}</span> </a> </li> </ul> </div> </li> </ul> </div>', function(t) {
    function e(t) {
        var e = i.options.navItem.length
          , n = i.options.navItem[e - 1];
        i.options.navItem[e - 1] = i.options.navMore[t],
        i.options.navMore[t] = n
    }
    var i = this;
    this.options = {
        navItem: [{
            name: "推荐",
            url: "/",
            icon: "recommand"
        }, {
            name: "阳光宽频",
            url: "https://365yg.com/",
            icon: "video",
            independent: !0
        }, {
            name: "热点",
            url: "/ch/news_hot/",
            icon: "hot"
        }, {
            name: "直播",
            url: "https://live.ixigua.com",
            log: "live",
            independent: !0
        }, {
            name: "图片",
            url: "/ch/news_image/",
            icon: "image",
            independent: !0
        }, {
            name: "科技",
            url: "/ch/news_tech/",
            icon: "technology"
        }, {
            name: "娱乐",
            url: "/ch/news_entertainment/",
            icon: "entertainment"
        }, {
            name: "游戏",
            url: "/ch/news_game/",
            icon: "game"
        }, {
            name: "体育",
            url: "/ch/news_sports/",
            icon: "sports"
        }, {
            name: "汽车",
            url: "/ch/news_car/",
            icon: "car"
        }, {
            name: "财经",
            url: "/ch/news_finance/",
            icon: "finance"
        }, {
            name: "搞笑",
            url: "/ch/funny/",
            icon: "funny"
        }],
        navMore: [{
            name: "军事",
            url: "/ch/news_military/",
            icon: "military"
        }, {
            name: "国际",
            url: "/ch/news_world/",
            icon: "international"
        }, {
            name: "时尚",
            url: "/ch/news_fashion/",
            icon: "fashion"
        }, {
            name: "旅游",
            url: "/ch/news_travel/",
            icon: "travel"
        }, {
            name: "探索",
            url: "/ch/news_discovery/",
            icon: "explore"
        }, {
            name: "育儿",
            url: "/ch/news_baby/",
            icon: "childcare"
        }, {
            name: "养生",
            url: "/ch/news_regimen/",
            icon: "health"
        }, {
            name: "美文",
            url: "/ch/news_essay/",
            icon: "article"
        }, {
            name: "历史",
            url: "/ch/news_history/",
            icon: "history"
        }, {
            name: "美食",
            url: "/ch/news_food/",
            icon: "food"
        }],
        isSuspendion: !1,
        tag: t.tag,
        province: t.province || "天津"
    },
    this.on("mount", function() {
        this.init(),
        this.update()
    }),
    this.init = function() {
        for (var i = t.tag, n = this.options.navMore.length, a = 0; n > a; a++) {
            var s = this.options.navMore[a];
            if (s.url === i) {
                e(a);
                break
            }
        }
    }
    .bind(this),
    utils.on(window, "scroll", _.throttle(function() {
        var t = utils.scrollTop();
        i.options.isSuspendion = t > 40,
        i.update()
    }, 10))
}),
riot.tag("msgAlert", '<div if="{options.show}" name="msgAlertPlace" class="msgAlert-place"> <div name="msgAlert" class="msgAlert"> <span onclick="{onRereshClick}" ga_event="refresh_float_click">您有未读新闻，点击查看</span> <i class="y-icon icon-dislikenewfeed" onclick="{onCloseRefreshClick}" ga_event="refresh_close_click"></i> </div> </div> <div class="msgAlert {msgAlert-hidden: options.articleCount < 0}"> <span if="{options.articleCount > 0}">为您推荐了{options.articleCount}篇文章</span> <span if="{options.articleCount == 0}">暂时没有更新，休息一会儿吧</span> <div style="background-color: #fff; height: 1px;"></div> </div>', function(t) {
    function e() {
        n && (clearTimeout(n),
        n = null),
        n = setTimeout(function() {
            i.options.show = !0,
            utils.removeClass(i.msgAlert, "msgAlert-fixed"),
            i.update()
        }, s)
    }
    var i = this
      , n = null
      , a = null
      , s = 36e4;
    this.options = {
        show: !1,
        category: t.category,
        articleCount: -1
    },
    this.onRereshClick = function() {
        this.options.show = !1,
        window.trigger("feedRefresh")
    }
    .bind(this),
    this.onCloseRefreshClick = function() {
        this.options.show = !1,
        e()
    }
    .bind(this),
    window.on("msgAlert-close", function() {
        i.options.show = !1,
        e(),
        i.update()
    }),
    window.on("feedRefreshStop", function(t) {
        i.options.articleCount = t > 0 ? t - 1 : 0,
        a && clearTimeout(a),
        a = setTimeout(function() {
            i.options.articleCount = -1,
            i.update()
        }, 2300)
    }),
    this.on("mount", function() {
        if ("__all__" === i.options.category) {
            this.msgAlert.style.width = t.mwidth + "px";
            var n = t.mtop;
            utils.on(window, "scroll", _.throttle(function() {
                var t = utils.offset(i.msgAlertPlace).top;
                n = t > n ? t : n,
                scrollTop = utils.scrollTop(),
                i.options.show && (scrollTop > n ? utils.addClass(i.msgAlert, "msgAlert-fixed") : utils.removeClass(i.msgAlert, "msgAlert-fixed"))
            }, 10)),
            e()
        }
    })
}),
riot.tag("feedBox", '<div class="feedBox" name="feedBox"> <div if="{options.isRefresh}" riot-tag="loading"></div> <div if="{opts.type==1}" riot-tag="wcommonFeed" list="{options.list}" category="{opts.category}" abtype="{opts.abType}"></div> <div if="{opts.type==2}" riot-tag="essayFeed" list="{options.list}"></div> <div if="{opts.type==3}" riot-tag="imgFeed" list="{options.list}"></div> <div if="{options.isLoadmore}" riot-tag="loading"></div> </div>', function(t) {
    function e(t) {
        var e = ascp.getHoney()
          , i = "";
        window.TAC && (i = TAC.sign("refresh" === t ? 0 : r.params.max_behot_time_tmp)),
        r.params = _.extend({}, r.params, {
            as: e.as,
            cp: e.cp,
            max_behot_time: "refresh" === t ? 0 : r.params.max_behot_time_tmp,
            _signature: i
        })
    }
    function i() {
        for (var t = 0; t < r.options.list.length; t++) {
            var e = r.options.list[t];
            e.timeago = utils.timeAgo(e.behot_time)
        }
    }
    function n() {
        var t;
        return tStorage.exist() && tStorage.get("n_cache_id") === s && (t = tStorage.get(o)),
        t && tStorage.decode(t)
    }
    function a(t) {
        tStorage.exist() && (tStorage.set("n_cache_id", s),
        t && tStorage.set(o, tStorage.encode(t)))
    }
    riot.observable(this);
    var s = "1"
      , o = "N" + location.pathname
      , r = this
      , c = !1
      , l = !1
      , u = 0
      , d = t.serviceType ? "/api/pc/feed/" : "/api/article/feed/";
    +t.abType,
    this.options = {
        list: [],
        isRefresh: !1,
        isLoadmore: !1
    },
    this.params = {
        category: t.category,
        utm_source: "toutiao",
        widen: t.widen || 0,
        max_behot_time: 0,
        max_behot_time_tmp: 0,
        tadrequire: !0
    },
    this.init = function() {
        var e = n();
        e && _.isArray(e.data) && (this.options.list = this.options.list.concat(e.data)),
        this.refresh(),
        utils.on(window, "scroll", _.throttle(function() {
            var t = utils.scrollTop()
              , e = r.feedBox.clientHeight
              , i = window.screen.height;
            600 > e - t - i && r.loadmore()
        }, 350)),
        2 !== t.type && setInterval(function() {
            i(),
            r.update()
        }, 12e4)
    }
    .bind(this),
    this.refresh = function(e) {
        window.scrollTo(0, e || 0),
        this.options.isRefresh = !0,
        r.update(),
        this.getData("refresh", function(e) {
            var i = e.data || [];
            r.options.isRefresh = !1,
            1 == t.type && i.length > 0 && r.options.list.push({
                feedMsg: !0,
                behot_time: r.params.max_behot_time_tmp,
                article_genre: "refresh"
            }),
            i.length > 0 && a(e),
            window.trigger("feedRefreshStop", i.length)
        })
    }
    .bind(this),
    this.loadmore = function() {
        this.options.isLoadmore = !0,
        r.update(),
        this.getData("loadmore", function() {
            r.options.isLoadmore = !1
        })
    }
    .bind(this),
    this.getData = function(n, a) {
        c || l || (c = !0,
        e(n),
        http({
            url: d,
            method: "get",
            data: r.params,
            success: function(e) {
                if ("success" === e.message) {
                    if (e.data && e.data.captcha)
                        return l = !0,
                        void window.trigger("codeVerification", e.data);
                    "refresh" === n && (r.options.list = [],
                    r.update()),
                    window.PAGE_SWITCH && window.PAGE_SWITCH.qihuAdShow && r.opts.widen && "__all__" == r.opts.category && ((0 === u || u % 2 !== 0) && adQihu && adQihu.insertAd(e.data, "feed"),
                    r.params.tadrequire = !r.params.tadrequire,
                    u++),
                    r.options.list = r.options.list.concat(e.data),
                    r.params.max_behot_time_tmp = e.next.max_behot_time,
                    2 !== t.type && i(),
                    taAnalysis && taAnalysis.send("event", {
                        ev: "article_show_count",
                        ext_id: e.data.length
                    })
                }
                c = !1,
                a && a(e),
                r.update()
            },
            error: function() {
                c = !1,
                a && a({}),
                r.update()
            }
        }))
    }
    .bind(this),
    this.init(),
    window.on("codeVerificationSuccess", function() {
        l = !1
    }),
    window.on("feedRefresh", function() {
        window.trigger("msgAlert-close");
        var t = 0;
        document.getElementById("J_carousel") && (t = 366),
        r.refresh(t)
    })
}),
riot.tag("wcommonFeed", '<div class="wcommonFeed"> <div riot-tag="msgAlert" category="{opts.category}" mwidth="660" mtop="500"></div> <ul> <li class="item {J_add: item.ad_id} {J_qihu_ad: item.qihu_ad_id!=undefined} {item-hidden: item.honey} {ugc-cell: item.ugc_data}" each="{item, i in opts.list}" ga_event="{item.article_genre}_item_click" ad_id="{item.ad_id}" qihu_ad_id="{item.qihu_ad_id}" ad_track="{item.ad_track_url}" group_id="{item.group_id}" onclick="{onItemClick}"> <span id="ad_extra" style="display:none;">{item.log_extra}</span> <div if="{!item.feedMsg && !item.ugc_data}" class="item-inner y-box"> <div class="normal {rbox: item.single_mode} {no-image: !item.single_mode&&!item.has_gallery}"> <div class="rbox-inner"> <div class="title-box" ga_event="{item.article_genre}_title_click"> <a class="link title" href="{item.source_url}" target="_blank"> {item.title} </a> </div> <div if="{item.has_gallery}" class="img-list y-box" ga_event="{item.article_genre}_img_click"> <a each="{imgItem, j in item.image_list}" class="img-wrap" href="{imgItem.source_url || item.source_url}" target="_blank"> <img riot-src="{imgItem.url}" alt=""> </a> <a if="{item.image_list.length < 4}" class="img-wrap" href="{item.source_url}" target="_blank"> <span class="add-info">查看详情&nbsp;<i class="y-icon icon-next-page"></i></span> </a> <span if="{!item.ad_label}" class="img-num">{item.gallary_image_count}图</span> </div> <div class="y-box footer"> <div class="y-left"> <a class="lbtn tag tag-bg-{tagHandle(item)}" if="{tagHandle(item)}" href="{item.tag_url}" target="_blank" ga_event="article_tag_click">{item.chinese_tag}</a> <div class="y-left" if="{!item.media_url}"> <a class="lbtn media-avatar avatar-bg-{parent.sourceFlag(item.source, i)}" href="/search/?keyword={item.source}" ga_event="{item.article_genre}_avatar_click" target="_blank">{parent.sourceHandle(item.source)}</a> <a class="lbtn source" href="/search/?keyword={item.source}" ga_event="{item.article_genre}_name_click" target="_blank">&nbsp;{item.source}&nbsp;&sdot;</a> </div> <div class="y-left" if="{item.media_url}"> <a class="lbtn media-avatar" ga_event="{item.article_genre}_avatar_click" href="{item.media_url}" target="_blank"> <img riot-src="{item.media_avatar_url}" alt=""> </a> <a class="lbtn source" ga_event="{item.article_genre}_name_click" href="{item.media_url}" target="_blank">&nbsp;{item.source}&nbsp;&sdot;</a> <a class="lbtn comment" ga_event="{item.article_genre}_comment_click" href="{item.source_url}/#comment_area" target="_blank">&nbsp;{item.comments_count}评论&nbsp;&sdot;</a> </div> <span class="lbtn">&nbsp;{item.timeago}</span> <span if="{item.is_related}" class="lbtn recommend">相关</span> <span if="{item.hot}" class="lbtn tag-hot">热</span> <a if="{item.ad_label}" class="lbtn recommend" ga_event="ad_label_click" target="_blank" href="https://ad.toutiao.com/promotion/?source2=pcfeedadtag">{item.ad_label}</a> </div> <div if="{item.group_id}" class="y-right"> <span class="dislike" data-groupid="{item.group_id}" ga_event="{item.article_genre}_dislike_click" onclick="{onDislikeClick}"> 不感兴趣 <i class="y-icon icon-dislikenewfeed"></i> </span> </div> </div> </div> </div> <div if="{item.single_mode}" class="lbox" ga_event="{item.article_genre}_img_click"> <a class="img-wrap" href="{item.source_url}" target="_blank"> <img riot-src="{item.image_url}" alt=""> <i if="{item.has_video && item.video_duration_str}" class="ftype video"> <span>{item.video_duration_str}</span> </i> </a> </div> </div> <div if="{item.ugc_data}" class="item-inner y-box ugc-item"> <div class="img-wrap" if="{item.ugc_data.ugc_images && item.ugc_data.ugc_images.length}"> <a href="{item.source_url}" target="_blank" class="img-center" ga_event="{item.article_genre}_img_click"> <img riot-src="{item.ugc_data.ugc_images[0]}" alt=""> </a> <span if="{item.ugc_data.ugc_images && item.ugc_data.ugc_images.length > 1}" class="img-num">{item.ugc_data.ugc_images.length}图</span> </div> <div class="desc-wrap"> <div class="ugc-user"> <a href="{item.ugc_data.ugc_user.open_url}" ga_event="{item.article_genre}_avatar_click" target="_blank"> <img riot-src="{item.ugc_data.ugc_user.avatar_url}" alt="{item.ugc_data.ugc_user.name}" class="ugc-avatar"> </a> <div class="ugc-desc"> <a class="ugc-name" ga_event="{item.article_genre}_name_click" href="{item.ugc_data.ugc_user.open_url}" target="_blank"> <span>{item.ugc_data.ugc_user.name}</span> <span if="{item.ugc_data.ugc_user.user_verified == 1}" class="y-icon dv"></span> </a> <p class="ugc-meta"> <span if="{item.ugc_data.ugc_user.is_following == true}">已关注</span> <span if="{item.ugc_data.ugc_user.is_following == false}">未关注</span> <span if="{item.ugc_data.ugc_user.user_auth_info.auth_info}">‧</span> <span>{item.ugc_data.ugc_user.user_auth_info.auth_info}</span> </p> </div> </div> <div class="ugc-content"> <a href="{item.source_url}" ga_event="{item.article_genre}_content_click" target="_blank">{item.ugc_data.content}</a> </div> <div class="y-box footer"> <div class="y-left"> <a class="lbtn comment" ga_event="{item.article_genre}_comment_click" href="{item.source_url}" target="_blank">{item.ugc_data.digg_count}赞</a> <a class="lbtn comment" ga_event="{item.article_genre}_comment_click" href="{item.source_url}/#comment_area" target="_blank">&nbsp;·&nbsp;{item.ugc_data.comment_count}评论</a> <a class="lbtn comment" ga_event="{item.article_genre}_comment_click" href="{item.source_url}" target="_blank">&nbsp;·&nbsp;{item.ugc_data.read_count}阅读</a> <span class="lbtn">&nbsp;·&nbsp;{item.timeago}</span> </div> <div if="{item.group_id}" class="y-right"> <span class="dislike" data-groupid="{item.group_id}" ga_event="{item.article_genre}_dislike_click" onclick="{onDislikeClick}"> 不感兴趣 <i class="y-icon icon-dislikenewfeed"></i> </span> </div> </div> </div> </div> <div if="{item.feedMsg}" class="list-refresh-msg" onclick="{onFeedrefreshClick}"> <span>{item.timeago}看到这里</span> &nbsp;点击刷新&nbsp;<i class="y-icon icon-refreshfeed"></i> </div> </li> </ul> </div>', function(t) {
    function e() {
        for (var t, e = 0, i = o.length; i > e; e++)
            t = o[e],
            utils.isContentInView(t, 10) && (c = utils.getAttribute(t, "group_id"),
            r[c] !== !0 && (taAnalysis && taAnalysis.send("event", {
                ev: "feed_ugc_show"
            }),
            r[c] = !0))
    }
    var i = this
      , n = t.category
      , a = {};
    t.abtype,
    this.onDislikeClick = function(t) {
        user.checkLogin({
            successCb: function() {
                i._dislike(t.item)
            },
            errorCb: function() {
                window.trigger("login", {
                    successCb: function(e) {
                        window.trigger("userChange", e),
                        i._dislike(t.item)
                    }
                })
            }
        })
    }
    .bind(this),
    this._dislike = function(e) {
        http({
            url: "/api/dislike/",
            data: {
                group_id: e.item.group_id,
                action: "dislike",
                app_name: "toutiao_web"
            },
            method: "post",
            success: function(n) {
                "success" === n.message && (t.list.splice(e.i, 1),
                i.update())
            }
        })
    }
    .bind(this),
    this.onFeedrefreshClick = function() {
        window.trigger("feedRefresh")
    }
    .bind(this),
    this.onItemClick = function(t) {
        var e = t.item.item;
        return e.ad_id && tAdMonitor && tAdMonitor.sendMsg({
            label: "click",
            value: e.ad_id,
            extra: e.log_extra
        }),
        void 0 != e.qihu_ad_id && adQihu && adQihu.reportData(e.qihu_ad_id, "feed_qihu_ad", "click"),
        !0
    }
    .bind(this);
    var s = {
        "热点": "hot",
        "视频": "video",
        "图片": "image",
        "社会": "society",
        "汽车": "car",
        "体育": "sport",
        "财经": "finance",
        "科技": "technology",
        "娱乐": "entertainment"
    };
    this.tagHandle = function(t) {
        return "__all__" == n && t.chinese_tag && !t.ad_id ? s[t.chinese_tag] || "other" : !1
    }
    .bind(this),
    this.sourceFlag = function(t, e) {
        return (t = t.replace(/\s*/gi, "")) ? (void 0 === a[t] && (a[t] = e % 6),
        a[t]) : 0
    }
    .bind(this),
    this.sourceHandle = function(t) {
        return t = t.replace(/\s*/gi, ""),
        t ? t.slice(0, 1) : ""
    }
    .bind(this);
    var o, r = {}, c = "";
    utils.on(window, "scroll", _.throttle(function() {
        e()
    }, 200)),
    this.on("updated", function() {
        if (tAdMonitor) {
            var t = document.querySelectorAll(".J_add");
            t && tAdMonitor.setAds(t)
        }
        try {
            if (adQihu) {
                var e = document.querySelectorAll(".J_qihu_ad");
                e && adQihu.setMonitorAds(e, "feed_qihu_ad")
            }
        } catch (i) {}
        o = document.querySelectorAll(".ugc-cell")
    })
}),
riot.tag("hotNews", '<div class="module-head news-head"> 24小时热闻 </div> <ul class="news-content"> <li each="{ items }" class="news-list"> <a href="{open_url}" target="_blank" class="news-link"> <div if="{image_url}" class="module-pic news-pic"><img riot-src="{image_url}"></div> <div class="news-inner"> <p class="module-title">{title}</p> </div> </a> </li> </ul>', 'class="hotNews module" ga_event="click_hot_news" if="{items.length!=0}"', function(t) {
    this.items = t.hotNews.slice(0, 4)
}),
riot.tag("whotvideo", '<div class="module-head video-head"> <a href="/video/" target="_blank">热门视频</a> </div> <ul class="video-list"> <li class="video-item" each="{item, i in options.list}"> <a href="{item.display_url}" target="_blank"> <dl> <dt class="module-pic"> <img riot-src="{item.pc_image_url}" alt=""> <i class="hot-tag video-tag"><span>{item.video_duration_format}</span></i> </dt> <dd> <div class="cell"> <h4>{item.title}</h4> <p> <span>{numFormat(item.video_play_count)}次播放&nbsp;</span> <span if="{!options.custom}">&sdot;&nbsp;{numFormat(item.comment_count)}评论</span> </p> </div> </dd> </dl> </a> </li> </ul>', 'class="whotvideo module" if="{options.list.length !== 0}" ga_event="click_video_recommend"', function(t) {
    var e = this;
    this.options = {
        list: [],
        custom: t.custom
    },
    this.on("mount", function() {
        http({
            url: "/api/pc/hot_video/",
            method: "get",
            data: {
                widen: 1
            },
            success: function(t) {
                "success" === t.message && 0 !== t.data.length && (e.options.list = t.data,
                e.update())
            }
        })
    }),
    this.numFormat = function(t) {
        return utils.numFormat(t, 1)
    }
    .bind(this)
}),
riot.tag("whotpicture", '<div class="module-head picture-head"> <a href="/news_image/" target="_blank">精彩图片</a> </div> <ul class="y-box picture-list"> <li class="y-left picture-item" each="{item, i in options.list}"> <a href="{item.article_url}" target="_blank"> <div class="module-pic picture-img"> <img riot-src="{item.cover_image_url}" alt=""> <i class="hot-tag"><span>{item.gallery_image_count}图</span></i> </div> <p>{item.title}</p> </a> </li> </ul>', 'class="whotpicture module" if="{options.list.length !== 0}" ga_event="click_pictures_recommend"', function() {
    var t = this;
    this.options = {
        list: []
    },
    this.on("mount", function() {
        http({
            url: "/api/pc/hot_gallery/",
            method: "get",
            data: {
                widen: 1
            },
            success: function(e) {
                "success" === e.message && 0 !== e.data.length && (t.options.list = e.data.slice(0, 6),
                t.update())
            }
        })
    })
}),
riot.tag("feedback", '<ul> <li class="tool-item" onclick="{onFeedRefresh}" title="刷新" ga_event="click_feed_newsrefresh"> <a href="javascript:;"> <i class="y-icon icon-refreshfeed"></i> </a> </li> <li class="tool-item go-top" onclick="{goTop}"> <a href="javascript:;"> <i class="y-icon icon-backtotopfeed"></i> </a> </li> </ul>', 'class="feedback"', function() {
    this.onFeedRefresh = function() {
        window.trigger("feedRefresh")
    }
    .bind(this),
    this.goTop = function() {
        window.scrollTo(0, 0)
    }
    .bind(this)
}),
riot.tag("tfeedadd", '<a class="add-wrap" href="{opts.add.web_url}" target="_blank"> <img riot-src="{opts.add.img}" alt=""> </a> <span onclick="{closeFeedAdd}" class="close-add"><i class="y-icon icon-dislikenewfeed"></i></span> <span class="ad-tag">广告</span>', 'class="tfeedadd" if="{!options.isClose}"', function() {
    this.options = {
        isClose: !1
    },
    this.closeFeedAdd = function(t) {
        this.options.isClose = !0,
        utils.preventDefault(t)
    }
    .bind(this)
}),
riot.tag("essayFeed", '<div class="essayFeed"> <ul> <li class="essay-item" each="{item in opts.list}"> <div if="{item.group.status === 112}" class="hot-tag">热门</div> <div class="media-info"> <a class="img-wrap" href="/c/user/{item.group.user.user_id}/" target="_blank"> <img riot-src="{item.group.user.avatar_url}" alt=""> </a> <a class="media-name" href="/c/user/{item.group.user.user_id}/" target="_blank">{item.group.user.name}</a> </div> <p class="essay-content">{item.group.text}</p> <a if="{item.comments && item.comments.length>0}" href="/api/article/joke/a{item.group.group_id}" target="_blank" class="god-comment"> <span>神评：</span>{item.comments[0].text} </a> <div class="essay-tool"> <div class="action-btn action-btn-left {selected:item.group.user_digg}" data-type="dig" onclick="{ diggClick }"> <i class="y-icon icon-handup"></i><span>{numFormat(item.group.digg_count)}</span> </div> <div class="action-btn action-btn-left {selected:item.group.user_bury}" data-type="bury" onclick="{ buryClick }"> <i class="y-icon icon-handdown"></i><span>{numFormat(item.group.bury_count)}</span> </div> <div class="action-btn action-btn-right share-wrap" > <i class="y-icon icon-share"></i> <span>{numFormat(item.group.share_count)}</span> <div class="snsbox clearfix"> <p class="snsbox-share">分享到:</p> <div class="snszone"> <i class="sns-btn sns-weixin" title="分享到微信" onmouseenter="{weixinshare}" data-share="0"> <div class="qrcodeW"> <div class="qrcode"></div> </div> </i> <i class="sns-btn sns-qzone" title="分享到QQ空间" onclick="{qzoneClick}"></i> <i class="sns-btn sns-weibo" title="分享到新浪微博" onclick="{tsinaClick}"></i> </div> </div> </div>  </div> </li> </ul> </div>', function() {
    var t = this;
    this.sendRequest = function(e, i) {
        var n = i.group.group_id
          , a = "/api/essay/item_action/"
          , s = function() {
            http({
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken")
                },
                url: a,
                method: "post",
                data: {
                    action: e,
                    group_id: n,
                    app_name: "neihanshequ_web",
                    csrfmiddlewaretoken: Cookies.get("csrftoken")
                },
                success: function(n) {
                    if ("success" === n.message) {
                        switch (e) {
                        case "digg":
                            i.group.user_digg = 1,
                            i.group.digg_count = n.digg_count;
                            break;
                        case "bury":
                            i.group.user_bury = 1,
                            i.group.bury_count = n.bury_count;
                            break;
                        case "repin":
                            i.group.user_repin = 1,
                            i.group.repin_count = n.repin_count;
                            break;
                        case "unrepin":
                            i.group.user_repin = 0,
                            i.group.repin_count = n.repin_count
                        }
                        t.update()
                    }
                }
            })
        };
        user.checkLogin({
            successCb: function() {
                s()
            },
            errorCb: function() {
                window.trigger("login", {
                    successCb: function(t) {
                        window.trigger("userChange", t),
                        s()
                    }
                })
            }
        })
    }
    .bind(this),
    this.diggClick = function(t) {
        var e = t.item.item;
        e.group.user_digg || e.group.user_bury || this.sendRequest("digg", e)
    }
    .bind(this),
    this.buryClick = function(t) {
        var e = t.item.item;
        e.group.user_digg || e.group.user_bury || this.sendRequest("bury", e)
    }
    .bind(this),
    this.repinClick = function(t) {
        var e = t.item.item
          , i = 0 == e.group.user_repin ? "repin" : "unrepin";
        this.sendRequest(i, e)
    }
    .bind(this),
    this.numFormat = function(t) {
        return "[object Number]" === Object.prototype.toString.call(+t) ? 1e4 > t ? t : (t / 1e4).toFixed(2) + "万" : void 0
    }
    .bind(this),
    this.qzoneClick = function(t) {
        var e = {
            url: "http://neihanshequ.com/p" + t.item.item.group.group_id + "/?app=news_article",
            text: "【（分享来自 @今日头条）" + t.item.item.group.text + "...",
            desc: "来自头条 http://toutiao.com"
        };
        bdshare("qzone", e)
    }
    .bind(this),
    this.tsinaClick = function(t) {
        var e = {
            url: "http://neihanshequ.com/p" + t.item.item.group.group_id + "/?app=news_article",
            text: "【（分享来自 @今日头条）" + t.item.item.group.text + "...",
            desc: "来自头条 http://toutiao.com"
        };
        bdshare("tsina", e)
    }
    .bind(this),
    this.weixinshare = function(t) {
        var e = t.target
          , i = "http://neihanshequ.com/p" + t.item.item.group.group_id + "/?app=news_article";
        if (1 != e.getAttribute("data-share")) {
            var n = qrCode(6, "M");
            n.addData(i),
            n.make(),
            e.getElementsByTagName("div")[1].innerHTML = n.createTableTag(),
            e.setAttribute("data-share", 1)
        }
    }
    .bind(this)
}),
riot.tag("imgFeed", '<ul class="img-feed" if="{opts.list.length}"> <li class="img-item {item-hidden: item.honey}" each="{item in opts.list}"> <a href="{item.source_url}" ga_event="click_photos_feed" target="_blank"> <div class="img-box clearfix"> <span class="pic-num">{item.gallary_image_count}图</span> <div class="image-wrap large" if="{item.gallary_flag==1}"> <img riot-src="{item.image_list[0].url}" alt=""> </div> <div class="image-wrap middle left" if="{item.gallary_flag==2}"> <img riot-src="{item.image_list[0].url}" alt=""> </div> <div class="image-wrap small right" if="{item.gallary_flag==2}"> <img riot-src="{item.image_list[1].url}" alt=""> </div> <div class="image-wrap small right" if="{item.gallary_flag==2}"> <img riot-src="{item.image_list[2].url}" alt=""> </div> <div class="image-wrap small right" if="{item.gallary_flag==3}"> <img riot-src="{item.image_list[0].url}" alt=""> </div> <div class="image-wrap middle left" if="{item.gallary_flag==3}"> <img riot-src="{item.image_list[1].url}" alt=""> </div> <div class="image-wrap small right" if="{item.gallary_flag==3}"> <img riot-src="{item.image_list[2].url}" alt=""> </div> </div> <div class="info"> <p class="des">{item.title}</p> <p class="extra"> <span if="{item.source}">{item.source}&nbsp;</span><span if="{item.comments_count && item.comments_count > 0}">·&nbsp;{item.comments_count}评论</span> </p> </div> </a> </li> </ul>', function() {}),
!function(t, e, i) {
    "undefined" != typeof module && module.exports ? module.exports = i() : "function" == typeof define && define.amd ? define("static/js/lib/qrcode", [], i) : e[t] = i()
}("qrCode", this, function() {
    function t(e, i) {
        if ("undefined" == typeof e.length)
            throw new Error(e.length + "/" + i);
        var n = function() {
            for (var t = 0; t < e.length && 0 == e[t]; )
                t += 1;
            for (var n = new Array(e.length - t + i), a = 0; a < e.length - t; a += 1)
                n[a] = e[a + t];
            return n
        }()
          , a = {};
        return a.get = function(t) {
            return n[t]
        }
        ,
        a.getLength = function() {
            return n.length
        }
        ,
        a.multiply = function(e) {
            for (var i = new Array(a.getLength() + e.getLength() - 1), n = 0; n < a.getLength(); n += 1)
                for (var s = 0; s < e.getLength(); s += 1)
                    i[n + s] ^= o.gexp(o.glog(a.get(n)) + o.glog(e.get(s)));
            return t(i, 0)
        }
        ,
        a.mod = function(e) {
            if (a.getLength() - e.getLength() < 0)
                return a;
            for (var i = o.glog(a.get(0)) - o.glog(e.get(0)), n = new Array(a.getLength()), s = 0; s < a.getLength(); s += 1)
                n[s] = a.get(s);
            for (var s = 0; s < e.getLength(); s += 1)
                n[s] ^= o.gexp(o.glog(e.get(s)) + i);
            return t(n, 0).mod(e)
        }
        ,
        a
    }
    var e = function(e, i) {
        var a = 236
          , o = 17
          , u = e
          , d = n[i]
          , h = null
          , m = 0
          , f = null
          , v = new Array
          , _ = {}
          , w = function(t, e) {
            m = 4 * u + 17,
            h = function(t) {
                for (var e = new Array(t), i = 0; t > i; i += 1) {
                    e[i] = new Array(t);
                    for (var n = 0; t > n; n += 1)
                        e[i][n] = null
                }
                return e
            }(m),
            b(0, 0),
            b(m - 7, 0),
            b(0, m - 7),
            C(),
            k(),
            A(t, e),
            u >= 7 && x(t),
            null == f && (f = B(u, d, v)),
            T(f, e)
        }
          , b = function(t, e) {
            for (var i = -1; 7 >= i; i += 1)
                if (!(-1 >= t + i || t + i >= m))
                    for (var n = -1; 7 >= n; n += 1)
                        -1 >= e + n || e + n >= m || (h[t + i][e + n] = i >= 0 && 6 >= i && (0 == n || 6 == n) || n >= 0 && 6 >= n && (0 == i || 6 == i) || i >= 2 && 4 >= i && n >= 2 && 4 >= n ? !0 : !1)
        }
          , y = function() {
            for (var t = 0, e = 0, i = 0; 8 > i; i += 1) {
                w(!0, i);
                var n = s.getLostPoint(_);
                (0 == i || t > n) && (t = n,
                e = i)
            }
            return e
        }
          , k = function() {
            for (var t = 8; m - 8 > t; t += 1)
                null == h[t][6] && (h[t][6] = t % 2 == 0);
            for (var e = 8; m - 8 > e; e += 1)
                null == h[6][e] && (h[6][e] = e % 2 == 0)
        }
          , C = function() {
            for (var t = s.getPatternPosition(u), e = 0; e < t.length; e += 1)
                for (var i = 0; i < t.length; i += 1) {
                    var n = t[e]
                      , a = t[i];
                    if (null == h[n][a])
                        for (var o = -2; 2 >= o; o += 1)
                            for (var r = -2; 2 >= r; r += 1)
                                h[n + o][a + r] = -2 == o || 2 == o || -2 == r || 2 == r || 0 == o && 0 == r ? !0 : !1
                }
        }
          , x = function(t) {
            for (var e = s.getBCHTypeNumber(u), i = 0; 18 > i; i += 1) {
                var n = !t && 1 == (e >> i & 1);
                h[Math.floor(i / 3)][i % 3 + m - 8 - 3] = n
            }
            for (var i = 0; 18 > i; i += 1) {
                var n = !t && 1 == (e >> i & 1);
                h[i % 3 + m - 8 - 3][Math.floor(i / 3)] = n
            }
        }
          , A = function(t, e) {
            for (var i = d << 3 | e, n = s.getBCHTypeInfo(i), a = 0; 15 > a; a += 1) {
                var o = !t && 1 == (n >> a & 1);
                6 > a ? h[a][8] = o : 8 > a ? h[a + 1][8] = o : h[m - 15 + a][8] = o
            }
            for (var a = 0; 15 > a; a += 1) {
                var o = !t && 1 == (n >> a & 1);
                8 > a ? h[8][m - a - 1] = o : 9 > a ? h[8][15 - a - 1 + 1] = o : h[8][15 - a - 1] = o
            }
            h[m - 8][8] = !t
        }
          , T = function(t, e) {
            for (var i = -1, n = m - 1, a = 7, o = 0, r = s.getMaskFunction(e), c = m - 1; c > 0; c -= 2)
                for (6 == c && (c -= 1); ; ) {
                    for (var l = 0; 2 > l; l += 1)
                        if (null == h[n][c - l]) {
                            var u = !1;
                            o < t.length && (u = 1 == (t[o] >>> a & 1));
                            var d = r(n, c - l);
                            d && (u = !u),
                            h[n][c - l] = u,
                            a -= 1,
                            -1 == a && (o += 1,
                            a = 7)
                        }
                    if (n += i,
                    0 > n || n >= m) {
                        n -= i,
                        i = -i;
                        break
                    }
                }
        }
          , M = function(e, i) {
            for (var n = 0, a = 0, o = 0, r = new Array(i.length), c = new Array(i.length), l = 0; l < i.length; l += 1) {
                var u = i[l].dataCount
                  , d = i[l].totalCount - u;
                a = Math.max(a, u),
                o = Math.max(o, d),
                r[l] = new Array(u);
                for (var h = 0; h < r[l].length; h += 1)
                    r[l][h] = 255 & e.getBuffer()[h + n];
                n += u;
                var g = s.getErrorCorrectPolynomial(d)
                  , p = t(r[l], g.getLength() - 1)
                  , m = p.mod(g);
                c[l] = new Array(g.getLength() - 1);
                for (var h = 0; h < c[l].length; h += 1) {
                    var f = h + m.getLength() - c[l].length;
                    c[l][h] = f >= 0 ? m.get(f) : 0
                }
            }
            for (var v = 0, h = 0; h < i.length; h += 1)
                v += i[h].totalCount;
            for (var _ = new Array(v), w = 0, h = 0; a > h; h += 1)
                for (var l = 0; l < i.length; l += 1)
                    h < r[l].length && (_[w] = r[l][h],
                    w += 1);
            for (var h = 0; o > h; h += 1)
                for (var l = 0; l < i.length; l += 1)
                    h < c[l].length && (_[w] = c[l][h],
                    w += 1);
            return _
        }
          , B = function(t, e, i) {
            for (var n = r.getRSBlocks(t, e), l = c(), u = 0; u < i.length; u += 1) {
                var d = i[u];
                l.put(d.getMode(), 4),
                l.put(d.getLength(), s.getLengthInBits(d.getMode(), t)),
                d.write(l)
            }
            for (var h = 0, u = 0; u < n.length; u += 1)
                h += n[u].dataCount;
            if (l.getLengthInBits() > 8 * h)
                throw new Error("code length overflow. (" + l.getLengthInBits() + ">" + 8 * h + ")");
            for (l.getLengthInBits() + 4 <= 8 * h && l.put(0, 4); l.getLengthInBits() % 8 != 0; )
                l.putBit(!1);
            for (; !(l.getLengthInBits() >= 8 * h) && (l.put(a, 8),
            !(l.getLengthInBits() >= 8 * h)); )
                l.put(o, 8);
            return M(l, n)
        };
        return _.addData = function(t) {
            var e = l(t);
            v.push(e),
            f = null
        }
        ,
        _.isDark = function(t, e) {
            if (0 > t || t >= m || 0 > e || e >= m)
                throw new Error(t + "," + e);
            return h[t][e]
        }
        ,
        _.getModuleCount = function() {
            return m
        }
        ,
        _.make = function() {
            w(!1, y())
        }
        ,
        _.createTableTag = function(t, e) {
            t = t || 2,
            e = "undefined" == typeof e ? 4 * t : e;
            var i = "";
            i += '<table style="',
            i += " border-width: 0px; border-style: none;",
            i += " border-collapse: collapse;",
            i += '">',
            i += "<tbody>";
            for (var n = 0; n < _.getModuleCount(); n += 1) {
                i += "<tr>";
                for (var a = 0; a < _.getModuleCount(); a += 1)
                    i += '<td style="',
                    i += " border-width: 0px; border-style: none;",
                    i += " border-collapse: collapse;",
                    i += " padding: 0px; margin: 0px;",
                    i += " width: " + t + "px;",
                    i += " height: " + t + "px;",
                    i += " background-color: ",
                    i += _.isDark(n, a) ? "#000000" : "#ffffff",
                    i += ";",
                    i += '"/>';
                i += "</tr>"
            }
            return i += "</tbody>",
            i += "</table>"
        }
        ,
        _.createImg = function(t, e) {
            t = t || 2,
            e = "undefined" == typeof e ? 4 * t : e;
            var i = _.getModuleCount() * t + 2 * e
              , n = e
              , a = i - e
              , s = g(i, i, function(e, i) {
                if (e >= n && a > e && i >= n && a > i) {
                    var s = Math.floor((e - n) / t)
                      , o = Math.floor((i - n) / t);
                    return _.isDark(o, s) ? 0 : 1
                }
                return 1
            });
            return {
                width: i,
                height: i,
                src: s
            }
        }
        ,
        _.createImgTag = function(t, e) {
            var i = this.createImg(t, e);
            return p(i.width, i.height, i.src)
        }
        ,
        _
    };
    e.stringToBytes = function(t) {
        for (var e = new Array, i = 0; i < t.length; i += 1) {
            var n = t.charCodeAt(i);
            e.push(255 & n)
        }
        return e
    }
    ,
    e.createStringToBytes = function(t, e) {
        var i = function() {
            for (var i = d(t), n = function() {
                var t = i.read();
                if (-1 == t)
                    throw new Error;
                return t
            }, a = 0, s = {}; ; ) {
                var o = i.read();
                if (-1 == o)
                    break;
                var r = n()
                  , c = n()
                  , l = n()
                  , u = String.fromCharCode(o << 8 | r)
                  , h = c << 8 | l;
                s[u] = h,
                a += 1
            }
            if (a != e)
                throw new Error(a + " != " + e);
            return s
        }()
          , n = "?".charCodeAt(0);
        return function(t) {
            for (var e = new Array, a = 0; a < t.length; a += 1) {
                var s = t.charCodeAt(a);
                if (128 > s)
                    e.push(s);
                else {
                    var o = i[t.charAt(a)];
                    "number" == typeof o ? (255 & o) == o ? e.push(o) : (e.push(o >>> 8),
                    e.push(255 & o)) : e.push(n)
                }
            }
            return e
        }
    }
    ;
    var i = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
    }
      , n = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
    }
      , a = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
    }
      , s = function() {
        var e = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]]
          , n = 1335
          , s = 7973
          , r = 21522
          , c = {}
          , l = function(t) {
            for (var e = 0; 0 != t; )
                e += 1,
                t >>>= 1;
            return e
        };
        return c.getBCHTypeInfo = function(t) {
            for (var e = t << 10; l(e) - l(n) >= 0; )
                e ^= n << l(e) - l(n);
            return (t << 10 | e) ^ r
        }
        ,
        c.getBCHTypeNumber = function(t) {
            for (var e = t << 12; l(e) - l(s) >= 0; )
                e ^= s << l(e) - l(s);
            return t << 12 | e
        }
        ,
        c.getPatternPosition = function(t) {
            return e[t - 1]
        }
        ,
        c.getMaskFunction = function(t) {
            switch (t) {
            case a.PATTERN000:
                return function(t, e) {
                    return (t + e) % 2 == 0
                }
                ;
            case a.PATTERN001:
                return function(t) {
                    return t % 2 == 0
                }
                ;
            case a.PATTERN010:
                return function(t, e) {
                    return e % 3 == 0
                }
                ;
            case a.PATTERN011:
                return function(t, e) {
                    return (t + e) % 3 == 0
                }
                ;
            case a.PATTERN100:
                return function(t, e) {
                    return (Math.floor(t / 2) + Math.floor(e / 3)) % 2 == 0
                }
                ;
            case a.PATTERN101:
                return function(t, e) {
                    return t * e % 2 + t * e % 3 == 0
                }
                ;
            case a.PATTERN110:
                return function(t, e) {
                    return (t * e % 2 + t * e % 3) % 2 == 0
                }
                ;
            case a.PATTERN111:
                return function(t, e) {
                    return (t * e % 3 + (t + e) % 2) % 2 == 0
                }
                ;
            default:
                throw new Error("bad maskPattern:" + t)
            }
        }
        ,
        c.getErrorCorrectPolynomial = function(e) {
            for (var i = t([1], 0), n = 0; e > n; n += 1)
                i = i.multiply(t([1, o.gexp(n)], 0));
            return i
        }
        ,
        c.getLengthInBits = function(t, e) {
            if (e >= 1 && 10 > e)
                switch (t) {
                case i.MODE_NUMBER:
                    return 10;
                case i.MODE_ALPHA_NUM:
                    return 9;
                case i.MODE_8BIT_BYTE:
                    return 8;
                case i.MODE_KANJI:
                    return 8;
                default:
                    throw new Error("mode:" + t)
                }
            else if (27 > e)
                switch (t) {
                case i.MODE_NUMBER:
                    return 12;
                case i.MODE_ALPHA_NUM:
                    return 11;
                case i.MODE_8BIT_BYTE:
                    return 16;
                case i.MODE_KANJI:
                    return 10;
                default:
                    throw new Error("mode:" + t)
                }
            else {
                if (!(41 > e))
                    throw new Error("type:" + e);
                switch (t) {
                case i.MODE_NUMBER:
                    return 14;
                case i.MODE_ALPHA_NUM:
                    return 13;
                case i.MODE_8BIT_BYTE:
                    return 16;
                case i.MODE_KANJI:
                    return 12;
                default:
                    throw new Error("mode:" + t)
                }
            }
        }
        ,
        c.getLostPoint = function(t) {
            for (var e = t.getModuleCount(), i = 0, n = 0; e > n; n += 1)
                for (var a = 0; e > a; a += 1) {
                    for (var s = 0, o = t.isDark(n, a), r = -1; 1 >= r; r += 1)
                        if (!(0 > n + r || n + r >= e))
                            for (var c = -1; 1 >= c; c += 1)
                                0 > a + c || a + c >= e || (0 != r || 0 != c) && o == t.isDark(n + r, a + c) && (s += 1);
                    s > 5 && (i += 3 + s - 5)
                }
            for (var n = 0; e - 1 > n; n += 1)
                for (var a = 0; e - 1 > a; a += 1) {
                    var l = 0;
                    t.isDark(n, a) && (l += 1),
                    t.isDark(n + 1, a) && (l += 1),
                    t.isDark(n, a + 1) && (l += 1),
                    t.isDark(n + 1, a + 1) && (l += 1),
                    (0 == l || 4 == l) && (i += 3)
                }
            for (var n = 0; e > n; n += 1)
                for (var a = 0; e - 6 > a; a += 1)
                    t.isDark(n, a) && !t.isDark(n, a + 1) && t.isDark(n, a + 2) && t.isDark(n, a + 3) && t.isDark(n, a + 4) && !t.isDark(n, a + 5) && t.isDark(n, a + 6) && (i += 40);
            for (var a = 0; e > a; a += 1)
                for (var n = 0; e - 6 > n; n += 1)
                    t.isDark(n, a) && !t.isDark(n + 1, a) && t.isDark(n + 2, a) && t.isDark(n + 3, a) && t.isDark(n + 4, a) && !t.isDark(n + 5, a) && t.isDark(n + 6, a) && (i += 40);
            for (var u = 0, a = 0; e > a; a += 1)
                for (var n = 0; e > n; n += 1)
                    t.isDark(n, a) && (u += 1);
            var d = Math.abs(100 * u / e / e - 50) / 5;
            return i += 10 * d
        }
        ,
        c
    }()
      , o = function() {
        for (var t = new Array(256), e = new Array(256), i = 0; 8 > i; i += 1)
            t[i] = 1 << i;
        for (var i = 8; 256 > i; i += 1)
            t[i] = t[i - 4] ^ t[i - 5] ^ t[i - 6] ^ t[i - 8];
        for (var i = 0; 255 > i; i += 1)
            e[t[i]] = i;
        var n = {};
        return n.glog = function(t) {
            if (1 > t)
                throw new Error("glog(" + t + ")");
            return e[t]
        }
        ,
        n.gexp = function(e) {
            for (; 0 > e; )
                e += 255;
            for (; e >= 256; )
                e -= 255;
            return t[e]
        }
        ,
        n
    }()
      , r = function() {
        var t = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16]]
          , e = function(t, e) {
            var i = {};
            return i.totalCount = t,
            i.dataCount = e,
            i
        }
          , i = {}
          , a = function(e, i) {
            switch (i) {
            case n.L:
                return t[4 * (e - 1) + 0];
            case n.M:
                return t[4 * (e - 1) + 1];
            case n.Q:
                return t[4 * (e - 1) + 2];
            case n.H:
                return t[4 * (e - 1) + 3];
            default:
                return void 0
            }
        };
        return i.getRSBlocks = function(t, i) {
            var n = a(t, i);
            if ("undefined" == typeof n)
                throw new Error("bad rs block @ typeNumber:" + t + "/errorCorrectLevel:" + i);
            for (var s = n.length / 3, o = new Array, r = 0; s > r; r += 1)
                for (var c = n[3 * r + 0], l = n[3 * r + 1], u = n[3 * r + 2], d = 0; c > d; d += 1)
                    o.push(e(l, u));
            return o
        }
        ,
        i
    }()
      , c = function() {
        var t = new Array
          , e = 0
          , i = {};
        return i.getBuffer = function() {
            return t
        }
        ,
        i.get = function(e) {
            var i = Math.floor(e / 8);
            return 1 == (t[i] >>> 7 - e % 8 & 1)
        }
        ,
        i.put = function(t, e) {
            for (var n = 0; e > n; n += 1)
                i.putBit(1 == (t >>> e - n - 1 & 1))
        }
        ,
        i.getLengthInBits = function() {
            return e
        }
        ,
        i.putBit = function(i) {
            var n = Math.floor(e / 8);
            t.length <= n && t.push(0),
            i && (t[n] |= 128 >>> e % 8),
            e += 1
        }
        ,
        i
    }
      , l = function(t) {
        var n = i.MODE_8BIT_BYTE
          , a = e.stringToBytes(t)
          , s = {};
        return s.getMode = function() {
            return n
        }
        ,
        s.getLength = function() {
            return a.length
        }
        ,
        s.write = function(t) {
            for (var e = 0; e < a.length; e += 1)
                t.put(a[e], 8)
        }
        ,
        s
    }
      , u = function() {
        var t = new Array
          , e = {};
        return e.writeByte = function(e) {
            t.push(255 & e)
        }
        ,
        e.writeShort = function(t) {
            e.writeByte(t),
            e.writeByte(t >>> 8)
        }
        ,
        e.writeBytes = function(t, i, n) {
            i = i || 0,
            n = n || t.length;
            for (var a = 0; n > a; a += 1)
                e.writeByte(t[a + i])
        }
        ,
        e.writeString = function(t) {
            for (var i = 0; i < t.length; i += 1)
                e.writeByte(t.charCodeAt(i))
        }
        ,
        e.toByteArray = function() {
            return t
        }
        ,
        e.toString = function() {
            var e = "";
            e += "[";
            for (var i = 0; i < t.length; i += 1)
                i > 0 && (e += ","),
                e += t[i];
            return e += "]"
        }
        ,
        e
    }
      , d = function(t) {
        var e = t
          , i = 0
          , n = 0
          , a = 0
          , s = {};
        s.read = function() {
            for (; 8 > a; ) {
                if (i >= e.length) {
                    if (0 == a)
                        return -1;
                    throw new Error("unexpected end of file./" + a)
                }
                var t = e.charAt(i);
                if (i += 1,
                "=" == t)
                    return a = 0,
                    -1;
                t.match(/^\s$/) || (n = n << 6 | o(t.charCodeAt(0)),
                a += 6)
            }
            var s = n >>> a - 8 & 255;
            return a -= 8,
            s
        }
        ;
        var o = function(t) {
            if (t >= 65 && 90 >= t)
                return t - 65;
            if (t >= 97 && 122 >= t)
                return t - 97 + 26;
            if (t >= 48 && 57 >= t)
                return t - 48 + 52;
            if (43 == t)
                return 62;
            if (47 == t)
                return 63;
            throw new Error("c:" + t)
        };
        return s
    }
      , h = function(t, e) {
        var i = t
          , n = e
          , a = new Array(t * e)
          , s = {};
        s.setPixel = function(t, e, n) {
            a[e * i + t] = n
        }
        ,
        s.write = function(t) {
            t.writeString("GIF87a"),
            t.writeShort(i),
            t.writeShort(n),
            t.writeByte(128),
            t.writeByte(0),
            t.writeByte(0),
            t.writeByte(0),
            t.writeByte(0),
            t.writeByte(0),
            t.writeByte(255),
            t.writeByte(255),
            t.writeByte(255),
            t.writeString(","),
            t.writeShort(0),
            t.writeShort(0),
            t.writeShort(i),
            t.writeShort(n),
            t.writeByte(0);
            var e = 2
              , a = r(e);
            t.writeByte(e);
            for (var s = 0; a.length - s > 255; )
                t.writeByte(255),
                t.writeBytes(a, s, 255),
                s += 255;
            t.writeByte(a.length - s),
            t.writeBytes(a, s, a.length - s),
            t.writeByte(0),
            t.writeString(";")
        }
        ;
        var o = function(t) {
            var e = t
              , i = 0
              , n = 0
              , a = {};
            return a.write = function(t, a) {
                if (t >>> a != 0)
                    throw new Error("length over");
                for (; i + a >= 8; )
                    e.writeByte(255 & (t << i | n)),
                    a -= 8 - i,
                    t >>>= 8 - i,
                    n = 0,
                    i = 0;
                n = t << i | n,
                i += a
            }
            ,
            a.flush = function() {
                i > 0 && e.writeByte(n)
            }
            ,
            a
        }
          , r = function(t) {
            for (var e = 1 << t, i = (1 << t) + 1, n = t + 1, s = c(), r = 0; e > r; r += 1)
                s.add(String.fromCharCode(r));
            s.add(String.fromCharCode(e)),
            s.add(String.fromCharCode(i));
            var l = u()
              , d = o(l);
            d.write(e, n);
            var h = 0
              , g = String.fromCharCode(a[h]);
            for (h += 1; h < a.length; ) {
                var p = String.fromCharCode(a[h]);
                h += 1,
                s.contains(g + p) ? g += p : (d.write(s.indexOf(g), n),
                s.size() < 4095 && (s.size() == 1 << n && (n += 1),
                s.add(g + p)),
                g = p)
            }
            return d.write(s.indexOf(g), n),
            d.write(i, n),
            d.flush(),
            l.toByteArray()
        }
          , c = function() {
            var t = {}
              , e = 0
              , i = {};
            return i.add = function(n) {
                if (i.contains(n))
                    throw new Error("dup key:" + n);
                t[n] = e,
                e += 1
            }
            ,
            i.size = function() {
                return e
            }
            ,
            i.indexOf = function(e) {
                return t[e]
            }
            ,
            i.contains = function(e) {
                return "undefined" != typeof t[e]
            }
            ,
            i
        };
        return s
    }
      , g = function(t, e, i) {
        for (var n = h(t, e), a = 0; e > a; a += 1)
            for (var s = 0; t > s; s += 1)
                n.setPixel(s, a, i(s, a));
        var o = u();
        n.write(o);
        var r = o.toByteArray()
          , c = new Buffer(r);
        return "data:image/gif;base64," + c.toString("base64")
    }
      , p = function(t, e, i, n) {
        var a = "";
        return a += "<img",
        a += ' src="',
        a += i,
        a += '"',
        a += ' width="',
        a += t,
        a += '"',
        a += ' height="',
        a += e,
        a += '"',
        n && (a += ' alt="',
        a += n,
        a += '"'),
        a += "/>"
    };
    return e
}),
!function(t, e, i) {
    "undefined" != typeof module && module.exports ? module.exports = i() : "function" == typeof define && define.amd ? define("static/js/lib/bdshare", [], i) : e[t] = i()
}("bdshare", this, function() {
    var t = "6649976"
      , e = "http://s.share.baidu.com/"
      , i = function() {
        var t = (new Date).getTime()
          , e = (new Date).getTime() + 1e3
          , i = (new Date).getTime() + 3e3;
        return t.toString(32) + e.toString(32) + i.toString(32)
    }
      , n = function(t, e) {
        for (var i = t.length, n = "", a = 1; e >= a; a++) {
            var s = Math.floor(i * Math.random());
            n += t.charAt(s)
        }
        return n
    }
      , a = function() {
        var t = (new Date).toString(36)
          , e = n("0123456789abcdefghijklmnopqrstuvwxyz", 3);
        return t + e
    }
      , s = function(n, s) {
        s = s || {};
        var o = i()
          , r = 0
          , c = ""
          , l = document.title
          , u = s.wbuid || ""
          , d = a()
          , h = (window.isAppPage ? "app" : "detail/list",
        encodeURIComponent(s.pic || ""))
          , g = encodeURIComponent(s.url || "")
          , p = encodeURIComponent(s.comment || "")
          , m = encodeURIComponent(s.desc || "");
        "tsina" === n ? l = (s.text || l) + (s.weibotext || c) : ("tqq" === n && (s.text = s.text.replace("@今日头条", "@headlineapp")),
        l = s.text || l),
        l = encodeURIComponent(l.substring(0, 300));
        var f = "?click=1&url=" + g + "&uid=" + t + "&to=" + n + "&type=text&relateUid=" + u + "&pic=" + h + "&title=" + l + "&key=&sign=on&desc=" + m + "&comment=" + p + "&searchPic=0&l=" + o + "&linkid=" + d + "&sloc=&apiType=0&buttonType=" + r
          , v = e + f
          , _ = e + "commit" + f + "&t=" + Math.random()
          , w = function() {
            var t = [];
            return function(e) {
                var i = t.push(new Image) - 1;
                t[i].onload = function() {
                    t[i] = t[i].onload = null
                }
                ,
                t[i].src = e
            }
        }();
        setTimeout(function() {
            w(_)
        }, 1500),
        window.open(v, "_blank", "height=500,width=700,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no")
    };
    return s
}),
Function(function(t) {
    return 'e(e,a,r){(b[e]||(b[e]=t("x,y","x "+e+" y")(r,a)}a(e,a,r){(k[r]||(k[r]=t("x,y","new x[y]("+Array(r+1).join(",x[y]")(1)+")")(e,a)}r(e,a,r){n,t,s={},b=s.d=r?r.d+1:0;for(s["$"+b]=s,t=0;t<b;t)s[n="$"+t]=r[n];for(t=0,b=s=a;t<b;t)s[t]=a[t];c(e,0,s)}c(t,b,k){u(e){v[x]=e}f{g=,ting(bg)}l{try{y=c(t,b,k)}catch(e){h=e,y=l}}for(h,y,d,g,v=[],x=0;;)switch(g=){case 1:u(!)4:f5:u((e){a=0,r=e;{c=a<r;c&&u(e[a]),c}}(6:y=,u((y8:if(g=,lg,g=,y===c)b+=g;else if(y!==l)y9:c10:u(s(11:y=,u(+y)12:for(y=f,d=[],g=0;g<y;g)d[g]=y.charCodeAt(g)^g+y;u(String.fromCharCode.apply(null,d13:y=,h=delete [y]14:59:u((g=)?(y=x,v.slice(x-=g,y:[])61:u([])62:g=,k[0]=65599*k[0]+k[1].charCodeAt(g)>>>065:h=,y=,[y]=h66:u(e(t[b],,67:y=,d=,u((g=).x===c?r(g.y,y,k):g.apply(d,y68:u(e((g=t[b])<"<"?(b--,f):g+g,,70:u(!1)71:n72:+f73:u(parseInt(f,3675:if(){bcase 74:g=<<16>>16g76:u(k[])77:y=,u([y])78:g=,u(a(v,x-=g+1,g79:g=,u(k["$"+g])81:h=,[f]=h82:u([f])83:h=,k[]=h84:!085:void 086:u(v[x-1])88:h=,y=,h,y89:u({e{r(e.y,arguments,k)}e.y=f,e.x=c,e})90:null91:h93:h=0:;default:u((g<<16>>16)-16)}}n=this,t=n.Function,s=Object.keys||(e){a={},r=0;for(c in e)a[r]=c;a=r,a},b={},k={};r'.replace(/[-]/g, function(e) {
        return t[15 & e.charCodeAt(0)]
    })
}("v[x++]=v[--x]t.charCodeAt(b++)-32function return ))++.substrvar .length(),b+=;break;case ;break}".split("")))()('gr$Daten Иb/s!l y͒yĹg,(lfi~ah`{mv,-n|jqewVxp{rvmmx,&effkx[!cs"l".Pq%widthl"@q&heightl"vr*getContextx$"2d[!cs#l#,*;?|u.|uc{uq$fontl#vr(fillTextx$$龘ฑภ경2<[#c}l#2q*shadowBlurl#1q-shadowOffsetXl#$$limeq+shadowColorl#vr#arcx88802[%c}l#vr&strokex[ c}l"v,)}eOmyoZB]mx[ cs!0s$l$Pb<k7l l!r&lengthb%^l$1+s$jl  s#i$1ek1s$gr#tack4)zgr#tac$! +0o![#cj?o ]!l$b%s"o ]!l"l$b*b^0d#>>>s!0s%yA0s"l"l!r&lengthb<k+l"^l"1+s"jl  s&l&z0l!$ +["cs\'(0l#i\'1ps9wxb&s() &{s)/s(gr&Stringr,fromCharCodes)0s*yWl ._b&s o!])l l Jb<k$.aj;l .Tb<k$.gj/l .^b<k&i"-4j!+& s+yPo!]+s!l!l Hd>&l!l Bd>&+l!l <d>&+l!l 6d>&+l!l &+ s,y=o!o!]/q"13o!l q"10o!],l 2d>& s.{s-yMo!o!]0q"13o!]*Ld<l 4d#>>>b|s!o!l q"10o!],l!& s/yIo!o!].q"13o!],o!]*Jd<l 6d#>>>b|&o!]+l &+ s0l-l!&l-l!i\'1z141z4b/@d<l"b|&+l-l(l!b^&+l-l&zl\'g,)gk}ejo{cm,)|yn~Lij~em["cl$b%@d<l&zl\'l $ +["cl$b%b|&+l-l%8d<@b|l!b^&+ q$sign ', [TAC = {}]),
function(t, e) {
    var i = e.getElementById("module-inner")
      , n = e.getElementById("module-place")
      , a = e.getElementById("m-hotNews")
      , s = utils.offset(n).top
      , o = (utils.getWinSize().winHeight,
    e.getElementById("imagindexhover"));
    utils.on(t, "scroll", _.throttle(function() {
        var t = i.clientHeight
          , e = utils.scrollTop();
        s + t > e ? (utils.removeClass(a, "module-fixed"),
        o.style.display = "none") : (utils.addClass(a, "module-fixed"),
        o.style.display = "block")
    }, 60))
}(window, document, void 0),
function(t) {
    var e = t.uaCheck && t.uaCheck.is360se()
      , i = window.localStorage && window.localStorage.getItem("is_ext_pop_showed")
      , n = window.sessionStorage && window.sessionStorage.getItem("is_ext_installed");
    if (e && "1" === i && "1" !== n) {
        var a = document.querySelector(".ext-banner");
        a && (a.style.display = "block"),
        utils.on(a, "click", function() {
            window._czc && _czc.push(["_trackEvent", "extension-banner", "click", "times", 1, ""])
        })
    }
}(window);
