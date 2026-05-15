# 平台支持

## 能力矩阵

来自 `src/adapters/capabilities.ts` 中的 `PLATFORM_CAPABILITIES`：

| 平台      | `<pre>` | `<table>` | `<blockquote>` | `<ol start>` | https-only 图片 | `<video>` |
| --------- | :-----: | :-------: | :------------: | :----------: | :-------------: | :-------: |
| 微信      | ✅      | ✅        | ✅             | ✅           |                 |           |
| 支付宝    | ✅      | ✅        | ✅             |              | ✅              |           |
| 抖音      | ✅      | ✅        | ✅             | ✅           | ✅              | ✅        |
| 百度      |         |           | ✅             |              |                 |           |
| QQ        |         | ✅        | ✅             | ✅           |                 |           |
| 快手      |         |           |                |              | ✅              |           |
| 钉钉      |         |           | ✅             |              |                 |           |
| 京东      |         |           |                |              |                 |           |
| other     |         |           |                |              |                 |           |

矩阵由社区与文档反复核对，如发现某端能力变化欢迎 PR 修订。

## 适配规则

`adaptToPlatform(nodes, platform)` 会按平台做以下转换。所有规则都集中在
`src/adapters/adapt.ts` 的 `mapNode` 中。

### 通用（任何平台）

- 移除内部节点的 `selectable`（属于 rich-text 组件级属性，不应出现在子节点）
- `classMode='strip'` 时移除 `class`（多数小程序 rich-text 忽略内部 class）
- 不支持的 `<video>` 直接丢弃

### 标签级降级（不支持时）

| 原标签         | 降级为                                  |
| -------------- | --------------------------------------- |
| `<pre>`        | `<div class="md-code-block">`           |
| `<blockquote>` | `<div class="md-blockquote">`           |
| `<table>`      | 嵌套 `<div class="md-table/thead/...">` |

降级容器**保留 class** 作为标识，便于消费方在 WXSS / ACSS 上做差异化样式。

### 属性级降级

- `<ol start="N">`：当 `caps.olStartSupported = false`（如 alipay、baidu、kuaishou…）时移除 `start`
- `<img src="http://...">`：当 `caps.httpsOnlyImages = true` 时强制改写为 `https://`

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
wx.* → wechat        my.* → alipay        tt.* → douyin
swan.* → baidu       qq.* → qq            ks.* → kuaishou
dd.* → dingtalk      jd.* → jd            (兜底) → wechat
```

也可以显式指定：

```ts
render({ content, platform: 'alipay' });
```

## 自定义平台

需要兼容矩阵之外的平台或 H5 网页？用 `toOtherNodes` + 自定义能力：

```ts
import { toOtherNodes } from '@ant-design/x-markdown-mini';

const html = toOtherNodes(nodes, {
  preSupported: true,
  tableSupported: true,
  blockquoteSupported: true,
  olStartSupported: true,
  httpsOnlyImages: false,
  videoSupported: true,
});
```
