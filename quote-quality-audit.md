# 金句质量审计 — 2026-04-03

## 核心原则（Shakie 确认）
每个金句必须满足以下条件才能保留：
1. ✅ 确实出现在 Lenny 公开的 podcast transcript 中
2. ✅ 能在 YouTube 找到对应的准确时间点（正片，非预告/广告）
3. ✅ 引言归属正确（speaker 是对的人）

不满足 = 替换金句 + 重新生成漫画

---

## 🟢 A 级：有转录 + 时间戳已修正验证（15 组）
这些金句有 lenny-data/podcasts/ 下的转录文件支撑，时间戳已从预告段修正到正片。

| Comic | Speaker | Quote (缩) | 时间戳 | 状态 |
|-------|---------|-----------|--------|------|
| 2 | Stewart Butterfield | limitless opportunities | 00:47:06 | ✅ |
| 3 | Lazar Jovanovic | AI is an amplifier | 00:57:03 | ✅ |
| 5 | Ben Horowitz | product works | 00:48:39 | ✅ |
| 6 | Marc Andreessen | task loss | 00:39:28 | ✅ |
| 9 | Reid Hoffman (via Stewart) | embarrassed first version | 00:46:31 | ✅ |
| 10 | Lenny | ship things you can talk about | 00:53:41 | ✅ |
| 12 | Nick Turley | MS-DOS → Windows | 00:50:07 | ✅ |
| 15 | Ben Horowitz | PM is mini CEO | 00:48:21 | ✅ |
| 19 | Melanie Perkins | 100+ rejections | 00:26:30 | ✅ |
| 20 | Dr. Becky Kennedy | babies in disguise | 00:07:07 | ✅ |
| 23 | Brian Halligan | easy to start hard to scale | 00:25:54 | ✅ |
| 25 | Molly Graham | give away Legos | 00:11:47 | ✅ |
| 27 | Matt MacInnis | comfort zone mistake | 00:05:56 | ✅ |
| 28 | Dr. Becky Kennedy | hard things | 01:02:09 | ✅ |
| 33 | Eoghan McCabe | heart systems | 01:04:24 | ✅ |

## 🟡 B 级：有转录但未经修正验证（5 组）
时间戳看起来合理（原始值就不是 00:00:00 也不是明显预告段），但没有被系统性复核过。

| Comic | Speaker | Quote (缩) | 时间戳 | 备注 |
|-------|---------|-----------|--------|------|
| 4 | Aishwarya | data shows won't succeed | 01:21:35 | 原始时间戳 |
| 7 | Lenny | give away for free | 00:55:51 | 原始时间戳 |
| 8 | Jeetu Patel | don't make it fake | 01:02:19 | 原始时间戳 |
| 30 | Bret Taylor | predict future invent it | 01:25:05 | 原始时间戳 |
| 11 | Brian Chesky | 1000 people look like 10 | 00:14:26 | 无转录但 Barnaby 查到了 |

## 🟠 C 级：无转录 + Barnaby 通过 YouTube 查到时间戳（7 组）
这些嘉宾在 lenny-data/ 里没有转录文件，Barnaby 用 YouTube 搜索定位的时间戳，置信度从高到中。

| Comic | Speaker | Quote (缩) | 时间戳 | 置信度 |
|-------|---------|-----------|--------|--------|
| 14 | Dalton Caldwell | sell shit make money | 00:04:48 | 高 |
| 17 | Dalton Caldwell | pivot like going home | 00:15:41 | 高 |
| 18 | Tobi Lütke | pessimism sophisticated | 00:22:58 | 高 |
| 21 | Nikita Bier | pixels | 00:51:05 | 高 |
| 22 | Jason Fried | small destination | 00:13:55 | 高 |
| 29 | Tobi Lütke | maximum potential | 00:08:49 | 高 |
| 31 | Kunal Shah | uncertainty absorber | 00:35:19 | 高 |

## 🟠 C 级（中置信度）：需要重点验证（2 组）

| Comic | Speaker | Quote (缩) | 时间戳 | 问题 |
|-------|---------|-----------|--------|------|
| 24 | April Dunford | no decision | 00:22:10 | 可能是不同集 |
| 32 | Kim Scott | ruinous empathy | 00:05:48 | 转录来自不同 video ID |

## 🔴 D 级：有问题需要处理（4 组）

| Comic | Speaker | 问题 | 建议 |
|-------|---------|------|------|
| 1 | Reid Hoffman | "Ship fast, iterate later" 在 Stewart Butterfield 节目转录中完全找不到，Reid Hoffman 也不是这期嘉宾 | **替换金句** |
| 13 | Roger Martin | 无转录，时间戳通过 YouTube 查找但需验证 | 验证 01:19:10 |
| 16 | Brian Chesky | 无转录，时间戳通过 YouTube 查找但需验证 | 验证 00:24:55 |
| 26 | Shreyas Doshi | 无转录，时间戳仍疑似未修正 | 需要查找 |

---

## 新增金句准入标准（必须全满足）

### 入选条件
1. 金句原文必须能在 lenny-data/podcasts/*.md 转录中 **精确匹配**（允许小幅语序调整，但核心词必须一致）
2. 如果没有转录文件，必须在 YouTube 视频中 **实际听到** 该句话，并记录精确时间戳
3. Speaker 归属必须准确 —— 是谁说的就写谁，不是 Lenny 复述的
4. YouTube 时间戳必须指向 **正片**（main interview），不是预告（preview/teaser）或广告段
5. 时间戳精确到秒，点击后能在 ±30 秒内听到原文

### 流程
1. 从转录中提取候选金句
2. 验证：转录匹配 ✓ → YouTube 定位 ✓ → Speaker 确认 ✓
3. 三项全过才进入漫画生成
