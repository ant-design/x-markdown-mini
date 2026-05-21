# 平台支持

## 能力矩阵

来自 `src/platforms/*` 中的 `PlatformRenderer.capabilities`：

| 平台      | `<pre>` | `<table>` | `<blockquote>` | `<ol start>` | https-only 图片 | `<video>` |
| --------- | :-----: | :-------: | :------------: | :----------: | :-------------: | :-------: |
| 微信      | ✅      | ✅        | ✅             | ✅           |                 |           |
| 支付宝    | ✅      | ✅        | ✅             |              | ✅              |           |

当前内置平台只有微信和支付宝。其它小程序平台应先补 renderer、组件产物和真机/开发者工具验证，再写入矩阵。

## 适配规则

入口会通过 `getPlatformRenderer(platform)` 选择 renderer。当前微信/支付宝差异直接编进各自 `renderTokens`，避免二次树遍历。

### 当前差异

- 微信：`<a href>` 转成 `data-href`，有序列表保留 `start`，图片 URL 不强制改写。
- 支付宝：`<a href>` 保留 `href`，有序列表不输出 `start`，`http://` 图片改写为 `https://`。

### 微信特有

- `<a href="..." class="md-link">` → `<a data-href="..." class="md-link">`：因为微信 rich-text 不会自动响应 `<a>` 跳转，消费方需要在 `<rich-text>` 上绑 `bindtap` 并读 `event.target.dataset.href`：

  ```xml
  <rich-text nodes="{{nodes}}" bindtap="onTap" />
  ```

  ```js
  onTap(e) {
    const href = e.target.dataset.href;
    if (href) wx.navigateTo({ url: ... });
  }
  ```

## 平台自动识别

`platform: 'auto'`（或不传）时，`render` 会按下面顺序探测全局 API：

```
my.* → alipay        wx.* → wechat        (兜底) → alipay
```

也可以显式指定：

```ts
renderNodes({ content, platform: 'alipay' });
```

## 自定义平台

新增平台的最小改动：

1. 在 `src/platforms/types.ts` 追加平台类型。
2. 在 `src/platforms/index.ts` 追加运行时 detector 并注册 renderer。
3. 在 `src/platforms/` 新增 renderer，声明能力并提供 `renderTokens`。
4. 增加组件产物、样式、示例和平台测试。
