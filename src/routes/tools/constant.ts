export const START_THRIFT = `namespace java com.example.thrift
namespace py example.thrift

const string test = 'test'

// 定义一个枚举类型，表示用户的状态
enum UserStatus {
    ACTIVE = 0,  // 用户活跃
    INACTIVE = 1,  // 用户不活跃
    SUSPENDED = 2,  // 用户被暂停
    DELETED = 3  // 用户已删除
}

// 定义一个枚举类型，表示订单的状态
enum OrderStatus {
    PENDING = 0,  // 待处理
    SHIPPED = 1,  // 已发货
    DELIVERED = 2,  // 已送达
    CANCELED = 3  // 已取消
}

// 定义一个复杂数据结构 - 用户
struct User {
    1: required i32 user_id;  // 必选的用户ID
    2: required string name;  // 必选的用户名
    3: optional string email;  // 可选的电子邮件
    4: required UserStatus status;  // 必选的用户状态
    5: optional string phone_number;  // 可选的电话号码
    6: required i64 created_at;  // 必选的创建时间
    7: optional i64 last_login;  // 可选的最后登录时间
    8: optional map<string, string> preferences;  // 可选的用户偏好设置
    9: optional list<i32> friend_ids;  // 可选的朋友ID列表
}

// 定义一个复杂数据结构 - 地址
struct Address {
    1: required string street;  // 必选的街道
    2: required string city;  // 必选的城市
    3: required string state;  // 必选的州
    4: required string country;  // 必选的国家
    5: required string zip_code;  // 必选的邮政编码
    6: optional string phone_number;  // 可选的地址关联电话号码
}

// 定义一个复杂数据结构 - 订单
struct Order {
    1: required i32 order_id;  // 必选的订单ID
    2: required i32 user_id;  // 必选的用户ID（订单关联的用户）
    3: required list<i32> product_ids;  // 必选的产品ID列表
    4: required double total_amount;  // 必选的订单总金额
    5: required OrderStatus status;  // 必选的订单状态
    6: required i64 created_at;  // 必选的创建时间
    7: optional string shipping_address;  // 可选的配送地址
    8: optional Address billing_address;  // 可选的账单地址
    9: optional i64 shipping_time;  // 可选的发货时间
    10: optional list<string> order_notes;  // 可选的订单备注
    11: optional map<string, string> order_metadata;  // 可选的订单元数据
}

// 定义一个复杂的数据结构 - 商品
struct Product {
    1: required i32 product_id;  // 必选的商品ID
    2: required string name;  // 必选的商品名称
    3: required double price;  // 必选的商品价格
    4: required string description;  // 必选的商品描述
    5: optional string image_url;  // 可选的商品图片URL
    6: optional bool in_stock;  // 可选的库存状态
}

// 定义一个复杂的数据结构 - 购物车
struct Cart {
    1: required i32 cart_id;  // 必选的购物车ID
    2: required i32 user_id;  // 必选的用户ID
    3: required list<Product> products;  // 必选的商品列表
    4: required double total_price;  // 必选的购物车总价格
    5: optional i64 created_at;  // 可选的购物车创建时间
    6: optional bool is_active;  // 可选的购物车是否有效
}

// 定义一个复杂的数据结构 - 支付信息
struct PaymentInfo {
    1: required string payment_method;  // 必选的支付方式
    2: required double amount;  // 必选的支付金额
    3: required i64 payment_time;  // 必选的支付时间
    4: optional string transaction_id;  // 可选的交易ID
    5: optional string payment_status;  // 可选的支付状态
}

// 定义一个包含多个复杂结构的复杂数据结构
struct UserProfile {
    1: required i32 user_id;  // 必选的用户ID
    2: required string username;  // 必选的用户名
    3: optional string avatar_url;  // 可选的头像URL
    4: required string bio;  // 必选的个人简介
    5: optional list<Address> addresses;  // 可选的地址列表
    6: required list<Order> orders;  // 必选的订单列表
    7: optional Cart cart;  // 可选的购物车
    8: optional list<PaymentInfo> payment_history;  // 可选的支付历史
}

struct MyStruct {
  1: optional string test
}

service MyService {
  void ping()
}

// 服务接口，定义用户相关操作
service UserService {
    // 创建新用户
    void createUser(1: required string name, 2: required string email);

    // 获取用户资料
    UserProfile getUserProfile(1: required i32 user_id);

    // 更新用户资料
    void updateUserProfile(1: required i32 user_id, 2: required UserProfile user_profile);

    // 获取用户的所有订单
    list<Order> getUserOrders(1: required i32 user_id);

    // 创建一个新的订单
    void createOrder(1: required i32 user_id, 2: required list<i32> product_ids, 3: required double total_amount);

    // 获取订单详情
    Order getOrderDetails(1: required i32 order_id);
}

// 服务接口，定义订单相关操作
service OrderService {
    // 创建新订单
    void createOrder(1: required i32 user_id, 2: required list<i32> product_ids, 3: required double total_amount);

    // 获取订单信息
    Order getOrder(1: required i32 order_id);

    // 更新订单状态
    void updateOrderStatus(1: required i32 order_id, 2: required OrderStatus status);
}

// 服务接口，定义商品相关操作
service ProductService {
    // 获取商品列表
    list<Product> getProducts(1: required i32 page, 2: required i32 page_size);

    // 获取单个商品详情
    Product getProductDetails(1: required i32 product_id);
}
`;

