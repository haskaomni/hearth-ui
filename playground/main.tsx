import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, Asterisk, Bell, BookOpen, Briefcase, Calendar, CalendarDays, Cloud, Compass, Eye, FileText, Files, Folder,
  Goal, HardDrive, Heart, HeartPulse, HelpCircle, Hourglass, Landmark, Lightbulb, Loader, Map, MessageSquare, Mic,
  MoreHorizontal, MoreVertical, Paperclip, PenSquare, Plane, Plus, Receipt, Settings, SlidersHorizontal, Sparkles,
  Sprout, SquareCheck, Target, TrendingUp, Users, Wallet, LayoutGrid, Brain, ListTodo, PanelLeft, ChevronDown,
} from "lucide-react";
import {
  ThemeProvider, ThemeSwitcher, AppShell, Sidebar, SidebarBrand, SidebarSpacer, NavGroup, NavItem, UserCard,
  TopBar, BackLink, PageContent, Button, IconButton, Kbd, SearchInput, PromptInput, SuggestionList, Greeting,
  HeroBanner, Tabs, Select, SectionTitle, MetricCard, Sparkline, BarSpark, List, ListItem, StatCard, VisionCard,
  Card, Meter, FileCard, Table, Badge, TaskCard, KanbanBoard, KanbanColumn, AvatarGroup, Avatar, Input, Switch,
  Field, Textarea, Progress, Heading, Eyebrow, IconTile, Orb, Landscape, Divider,
} from "../src";

type Page = "chat" | "goals" | "tasks" | "files" | "components";

const recent = [
  "Plan my vacation", "Help me move to NYC", "Review my weekly goals", "Plan my Q3 priorities",
  "Build a better morning routine", "Organize my personal tasks", "What should I focus on today",
];

function AppSidebar({ page, go }: { page: Page; go: (p: Page) => void }) {
  return (
    <Sidebar>
      <SidebarBrand logo={<Asterisk />} name="Hearth" subtitle="Life OS" action={<IconButton size="sm" label="Collapse sidebar" icon={<PanelLeft />} />} />
      <SearchInput size="sm" variant="subtle" shortcut={["⌘", "K"]} />
      <NavGroup title="Main">
        <NavItem icon={<PenSquare />} active={page === "chat"} onClick={() => go("chat")} trailing={<Kbd keys={["⌘", "T"]} />}>Chat</NavItem>
        <NavItem icon={<Goal />} active={page === "goals"} onClick={() => go("goals")}>Goals</NavItem>
        <NavItem icon={<Calendar />} count={8}>Calendar</NavItem>
        <NavItem icon={<SquareCheck />} active={page === "tasks"} onClick={() => go("tasks")} count={9}>Tasks</NavItem>
        <NavItem icon={<Brain />}>Memory</NavItem>
        <NavItem icon={<Files />} active={page === "files"} onClick={() => go("files")}>Files</NavItem>
        <NavItem icon={<LayoutGrid />} active={page === "components"} onClick={() => go("components")}>Components</NavItem>
      </NavGroup>
      <NavGroup title="Today" collapsible>
        {recent.map((r) => <NavItem key={r} sub>{r}</NavItem>)}
      </NavGroup>
      <SidebarSpacer />
      <NavGroup title="Setting" collapsible defaultCollapsed><NavItem icon={<Settings />}>Preferences</NavItem></NavGroup>
      <NavGroup title="Help Center" collapsible defaultCollapsed><NavItem icon={<HelpCircle />}>Docs</NavItem></NavGroup>
      <UserCard name="Alex Rivera" email="alex@example.com" />
      <ThemeSwitcher />
    </Sidebar>
  );
}

const topEnd = (
  <>
    <IconButton label="Notifications" icon={<Bell />} variant="secondary" size="sm" />
    <Button size="sm" leftIcon={<PenSquare />}>New</Button>
    <IconButton label="Filters" icon={<SlidersHorizontal />} size="sm" />
  </>
);

