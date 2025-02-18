"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      categories: [
        { name: "景点", value: "scenic" },
        { name: "美食", value: "food" },
        { name: "文化", value: "culture" },
        { name: "攻略", value: "guide" }
      ],
      currentCategory: "scenic",
      collectionList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false,
      isRefreshing: false
    };
  },
  onLoad() {
    this.loadCollections();
  },
  methods: {
    /**
     * 加载收藏列表
     */
    async loadCollections() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      common_vendor.index.__f__("log", "at pages/user/collections.vue:152", "当前分类", this.currentCategory);
      try {
        const res = await common_vendor.er.callFunction({
          name: "user-center",
          data: {
            action: "getCollections",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              type: this.currentCategory,
              page: this.page,
              pageSize: this.pageSize
            }
          }
        });
        common_vendor.index.__f__("log", "at pages/user/collections.vue:167", "收藏列表", res);
        if (res.result.code === 0) {
          const { list, total } = res.result.data;
          if (this.page === 1) {
            this.collectionList = list;
          } else {
            this.collectionList = [...this.collectionList, ...list];
          }
          this.noMore = this.collectionList.length >= total;
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "加载失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "加载失败，请稍后重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/user/collections.vue:189", e);
      } finally {
        this.loading = false;
        this.isRefreshing = false;
      }
    },
    /**
     * 处理分类切换
     */
    handleCategoryChange(category) {
      this.currentCategory = category;
      this.page = 1;
      this.noMore = false;
      this.collectionList = [];
      this.loadCollections();
    },
    /**
     * 加载更多
     */
    loadMore() {
      if (!this.loading && !this.noMore) {
        this.page++;
        this.loadCollections();
      }
    },
    /**
     * 刷新列表
     */
    refresh() {
      this.isRefreshing = true;
      this.page = 1;
      this.noMore = false;
      this.loadCollections();
    },
    /**
     * 跳转到详情页
     */
    goToDetail(item) {
      let url = "";
      switch (this.currentCategory) {
        case "scenic":
          url = `/pages/scenic/detail?id=${item._id}`;
          break;
        case "food":
          url = `/pages/food/detail?id=${item._id}`;
          break;
        case "culture":
          url = `/pages/culture/detail?id=${item._id}`;
          break;
        case "guide":
          url = `/pages/guide/detail?id=${item._id}`;
          break;
      }
      if (url) {
        common_vendor.index.navigateTo({ url });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.categories, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.currentCategory === item.value ? 1 : "",
        c: item.value,
        d: common_vendor.o(($event) => $options.handleCategoryChange(item.value), item.value)
      };
    }),
    b: $data.currentCategory === "scenic"
  }, $data.currentCategory === "scenic" ? {
    c: common_vendor.f($data.collectionList, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.location),
        d: common_vendor.t(item.price),
        e: common_vendor.f(item.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        f: index,
        g: common_vendor.o(($event) => $options.goToDetail(item), index)
      };
    })
  } : {}, {
    d: $data.currentCategory === "food"
  }, $data.currentCategory === "food" ? {
    e: common_vendor.f($data.collectionList, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.location),
        d: common_vendor.t(item.price),
        e: common_vendor.f(item.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        f: index,
        g: common_vendor.o(($event) => $options.goToDetail(item), index)
      };
    })
  } : {}, {
    f: $data.currentCategory === "culture"
  }, $data.currentCategory === "culture" ? {
    g: common_vendor.f($data.collectionList, (item, index, i0) => {
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
        f: common_vendor.o(($event) => $options.goToDetail(item), index)
      };
    })
  } : {}, {
    h: $data.currentCategory === "guide"
  }, $data.currentCategory === "guide" ? {
    i: common_vendor.f($data.collectionList, (item, index, i0) => {
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
        e: common_vendor.t(item.views),
        f: index,
        g: common_vendor.o(($event) => $options.goToDetail(item), index)
      };
    })
  } : {}, {
    j: $data.loading
  }, $data.loading ? {} : $data.noMore ? {} : $data.collectionList.length === 0 ? {} : {}, {
    k: $data.noMore,
    l: $data.collectionList.length === 0,
    m: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    n: $data.isRefreshing,
    o: common_vendor.o((...args) => $options.refresh && $options.refresh(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/collections.js.map