export const START_JS_BUNDLE = `!function(){const t={async fetchData(){return await Promise.allSettled([fetch("https://api.example.com"),new Promise((t=>setTimeout(t,1e3)))])}};(async()=>{console.log(await t.fetchData())})()}();
//# sourceMappingURL=main.bundle.js.map`;

export const START_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"><title>滴滴洗车</title><script type="text/javascript">!function () {
  try {
    function e(c, u, i) {
      try {
        return u in c ? Object.defineProperty(c, u, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : c[u] = i, c;
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    }
    var t = function (c) {
        try {
          return c.reduce(function (c, u) {
            try {
              return c.then(function () {
                try {
                  return u();
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              });
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          }, Promise.resolve(void 0));
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      n = function (c) {
        try {
          var u = {};
          for (var i in c) u[i] = c[i];
          return u;
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      r = function () {
        try {
          return new Promise(function (c) {
            try {
              var u;
              null !== (u = window.Omega) && void 0 !== u && u.trackEvent ? c(window.Omega) : function t() {
                try {
                  return setTimeout(function () {
                    try {
                      var u;
                      null !== (u = window.Omega) && void 0 !== u && u.trackEvent ? c(window.Omega) : t();
                    } catch (e) {
                      e.injectJsFrom = "fin";
                      throw e;
                    }
                  }, 100);
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              }();
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          });
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      o = function (c, u) {
        try {
          for (var i = [], a = 0; a < c.length; a++) i.push(u(c[a], a, c));
          return i;
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      d = function () {
        try {
          return performance && performance.now ? performance.now() : +new Date();
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      l = function (c) {
        try {
          return JSON.stringify(c, Object.getOwnPropertyNames(c));
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      p = function (c) {
        try {
          return new Promise(function (u, i) {
            try {
              var a = document.createElement("css" === c.type ? "link" : "script");
              a.setAttribute("crossorigin", "anonymous"), "script" === c.type && a.setAttribute("type", "text/javascript"), a.addEventListener("load", function (c) {
                try {
                  return u(c);
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              }), a.addEventListener("error", function (c) {
                try {
                  return i(c);
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              }), "script" === c.type ? a.setAttribute("src", c.url) : a.setAttribute("href", c.url), "css" === c.type && (a.setAttribute("rel", "stylesheet"), a.setAttribute("type", "text/css")), function (c, u) {
                try {
                  if (c.extraAttributes) for (var i in c.extraAttributes) u.setAttribute(i, c.extraAttributes[i]);
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              }(c, a), function (c, u) {
                try {
                  "head" === c.position ? document.head.appendChild(u) : document.body.appendChild(u);
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              }(c, a);
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          });
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      c = {
        DDCachePageViewTracked: !1
      },
      v = function (u) {
        try {
          c.DDCachePageViewTracked || (r().then(function (c) {
            try {
              return c.trackEvent("pub_ddcache_using_ddcache_bt", "使用 DDCache 的 PV 打点", {
                mode: u
              });
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          }), c.DDCachePageViewTracked = !0);
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      u = "false" !== window.localStorage.getItem("USER_GROWTH_PERF_BROWSER_SW_SUPPORT") && "serviceWorker" in window.navigator,
      i = window.caches && "function" == typeof window.caches.open;
    function b(c, u) {
      try {
        var i = Object.keys(c);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(c);
          u && (a = a.filter(function (u) {
            try {
              return Object.getOwnPropertyDescriptor(c, u).enumerable;
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          })), i.push.apply(i, a);
        }
        return i;
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    }
    function m(c) {
      try {
        for (var u = 1; u < arguments.length; u++) {
          var i = null != arguments[u] ? arguments[u] : {};
          u % 2 ? b(Object(i), !0).forEach(function (u) {
            try {
              e(c, u, i[u]);
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(c, Object.getOwnPropertyDescriptors(i)) : b(Object(i)).forEach(function (u) {
            try {
              Object.defineProperty(c, u, Object.getOwnPropertyDescriptor(i, u));
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          });
        }
        return c;
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    }
    window.navigator.userAgent.indexOf("passenger");
    var O = function (c) {
        try {
          if (c.isStale) {
            var u = function () {
              try {
                var c = window.localStorage.getItem("USER_GROWTH_PERF_DD_CACHE_EXPIRATION_RECORDS_MVP");
                return c ? JSON.parse(c) : {};
              } catch (u) {
                return r().then(function (i) {
                  try {
                    i.trackEvent("pub_ddcache_error_bt", "ddcache 错误信息", {
                      name: "读取 LocalStorage 内的过期记录失败.",
                      code: "000003",
                      message: (null == u ? void 0 : u.message) || "未知错误",
                      error: l(u)
                    });
                  } catch (e) {
                    e.injectJsFrom = "fin";
                    throw e;
                  }
                }), {};
              }
            }() || {};
            if (!u[c.url] || Date.now() - u[c.url] > 6048e5) return Promise.resolve(void 0);
          }
          return caches.match(c.url).then(function (c) {
            try {
              return c;
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          }).catch(function (c) {
            try {
              return r().then(function (u) {
                try {
                  u.trackEvent("pub_ddcache_error_bt", "ddcache 错误信息", {
                    name: "caches.match 错误",
                    code: "000026",
                    message: (null == c ? void 0 : c.message) || "未知错误",
                    error: l(c)
                  });
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              }), c;
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          });
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      _ = function (c) {
        try {
          var u = new DocumentFragment();
          !function (c, u) {
            try {
              for (var i = 0; i < c.length; i++) u(c[i]);
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          }(c, function (c) {
            try {
              return u.appendChild((i = c, (a = document.createElement("link")).rel = "preload", a.href = i.url, a.crossOrigin = "anonymous", a.as = "script" === i.type ? "script" : "style", a));
              var i, a;
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          }), document.head.appendChild(u);
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      y = function (c, u) {
        try {
          var i = o(c, function (c) {
            try {
              return function () {
                try {
                  return p(c);
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              };
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          });
          return "function" == typeof u && u(), t(i);
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      },
      E = function (c, u) {
        try {
          var i = d(),
            a = [],
            s = o(c, function (c) {
              try {
                return O(c);
              } catch (e) {
                e.injectJsFrom = "fin";
                throw e;
              }
            });
          return "function" == typeof u && u(), Promise.all(s).then(function (u) {
            try {
              var s = o(u, function (u, s) {
                try {
                  var f = u instanceof Response ? u : null;
                  return f || a.push(c[s]), function () {
                    try {
                      return (f ? function (c, u) {
                        try {
                          return u.blob().then(function (i) {
                            try {
                              var a = n(c);
                              a.url = window.URL.createObjectURL(i);
                              var s = a.extraAttributes ? n(a.extraAttributes) : {};
                              return s["data-original-url"] = u.url, a.extraAttributes = s, p(a);
                            } catch (e) {
                              e.injectJsFrom = "fin";
                              throw e;
                            }
                          }).catch(function (u) {
                            try {
                              return r().then(function (c) {
                                try {
                                  c.trackError("使用缓存创建 Object URL 错误", "000005", (null == u ? void 0 : u.message) || "未知错误", u);
                                } catch (e) {
                                  e.injectJsFrom = "fin";
                                  throw e;
                                }
                              }), p(c);
                            } catch (e) {
                              e.injectJsFrom = "fin";
                              throw e;
                            }
                          });
                        } catch (e) {
                          e.injectJsFrom = "fin";
                          throw e;
                        }
                      }(c[s], f) : p(c[s])).then(function (u) {
                        try {
                          var a,
                            h,
                            w,
                            g,
                            P = d();
                          return a = {
                            url: c[s].url,
                            usingCache: !!f,
                            duration: P - i
                          }, h = a.url, w = a.usingCache, g = a.duration, setTimeout(function () {
                            try {
                              return r().then(function (c) {
                                try {
                                  c.trackEvent("pub_ddcache_using_cache_storage_api_bt", "使用了 Cache Storage 处理资源", {
                                    url: h,
                                    using_cache: w ? 1 : 0,
                                    time: g
                                  });
                                } catch (e) {
                                  e.injectJsFrom = "fin";
                                  throw e;
                                }
                              });
                            } catch (e) {
                              e.injectJsFrom = "fin";
                              throw e;
                            }
                          }, 2e3), u;
                        } catch (e) {
                          e.injectJsFrom = "fin";
                          throw e;
                        }
                      });
                    } catch (e) {
                      e.injectJsFrom = "fin";
                      throw e;
                    }
                  };
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              });
              return _(a), t(s);
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          });
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      };
    window.navigator.serviceWorker && window.navigator.serviceWorker.addEventListener("message", function (c) {
      try {
        var u = c.data,
          i = u.type,
          a = u.method,
          s = u.data;
        "OMEGA_TRACK" === i && r().then(function (c) {
          try {
            c[a].apply(window.Omega, s);
          } catch (e) {
            e.injectJsFrom = "fin";
            throw e;
          }
        });
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    }), window.DDCache = {
      boot: function (c) {
        try {
          var a = function (c) {
            try {
              return o(c, function (c) {
                try {
                  return m(m({}, c), {}, {
                    url: 0 === c.url.indexOf("//") ? "".concat(window.location.protocol).concat(c.url) : c.url
                  });
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              });
            } catch (e) {
              e.injectJsFrom = "fin";
              throw e;
            }
          }(c);
          switch (!0) {
            case !i:
              return y(a);
            case !window.PERF_ENABLE_CACHE:
              return y(a, function () {
                try {
                  return v(1);
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              });
            case window.PERF_ENABLE_SW && u:
              return function (c, u) {
                try {
                  var i = o(c, function (c) {
                    try {
                      return function () {
                        try {
                          return p(c);
                        } catch (e) {
                          e.injectJsFrom = "fin";
                          throw e;
                        }
                      };
                    } catch (e) {
                      e.injectJsFrom = "fin";
                      throw e;
                    }
                  });
                  return _(c), u(), t(i);
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              }(a, function () {
                try {
                  return v(2);
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              });
            default:
              return E(a, function () {
                try {
                  return v(3);
                } catch (e) {
                  e.injectJsFrom = "fin";
                  throw e;
                }
              });
          }
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      }
    };
  } catch (e) {
    e.injectJsFrom = "fin";
    throw e;
  }
}();</script><link rel="icon" href="data:;base64,iVBORw0KGgo="><script>var userGrowMonitorConfig = {
  durations: 4e3
};</script><script id="perf-track" prod-key="ut-car-washing" src="https://ut-static.udache.com/webx/perf-sdk/cdn/latest/perf-track.min.js"></script><meta name="format-detection" content="telephone=yes"><link rel="preconnect" href="https://car-service.xiaojukeji.com" crossorigin=""><link rel="dns-prefetch" href="https://car-service.xiaojukeji.com"><link rel="dns-prefetch" href="https://poi.map.xiaojukeji.com"><script type="text/javascript">window.PERF_ENABLE_CACHE = !0, window.PERF_ENABLE_SW = !0;</script><script>var thirdPartyConstant = {
    checkDom: function (t, r) {
      try {
        if (!t) return !1;
        if (r >= 2) return !0;
        for (var e = 0; e < t.childNodes.length; e++) {
          var n = t.childNodes[e];
          return thirdPartyConstant.checkDom(n, r + 1);
        }
        return !1;
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    },
    track: function () {
      try {
        for (var t = {}, r = window.location.search.substring(1).split("&"), e = 0; e < r.length; e++) {
          var n = r[e].split("=");
          t[n[0]] = n[1] || "";
        }
        window && window.Omega && "function" == typeof window.Omega.trackEvent && window.Omega.trackEvent("tech_ut_thrid_party_crash_error", "三方注入页面崩溃", {
          dchn: t.dchn,
          prod_key: t.prod_key
        });
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    },
    innerJsCondition: function (t) {
      try {
        return -1 !== ["static.udache.com", "ut-static.udache.com"].indexOf(t);
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    }
  },
  config = {
    appKey: "omega7470fec158",
    jsErrorFilters: [{
      message: /^Script error\.$/
    }, {
      message: /Fusion.invokeJSMethod is not a function/
    }, {
      message: /TypeError: Failed to register a ServiceWorker/
    }],
    fastLoad: !0,
    openStayTime: !0,
    checkThirdPartyError: function (t) {
      try {
        var r = t.filename ? t.filename.split("/")[2] : "",
          e = Object.prototype.toString.call(t),
          n = "[object ErrorEvent]" === e || "[object PromiseRejectionEvent]" === e,
          o = document.querySelector("#app") || document.querySelector(".app"),
          i = thirdPartyConstant.innerJsCondition(r);
        return !i && (r && r !== window.location.hostname && !i || !(!n || !t.error || "fin" === t.error.injectJsFrom)) && (thirdPartyConstant.checkDom(o, 0) || thirdPartyConstant.track(), !0);
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    }
  };
!function () {
  try {
    var t = {};
    document.cookie.split(";").map(function (r) {
      try {
        var e = r.split("=");
        if (!e || "string" != typeof e[0] || "string" != typeof e[1]) return;
        t[e[0].replace(/ ?/g, "")] = e[1];
      } catch (n) {}
    });
    var r = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (t, e, n) {
      try {
        r[e] = n;
      } catch (o) {}
    }), r.dchn && t.chitu_mockview_dchn === r.dchn && (config.forbidReport = !0);
  } catch (e) {}
}();
var Omega = Omega || config;</script><style>.default-loading{align-items:center;display:flex;flex-direction:column;height:100vh;justify-content:center;position:fixed;width:100vw;z-index:700}.default-loading .loading-img{height:13.33vw;width:13.33vw}.default-loading .loading-text{color:#000;font-size:3.2vw;line-height:6.4vw}.default-loading .loading-img-container{background-repeat:no-repeat;background-size:contain;height:13.07vw;width:43.07vw}body.no-webp .default-loading .loading-img-container{background-image:url(https://ut-static.udache.com/webx/ut/UASF17_6ZdRqchCxZ2kCi.png)}body.webp .default-loading .loading-img-container{background-image:url(https://ut-static.udache.com/webx/ut/UASF17_6ZdRqchCxZ2kCi.png?x-s3-process=image/format,webp)}.default-loading .loading-img-container .loading-img{height:13.33vw;width:28vw}.default-loading .loading-img-container .laoding-light{display:flex;height:8vw;overflow:hidden;transform-origin:center}.default-loading .loading-img-container .laoding-light .laoding-light-thin{animation:move .8s linear infinite normal;background:linear-gradient(130deg,#fff,#fff 35%,hsla(0,0%,100%,0));-webkit-filter:blur(.27vw);filter:blur(.27vw);height:13.33vw;width:2vw}.default-loading .loading-img-container .laoding-light .laoding-light-thick{animation:move .8s linear infinite normal;background:linear-gradient(130deg,#fff,#fff 50%,hsla(0,0%,100%,0));-webkit-filter:blur(.27vw);filter:blur(.27vw);height:13.33vw;margin-left:2.67vw;width:5.33vw}@keyframes move{0%{opacity:.5;transform:translate(-8vw,-2.13vw) rotate(20deg)}50%{opacity:.5;transform:translate(20.27vw,-2.13vw) rotate(20deg)}to{opacity:.5;transform:translate(43.07vw,-2.13vw) rotate(20deg)}}.default-loading{background-color:#f6f8fb}.default-loading .loading-img{opacity:0}</style></head><body><div id="loading" class="default-loading"><div class="loading-img-container"><div class="laoding-light"><div class="laoding-light-thin"></div><div class="laoding-light-thick"></div></div></div></div><script>!function () {
  try {
    function addBodyClass(a) {
      try {
        document.body.className = document.body.className ? document.body.className + " " + a : a;
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    }
    function addWebp() {
      try {
        addBodyClass("webp"), window.__CAN_WEBP__ = !0;
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    }
    function addNoWebp() {
      try {
        addBodyClass("no-webp"), window.__CAN_WEBP__ = !1;
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    }
    var a = "USER_GROWTH_PERF_BROWSER_WEBP_SUPPORT_CACHE";
    function setCache(e) {
      try {
        window.localStorage && window.localStorage.setItem(a, JSON.stringify({
          support: e,
          timestamp: Date.now()
        }));
      } catch (o) {}
    }
    function capabilityTesting() {
      try {
        var a = new Image();
        a.onload = function () {
          try {
            addWebp(), setCache(!0);
          } catch (e) {
            e.injectJsFrom = "fin";
            throw e;
          }
        }, a.onerror = function () {
          try {
            addNoWebp(), setCache(!1);
          } catch (e) {
            e.injectJsFrom = "fin";
            throw e;
          }
        }, a.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
      } catch (e) {
        e.injectJsFrom = "fin";
        throw e;
      }
    }
    try {
      !function cleanOldClass() {
        try {
          document.body.className = document.body.className.replace("no-webp", ""), document.body.className = document.body.className.replace("webp", "");
        } catch (e) {
          e.injectJsFrom = "fin";
          throw e;
        }
      }();
      const t = function getCache() {
        try {
          if (window.localStorage) {
            var e = window.localStorage.getItem(a);
            try {
              var o = JSON.parse(e);
              return Date.now() - o.timestamp <= 2592e6 ? o.support : void 0;
            } catch (t) {}
          }
        } catch (t) {}
      }();
      if (void 0 !== t) t ? addWebp() : addNoWebp();else {
        var e = /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i.exec(navigator.userAgent);
        if (e && e[1]) {
          var o = e[1].split("_");
          o[0] && Number(o[0]) >= 15 ? capabilityTesting() : (addNoWebp(), setCache(!1));
        } else capabilityTesting();
      }
    } catch (t) {
      addNoWebp();
    }
  } catch (e) {
    e.injectJsFrom = "fin";
    throw e;
  }
}();</script><script type="text/javascript">window.DDCache_JS = window.DDCache_JS || [], window.DDCache_CSS = window.DDCache_CSS || [], window.DDCache_JS.push({
  url: window.location.protocol + "//tracker.didistatic.com/static/tracker/latest3x/xspm.js",
  position: "head",
  type: "script",
  isStale: !0,
  isCommonLib: !0
}), window.DDCache_JS = window.DDCache_JS.concat([]), window.DDCache_CSS = window.DDCache_CSS.concat([]), window.DDCache_JS = window.DDCache_JS.concat([{
  url: "https://ut-static.udache.com/webx/entry/ut-car-washing/online/index/static/js/vendor.2bf22d8f8e05269b814d.js",
  position: "append-body",
  type: "script",
  isCommonLib: !0
}, {
  url: "https://ut-static.udache.com/webx/entry/ut-car-washing/online/index/static/js/bundle.87b88bd7f73e2883fcfe.js",
  position: "append-body",
  type: "script",
  isCommonLib: !0
}, {
  url: "https://ut-static.udache.com/webx/entry/ut-car-washing/online/index/static/js/index.c6c8248e9392c83dca5d.js",
  position: "append-body",
  type: "script",
  isCommonLib: !0
}]), window.DDCache_CSS = window.DDCache_CSS.concat([]);</script><script type="text/javascript">window.DDCache && (window.DDCache_CSS && window.DDCache.boot(window.DDCache_CSS), window.DDCache_JS && window.DDCache.boot(window.DDCache_JS));</script><div id="app"></div><script type="text/javascript">!function () {
  try {
    var e = window.__INITIAL_STATE__ || {},
      a = e.xid && e.xpubData,
      t = document.querySelector("#container-loading");
    if (a) try {
      var c = new URLSearchParams(document.location.search).get("page_key") || "index",
        n = e.xpubData.scenes.multiPages.findIndex(e => {
          try {
            return e.pageKey === c;
          } catch (e) {
            e.injectJsFrom = "fin";
            throw e;
          }
        }) || 0,
        o = e.xpubData.scenes.multiPages[n].style.backgroundColor;
      o && (document.querySelector("body").style.background = o);
    } catch (l) {
      t && (t.style.display = "block");
    } else t && (t.style.display = "block");
  } catch (e) {
    e.injectJsFrom = "fin";
    throw e;
  }
}();</script></body></html>`;

export const START_SOURCEMAP = JSON.stringify({
  version: 3,
  file: "main.bundle.js",
  mappings:
    "YACA,MAAMA,EAAmB,CACvB,eAAMC,GAKJ,aAJkBC,QAAQC,WAAW,CACnCC,MAAM,2BACN,IAAIF,SAASG,GAAMC,WAAWD,EAAG,QAGrC,GAMF,WACEE,QAAQC,UAAUR,EAAiBC,YACpC,EAFD,E",
  sources: ["webpack://polyfill-service/./src/main.js"],
  sourcesContent: [
    '// 测试代码包含以下ES6+特性：\nconst advancedFeatures = {\n  async fetchData() {\n    const res = await Promise.allSettled([\n      fetch("https://api.example.com"),\n      new Promise((r) => setTimeout(r, 1000)),\n    ]);\n    return res;\n  },\n\n\n};\n\n// 测试代码执行\n(async () => {\n  console.log(await advancedFeatures.fetchData());\n})();\n',
  ],
  names: [
    "advancedFeatures",
    "fetchData",
    "Promise",
    "allSettled",
    "fetch",
    "r",
    "setTimeout",
    "console",
    "log",
  ],
  sourceRoot: "",
});

export const THRIFT_TIPS = "输入Thrift IDL生成TypeScript代码";
export const JS_ESCHECK_TIPS = "输入Js Bundle & SourceMap生成ESCheck报告";
export const HTML_ESCHECK_TIPS = "输入HTML生成ESCheck报告";