/* ------------------------------------------------------------------ Chat */
function ChatPage() {
  return (
    <>
      <TopBar start={<BackLink noIcon trailingIcon={<ChevronDown size={13} />}>Personal OS</BackLink>} end={topEnd} />
      <PageContent narrow style={{ paddingTop: 72 }}>
        <Greeting title="Good morning, Alex" />
        <div style={{ marginTop: 28 }}>
          <PromptInput
            placeholder="Ask Hearth to plan, remember, or do anything…"
            tools={<><IconButton label="Add" icon={<Plus />} /><IconButton label="Attach" icon={<Paperclip />} /><IconButton label="Voice" icon={<Mic />} /></>}
            footnote="AI can make mistakes, please verify important details. Your data is private and never shared."
            onSubmit={(v) => alert(`Sent: ${v}`)}
          />
        </div>
        <SuggestionList
          style={{ marginTop: 20, maxWidth: 360 }}
          moreLabel="More ideas"
          items={[
            { label: "Stay on Track", icon: <FileText />, tone: "purple" },
            { label: "Structure Your Week", icon: <LayoutGrid />, tone: "pink" },
            { label: "Think With Me", icon: <Brain />, tone: "purple" },
            { label: "Explore Something New", icon: <Compass />, tone: "amber" },
            { label: "Plan My Week", icon: <CalendarDays />, tone: "purple" },
            { label: "Ask For Advice", icon: <Lightbulb />, tone: "amber" },
          ]}
        />
      </PageContent>
    </>
  );
}

/* ------------------------------------------------------------------ Goals */
const wave = [30, 32, 31, 35, 33, 38, 34, 30, 42, 36, 33, 45, 38, 40, 36, 48, 41, 39, 44, 37, 42, 46, 40, 43];
const bars = Array.from({ length: 48 }, (_, i) => 20 + Math.round(30 * Math.abs(Math.sin(i * 1.7)) + (i > 28 && i < 40 ? 40 : 0)));

