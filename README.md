# @hearth/ui

📖 **在线文档 & Demo：https://haskaomni.github.io/hearth-ui/** · ⬇️ [下载源码 ZIP](https://github.com/haskaomni/hearth-ui/archive/refs/heads/main.zip)

一套基于 “Hearth · Life OS” 设计稿提炼的 React 组件库：黑白极简、等宽字体、细边框与柔和阴影，内置亮色 / 暗色主题。

- **React 18 / 19**，TypeScript 类型完整
- **零运行时样式依赖**：纯 CSS + CSS 变量（类名统一前缀 `hx-`），不依赖 Tailwind，不会和宿主项目样式冲突
- **主题可定制**：所有颜色、圆角、阴影、字体都是 `--hx-*` 变量，覆盖即可换肤
- 图标使用 `lucide-react`（peer dependency），任何 `ReactNode` 图标都可传入
- 已加 `"use client"`，可直接用于 Next.js App Router

## 安装

在其他项目中使用（三选一）：

```bash
# 0. 直接从 GitHub 安装（安装时自动构建）
npm i github:haskaomni/hearth-ui

# 1. 本地路径
npm i /path/to/hearth-ui

# 2. 打包成 tgz 后安装
cd hearth-ui && npm run build && npm pack   # 生成 hearth-ui-0.1.0.tgz
npm i ./hearth-ui-0.1.0.tgz

# 3. 发布到 npm / 私有 registry 后
npm i @hearth/ui
```

同时安装 peer 依赖：

```bash
npm i react react-dom lucide-react
```

## 快速开始

```tsx
import "@hearth/ui/styles.css";
import { ThemeProvider, Button, Card, Tabs } from "@hearth/ui";
import { Plus } from "lucide-react";

export default function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Card>
        <Tabs items={[{ value: "all", label: "All Goals" }, { value: "health", label: "Health" }]} />
        <Button leftIcon={<Plus />}>New Goal</Button>
      </Card>
    </ThemeProvider>
  );
}
```

字体（推荐，和设计稿一致）—— 在 `index.html` 引入 Geist Mono；不引入时自动回退到系统等宽字体：

```html
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

## 组件一览

| 分类 | 组件 |
| --- | --- |
| 主题 | `ThemeProvider` `useTheme` `ThemeSwitcher` |
| 基础 | `Button` `IconButton` `Kbd` `Badge` `Avatar` `AvatarGroup` `Card` `CardHeader` `SectionTitle` `Heading` `Eyebrow` `Divider` `IconTile` `Orb` |
| 表单 | `Field` `Input` `SearchInput` `Textarea` `Select` `Switch` `PromptInput`（AI 输入框） |
| 导航 / 布局 | `AppShell` `PageContent` `Sidebar` `SidebarBrand` `NavGroup` `NavItem` `SidebarSpacer` `SidebarDivider` `UserCard` `TopBar` `BackLink` `Tabs` |
| 数据展示 | `Progress`（bar / ticks 条纹） `Meter`（存储分段条） `Sparkline` `BarSpark` `MetricCard` `StatCard` `List` `ListItem` `SuggestionList` `Table` |
| 业务模式 | `HeroBanner` `Landscape`（内置插画） `Greeting` `TaskCard` `KanbanBoard` `KanbanColumn` `FileCard` `VisionCard` |
| 工具 | `cx`（className 合并） `toneColor` |

色调 `tone`：`neutral | blue | purple | red | green | amber | pink | inverse`，适用于 `Badge`、`Progress`、`ListItem`、`IconTile`、图表等。

### 常用示例

```tsx
// 侧边栏 + 页面骨架
<AppShell
  sidebar={
    <Sidebar>
      <SidebarBrand logo={<Asterisk />} name="Hearth" subtitle="Life OS" />
      <SearchInput size="sm" variant="subtle" />
      <NavGroup title="Main">
        <NavItem icon={<PenSquare />} active>Chat</NavItem>
        <NavItem icon={<SquareCheck />} count={9}>Tasks</NavItem>
        {/* 配合路由：<NavItem as={Link} to="/files">Files</NavItem> */}
      </NavGroup>
      <SidebarSpacer />
      <UserCard name="Alex" email="alex@example.com" />
      <ThemeSwitcher />
    </Sidebar>
  }
>
  <TopBar start={<BackLink>Goals</BackLink>} end={<Button size="sm">New</Button>} />
  <PageContent>…</PageContent>
</AppShell>

// AI 输入框（Enter 发送，Shift+Enter 换行，自动增高）
<PromptInput
  placeholder="Ask Hearth to plan, remember, or do anything…"
  tools={<IconButton label="Attach" icon={<Paperclip />} />}
  footnote="AI can make mistakes, please verify important details."
  onSubmit={(text) => send(text)}
/>

// 指标卡
<MetricCard title="Health & Longevity" subtitle="Physical pillar" value="78%"
  caption="VO2 Max Target" chart={<Sparkline data={[3, 5, 4, 8, 6]} highlight={3} />} />

// 看板
<KanbanBoard>
  <KanbanColumn title="In Progress" count={3} onAdd={addTask}>
    <TaskCard title="Design tokens" progress={89} tags={[{ label: "Design", tone: "blue" }]} due="Feb 18" comments={2} />
  </KanbanColumn>
</KanbanBoard>

// 表格
<Table data={rows} rowKey={(r) => r.id} columns={[
  { key: "name", header: "Name" },
  { key: "type", header: "Type", render: (r) => <Badge variant="outline">{r.type}</Badge> },
]} />
```

## 主题定制

```css
/* 覆盖任意变量即可换肤 */
:root {
  --hx-font-sans: "Inter", system-ui, sans-serif;  /* 换成非等宽字体 */
  --hx-blue: #0ea5e9;
  --hx-radius-lg: 14px;
}
[data-hx-theme="dark"] {
  --hx-bg: #000;
}
```

`ThemeProvider` 参数：`defaultMode`（`light | dark | system`）、受控的 `mode` + `onModeChange`、`storageKey`（默认 `hx-theme`，传 `false` 关闭持久化）、`applyToDocument`（同步 `data-hx-theme` 到 `<html>`）。

完整变量见 `src/styles/tokens.css`。

## 开发

```bash
npm install
npm run dev              # 启动文档站（组件文档 + Chat / Goals / Files / Tasks 四个示例页面）
npm run build            # 构建到 dist/：index.js (ESM) / index.cjs / index.d.ts / styles.css
npm run typecheck
```

目录结构：

```
src/
  index.ts                 入口
  utils.ts                 cx / tone 工具
  styles/tokens.css        设计变量（亮 / 暗）
  styles/components.css    组件样式
  components/
    theme.tsx  primitives.tsx  forms.tsx  navigation.tsx  data.tsx  patterns.tsx
playground/                文档站 & 演示页面（推送 main 后由 GitHub Actions 自动部署到 Pages）
```
