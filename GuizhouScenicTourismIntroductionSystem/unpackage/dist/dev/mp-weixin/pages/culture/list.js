"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      categories: ["全部", "民族文化", "历史文化", "饮食文化", "节日文化", "其他"],
      currentCategory: 0,
      searchKeyword: "",
      page: 1,
      pageSize: 10,
      total: 0,
      cultureList: [],
      isLoading: false,
      isRefreshing: false,
      hasMore: true
    };
  },
  onLoad() {
    this.loadCultureList();
  },
  methods: {
    /**
     * 加载文化列表
     */
    async loadCultureList() {
      if (this.isLoading || !this.hasMore)
        return;
      this.isLoading = true;
      common_vendor.index.__f__("log", "at pages/culture/list.vue:96", "当前分类", this.currentCategory);
      try {
        const res = await common_vendor.er.callFunction({
          name: "culture-center",
          data: {
            action: "getCultureList",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              page: this.page,
              pageSize: this.pageSize,
              category: this.currentCategory,
              keyword: this.searchKeyword
            }
          }
        });
        if (res.result.code === 0) {
          const { list, total } = res.result.data;
          if (this.page === 1) {
            this.cultureList = list;
          } else {
            this.cultureList = [...this.cultureList, ...list];
          }
          this.total = total;
          this.hasMore = this.cultureList.length < total;
          this.page++;
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
        common_vendor.index.__f__("error", "at pages/culture/list.vue:136", e);
      } finally {
        this.isLoading = false;
        this.isRefreshing = false;
      }
    },
    /**
     * 处理搜索
     */
    handleSearch() {
      this.page = 1;
      this.hasMore = true;
      this.loadCultureList();
    },
    /**
     * 处理分类切换
     */
    handleCategoryChange(index) {
      this.currentCategory = index;
      this.page = 1;
      this.hasMore = true;
      this.loadCultureList();
    },
    /**
     * 加载更多
     */
    loadMore() {
      this.loadCultureList();
    },
    /**
     * 刷新列表
     */
    refresh() {
      this.isRefreshing = true;
      this.page = 1;
      this.hasMore = true;
      this.loadCultureList();
    },
    /**
     * 跳转到详情页
     */
    goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/culture/detail?id=${id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    b: $data.searchKeyword,
    c: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    d: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    e: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: $data.currentCategory === index ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.handleCategoryChange(index), index)
      };
    }),
    f: common_vendor.f($data.cultureList, (item, index, i0) => {
      return {
        a: item.images[0],
        b: common_vendor.t(item.name),
        c: common_vendor.f(item.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        d: common_vendor.t(item.description),
        e: common_vendor.t(item.views),
        f: index,
        g: common_vendor.o(($event) => $options.goToDetail(item._id), index)
      };
    }),
    g: $data.isLoading
  }, $data.isLoading ? {} : $data.hasMore ? {} : {}, {
    h: $data.hasMore,
    i: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    j: $data.isRefreshing,
    k: common_vendor.o((...args) => $options.refresh && $options.refresh(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/culture/list.js.map
