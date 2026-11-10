import * as React from "react";
import {
  Activity, Bell, Calendar, Folder, Heart, Lightbulb, Map, MessageSquare, Paperclip, Plus, Sparkles, Target,
  FileText, LayoutGrid, Brain, Check, Copy, Asterisk, PenSquare, SquareCheck,
} from "lucide-react";
import {
  Avatar, AvatarGroup, Badge, BarSpark, Button, Card, Field, FileCard, HeroBanner, IconButton, IconTile, Input,
  KanbanColumn, Kbd, List, ListItem, Meter, MetricCard, Orb, Progress, PromptInput, SearchInput, SectionTitle,
  Select, Sparkline, StatCard, SuggestionList, Switch, Table, Tabs, TaskCard, Textarea, ThemeSwitcher, Greeting,
  NavGroup, NavItem, SidebarBrand, UserCard, BackLink, Heading, VisionCard, Landscape,
} from "../src";

type PropRow = [name: string, type: string, def: string, desc: string];
interface Doc {
  id: string;
  name: string;
  group: string;
  desc: string;
  demo: React.ReactNode;
  code: string;
  props?: PropRow[];
}

const wave = [30, 32, 31, 35, 33, 38, 34, 30, 42, 36, 33, 45, 38, 40, 36, 48, 41, 39, 44, 37, 42, 46, 40, 43];
const bars = Array.from({ length: 40 }, (_, i) => 20 + Math.round(30 * Math.abs(Math.sin(i * 1.7))));
const tones = ["neutral", "blue", "purple", "red", "green", "amber", "pink", "inverse"] as const;

function SwitchDemo() {
  const [on, setOn] = React.useState(true);
  return <Switch checked={on} onCheckedChange={setOn} label={on ? "Sync on" : "Sync off"} />;
}

