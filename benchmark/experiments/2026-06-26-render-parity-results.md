# Render Parity Benchmark Results

Generated: 2026-06-26T03:50:29.002Z

## Method

- Environment: Node v20.19.5, darwin arm64.
- Corpus: shared example Markdown from `examples/sample.js`; short=1x, medium=4x, long=10x.
- One trial: warm up once, then run 20 synchronous conversions and measure total JS time.
- Each experiment is repeated 3 times; tables report arithmetic means.
- Scope: conversion to renderable structures only. It excludes real mini-program `setData`, native layout, image loading, and paint.
- x-markdown-mini is measured with `tokensToWechat/tokensToAlipay(..., { escapeText: false })`, matching the example component's text escaping mode.

## Implementations

- x-markdown-mini: Markdown -> MiniNode[].
- marked + rich-text: Markdown -> HTML -> rich-text nodes via mini-html-parser2 as a JS-visible approximation of native rich-text parsing.
- mp-html: Markdown -> HTML -> mp-html nodes via mp-html parser.
- towxml: Markdown -> WXML tree, WeChat only.

## wechat

| Case | Bytes | Implementation | Stage | Avg total for 20 runs (ms) | Avg per run (ms) | Throughput (KB/s) | Output nodes/chars | Trial totals (ms) |
|---|---:|---|---|---:|---:|---:|---:|---|
| 短文 (short) | 2891 | x-markdown-mini | Markdown -> MiniNode[] | 4.89 | 0.24 | 12538.30 | 105 | 5.62, 3.37, 5.69 |
| 短文 (short) | 2891 | marked + rich-text | Markdown -> HTML -> rich-text nodes | 6.49 | 0.32 | 10127.46 | 158 | 10.08, 4.76, 4.62 |
| 短文 (short) | 2891 | mp-html | Markdown -> HTML -> mp-html nodes | 7.41 | 0.37 | 8052.42 | 108 | 9.27, 6.05, 6.92 |
| 短文 (short) | 2891 | towxml | Markdown -> WXML tree | 16.86 | 0.84 | 3700.89 | 192 | 23.22, 15.54, 11.82 |
| 中等 (medium) | 11585 | x-markdown-mini | Markdown -> MiniNode[] | 11.09 | 0.55 | 20891.27 | 423 | 11.33, 11.07, 10.88 |
| 中等 (medium) | 11585 | marked + rich-text | Markdown -> HTML -> rich-text nodes | 12.80 | 0.64 | 18318.03 | 638 | 14.79, 12.01, 11.59 |
| 中等 (medium) | 11585 | mp-html | Markdown -> HTML -> mp-html nodes | 17.78 | 0.89 | 13071.82 | 439 | 19.24, 17.19, 16.92 |
| 中等 (medium) | 11585 | towxml | Markdown -> WXML tree | 30.18 | 1.51 | 7733.19 | 771 | 33.70, 29.36, 27.48 |
| 长文 (long) | 28973 | x-markdown-mini | Markdown -> MiniNode[] | 16.36 | 0.82 | 35447.20 | 1059 | 17.00, 16.26, 15.82 |
| 长文 (long) | 28973 | marked + rich-text | Markdown -> HTML -> rich-text nodes | 23.88 | 1.19 | 24282.82 | 1598 | 24.53, 23.12, 23.98 |
| 长文 (long) | 28973 | mp-html | Markdown -> HTML -> mp-html nodes | 41.52 | 2.08 | 13958.32 | 1099 | 41.37, 40.93, 42.26 |
| 长文 (long) | 28973 | towxml | Markdown -> WXML tree | 71.51 | 3.58 | 8115.30 | 1929 | 72.46, 74.26, 67.81 |

## alipay