function GoalsPage() {
  const [q, setQ] = React.useState("q3");
  return (
    <>
      <TopBar start={<BackLink>Goals</BackLink>} end={topEnd} />
      <PageContent>
        <HeroBanner
          eyebrow="Welcome back"
          title="Life Goals"
          description="Strategic alignment and quarterly targets."
          actions={<><Button leftIcon={<Plus />}>New Goal</Button><Button variant="ghost" leftIcon={<Eye />}>Vision Board</Button></>}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0", gap: 12, flexWrap: "wrap" }}>
          <Tabs items={[{ value: "all", label: "All Goals" }, { value: "health", label: "Health" }, { value: "career", label: "Career" }, { value: "growth", label: "Growth" }]} />
          <Select icon={<Calendar />} value={q} onChange={(e) => setQ(e.target.value)} options={[{ value: "q3", label: "Q3 2026" }, { value: "q4", label: "Q4 2026" }]} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 20 }}>
          <div>
            <SectionTitle icon={<Target />} title="Active Targets" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
              <MetricCard title="Health & Longevity" subtitle="Physical pillar" icon={<HeartPulse />} value="78%" caption="VO2 Max Target"
                aside={<Tabs size="sm" variant="inverse" defaultValue="w2" items={[{ value: "w1", label: "W1" }, { value: "w2", label: "W2" }, { value: "w3", label: "W3" }]} />}
                chart={<Sparkline data={wave} highlight={11} />} />
              <MetricCard title="Financial Freedom" subtitle="Wealth pillar" icon={<Landmark />} value="45%" caption="Portfolio Growth"
                chart={<BarSpark data={bars} highlightRange={[29, 39]} />} />
            </div>
            <SectionTitle icon={<Eye />} title="Vision Board" style={{ marginTop: 22 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              <VisionCard media={<Landscape palette="dusk" style={{ width: "100%", height: "100%" }} />} title="Build My Dream Career" description="Build a top 1% career in UI/UX design and development, work on meaningful projects." status={<><Loader size={11} /> In Progress</>} date="Q4 2026" />
              <VisionCard media={<BookOpen size={40} strokeWidth={1} />} title="Be 1% Better Every Day" description="Stay fit, build a consistent workout routine, eat clean, and have more energy." status={<><Hourglass size={11} /> Planned</>} date="2029" />
              <VisionCard media={<Sprout size={40} strokeWidth={1} />} title="Financial Freedom" description="Grow multiple income streams, invest wisely, and reach financial freedom within 5 years." status={<><Loader size={11} /> In Progress</>} date="Q4 2026" />
            </div>
          </div>
          <div>
            <SectionTitle icon={<Heart />} title="Life Pillars" />
            <List bordered>
              <ListItem icon={<Heart />} title="Health" description="2 Active goal" trailing={<Kbd>A+</Kbd>} />
              <ListItem icon={<Briefcase />} title="Career" description="1 Active goal" trailing={<Kbd>B+</Kbd>} />
              <ListItem icon={<Users />} title="Relationships" description="Focus area" trailing={<Kbd>A-</Kbd>} />
              <ListItem icon={<TrendingUp />} title="Growth" description="0 Active goal" trailing={<Kbd>A+</Kbd>} />
            </List>
            <SectionTitle title="Quick Stats" style={{ marginTop: 22 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <StatCard icon={<Target />} value="2" label="Active goal" />
              <StatCard icon={<ListTodo />} value="4" label="Completed tasks" />
              <StatCard icon={<Heart />} value="3" label="Total pillars" />
              <StatCard icon={<Activity />} value="78%" label="Avg. progress" />
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}

/* ------------------------------------------------------------------ Files */
type FileRow = { name: string; type: string; size: string; modified: string };
const files: FileRow[] = [
  { name: "SF_Rental_Agreement_2026.pdf", type: "PDF", size: "1.8 MB", modified: "Jun 20, 2026" },
  { name: "Apple_Store_Receipt.jpg", type: "Image", size: "2.4 MB", modified: "Jun 19, 2026" },
  { name: "Q3_Expense_Report.csv", type: "CSV", size: "856 KB", modified: "Jun 18, 2026" },
];

function FilesPage() {
  return (
    <>
      <TopBar start={<BackLink>Files</BackLink>} end={topEnd} />
      <PageContent>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2.4fr) minmax(0,1fr)", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <HeroBanner eyebrow={<><Sparkles size={11} /> AI Insight</>} title="Review pull requests for API v2"
              description="I've automatically grouped 14 new W-2s and receipts from 2023 into your Legal & Finance group."
              actions={<><Button>Review Documents</Button><Button variant="secondary">Dismiss</Button></>} />
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}><Input leftIcon={<Sparkles />} placeholder="Ask AI: 'Find the rental agreement from last June'…" rightSlot={<Kbd keys={["⌘", "F"]} />} /></div>
              <Select options={[{ value: "all", label: "All Files" }, { value: "pdf", label: "PDF" }]} wrapperClassName="" style={{ height: 34 }} />
              <IconButton variant="secondary" label="Grid" icon={<LayoutGrid />} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10 }}>
              <FileCard name="SF_Rental_Agreement_2026.pdf" meta="Legal & Finance • 3.2 MB" progress={88} />
              <FileCard name="Apple_Store_Receipt.jpg" meta="Receipts • 3.2 MB" progress={88} progressTone="purple" />
              <FileCard name="Passport_Scan_2025.png" meta="Travel • 3.2 MB" progress={88} progressTone="red" />
              <FileCard name="Meeting_Notes_Dr_Smith.m4a" meta="Travel • 3.2 MB" progress={88} progressTone="inverse" />
            </div>
            <SectionTitle icon={<Folder />} title="Recent File" />
            <Table<FileRow> data={files} rowKey={(r) => r.name} columns={[
              { key: "name", header: "Name", render: (r) => <span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}><FileText size={14} />{r.name}</span> },
              { key: "type", header: "Type", render: (r) => <Badge variant="outline">{r.type}</Badge> },
              { key: "size", header: "Size" },
              { key: "modified", header: "Modified" },
              { key: "action", header: "Action", align: "right", render: () => <IconButton size="sm" label="More" icon={<MoreHorizontal />} /> },
            ]} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <div style={{ height: 90, display: "grid", placeItems: "center", color: "var(--hx-fg-subtle)" }}><Cloud size={56} strokeWidth={1} /></div>
              <Meter title="Storage" caption="130 GB of 200 GB" max={200} segments={[
                { label: "Documents", value: 60, tone: "blue" }, { label: "Image", value: 30, tone: "purple" },
                { label: "Download", value: 25, tone: "pink" }, { label: "Research", value: 15, tone: "inverse" },
              ]} />
            </Card>
            <div>
              <SectionTitle icon={<Sparkles />} title="Semantic Groups" />
              <List>
                <ListItem icon={<Sparkles />} iconTone="blue" title="All Intelligent" description="20 files" trailing={<MoreVertical />} />
                <ListItem icon={<Heart />} iconTone="red" title="Health Records" description="12 files" trailing={<MoreVertical />} />
                <ListItem icon={<Wallet />} title="Legal & Finance" description="45 files" trailing={<MoreVertical />} />
                <ListItem icon={<Plane />} iconTone="green" title="Travel Documents" description="8 files" trailing={<MoreVertical />} />
                <ListItem icon={<Receipt />} iconTone="amber" title="Receipts & Invoices" description="5 files" trailing={<MoreVertical />} />
              </List>
            </div>
            <div>
              <SectionTitle icon={<HardDrive />} title="Cloud Sync" />
              <List>
                <ListItem icon={<HardDrive />} iconTone="blue" title="Drive Connected" description={<Progress value={80} variant="ticks" />} />
                <ListItem icon={<Cloud />} iconTone="red" title="Dropbox Connect" description={<Progress value={59} variant="ticks" tone="red" />} />
              </List>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}