const docs: Doc[] = [
  /* ---------------- Basics */
  {
    id: "button", name: "Button", group: "Basics",
    desc: "Primary actions are solid black; secondary is a bordered white button. Supports icons, loading and three sizes.",
    demo: (<>
      <Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button><Button loading>Saving</Button>
      <Button size="sm" leftIcon={<Plus />}>New</Button><Button size="lg" rightIcon={<Sparkles />}>Generate</Button>
    </>),
    code: `<Button leftIcon={<Plus />}>New Goal</Button>
<Button variant="secondary">Dismiss</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button loading>Saving</Button>`,
    props: [
      ["variant", `"primary" | "secondary" | "ghost" | "outline" | "danger"`, `"primary"`, "Visual style"],
      ["size", `"sm" | "md" | "lg"`, `"md"`, "Height 28 / 34 / 40px"],
      ["leftIcon / rightIcon", "ReactNode", "—", "Icon before / after the label"],
      ["loading", "boolean", "false", "Shows a spinner and disables the button"],
      ["block", "boolean", "false", "Full width"],
    ],
  },
  {
    id: "icon-button", name: "IconButton", group: "Basics",
    desc: "Square button for a single icon. `label` is required and becomes the aria-label and tooltip.",
    demo: (<>
      <IconButton label="Notifications" icon={<Bell />} variant="secondary" />
      <IconButton label="Attach" icon={<Paperclip />} />
      <IconButton label="Add" icon={<Plus />} variant="primary" />
    </>),
    code: `<IconButton label="Notifications" icon={<Bell />} variant="secondary" />`,
    props: [["icon", "ReactNode", "—", "The icon"], ["label", "string", "—", "Accessible name (required)"], ["variant / size", "same as Button", `"ghost" / "md"`, ""]],
  },
  {
    id: "badge", name: "Badge", group: "Basics",
    desc: "Small tags for status, categories and counts. Eight tones, soft or outline style.",
    demo: (<>
      {tones.map((t) => <Badge key={t} tone={t}>{t}</Badge>)}
      <Badge tone="green" dot pill size="md">Online</Badge><Badge variant="outline">PDF</Badge>
    </>),
    code: `<Badge tone="red">Deep Work</Badge>
<Badge tone="green" dot pill size="md">Online</Badge>
<Badge variant="outline">PDF</Badge>`,
    props: [
      ["tone", `"neutral" | "blue" | "purple" | "red" | "green" | "amber" | "pink" | "inverse"`, `"neutral"`, "Color"],
      ["variant", `"soft" | "outline"`, `"soft"`, ""], ["size", `"sm" | "md"`, `"sm"`, ""],
      ["pill / dot", "boolean", "false", "Rounded shape / leading status dot"], ["icon", "ReactNode", "—", ""],
    ],
  },
  {
    id: "kbd", name: "Kbd", group: "Basics",
    desc: "Keyboard shortcut hint.",
    demo: (<><Kbd keys={["⌘", "K"]} /><Kbd>Esc</Kbd><Kbd keys={["⇧", "Enter"]} /></>),
    code: `<Kbd keys={["⌘", "K"]} />\n<Kbd>Esc</Kbd>`,
    props: [["keys", "string[]", "—", "Render several keys"], ["children", "ReactNode", "—", "A single key"]],
  },
  {
    id: "avatar", name: "Avatar / AvatarGroup", group: "Basics",
    desc: "Image or initials. Groups overlap and show +N for the overflow.",
    demo: (<>
      <Avatar name="Alex Rivera" /><Avatar name="Sam Park" round color="#7a5af8" size={36} />
      <AvatarGroup max={3}>
        <Avatar name="Ana Lee" color="#2f6bff" /><Avatar name="Ben Ko" color="#e5484d" /><Avatar name="Cy Do" color="#2fa36b" /><Avatar name="Di Wu" /><Avatar name="Ed Yi" />
      </AvatarGroup>
    </>),
    code: `<Avatar src="/me.jpg" name="Alex Rivera" />
<AvatarGroup max={3}>
  <Avatar name="Ana Lee" color="#2f6bff" />
  <Avatar name="Ben Ko" />
  …
</AvatarGroup>`,
    props: [["src", "string", "—", "Image URL; otherwise initials"], ["name", "string", "—", "Used for initials and title"], ["size", "number", "28", "px"], ["round", "boolean", "false", "Circle instead of rounded square"], ["color", "string", "—", "Initials background"]],
  },
  {
    id: "card", name: "Card / SectionTitle", group: "Basics",
    desc: "The bordered white container used everywhere, plus the icon + title heading above card groups.",
    demo: (
      <div style={{ width: "100%" }}>
        <SectionTitle icon={<Target />} title="Active Targets" action={<Button size="sm" variant="ghost">View all</Button>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
          <Card>Default</Card><Card variant="muted">Muted</Card><Card variant="elevated">Elevated</Card><Card interactive>Interactive</Card>
        </div>
      </div>
    ),
    code: `<SectionTitle icon={<Target />} title="Active Targets" action={…} />
<Card padding="lg" variant="elevated" interactive>…</Card>`,
    props: [["padding", `"none" | "sm" | "md" | "lg"`, `"md"`, ""], ["variant", `"default" | "muted" | "elevated"`, `"default"`, ""], ["interactive", "boolean", "false", "Hover state"], ["as", "ElementType", `"div"`, "Render as another element"]],
  },
  {
    id: "misc", name: "Orb / IconTile / Heading", group: "Basics",
    desc: "The assistant's gradient orb, tinted icon tiles, and typography helpers.",
    demo: (<>
      <Orb /><Orb size={22} animated={false} />
      <IconTile tone="blue"><Map /></IconTile><IconTile tone="amber"><Lightbulb /></IconTile><IconTile tone="red"><Heart /></IconTile>
      <Heading level={3}>Heading level 3</Heading>
    </>),
    code: `<Orb size={32} />
<IconTile tone="blue"><Map /></IconTile>
<Heading level={1}>Tasks</Heading>
<Eyebrow>Welcome back</Eyebrow>`,
  },

  /* ---------------- Forms */
  {
    id: "input", name: "Input / SearchInput / Field", group: "Forms",
    desc: "Text inputs with optional icons and slots. `Field` adds a label, hint and error message.",
    demo: (
      <div style={{ width: "100%", display: "grid", gap: 10, maxWidth: 420 }}>
        <SearchInput />
        <Input leftIcon={<Sparkles />} placeholder="AI Quick Entry" />
        <Field label="Email" hint="We never share it."><Input placeholder="you@example.com" /></Field>
        <Field label="Name" error="Required"><Input invalid placeholder="Your name" /></Field>
      </div>
    ),
    code: `<SearchInput shortcut={["⌘", "K"]} />
<Input leftIcon={<Sparkles />} placeholder="AI Quick Entry" />
<Field label="Name" error="Required">
  <Input invalid />
</Field>`,
    props: [
      ["leftIcon / rightSlot", "ReactNode", "—", "Content inside the field"], ["size", `"sm" | "md"`, `"md"`, ""],
      ["variant", `"default" | "subtle"`, `"default"`, "Subtle = grey, borderless"], ["invalid", "boolean", "false", "Error state"],
      ["shortcut (SearchInput)", "string[] | null", `["⌘","K"]`, "Keyboard hint"],
    ],
  },
  {
    id: "textarea", name: "Textarea", group: "Forms", desc: "Multi-line text input.",
    demo: <div style={{ width: "100%", maxWidth: 420 }}><Textarea placeholder="Notes…" /></div>,
    code: `<Textarea placeholder="Notes…" />`,
  },
  {
    id: "select", name: "Select", group: "Forms",
    desc: "A styled native <select>: accessible and needs no dependencies.",
    demo: (<><Select icon={<Calendar />} options={[{ value: "q3", label: "Q3 2026" }, { value: "q4", label: "Q4 2026" }]} />
      <Select options={[{ value: "all", label: "All Files" }, { value: "pdf", label: "PDF" }]} /></>),
    code: `<Select icon={<Calendar />} value={q} onChange={(e) => setQ(e.target.value)}
  options={[{ value: "q3", label: "Q3 2026" }, { value: "q4", label: "Q4 2026" }]} />`,
    props: [["options", "{ value, label, disabled? }[]", "—", ""], ["icon", "ReactNode", "—", "Leading icon"]],
  },
  {
    id: "switch", name: "Switch", group: "Forms", desc: "Toggle that works controlled or uncontrolled.",
    demo: <><SwitchDemo /><Switch defaultChecked color="var(--hx-green)" label="Custom color" /><Switch disabled label="Disabled" /></>,
    code: `<Switch checked={on} onCheckedChange={setOn} label="Sync" />`,
    props: [["checked / defaultChecked", "boolean", "false", ""], ["onCheckedChange", "(v: boolean) => void", "—", ""], ["label", "ReactNode", "—", ""], ["color", "string", "blue", "Color when on"]],
  },
  {
    id: "prompt-input", name: "PromptInput", group: "Forms",
    desc: "The AI chat composer. It grows with its content; Enter sends and Shift+Enter starts a new line. It handles IME composition correctly.",
    demo: (
      <div style={{ width: "100%", maxWidth: 560 }}>
        <PromptInput placeholder="Ask Hearth to plan, remember, or do anything…"
          tools={<><IconButton label="Add" icon={<Plus />} /><IconButton label="Attach" icon={<Paperclip />} /></>}
          footnote="AI can make mistakes, please verify important details." />
      </div>
    ),
    code: `<PromptInput
  placeholder="Ask anything…"
  tools={<IconButton label="Attach" icon={<Paperclip />} />}
  footnote="AI can make mistakes."
  onSubmit={(text) => send(text)}
  loading={isStreaming}
/>`,
    props: [
      ["value / defaultValue / onValueChange", "string", "—", "Controlled or uncontrolled"], ["onSubmit", "(text: string) => void", "—", ""],
      ["tools / trailing", "ReactNode", "—", "Toolbar left side / before the send button"], ["footnote", "ReactNode", "—", "Small centered note"],
      ["loading / disabled", "boolean", "false", ""],
    ],
  },

  /* ---------------- Navigation */
  {
    id: "tabs", name: "Tabs", group: "Navigation",
    desc: "Segmented control. Arrow keys move between tabs (WAI-ARIA tabs pattern).",
    demo: (<>
      <Tabs items={[{ value: "smart", label: "Smart View" }, { value: "kanban", label: "Kanban" }, { value: "list", label: "List" }]} />
      <Tabs size="sm" variant="inverse" defaultValue="w2" items={[{ value: "w1", label: "W1" }, { value: "w2", label: "W2" }, { value: "w3", label: "W3" }]} />
    </>),
    code: `<Tabs value={view} onValueChange={setView} items={[
  { value: "smart", label: "Smart View" },
  { value: "kanban", label: "Kanban" },
]} />`,
    props: [["items", "{ value, label, icon?, disabled? }[]", "—", ""], ["value / defaultValue / onValueChange", "string", "first item", ""], ["size", `"sm" | "md"`, `"md"`, ""], ["variant", `"default" | "inverse"`, `"default"`, "Inverse = black selected tab"], ["block", "boolean", "false", "Stretch to full width"]],
  },
  {
    id: "sidebar", name: "Sidebar / NavItem / AppShell", group: "Navigation",
    desc: "Building blocks for the app layout. `NavItem` takes `as` so you can pass your router's Link. Under 900px wide the sidebar becomes a drawer controlled by `sidebarOpen`.",
    demo: (
      <div style={{ width: 240, padding: 10, background: "var(--hx-bg-subtle)", border: "1px solid var(--hx-border)", borderRadius: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        <SidebarBrand logo={<Asterisk />} name="Hearth" subtitle="Life OS" />
        <NavGroup title="Main">
          <NavItem icon={<PenSquare />} active trailing={<Kbd keys={["⌘", "T"]} />}>Chat</NavItem>
          <NavItem icon={<SquareCheck />} count={9}>Tasks</NavItem>
          <NavItem icon={<Folder />}>Files</NavItem>
        </NavGroup>
        <NavGroup title="Today" collapsible><NavItem sub>Plan my vacation</NavItem><NavItem sub>Review weekly goals</NavItem></NavGroup>
        <UserCard name="Alex Rivera" email="alex@example.com" />
        <ThemeSwitcher />
      </div>
    ),
    code: `<AppShell sidebar={
  <Sidebar>
    <SidebarBrand logo={<Asterisk />} name="Hearth" subtitle="Life OS" />
    <NavGroup title="Main">
      <NavItem as={Link} to="/chat" icon={<PenSquare />} active>Chat</NavItem>
      <NavItem icon={<SquareCheck />} count={9}>Tasks</NavItem>
    </NavGroup>
    <SidebarSpacer />
    <UserCard name="Alex" email="alex@example.com" />
    <ThemeSwitcher />
  </Sidebar>
}>
  <TopBar start={<BackLink>Goals</BackLink>} end={…} />
  <PageContent>…</PageContent>
</AppShell>`,
    props: [["NavItem.active", "boolean", "false", "Sets aria-current=page"], ["NavItem.count / trailing", "ReactNode", "—", "Right side"], ["NavItem.sub", "boolean", "false", "Smaller, indented item"], ["NavGroup.collapsible", "boolean", "false", ""], ["AppShell.sidebarOpen", "boolean", "—", "Mobile drawer"]],
  },
  {
    id: "topbar", name: "TopBar / BackLink", group: "Navigation",
    desc: "Sticky header with a breadcrumb on the left and actions on the right.",
    demo: <><BackLink>Goals</BackLink><BackLink noIcon>Personal OS</BackLink></>,
    code: `<TopBar
  start={<BackLink href="/goals">Goals</BackLink>}
  end={<Button size="sm" leftIcon={<PenSquare />}>New</Button>}
/>`,
  },

  /* ---------------- Data display */
  {
    id: "progress", name: "Progress", group: "Data display",
    desc: "Two styles: a rounded `bar` and the striped `ticks` meter from the design.",
    demo: (
      <div style={{ width: "100%", display: "grid", gap: 12, maxWidth: 420 }}>
        <Progress value={62} label="Uploading" showValue="top" />
        <Progress value={89} variant="ticks" />
        <Progress value={39} variant="ticks" tone="purple" />
        <Progress value={59} variant="ticks" tone="red" />
      </div>
    ),
    code: `<Progress value={62} label="Uploading" showValue="top" />
<Progress value={89} variant="ticks" tone="blue" />`,
    props: [["value / max", "number", "— / 100", ""], ["variant", `"bar" | "ticks"`, `"bar"`, ""], ["tone", "Tone", `"blue"`, ""], ["label", "ReactNode", "—", ""], ["showValue", `"top" | "inline" | false`, `"inline"`, ""]],
  },
  {
    id: "meter", name: "Meter", group: "Data display", desc: "Stacked usage bar with a legend.",
    demo: <div style={{ width: "100%", maxWidth: 420 }}><Meter title="Storage" caption="130 GB of 200 GB" max={200} segments={[{ label: "Documents", value: 60, tone: "blue" }, { label: "Image", value: 30, tone: "purple" }, { label: "Download", value: 25, tone: "pink" }, { label: "Research", value: 15, tone: "inverse" }]} /></div>,
    code: `<Meter title="Storage" caption="130 GB of 200 GB" max={200} segments={[
  { label: "Documents", value: 60, tone: "blue" },
  { label: "Image", value: 30, color: "#7a5af8" },
]} />`,
    props: [["segments", "{ label, value, tone?, color? }[]", "—", ""], ["max", "number", "—", ""], ["legend", "boolean", "true", ""]],
  },
  {
    id: "charts", name: "Sparkline / BarSpark", group: "Data display",
    desc: "Lightweight inline-SVG charts that need no chart library.",
    demo: (
      <div style={{ width: "100%", display: "grid", gap: 12, maxWidth: 420 }}>
        <Sparkline data={wave} highlight={11} />
        <Sparkline data={wave} tone="blue" area />
        <BarSpark data={bars} highlightRange={[18, 28]} />
      </div>
    ),
    code: `<Sparkline data={[3, 5, 4, 8]} highlight={3} />
<Sparkline data={data} tone="blue" area />
<BarSpark data={data} highlightRange={[18, 28]} />`,
    props: [["data", "number[]", "—", ""], ["height", "number", "48", ""], ["tone", "Tone", "neutral / inverse", ""], ["highlight (Sparkline)", "number", "—", "Index to mark with a dot"], ["highlightRange (BarSpark)", "[number, number]", "—", ""]],
  },
  {
    id: "metric-card", name: "MetricCard / StatCard", group: "Data display",
    desc: "Goal card with a big number and a chart; compact stat tile.",
    demo: (
      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        <MetricCard title="Health & Longevity" subtitle="Physical pillar" icon={<Heart />} value="78%" caption="VO2 Max Target" chart={<Sparkline data={wave} highlight={11} />} />
        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <StatCard icon={<Target />} value="2" label="Active goal" />
          <StatCard icon={<Activity />} value="78%" label="Avg. progress" />
        </div>
      </div>
    ),
    code: `<MetricCard title="Health & Longevity" subtitle="Physical pillar"
  icon={<Heart />} value="78%" caption="VO2 Max Target"
  aside={<Tabs size="sm" variant="inverse" items={…} />}
  chart={<Sparkline data={data} highlight={11} />} />
<StatCard icon={<Target />} value="2" label="Active goal" />`,
  },
  {
    id: "list", name: "List / ListItem", group: "Data display",
    desc: "Rows with an icon, title, description and right-side content. A row with onClick or href becomes clickable.",
    demo: (
      <div style={{ width: "100%", maxWidth: 420 }}>
        <List bordered>
          <ListItem icon={<Sparkles />} iconTone="blue" title="All Intelligent" description="20 files" chevron onClick={() => {}} />
          <ListItem icon={<Heart />} iconTone="red" title="Health Records" description="12 files" trailing={<Badge>New</Badge>} />
          <ListItem icon={<Folder />} title="Legal & Finance" description="45 files" trailing={<Kbd>A+</Kbd>} />
        </List>
      </div>
    ),
    code: `<List bordered>
  <ListItem icon={<Sparkles />} iconTone="blue" title="All Intelligent"
    description="20 files" chevron onClick={open} />
</List>`,
    props: [["icon / iconTone", "ReactNode / Tone", "—", ""], ["title / description", "ReactNode", "—", ""], ["trailing", "ReactNode", "—", ""], ["onClick / href", "", "—", "Clickable row"], ["chevron", "boolean", "false", ""]],
  },
  {
    id: "suggestions", name: "SuggestionList", group: "Data display", desc: "Prompt starters shown under the composer.",
    demo: <SuggestionList moreLabel="More ideas" items={[{ label: "Stay on Track", icon: <FileText />, tone: "purple" }, { label: "Structure Your Week", icon: <LayoutGrid />, tone: "pink" }, { label: "Think With Me", icon: <Brain />, tone: "purple" }]} />,
    code: `<SuggestionList
  items={[{ label: "Plan My Week", icon: <Calendar />, tone: "purple" }]}
  onSelect={(s) => send(s.label)}
  moreLabel="More ideas"
/>`,
  },
  {
    id: "table", name: "Table", group: "Data display", desc: "Typed data table with column definitions and custom cell rendering.",
    demo: (
      <div style={{ width: "100%" }}>
        <Table data={[{ name: "SF_Rental_Agreement.pdf", type: "PDF", size: "1.8 MB" }, { name: "Q3_Expense_Report.csv", type: "CSV", size: "856 KB" }]}
          columns={[{ key: "name", header: "Name" }, { key: "type", header: "Type", render: (r) => <Badge variant="outline">{r.type}</Badge> }, { key: "size", header: "Size", align: "right" }]} />
      </div>
    ),
    code: `<Table<FileRow> data={rows} rowKey={(r) => r.id} onRowClick={open} columns={[
  { key: "name", header: "Name" },
  { key: "type", header: "Type", render: (r) => <Badge variant="outline">{r.type}</Badge> },
  { key: "size", header: "Size", align: "right" },
]} />`,
    props: [["columns", "{ key, header, render?, width?, align? }[]", "—", ""], ["data", "T[]", "—", ""], ["rowKey", "(row, i) => Key", "index", ""], ["onRowClick", "(row) => void", "—", ""], ["compact", "boolean", "false", ""], ["empty", "ReactNode", `"No data"`, ""]],
  },

  /* ---------------- Patterns */
  {
    id: "hero", name: "HeroBanner", group: "Patterns",
    desc: "Banner with text and actions on the left and artwork on the right. By default the artwork is the built-in <Landscape/> illustration. Pass `media` an image URL or any element to replace it, or null to hide it.",
    demo: <div style={{ width: "100%" }}><HeroBanner eyebrow="Welcome back" title="Life Goals" description="Strategic alignment and quarterly targets." actions={<><Button leftIcon={<Plus />}>New Goal</Button><Button variant="ghost">Vision Board</Button></>} /></div>,
    code: `<HeroBanner
  eyebrow="Welcome back"
  title="Life Goals"
  description="Strategic alignment and quarterly targets."
  actions={<Button leftIcon={<Plus />}>New Goal</Button>}
  media="/my-cover.jpg"
/>`,
  },
  {
    id: "greeting", name: "Greeting", group: "Patterns", desc: "Centered orb and welcome line for the empty chat screen.",
    demo: <div style={{ width: "100%", padding: 12 }}><Greeting title="Good morning, Alex" /></div>,
    code: `<Greeting title="Good morning, Alex" />`,
  },
  {
    id: "task-card", name: "TaskCard / KanbanColumn", group: "Patterns",
    desc: "Kanban card with progress, tags and metadata; columns go inside <KanbanBoard>.",
    demo: (
      <div style={{ width: "100%", maxWidth: 340 }}>
        <KanbanColumn title="In Progress" count={2} onAdd={() => {}} actions={<IconButton size="sm" label="Add" icon={<Plus />} />}>
          <TaskCard title="Design System: Tokens" progress={89} tags={[{ label: "Design", tone: "blue" }]} due="Feb 18" comments={2} links={2}
            footerEnd={<AvatarGroup size={20}><Avatar name="Ana Lee" color="#2f6bff" /><Avatar name="Ben Ko" color="#7a5af8" /></AvatarGroup>} />
          <TaskCard title="Finalize Q3 Strategy Deck" description="Incorporate feedback from the executive review." tags={[{ label: "Deep Work", tone: "red" }]} due="Feb 18" comments={2} />
        </KanbanColumn>
      </div>
    ),
    code: `<KanbanBoard>
  <KanbanColumn title="In Progress" icon={<Loader />} count={3} onAdd={add}>
    <TaskCard title="Design tokens" progress={89}
      tags={[{ label: "Design", tone: "blue" }]}
      due="Feb 18" comments={2} links={2}
      footerEnd={<AvatarGroup>…</AvatarGroup>} />
  </KanbanColumn>
</KanbanBoard>`,
    props: [["title / description", "ReactNode", "—", ""], ["tags", "{ label, tone? }[]", "—", ""], ["progress / progressTone", "number / Tone", "— / blue", "Striped meter"], ["due / comments / links", "ReactNode / number", "—", "Footer meta"], ["statusIcon / footerEnd", "ReactNode", "—", ""]],
  },
  {
    id: "file-card", name: "FileCard / VisionCard", group: "Patterns", desc: "File thumbnail card and image card with a status footer.",
    demo: (
      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 10 }}>
        <FileCard name="SF_Rental_Agreement_2026.pdf" meta="Legal & Finance • 3.2 MB" progress={88} />
        <FileCard name="Passport_Scan.png" meta="Travel • 3.2 MB" progress={64} progressTone="red" />
        <VisionCard media={<Landscape palette="dusk" style={{ width: "100%", height: "100%" }} />} title="Dream Career" description="Build a top 1% career in design." status="In Progress" date="Q4 2026" />
      </div>
    ),
    code: `<FileCard name="Agreement.pdf" meta="Legal • 3.2 MB" progress={88} />
<VisionCard media={<img src="…" />} title="Dream Career"
  description="…" status="In Progress" date="Q4 2026" />`,
  },
];

const groups = [...new Set(docs.map((d) => d.group))];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="doc-code">
      <button
        type="button"
        className="doc-copy"
        aria-label="Copy code"
        onClick={() => {
          navigator.clipboard?.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }, () => {});
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="hx-table-wrap">
      <table className="hx-table hx-table--compact">
        <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>
          {rows.map(([n, t, d, desc]) => (
            <tr key={n}>
              <td><code className="doc-inline">{n}</code></td>
              <td className="doc-type">{t}</td>
              <td className="doc-type">{d}</td>
              <td style={{ whiteSpace: "normal", color: "var(--hx-fg-secondary)" }}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const install = `npm i @hearth/ui react react-dom lucide-react`;
const usage = `import "@hearth/ui/styles.css";
import { ThemeProvider, Button } from "@hearth/ui";

export default function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Button>Hello Hearth</Button>
    </ThemeProvider>
  );
}`;
const theming = `:root {
  --hx-font-sans: "Inter", system-ui, sans-serif;
  --hx-blue: #0ea5e9;
  --hx-radius-lg: 14px;
}
[data-hx-theme="dark"] {
  --hx-bg: #000;
}`;

export function DocsPage() {
  const [active, setActive] = React.useState("getting-started");

  React.useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-doc-section]");
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="doc-layout">
      <nav className="doc-toc" aria-label="Components">
        <NavGroup title="Guide">
          <NavItem active={active === "getting-started"} onClick={() => jump("getting-started")}>Getting started</NavItem>
          <NavItem active={active === "theming"} onClick={() => jump("theming")}>Theming</NavItem>
        </NavGroup>
        {groups.map((g) => (
          <NavGroup key={g} title={g}>
            {docs.filter((d) => d.group === g).map((d) => (
              <NavItem key={d.id} active={active === d.id} onClick={() => jump(d.id)}>{d.name}</NavItem>
            ))}
          </NavGroup>
        ))}
      </nav>

      <div className="doc-main">
        <section id="getting-started" data-doc-section className="doc-section">
          <Badge tone="blue" pill size="md" icon={<Sparkles />} style={{ alignSelf: "flex-start" }}>v0.1.0</Badge>
          <Heading level={1} style={{ marginTop: 12 }}>Hearth UI</Heading>
          <p className="doc-lead">
            A calm, monochrome React component library for AI-native productivity apps. It is styled with plain CSS variables
            (no Tailwind needed), comes with light and dark themes, and is fully typed.
          </p>
          <h3 className="doc-h3">Install</h3>
          <CodeBlock code={install} />
          <h3 className="doc-h3">Use</h3>
          <CodeBlock code={usage} />
          <p className="doc-p">
            Recommended font: <code className="doc-inline">Geist Mono</code> from Google Fonts. If it isn't loaded, text falls back to the system monospace font.
            Icons come from <code className="doc-inline">lucide-react</code>, but any ReactNode works as an icon.
          </p>
        </section>

        <section id="theming" data-doc-section className="doc-section">
          <Heading level={2}>Theming</Heading>
          <p className="doc-p">
            Every color, radius, shadow and font is a <code className="doc-inline">--hx-*</code> CSS variable. Override them to re-skin the library.
            <code className="doc-inline">ThemeProvider</code> switches between light, dark and system, and saves the choice.
            Try the switcher here or in the sidebar.
          </p>
          <div className="doc-demo"><ThemeSwitcher style={{ width: 260 }} /></div>
          <CodeBlock code={theming} />
          <h3 className="doc-h3">Tones</h3>
          <div className="doc-demo">
            {tones.map((t) => <span key={t} className="doc-swatch"><i style={{ background: t === "neutral" ? "var(--hx-fg-secondary)" : t === "inverse" ? "var(--hx-primary)" : `var(--hx-${t})` }} />{t}</span>)}
          </div>
        </section>

        {groups.map((g) => (
          <React.Fragment key={g}>
            <Eyebrow2>{g}</Eyebrow2>
            {docs.filter((d) => d.group === g).map((d) => (
              <section key={d.id} id={d.id} data-doc-section className="doc-section">
                <Heading level={2}>{d.name}</Heading>
                <p className="doc-p">{d.desc}</p>
                <div className="doc-demo">{d.demo}</div>
                <CodeBlock code={d.code} />
                {d.props && <PropsTable rows={d.props} />}
              </section>
            ))}
          </React.Fragment>
        ))}
        <footer className="doc-foot">
          <MessageSquare size={13} /> Built with Hearth UI ·{" "}
          <a href="https://github.com/haskaomni/hearth-ui">GitHub</a>
        </footer>
      </div>
    </div>
  );
}

function Eyebrow2({ children }: { children: React.ReactNode }) {
  return <div className="doc-group">{children}</div>;
}