| Case | Bytes | Implementation | Stage | Avg total for 20 runs (ms) | Avg per run (ms) | Throughput (KB/s) | Output nodes/chars | Trial totals (ms) |
|---|---:|---|---|---:|---:|---:|---:|---|
| 短文 (short) | 2891 | x-markdown-mini | Markdown -> MiniNode[] | 1.85 | 0.09 | 31269.41 | 105 | 1.94, 1.74, 1.87 |
| 短文 (short) | 2891 | marked + rich-text | Markdown -> HTML -> rich-text nodes | 6.27 | 0.31 | 10673.32 | 158 | 9.62, 5.44, 3.76 |
| 短文 (short) | 2891 | mp-html | Markdown -> HTML -> mp-html nodes | 7.54 | 0.38 | 7909.10 | 108 | 9.53, 6.55, 6.54 |
| 中等 (medium) | 11585 | x-markdown-mini | Markdown -> MiniNode[] | 8.38 | 0.42 | 27773.52 | 423 | 9.22, 7.86, 8.08 |
| 中等 (medium) | 11585 | marked + rich-text | Markdown -> HTML -> rich-text nodes | 13.35 | 0.67 | 18153.53 | 638 | 17.51, 11.93, 10.63 |
| 中等 (medium) | 11585 | mp-html | Markdown -> HTML -> mp-html nodes | 19.06 | 0.95 | 12176.51 | 439 | 20.18, 18.73, 18.28 |
| 长文 (long) | 28973 | x-markdown-mini | Markdown -> MiniNode[] | 16.41 | 0.82 | 35317.79 | 1059 | 16.22, 16.56, 16.44 |
| 长文 (long) | 28973 | marked + rich-text | Markdown -> HTML -> rich-text nodes | 25.48 | 1.27 | 22741.61 | 1598 | 25.77, 25.35, 25.32 |
| 长文 (long) | 28973 | mp-html | Markdown -> HTML -> mp-html nodes | 48.41 | 2.42 | 12032.62 | 1099 | 44.83, 53.20, 47.19 |

## Summary

- wechat/short: fastest x-markdown-mini (4.89 ms for 20 runs).
- wechat/medium: fastest x-markdown-mini (11.09 ms for 20 runs).
- wechat/long: fastest x-markdown-mini (16.36 ms for 20 runs).
- alipay/short: fastest x-markdown-mini (1.85 ms for 20 runs).
- alipay/medium: fastest x-markdown-mini (8.38 ms for 20 runs).
- alipay/long: fastest x-markdown-mini (16.41 ms for 20 runs).

## Raw JSON

