"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "booking-popup",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    scenicId: {
      type: String,
      required: true
    },
    tickets: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      bookingDate: this.getDefaultDate(),
      selectedTicketIndex: 0,
      quantity: 1
    };
  },
  computed: {
    startDate() {
      const today = /* @__PURE__ */ new Date();
      return this.formatDate(today);
    },
    endDate() {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() + 30);
      return this.formatDate(date);
    },
    ticketTypes() {
      return this.tickets || [];
    },
    totalPrice() {
      if (!this.ticketTypes.length)
        return 0;
      return (this.ticketTypes[this.selectedTicketIndex].price * this.quantity).toFixed(2);
    }
  },
  methods: {
    getDefaultDate() {
      return this.formatDate(/* @__PURE__ */ new Date());
    },
    formatDate(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    },
    handleClose() {
      this.$emit("close");
      this.resetForm();
    },
    handleDateChange(e) {
      this.bookingDate = e.detail.value;
    },
    handleTicketChange(e) {
      this.selectedTicketIndex = Number(e.detail.value);
    },
    handleQuantityChange(delta) {
      const newQuantity = this.quantity + delta;
      if (newQuantity >= 1 && newQuantity <= 10) {
        this.quantity = newQuantity;
      }
    },
    resetForm() {
      this.bookingDate = this.getDefaultDate();
      this.selectedTicketIndex = 0;
      this.quantity = 1;
    },
    async handleSubmit() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      try {
        const res = await common_vendor.er.callFunction({
          name: "scenic-center",
          data: {
            action: "createBooking",
            params: {
              USERID: userInfo._id,
              scenicId: this.scenicId,
              bookingDate: this.bookingDate,
              ticketType: this.ticketTypes[this.selectedTicketIndex].name,
              quantity: this.quantity,
              totalPrice: Number(this.totalPrice)
            }
          }
        });
        if (res.result.code === 0) {
          common_vendor.index.showToast({
            title: "预订成功"
          });
          this.$emit("submit");
          this.handleClose();
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "预订失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "预订失败",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at components/booking-popup/booking-popup.vue:177", e);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.show
  }, $props.show ? {
    b: common_vendor.o((...args) => $options.handleClose && $options.handleClose(...args)),
    c: common_vendor.o((...args) => $options.handleClose && $options.handleClose(...args)),
    d: common_vendor.t($data.bookingDate),
    e: $options.startDate,
    f: $options.endDate,
    g: $data.bookingDate,
    h: common_vendor.o((...args) => $options.handleDateChange && $options.handleDateChange(...args)),
    i: common_vendor.t($options.ticketTypes[$data.selectedTicketIndex].name),
    j: common_vendor.t($options.ticketTypes[$data.selectedTicketIndex].price),
    k: $options.ticketTypes,
    l: $data.selectedTicketIndex,
    m: common_vendor.o((...args) => $options.handleTicketChange && $options.handleTicketChange(...args)),
    n: common_vendor.o(($event) => $options.handleQuantityChange(-1)),
    o: common_vendor.t($data.quantity),
    p: common_vendor.o(($event) => $options.handleQuantityChange(1)),
    q: common_vendor.t($options.totalPrice),
    r: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/booking-popup/booking-popup.js.map
