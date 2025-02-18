"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_date = require("../../utils/date.js");
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
      reviewList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false,
      isRefreshing: false
    };
  },
  onLoad() {
    this.loadReviews();
  },
  methods: {
    /**
     * 加载评价列表
     */
    async loadReviews() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      try {
        const res = await common_vendor.er.callFunction({
          name: "user-center",
          data: {
            action: "getReviews",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              type: this.currentCategory,
              page: this.page,
              pageSize: this.pageSize
            }
          }
        });
        if (res.result.code === 0) {
          const { list, total } = res.result.data;
          if (this.page === 1) {
            this.reviewList = list;
          } else {
            this.reviewList = [...this.reviewList, ...list];
          }
          this.noMore = this.reviewList.length >= total;
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
        common_vendor.index.__f__("error", "at pages/user/reviews.vue:138", e);
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
      this.reviewList = [];
      this.loadReviews();
    },
    /**
     * 加载更多
     */
    loadMore() {
      if (!this.loading && !this.noMore) {
        this.page++;
        this.loadReviews();
      }
    },
    /**
     * 刷新列表
     */
    refresh() {
      this.isRefreshing = true;
      this.page = 1;
      this.noMore = false;
      this.loadReviews();
    },
    /**
     * 跳转到详情页
     */
    goToDetail(item) {
      let url = "";
      switch (this.currentCategory) {
        case "scenic":
          url = `/pages/scenic/detail?id=${item.scenic_id}`;
          break;
        case "food":
          url = `/pages/food/detail?id=${item.food_id}`;
          break;
        case "culture":
          url = `/pages/culture/detail?id=${item.culture_id}`;
          break;
        case "guide":
          url = `/pages/guide/detail?id=${item.guide_id}`;
          break;
      }
      if (url) {
        common_vendor.index.navigateTo({ url });
      }
    },
    /**
     * 预览图片
     */
    previewImage(images, current) {
      common_vendor.index.previewImage({
        urls: images,
        current: images[current]
      });
    },
    /**
     * 格式化日期
     */
    formatDate(timestamp) {
      return utils_date.formatDate(timestamp);
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
    b: common_vendor.f($data.reviewList, (item, index, i0) => {
      return common_vendor.e({
        a: item.cover,
        b: common_vendor.t(item.name)
      }, $data.currentCategory === "scenic" || $data.currentCategory === "food" ? {
        c: common_vendor.t(item.score)
      } : {}, {
        d: common_vendor.o(($event) => $options.goToDetail(item), index),
        e: common_vendor.t(item.content),
        f: item.images && item.images.length
      }, item.images && item.images.length ? {
        g: common_vendor.f(item.images, (img, imgIndex, i1) => {
          return {
            a: imgIndex,
            b: img,
            c: common_vendor.o(($event) => $options.previewImage(item.images, imgIndex), imgIndex)
          };
        })
      } : {}, {
        h: common_vendor.t($options.formatDate(item.created_at)),
        i: index
      });
    }),
    c: $data.currentCategory === "scenic" || $data.currentCategory === "food",
    d: $data.loading
  }, $data.loading ? {} : $data.noMore ? {} : $data.reviewList.length === 0 ? {} : {}, {
    e: $data.noMore,
    f: $data.reviewList.length === 0,
    g: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    h: $data.isRefreshing,
    i: common_vendor.o((...args) => $options.refresh && $options.refresh(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/reviews.js.map
