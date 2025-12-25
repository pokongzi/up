// pages/index/index.js
Page({
  data: {
    status: ''
  },
  handleCheckStatus() {
    // TODO: 调用后台接口
    wx.showToast({
      title: '后台连接正常',
      icon: 'success'
    });
    this.setData({ status: '后台连接正常' });
  }
});
