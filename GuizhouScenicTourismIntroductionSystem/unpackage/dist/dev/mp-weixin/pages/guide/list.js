"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      keyword: "",
      currentTag: "",
      tags: ["美食", "景点", "住宿", "交通", "购物", "娱乐"],
      guideList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      hasMore: true,
      isRefreshing: false,
      total: 0
    };
  },
  onLoad() {
    this.loadGuideList();
  },
  methods: {
    /**
     * 加载攻略列表
     */
    async loadGuideList() {
      var _a;
      if (this.loading || !this.hasMore)
        return;
      this.loading = true;
      try {
        const res = await common_vendor.er.callFunction({
          name: "guide-center",
          data: {
            action: "getGuideList",
            params: {
              USERID: (_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a._id,
              page: this.page,
              pageSize: this.pageSize,
              keyword: this.keyword,
              tag: this.currentTag
            }
          }
        });
        if (res.result.code === 0) {
          const { list, total } = res.result.data;
          if (this.page === 1) {
            this.guideList = list;
          } else {
            this.guideList = [...this.guideList, ...list];
          }
          this.total = total;
          this.hasMore = this.guideList.length < total;
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "加载失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/guide/list.vue:144", e);
      } finally {
        this.loading = false;
        this.isRefreshing = false;
      }
    },
    /**
     * 处理搜索
     */
    handleSearch() {
      this.page = 1;
      this.hasMore = true;
      this.loadGuideList();
    },
    /**
     * 处理标签切换
     */
    handleTagChange(tag) {
      this.currentTag = tag;
      this.page = 1;
      this.hasMore = true;
      this.loadGuideList();
    },
    /**
     * 加载更多
     */
    loadMore() {
      if (this.hasMore) {
        this.page++;
        this.loadGuideList();
      }
    },
    /**
     * 刷新列表
     */
    async refresh() {
      this.isRefreshing = true;
      this.page = 1;
      this.hasMore = true;
      await this.loadGuideList();
    },
    /**
     * 跳转到详情页
     */
    goDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/guide/detail?id=${id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.keyword,
    b: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    c: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    d: $data.currentTag === "" ? 1 : "",
    e: common_vendor.o(($event) => $options.handleTagChange("")),
    f: common_vendor.f($data.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index,
        c: $data.currentTag === tag ? 1 : "",
        d: common_vendor.o(($event) => $options.handleTagChange(tag), index)
      };
    }),
    g: common_vendor.f($data.guideList, (item, index, i0) => {
      return {
        a: item.cover || "/static/default-cover.png",
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.description),
        d: common_vendor.f(item.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        e: common_vendor.t(item.views),
        f: common_vendor.t(item.likes),
        g: index,
        h: common_vendor.o(($event) => $options.goDetail(item._id), index)
      };
    }),
    h: $data.loading
  }, $data.loading ? {} : !$data.hasMore ? {} : {}, {
    i: !$data.hasMore,
    j: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    k: $data.isRefreshing,
    l: common_vendor.o((...args) => $options.refresh && $options.refresh(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/guide/list.js.map