/* ------------------------------------------------------------------ Tasks */
const desc = "Incorporate feedback from the executive review. Focus on the revised user flows.";
const people = (
  <AvatarGroup size={20}>
    <Avatar name="Ana Lee" color="#2f6bff" /><Avatar name="Ben Ko" color="#7a5af8" />
  </AvatarGroup>
);

function TasksPage() {
  return (
    <>
      <TopBar start={<BackLink>Tasks</BackLink>} end={topEnd} />
      <PageContent>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <Heading level={1}>Tasks</Heading>
            <p className="hx-text-sm hx-text-muted" style={{ marginTop: 6 }}>AI can make mistakes, please verify important details.<br />Your data is private and never shared.</p>
          </div>
          <div style={{ display: "flex", gap: 8, minWidth: 320, flex: "0 1 460px" }}>
            <div style={{ flex: 1 }}><Input leftIcon={<Sparkles />} placeholder="AI Quick Entry" /></div>
            <Button leftIcon={<PenSquare />}>New Task</Button>
          </div>
        </div>
        <Tabs style={{ margin: "20px 0" }} items={[{ value: "smart", label: "Smart View" }, { value: "kanban", label: "Kanban" }, { value: "list", label: "List" }]} />
        <KanbanBoard>
          <KanbanColumn title="To Do" icon={<ListTodo />} count={5} onAdd={() => {}} actions={<IconButton size="sm" label="Add" icon={<Plus />} />}>
            <TaskCard title="Finalize Q3 Strategy Deck" description={desc} tags={[{ label: "Deep Work", tone: "red" }]} due="Feb 18" comments={2} links={2} footerEnd={people} />
            <TaskCard title="Review pull requests for API v2" description={desc} tags={[{ label: "Deep Work", tone: "red" }]} due="Feb 18" comments={2} links={2} footerEnd={people} />
          </KanbanColumn>
          <KanbanColumn title="In Progress" icon={<Loader />} count={3} onAdd={() => {}} actions={<IconButton size="sm" label="Add" icon={<Plus />} />}>
            <TaskCard title="Design System: Tokens Structure" progress={89} tags={[{ label: "Design", tone: "blue" }]} due="Feb 18" comments={2} links={2} footerEnd={people} />
            <TaskCard title="Migrate auth service to OAuth2" progress={59} tags={[{ label: "Engineering", tone: "blue" }, { label: "Design", tone: "blue" }]} due="Feb 10" comments={2} links={2} footerEnd={people} />
            <TaskCard title="Draft investor update — Q3" progress={39} tags={[{ label: "Admin", tone: "purple" }]} due="Feb 18" comments={2} links={2} footerEnd={people} />
          </KanbanColumn>
          <KanbanColumn title="Waiting" icon={<Hourglass />} count={2} onAdd={() => {}} actions={<IconButton size="sm" label="Add" icon={<Plus />} />}>
            <TaskCard statusIcon={<Hourglass />} title="Client approval on wireframes" description="Review the wireframes, share feedback, and approve the structure before moving forward." tags={[{ label: "Client X", tone: "green" }]} due="Feb 10" comments={2} links={2} />
            <TaskCard statusIcon={<Hourglass />} title="Legal review of vendor contract" description="Review the vendor contract to ensure all terms, clauses, and obligations are clear." tags={[{ label: "Client X", tone: "green" }]} due="Feb 18" comments={2} links={2} />
          </KanbanColumn>
        </KanbanBoard>
      </PageContent>
    </>
  );
}

/* ------------------------------------------------------------------ Component gallery */
function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Eyebrow style={{ color: "var(--hx-fg-muted)" }}>{title}</Eyebrow>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>{children}</div>
    </Card>
  );
}

