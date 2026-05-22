# 送了莫

「送了莫」是一个纯工具型微信小程序，用于帮助用户通过三步快速获得送礼灵感：

1. 选择送礼场景
2. 选择收礼人关系
3. 选择预算区间

小程序定位为「工具 → 效率」，不包含电商、支付、下单、返利、陌生人社交或社区发布功能。

## 项目信息

- AppID: `wx2d6d23976c994991`
- 技术栈: 微信小程序原生 JavaScript
- 小程序根目录: `miniprogram/`
- 数据来源: 本地 JSON 文件
- 收藏提醒: `wx.setStorageSync` 本地存储

## 页面结构

- `pages/index/index`: 首页，场景选择和节日倒计时
- `pages/recipient/recipient`: 收礼人选择
- `pages/budget/budget`: 预算选择
- `pages/result/result`: 推荐结果、鲜花花语、收藏提醒
- `pages/about/about`: 关于页面、使用说明和免责声明

## 本地数据

- `miniprogram/data/gifts.json`
  - 40 条礼物推荐数据
  - 覆盖常见场景、收礼人和预算区间
- `miniprogram/data/flowerLanguages.json`
  - 45 条鲜花和花语建议
  - 覆盖全部送礼场景

## 使用微信开发者工具打开

1. 打开微信开发者工具
2. 导入项目根目录
3. 确认 AppID 为 `wx2d6d23976c994991`
4. 编译运行

## 免责声明

推荐内容仅供参考，价格可能随时间、地区和渠道变化。请结合收礼人的真实喜好、禁忌、过敏情况和双方关系边界做最终判断。
