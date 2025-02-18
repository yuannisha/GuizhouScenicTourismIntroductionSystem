"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchKeyword: "",
      bannerList: [
        {
          id: 1,
          image: "/static/banner/1.jpg",
          url: "/pages/scenic/detail?id=1"
        },
        {
          id: 2,
          image: "/static/banner/2.jpg",
          url: "/pages/scenic/detail?id=2"
        },
        {
          id: 3,
          image: "/static/banner/3.jpg",
          url: "/pages/scenic/detail?id=3"
        }
      ],
      navList: [
        {
          id: 1,
          name: "景点",
          icon: "/static/nav/scenic.png",
          url: "/pages/scenic/list"
        },
        {
          id: 2,
          name: "美食",
          icon: "/static/nav/food.png",
          url: "/pages/food/list"
        },
        {
          id: 3,
          name: "文化",
          icon: "/static/nav/culture.png",
          url: "/pages/culture/list"
        },
        {
          id: 4,
          name: "攻略",
          icon: "/static/nav/guide.png",
          url: "/pages/guide/list"
        }
      ],
      hotScenics: [],
      cultures: []
    };
  },
  onShow() {
    if (!common_vendor.index.getStorageSync("userInfo")) {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
    this.loadHotScenics();
    this.loadCultures();
  },
  onLoad() {
    this.loadHotScenics();
    this.loadCultures();
  },
  methods: {
    /**
     * 加载热门景点
     */
    async loadHotScenics() {
      var _a;
      try {
        const res = await common_vendor.er.callFunction({
          name: "scenic-center",
          data: {
            action: "getScenicList",
            params: {
              USERID: (_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a._id,
              page: 1,
              pageSize: 5,
              orderBy: "score"
            }
          }
        });
        if (res.result.code === 0) {
          this.hotScenics = res.result.data.list;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:162", e);
      }
    },
    /**
     * 加载特色文化
     */
    async loadCultures() {
      var _a;
      try {
        const res = await common_vendor.er.callFunction({
          name: "culture-center",
          data: {
            action: "getCultureList",
            params: {
              USERID: (_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a._id,
              page: 1,
              pageSize: 4
            }
          }
        });
        if (res.result.code === 0) {
          this.cultures = res.result.data.list;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:187", e);
      }
    },
    handleBannerClick(item) {
      common_vendor.index.navigateTo({
        url: item.url
      });
    },
    handleNavClick(item) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:199", item);
      if (item.url == "/pages/scenic/list") {
        common_vendor.index.switchTab({
          url: item.url
        });
      } else {
        common_vendor.index.navigateTo({
          url: item.url
        });
      }
    },
    /**
     * 跳转到景点列表
     */
    goToScenicList() {
      common_vendor.index.switchTab({
        url: "/pages/scenic/list"
      });
    },
    /**
     * 跳转到景点详情
     */
    goToScenicDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/scenic/detail?id=${item._id}`
      });
    },
    /**
     * 跳转到文化列表
     */
    goToCultureList() {
      common_vendor.index.navigateTo({
        url: "/pages/culture/list"
      });
    },
    /**
     * 跳转到文化详情
     */
    goToCultureDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/culture/detail?id=${item._id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.o(($event) => $options.handleBannerClick(item), index),
        c: index
      };
    }),
    b: common_vendor.f($data.navList, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.handleNavClick(item), index)
      };
    }),
    c: common_vendor.o((...args) => $options.goToScenicList && $options.goToScenicList(...args)),
    d: common_vendor.f($data.hotScenics, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: index,
        e: common_vendor.o(($event) => $options.goToScenicDetail(item), index)
      };
    }),
    e: common_vendor.o((...args) => $options.goToCultureList && $options.goToCultureList(...args)),
    f: common_vendor.f($data.cultures, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.description),
        d: common_vendor.f(item.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        e: index,
        f: common_vendor.o(($event) => $options.goToCultureDetail(item), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