function ComponentsPage() {
  const [on, setOn] = React.useState(true);
  return (
    <>
      <TopBar start={<BackLink>Components</BackLink>} end={topEnd} />
      <PageContent style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 14, alignItems: "start" }}>
        <Row title="Button">
          <Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button><Button loading>Saving</Button>
          <Button size="sm" leftIcon={<Plus />}>Small</Button><Button size="lg" rightIcon={<Sparkles />}>Large</Button>
          <IconButton label="Bell" icon={<Bell />} variant="secondary" />
        </Row>
        <Row title="Badge">
          {(["neutral", "blue", "purple", "red", "green", "amber", "pink", "inverse"] as const).map((t) => <Badge key={t} tone={t}>{t}</Badge>)}
          <Badge tone="green" dot pill size="md">Online</Badge><Badge variant="outline">PDF</Badge>
        </Row>
        <Row title="Inputs">
          <div style={{ width: "100%", display: "grid", gap: 10 }}>
            <SearchInput />
            <Field label="Email" hint="We never share it."><Input placeholder="you@example.com" /></Field>
            <Field label="Name" error="Required"><Input invalid placeholder="Your name" /></Field>
            <Textarea placeholder="Notes…" />
          </div>
        </Row>
        <Row title="Tabs / Select / Switch">
          <Tabs items={[{ value: "a", label: "Smart View" }, { value: "b", label: "Kanban" }, { value: "c", label: "List" }]} />
          <Tabs size="sm" variant="inverse" items={[{ value: "1", label: "W1" }, { value: "2", label: "W2" }, { value: "3", label: "W3" }]} />
          <Select icon={<Calendar />} options={[{ value: "q3", label: "Q3 2026" }, { value: "q4", label: "Q4 2026" }]} />
          <Switch checked={on} onCheckedChange={setOn} label="Sync" />
          <Kbd keys={["⌘", "K"]} />
        </Row>
        <Row title="Progress / Meter">
          <div style={{ width: "100%", display: "grid", gap: 12 }}>
            <Progress value={62} label="Bar" showValue="top" />
            <Progress value={89} variant="ticks" />
            <Progress value={39} variant="ticks" tone="purple" />
            <Meter title="Storage" caption="130 / 200 GB" max={200} segments={[{ label: "Docs", value: 70, tone: "blue" }, { label: "Media", value: 40, tone: "purple" }, { label: "Other", value: 20, tone: "amber" }]} />
          </div>
        </Row>
        <Row title="Avatar / Orb / IconTile">
          <Avatar name="Alex Rivera" /><Avatar name="Sam Park" round color="#7a5af8" />
          <AvatarGroup max={3}><Avatar name="A B" color="#2f6bff" /><Avatar name="C D" color="#e5484d" /><Avatar name="E F" color="#2fa36b" /><Avatar name="G H" /><Avatar name="I J" /></AvatarGroup>
          <Orb /><IconTile tone="blue"><Map /></IconTile><IconTile tone="amber"><Lightbulb /></IconTile>
        </Row>
        <Row title="Charts">
          <div style={{ width: "100%", display: "grid", gap: 12 }}>
            <Sparkline data={wave} tone="blue" area highlight={15} />
            <BarSpark data={bars} highlightRange={[10, 30]} tone="purple" />
          </div>
        </Row>
        <Row title="Prompt input">
          <div style={{ width: "100%" }}><PromptInput tools={<IconButton label="Attach" icon={<Paperclip />} />} placeholder="Ask anything…" /></div>
        </Row>
        <Row title="List / Stat">
          <div style={{ width: "100%", display: "grid", gap: 10 }}>
            <List bordered>
              <ListItem icon={<MessageSquare />} iconTone="blue" title="Clickable item" description="With chevron" chevron onClick={() => {}} />
              <ListItem icon={<Folder />} title="Static item" description="12 files" trailing={<Badge>New</Badge>} />
            </List>
            <Divider />
            <StatCard icon={<Activity />} value="78%" label="Avg. progress" />
          </div>
        </Row>
      </PageContent>
    </>
  );
}

function App() {
  const initial = (location.hash.slice(1) as Page) || "chat";
  const [page, setPage] = React.useState<Page>(initial);
  const go = (p: Page) => {
    setPage(p);
    history.replaceState(null, "", `#${p}`);
  };
  return (
    <ThemeProvider defaultMode="light">
      <AppShell sidebar={<AppSidebar page={page} go={go} />}>
        {page === "chat" && <ChatPage />}
        {page === "goals" && <GoalsPage />}
        {page === "files" && <FilesPage />}
        {page === "tasks" && <TasksPage />}
        {page === "components" && <ComponentsPage />}
      </AppShell>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
