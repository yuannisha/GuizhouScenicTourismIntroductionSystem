"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_date = require("../../utils/date.js");
const _sfc_main = {
  data() {
    return {
      orderList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false,
      isRefreshing: false,
      statusText: {
        pending: "待使用",
        cancelled: "已取消"
      }
    };
  },
  onLoad() {
    this.loadOrders();
  },
  methods: {
    /**
     * 加载订单列表
     */
    async loadOrders() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      try {
        const res = await common_vendor.er.callFunction({
          name: "scenic-center",
          data: {
            action: "getBookingList",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              page: this.page,
              pageSize: this.pageSize
            }
          }
        });
        common_vendor.index.__f__("log", "at pages/user/orders.vue:96", "订单列表", res);
        if (res.result.code === 0) {
          const list = res.result.data;
          const total = res.result.data.length;
          if (this.page === 1) {
            this.orderList = list;
          } else {
            this.orderList = [...this.orderList, ...list];
          }
          this.noMore = this.orderList.length >= total;
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
        common_vendor.index.__f__("error", "at pages/user/orders.vue:121", e);
      } finally {
        this.loading = false;
        this.isRefreshing = false;
      }
    },
    /**
     * 处理取消预订
     */
    async handleCancel(orderId) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消预订吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const res2 = await common_vendor.er.callFunction({
                name: "scenic-center",
                data: {
                  action: "cancelBooking",
                  params: {
                    USERID: common_vendor.index.getStorageSync("userInfo")._id,
                    bookingId: orderId
                  }
                }
              });
              if (res2.result.code === 0) {
                common_vendor.index.showToast({
                  title: "取消成功"
                });
                this.refresh();
              } else {
                common_vendor.index.showToast({
                  title: res2.result.message || "取消失败",
                  icon: "none"
                });
              }
            } catch (e) {
              common_vendor.index.showToast({
                title: "取消失败，请重试",
                icon: "none"
              });
              common_vendor.index.__f__("error", "at pages/user/orders.vue:165", e);
            }
          }
        }
      });
    },
    /**
     * 判断是否过期
     */
    isExpired(date) {
      return new Date(date) < /* @__PURE__ */ new Date();
    },
    /**
     * 跳转到景点详情
     */
    goToDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/scenic/detail?id=${item.scenic_id}`
      });
    },
    /**
     * 刷新列表
     */
    refresh() {
      this.isRefreshing = true;
      this.page = 1;
      this.noMore = false;
      this.loadOrders();
    },
    /**
     * 加载更多
     */
    loadMore() {
      if (!this.loading && !this.noMore) {
        this.loadOrders();
      }
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
    a: common_vendor.f($data.orderList, (item, index, i0) => {
      return common_vendor.e({
        a: item.scenic.cover,
        b: common_vendor.t(item.scenic.name),
        c: common_vendor.t(item.scenic.location),
        d: common_vendor.o(($event) => $options.goToDetail(item), index),
        e: common_vendor.t($options.formatDate(item.booking_date)),
        f: common_vendor.t(item.ticket_type),
        g: common_vendor.t(item.quantity),
        h: common_vendor.t(item.total_price),
        i: common_vendor.t($data.statusText[item.status]),
        j: common_vendor.n(item.status),
        k: item.status === "pending" && !$options.isExpired(item.booking_date)
      }, item.status === "pending" && !$options.isExpired(item.booking_date) ? {
        l: common_vendor.o(($event) => $options.handleCancel(item._id), index)
      } : {}, {
        m: index
      });
    }),
    b: $data.loading
  }, $data.loading ? {} : $data.noMore ? {} : $data.orderList.length === 0 ? {} : {}, {
    c: $data.noMore,
    d: $data.orderList.length === 0,
    e: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    f: $data.isRefreshing,
    g: common_vendor.o((...args) => $options.refresh && $options.refresh(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/orders.js.map
