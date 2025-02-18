"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchKeyword: "",
      currentCategory: 0,
      categoryList: [
        { id: 0, name: "全部" },
        { id: 1, name: "自然风光" },
        { id: 2, name: "人文景观" },
        { id: 3, name: "民族风情" },
        { id: 4, name: "历史遗迹" },
        { id: 5, name: "地质奇观" }
      ],
      scenicList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false,
      listHeight: 0
    };
  },
  onShow() {
    if (!common_vendor.index.getStorageSync("userInfo")) {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  onLoad() {
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.listHeight = systemInfo.windowHeight - common_vendor.index.upx2px(180);
    this.loadScenicList();
  },
  methods: {
    /**
     * 加载景点列表
     */
    async loadScenicList() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      try {
        const res = await common_vendor.er.callFunction({
          name: "scenic-center",
          data: {
            action: "getScenicList",
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
            this.scenicList = list;
          } else {
            this.scenicList = [...this.scenicList, ...list];
          }
          this.noMore = this.scenicList.length >= total;
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
        common_vendor.index.__f__("error", "at pages/scenic/list.vue:146", e);
      } finally {
        this.loading = false;
      }
    },
    /**
     * 处理搜索
     */
    handleSearch() {
      this.page = 1;
      this.noMore = false;
      this.loadScenicList();
    },
    /**
     * 处理分类切换
     */
    handleCategoryChange(category) {
      this.currentCategory = category.id;
      this.page = 1;
      this.noMore = false;
      this.loadScenicList();
    },
    /**
     * 加载更多
     */
    loadMore() {
      if (!this.loading && !this.noMore) {
        this.page++;
        this.loadScenicList();
      }
    },
    /**
     * 跳转到详情页
     */
    goToDetail(item) {
      common_vendor.index.__f__("log", "at pages/scenic/list.vue:185", item);
      common_vendor.index.navigateTo({
        url: `/pages/scenic/detail?id=${item._id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.searchKeyword,
    b: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    c: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    d: common_vendor.f($data.categoryList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.currentCategory === item.id ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.handleCategoryChange(item), index)
      };
    }),
    e: common_vendor.f($data.scenicList, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: common_vendor.t(item.location),
        e: common_vendor.t(item.description),
        f: common_vendor.f(item.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        g: index,
        h: common_vendor.o(($event) => $options.goToDetail(item), index)
      };
    }),
    f: $data.loading
  }, $data.loading ? {} : $data.noMore ? {} : {}, {
    g: $data.noMore,
    h: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    i: $data.listHeight + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/scenic/list.js.map