```json
{
  "iterations": 20,
  "trials": 3,
  "rows": [
    {
      "platform": "wechat",
      "caseId": "short",
      "caseName": "短文",
      "bytes": 2891,
      "implId": "x-markdown-mini",
      "implName": "x-markdown-mini",
      "stage": "Markdown -> MiniNode[]",
      "trials": [
        {
          "totalMs": 5.62458399999997,
          "avgMs": 0.2812291999999985,
          "throughputKBps": 10279.871364708983,
          "outputSize": 105
        },
        {
          "totalMs": 3.3676659999999856,
          "avgMs": 0.1683832999999993,
          "throughputKBps": 17169.161074762236,
          "outputSize": 105
        },
        {
          "totalMs": 5.687667000000033,
          "avgMs": 0.28438335000000164,
          "throughputKBps": 10165.85534982967,
          "outputSize": 105
        }
      ],
      "avgTotalMs": 4.893305666666663,
      "avgAvgMs": 0.24466528333333315,
      "avgThroughputKBps": 12538.295929766964,
      "avgOutputSize": 105
    },
    {
      "platform": "wechat",
      "caseId": "short",
      "caseName": "短文",
      "bytes": 2891,
      "implId": "marked-rich-text",
      "implName": "marked + rich-text",
      "stage": "Markdown -> HTML -> rich-text nodes",
      "trials": [
        {
          "totalMs": 10.077208000000041,
          "avgMs": 0.5038604000000021,
          "throughputKBps": 5737.70036303704,
          "outputSize": 158
        },
        {
          "totalMs": 4.764792,
          "avgMs": 0.2382396,
          "throughputKBps": 12134.842402354605,
          "outputSize": 158
        },
        {
          "totalMs": 4.621959000000004,
          "avgMs": 0.2310979500000002,
          "throughputKBps": 12509.847015086018,
          "outputSize": 158
        }
      ],
      "avgTotalMs": 6.487986333333349,
      "avgAvgMs": 0.32439931666666744,
      "avgThroughputKBps": 10127.463260159222,
      "avgOutputSize": 158
    },
    {
      "platform": "wechat",
      "caseId": "short",
      "caseName": "短文",
      "bytes": 2891,
      "implId": "mp-html",
      "implName": "mp-html",
      "stage": "Markdown -> HTML -> mp-html nodes",
      "trials": [
        {
          "totalMs": 9.269749999999988,
          "avgMs": 0.4634874999999994,
          "throughputKBps": 6237.492920521058,
          "outputSize": 108
        },
        {
          "totalMs": 6.0486250000000155,
          "avgMs": 0.30243125000000076,
          "throughputKBps": 9559.197338238006,
          "outputSize": 108
        },
        {
          "totalMs": 6.9157919999999535,
          "avgMs": 0.3457895999999977,
          "throughputKBps": 8360.575332514394,
          "outputSize": 108
        }
      ],
      "avgTotalMs": 7.411388999999986,
      "avgAvgMs": 0.37056944999999936,
      "avgThroughputKBps": 8052.421863757819,
      "avgOutputSize": 108
    },
    {
      "platform": "wechat",
      "caseId": "short",
      "caseName": "短文",
      "bytes": 2891,
      "implId": "towxml",
      "implName": "towxml",
      "stage": "Markdown -> WXML tree",
      "trials": [
        {
          "totalMs": 23.224625000000003,
          "avgMs": 1.1612312500000002,
          "throughputKBps": 2489.59886327551,
          "outputSize": 192
        },
        {
          "totalMs": 15.535208999999952,
          "avgMs": 0.7767604499999976,
          "throughputKBps": 3721.8681769907425,
          "outputSize": 192
        },
        {
          "totalMs": 11.821207999999956,
          "avgMs": 0.5910603999999978,
          "throughputKBps": 4891.209087937562,
          "outputSize": 192
        }
      ],
      "avgTotalMs": 16.860347333333305,
      "avgAvgMs": 0.8430173666666652,
      "avgThroughputKBps": 3700.8920427346043,
      "avgOutputSize": 192
    },
    {
      "platform": "wechat",
      "caseId": "medium",
      "caseName": "中等",
      "bytes": 11585,
      "implId": "x-markdown-mini",
      "implName": "x-markdown-mini",
      "stage": "Markdown -> MiniNode[]",
      "trials": [
        {
          "totalMs": 11.327083000000016,
          "avgMs": 0.5663541500000008,
          "throughputKBps": 20455.398799496717,
          "outputSize": 423
        },
        {
          "totalMs": 11.069875000000025,
          "avgMs": 0.5534937500000012,
          "throughputKBps": 20930.678982373287,
          "outputSize": 423
        },
        {
          "totalMs": 10.884208999999942,
          "avgMs": 0.5442104499999971,
          "throughputKBps": 21287.720586769443,
          "outputSize": 423
        }
      ],
      "avgTotalMs": 11.093722333333327,
      "avgAvgMs": 0.5546861166666665,
      "avgThroughputKBps": 20891.266122879813,
      "avgOutputSize": 423
    },
    {
      "platform": "wechat",
      "caseId": "medium",
      "caseName": "中等",
      "bytes": 11585,
      "implId": "marked-rich-text",
      "implName": "marked + rich-text",
      "stage": "Markdown -> HTML -> rich-text nodes",
      "trials": [
        {
          "totalMs": 14.787249999999972,
          "avgMs": 0.7393624999999986,
          "throughputKBps": 15668.903954420222,
          "outputSize": 638
        },
        {
          "totalMs": 12.010499999999979,
          "avgMs": 0.600524999999999,
          "throughputKBps": 19291.453311685644,
          "outputSize": 638
        },
        {
          "totalMs": 11.588624999999979,
          "avgMs": 0.579431249999999,
          "throughputKBps": 19993.74386521269,
          "outputSize": 638
        }
      ],
      "avgTotalMs": 12.79545833333331,
      "avgAvgMs": 0.6397729166666655,
      "avgThroughputKBps": 18318.03371043952,
      "avgOutputSize": 638
    },
    {
      "platform": "wechat",
      "caseId": "medium",
      "caseName": "中等",
      "bytes": 11585,
      "implId": "mp-html",
      "implName": "mp-html",
      "stage": "Markdown -> HTML -> mp-html nodes",
      "trials": [
        {
          "totalMs": 19.24370799999997,
          "avgMs": 0.9621853999999985,
          "throughputKBps": 12040.299094124706,
          "outputSize": 439
        },
        {
          "totalMs": 17.190541999999937,
          "avgMs": 0.8595270999999969,
          "throughputKBps": 13478.34175327345,
          "outputSize": 439
        },
        {
          "totalMs": 16.916334000000006,
          "avgMs": 0.8458167000000003,
          "throughputKBps": 13696.821072461677,
          "outputSize": 439
        }
      ],
      "avgTotalMs": 17.783527999999972,
      "avgAvgMs": 0.8891763999999985,
      "avgThroughputKBps": 13071.82063995328,
      "avgOutputSize": 439
    },
    {
      "platform": "wechat",
      "caseId": "medium",
      "caseName": "中等",
      "bytes": 11585,
      "implId": "towxml",
      "implName": "towxml",
      "stage": "Markdown -> WXML tree",
      "trials": [
        {
          "totalMs": 33.69524999999999,
          "avgMs": 1.6847624999999993,
          "throughputKBps": 6876.340136962927,
          "outputSize": 771
        },
        {
          "totalMs": 29.36429099999998,
          "avgMs": 1.468214549999999,
          "throughputKBps": 7890.536161761922,
          "outputSize": 771
        },
        {
          "totalMs": 27.47641699999997,
          "avgMs": 1.3738208499999984,
          "throughputKBps": 8432.68611041972,
          "outputSize": 771
        }
      ],
      "avgTotalMs": 30.178652666666647,
      "avgAvgMs": 1.5089326333333322,
      "avgThroughputKBps": 7733.187469714856,
      "avgOutputSize": 771
    },
    {
      "platform": "wechat",
      "caseId": "long",
      "caseName": "长文",
      "bytes": 28973,
      "implId": "x-markdown-mini",
      "implName": "x-markdown-mini",
      "stage": "Markdown -> MiniNode[]",
      "trials": [
        {
          "totalMs": 16.997791000000007,
          "avgMs": 0.8498895500000003,
          "throughputKBps": 34090.31208820015,
          "outputSize": 1059
        },
        {
          "totalMs": 16.26150000000007,
          "avgMs": 0.8130750000000034,
          "throughputKBps": 35633.85911508763,
          "outputSize": 1059
        },
        {
          "totalMs": 15.824708999999984,
          "avgMs": 0.7912354499999992,
          "throughputKBps": 36617.4189996164,
          "outputSize": 1059
        }
      ],
      "avgTotalMs": 16.361333333333352,
      "avgAvgMs": 0.8180666666666676,
      "avgThroughputKBps": 35447.1967343014,
      "avgOutputSize": 1059
    },
    {
      "platform": "wechat",
      "caseId": "long",
      "caseName": "长文",
      "bytes": 28973,
      "implId": "marked-rich-text",
      "implName": "marked + rich-text",
      "stage": "Markdown -> HTML -> rich-text nodes",
      "trials": [
        {
          "totalMs": 24.529541999999992,
          "avgMs": 1.2264770999999997,
          "throughputKBps": 23622.944121826662,
          "outputSize": 1598
        },
        {
          "totalMs": 23.12066600000003,
          "avgMs": 1.1560333000000014,
          "throughputKBps": 25062.426834936297,
          "outputSize": 1598
        },
        {
          "totalMs": 23.981208000000038,
          "avgMs": 1.1990604000000018,
          "throughputKBps": 24163.086363289083,
          "outputSize": 1598
        }
      ],
      "avgTotalMs": 23.877138666666685,
      "avgAvgMs": 1.1938569333333342,
      "avgThroughputKBps": 24282.81910668401,
      "avgOutputSize": 1598
    },
    {
      "platform": "wechat",
      "caseId": "long",
      "caseName": "长文",
      "bytes": 28973,
      "implId": "mp-html",
      "implName": "mp-html",
      "stage": "Markdown -> HTML -> mp-html nodes",
      "trials": [
        {
          "totalMs": 41.374667000000045,
          "avgMs": 2.0687333500000022,
          "throughputKBps": 14005.188247194821,
          "outputSize": 1099
        },
        {
          "totalMs": 40.925792,
          "avgMs": 2.0462896,
          "throughputKBps": 14158.797464444915,
          "outputSize": 1099
        },
        {
          "totalMs": 42.26254200000005,
          "avgMs": 2.1131271000000025,
          "throughputKBps": 13710.959459087891,
          "outputSize": 1099
        }
      ],
      "avgTotalMs": 41.52100033333337,
      "avgAvgMs": 2.076050016666668,
      "avgThroughputKBps": 13958.31505690921,
      "avgOutputSize": 1099
    },
    {
      "platform": "wechat",
      "caseId": "long",
      "caseName": "长文",
      "bytes": 28973,
      "implId": "towxml",
      "implName": "towxml",
      "stage": "Markdown -> WXML tree",
      "trials": [
        {
          "totalMs": 72.45633400000008,
          "avgMs": 3.622816700000004,
          "throughputKBps": 7997.36845642783,
          "outputSize": 1929
        },
        {
          "totalMs": 74.26383399999986,
          "avgMs": 3.713191699999993,
          "throughputKBps": 7802.721308463566,
          "outputSize": 1929
        },
        {
          "totalMs": 67.8064159999999,
          "avgMs": 3.390320799999995,
          "throughputKBps": 8545.798969820215,
          "outputSize": 1929
        }
      ],
      "avgTotalMs": 71.50886133333329,
      "avgAvgMs": 3.5754430666666637,
      "avgThroughputKBps": 8115.2962449038705,
      "avgOutputSize": 1929
    },
    {
      "platform": "alipay",
      "caseId": "short",
      "caseName": "短文",
      "bytes": 2891,
      "implId": "x-markdown-mini",
      "implName": "x-markdown-mini",
      "stage": "Markdown -> MiniNode[]",
      "trials": [
        {
          "totalMs": 1.9390410000000884,
          "avgMs": 0.09695205000000442,
          "throughputKBps": 29818.864067339146,
          "outputSize": 105
        },
        {
          "totalMs": 1.744374999999991,
          "avgMs": 0.08721874999999954,
          "throughputKBps": 33146.54245790057,
          "outputSize": 105
        },
        {
          "totalMs": 1.874667000000045,
          "avgMs": 0.09373335000000224,
          "throughputKBps": 30842.811016569136,
          "outputSize": 105
        }
      ],
      "avgTotalMs": 1.8526943333333747,
      "avgAvgMs": 0.09263471666666874,
      "avgThroughputKBps": 31269.405847269616,
      "avgOutputSize": 105
    },
    {
      "platform": "alipay",
      "caseId": "short",
      "caseName": "短文",
      "bytes": 2891,
      "implId": "marked-rich-text",
      "implName": "marked + rich-text",
      "stage": "Markdown -> HTML -> rich-text nodes",
      "trials": [
        {
          "totalMs": 9.618249999999989,
          "avgMs": 0.48091249999999947,
          "throughputKBps": 6011.488576404238,
          "outputSize": 158
        },
        {
          "totalMs": 5.439249999999902,
          "avgMs": 0.2719624999999951,
          "throughputKBps": 10630.142023257074,
          "outputSize": 158
        },
        {
          "totalMs": 3.759832999999844,
          "avgMs": 0.1879916499999922,
          "throughputKBps": 15378.342601919394,
          "outputSize": 158
        }
      ],
      "avgTotalMs": 6.272444333333245,
      "avgAvgMs": 0.3136222166666623,
      "avgThroughputKBps": 10673.324400526903,
      "avgOutputSize": 158
    },
    {
      "platform": "alipay",
      "caseId": "short",
      "caseName": "短文",
      "bytes": 2891,
      "implId": "mp-html",
      "implName": "mp-html",
      "stage": "Markdown -> HTML -> mp-html nodes",
      "trials": [
        {
          "totalMs": 9.532750000000078,
          "avgMs": 0.47663750000000393,
          "throughputKBps": 6065.406100023553,
          "outputSize": 108
        },
        {
          "totalMs": 6.553957999999966,
          "avgMs": 0.3276978999999983,
          "throughputKBps": 8822.149913075473,
          "outputSize": 108
        },
        {
          "totalMs": 6.540917000000036,
          "avgMs": 0.3270458500000018,
          "throughputKBps": 8839.739137493976,
          "outputSize": 108
        }
      ],
      "avgTotalMs": 7.542541666666693,
      "avgAvgMs": 0.37712708333333467,
      "avgThroughputKBps": 7909.098383531001,
      "avgOutputSize": 108
    },
    {
      "platform": "alipay",
      "caseId": "medium",
      "caseName": "中等",
      "bytes": 11585,
      "implId": "x-markdown-mini",
      "implName": "x-markdown-mini",
      "stage": "Markdown -> MiniNode[]",
      "trials": [
        {
          "totalMs": 9.216708000000153,
          "avgMs": 0.46083540000000767,
          "throughputKBps": 25139.12776665987,
          "outputSize": 423
        },
        {
          "totalMs": 7.855792000000065,
          "avgMs": 0.39278960000000324,
          "throughputKBps": 29494.16175988342,
          "outputSize": 423
        },
        {
          "totalMs": 8.076749999999947,
          "avgMs": 0.40383749999999735,
          "throughputKBps": 28687.2813941253,
          "outputSize": 423
        }
      ],
      "avgTotalMs": 8.383083333333389,
      "avgAvgMs": 0.41915416666666944,
      "avgThroughputKBps": 27773.523640222862,
      "avgOutputSize": 423
    },
    {
      "platform": "alipay",
      "caseId": "medium",
      "caseName": "中等",
      "bytes": 11585,
      "implId": "marked-rich-text",
      "implName": "marked + rich-text",
      "stage": "Markdown -> HTML -> rich-text nodes",
      "trials": [
        {
          "totalMs": 17.507749999999987,
          "avgMs": 0.8753874999999993,
          "throughputKBps": 13234.139166940364,
          "outputSize": 638
        },
        {
          "totalMs": 11.929750000000013,
          "avgMs": 0.5964875000000006,
          "throughputKBps": 19422.033152413063,
          "outputSize": 638
        },
        {
          "totalMs": 10.626291999999921,
          "avgMs": 0.5313145999999961,
          "throughputKBps": 21804.40740758881,
          "outputSize": 638
        }
      ],
      "avgTotalMs": 13.354597333333308,
      "avgAvgMs": 0.6677298666666652,
      "avgThroughputKBps": 18153.52657564741,
      "avgOutputSize": 638
    },
    {
      "platform": "alipay",
      "caseId": "medium",
      "caseName": "中等",
      "bytes": 11585,
      "implId": "mp-html",
      "implName": "mp-html",
      "stage": "Markdown -> HTML -> mp-html nodes",
      "trials": [
        {
          "totalMs": 20.176167000000078,
          "avgMs": 1.0088083500000038,
          "throughputKBps": 11483.846262771274,
          "outputSize": 439
        },
        {
          "totalMs": 18.733040999999957,
          "avgMs": 0.9366520499999978,
          "throughputKBps": 12368.520412676218,
          "outputSize": 439
        },
        {
          "totalMs": 18.27695800000015,
          "avgMs": 0.9138479000000075,
          "throughputKBps": 12677.164328987248,
          "outputSize": 439
        }
      ],
      "avgTotalMs": 19.062055333333394,
      "avgAvgMs": 0.9531027666666697,
      "avgThroughputKBps": 12176.51033481158,
      "avgOutputSize": 439
    },
    {
      "platform": "alipay",
      "caseId": "long",
      "caseName": "长文",
      "bytes": 28973,
      "implId": "x-markdown-mini",
      "implName": "x-markdown-mini",
      "stage": "Markdown -> MiniNode[]",
      "trials": [
        {
          "totalMs": 16.218834000000015,
          "avgMs": 0.8109417000000008,
          "throughputKBps": 35727.59916033418,
          "outputSize": 1059
        },
        {
          "totalMs": 16.56441699999982,
          "avgMs": 0.828220849999991,
          "throughputKBps": 34982.215190550094,
          "outputSize": 1059
        },
        {
          "totalMs": 16.441583000000037,
          "avgMs": 0.8220791500000019,
          "throughputKBps": 35243.5650508834,
          "outputSize": 1059
        }
      ],
      "avgTotalMs": 16.408277999999957,
      "avgAvgMs": 0.8204138999999979,
      "avgThroughputKBps": 35317.79313392256,
      "avgOutputSize": 1059
    },
    {
      "platform": "alipay",
      "caseId": "long",
      "caseName": "长文",
      "bytes": 28973,
      "implId": "marked-rich-text",
      "implName": "marked + rich-text",
      "stage": "Markdown -> HTML -> rich-text nodes",
      "trials": [
        {
          "totalMs": 25.771124999999984,
          "avgMs": 1.2885562499999992,
          "throughputKBps": 22484.854658071792,
          "outputSize": 1598
        },
        {
          "totalMs": 25.34937500000001,
          "avgMs": 1.2674687500000004,
          "throughputKBps": 22858.946226484866,
          "outputSize": 1598
        },
        {
          "totalMs": 25.324916999999914,
          "avgMs": 1.2662458499999958,
          "throughputKBps": 22881.022670281684,
          "outputSize": 1598
        }
      ],
      "avgTotalMs": 25.481805666666634,
      "avgAvgMs": 1.2740902833333319,
      "avgThroughputKBps": 22741.607851612778,
      "avgOutputSize": 1598
    },
    {
      "platform": "alipay",
      "caseId": "long",
      "caseName": "长文",
      "bytes": 28973,
      "implId": "mp-html",
      "implName": "mp-html",
      "stage": "Markdown -> HTML -> mp-html nodes",
      "trials": [
        {
          "totalMs": 44.8263750000001,
          "avgMs": 2.241318750000005,
          "throughputKBps": 12926.764655852692,
          "outputSize": 1099
        },
        {
          "totalMs": 53.20270899999991,
          "avgMs": 2.660135449999996,
          "throughputKBps": 10891.550653933824,
          "outputSize": 1099
        },
        {
          "totalMs": 47.189083999999866,
          "avgMs": 2.3594541999999934,
          "throughputKBps": 12279.534817840533,
          "outputSize": 1099
        }
      ],
      "avgTotalMs": 48.40605599999996,
      "avgAvgMs": 2.420302799999998,
      "avgThroughputKBps": 12032.616709209016,
      "avgOutputSize": 1099
    }
  ]
}
```
