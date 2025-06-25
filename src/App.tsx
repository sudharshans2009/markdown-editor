/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Image,
  List,
  ListOrdered,
  Table,
  Moon,
  Sun,
  Download,
  Upload,
  Eye,
  Edit3,
  Hash,
  Quote,
  Minus,
  Sparkles,
  Monitor,
  ExternalLink,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const initialMarkdown = `# Welcome to Markdown Editor
*Crafted with precision by Sudharshan S*

## ✨ Modern Features

- **Live Preview** with React Markdown
- **Syntax Highlighting** for code blocks  
- **Math Support** with KaTeX: $E = mc^2$
- **Tables**, **Task Lists**, and more!
- **Dark/Light Mode** with smooth transitions
- **Auto-save** functionality

### 🚀 Code Example

\`\`\`javascript
function createMarkdownEditor() {
  const editor = {
    features: ['live-preview', 'syntax-highlighting', 'math-support'],
    theme: 'modern',
    save: () => localStorage.setItem('content', this.content)
  };
  
  return editor;
}
\`\`\`

### ✅ Task List

- [x] Design modern UI
- [x] Implement live preview
- [x] Add syntax highlighting
- [ ] Deploy to production
- [ ] Add collaborative editing

### 📊 Feature Comparison

| Feature | Status | Priority |
|---------|--------|----------|
| Editor  | ✅ Complete | High |
| Preview | ✅ Complete | High |
| Export  | 🔄 In Progress | Medium |
| Themes  | ✅ Complete | Low |

> **Note:** This editor is built with modern web technologies including React, TypeScript, and Tailwind CSS for the best developer experience.

---

### 🔗 Connect

**Portfolio:** [www.sudharshans.me](https://www.sudharshans.me)  
**GitHub:** [@sudharshans2009](https://github.com/sudharshans2009)  
**Email:** [mail@sudharshans.me](mailto:mail@sudharshans.me)

*Happy writing! 📝*
`;

function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
          {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
          {theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppContent() {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [activeTab, setActiveTab] = useState("editor");
  const { theme } = useTheme();

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("markdown-content");
    if (saved) {
      setMarkdown(saved);
    }
  }, []);

  useEffect(() => {
    // Auto-save to localStorage with debounce
    const timer = setTimeout(() => {
      localStorage.setItem("markdown-content", markdown);
    }, 1000);
    return () => clearTimeout(timer);
  }, [markdown]);

  const insertMarkdown = (syntax: string, wrap = false) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    let newText = "";
    if (wrap && selectedText) {
      newText = `${syntax}${selectedText}${syntax}`;
    } else {
      newText = syntax;
    }

    const before = markdown.substring(0, start);
    const after = markdown.substring(end);
    const newMarkdown = before + newText + after;

    setMarkdown(newMarkdown);

    // Set cursor position
    setTimeout(() => {
      const newCursorPos =
        start + (wrap && selectedText ? syntax.length : newText.length);
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const exportMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importMarkdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "text/markdown" || file.name.endsWith(".md"))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdown(content);
      };
      reader.readAsText(file);
    }
  };

  const toolbarButtons = [
    { icon: Hash, action: () => insertMarkdown("# "), label: "Heading" },
    { icon: Bold, action: () => insertMarkdown("**", true), label: "Bold" },
    { icon: Italic, action: () => insertMarkdown("*", true), label: "Italic" },
    {
      icon: Strikethrough,
      action: () => insertMarkdown("~~", true),
      label: "Strikethrough",
    },
    {
      icon: Code,
      action: () => insertMarkdown("`", true),
      label: "Inline Code",
    },
    { icon: Quote, action: () => insertMarkdown("> "), label: "Quote" },
    { icon: List, action: () => insertMarkdown("- "), label: "Bullet List" },
    {
      icon: ListOrdered,
      action: () => insertMarkdown("1. "),
      label: "Numbered List",
    },
    { icon: Link, action: () => insertMarkdown("[text](url)"), label: "Link" },
    {
      icon: Image,
      action: () => insertMarkdown("![alt text](image-url)"),
      label: "Image",
    },
    {
      icon: Table,
      action: () =>
        insertMarkdown(
          "| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |"
        ),
      label: "Table",
    },
    {
      icon: Minus,
      action: () => insertMarkdown("\n---\n"),
      label: "Horizontal Rule",
    },
  ];

  // Determine if we're in dark mode (for syntax highlighting)
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="min-h-screen bg-background w-full h-full max-w-7xl mx-auto flex flex-col">
      {/* Header */}
      <motion.header
        className="border-b sticky top-0 z-50 bg-background/50 backdrop-blur-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Markdown Editor</h1>
              <p className="text-sm text-muted-foreground">By Sudharshan S</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={exportMarkdown}
              className="font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="font-medium"
            >
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </label>
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".md,.markdown"
              onChange={importMarkdown}
              className="hidden"
            />
            <Button
              variant="default"
              size="default"
              asChild
              className="font-medium"
            >
              <a
                href="https://www.sudharshans.me/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                My Website
              </a>
            </Button>
            <ModeToggle />
          </motion.div>
        </div>
      </motion.header>

      {/* Toolbar */}
      <motion.div
        className="border-b bg-background/95 backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-3">
          <motion.div
            className="flex items-center gap-2 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {toolbarButtons.map((button, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  className="hover:bg-accent transition-colors"
                  title={button.label}
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {markdown.length.toLocaleString()} characters • Auto-save enabled
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="split" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Split View
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="h-[calc(100vh-280px)] mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full card-elevated p-0">
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Start typing your markdown here..."
                  className="h-full resize-none border-0 text-sm font-mono leading-relaxed p-6 focus:ring-0"
                />
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="preview" className="h-[calc(100vh-280px)] mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full p-8 overflow-auto card-elevated">
                <div className="prose dark:prose-invert max-w-none animate-fade-in">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const inline = !match;
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={isDark ? oneDark : (oneLight as any)}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg !mt-4 !mb-4"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="split" className="h-[calc(100vh-280px)] mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full"
            >
              <Card className="h-full card-elevated p-0">
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Start typing your markdown here..."
                  className="h-full resize-none border-0 text-sm font-mono leading-relaxed p-6 focus:ring-0"
                />
              </Card>
              <Card className="h-full p-6 overflow-auto card-elevated">
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const inline = !match;
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={isDark ? oneDark : (oneLight as any)}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg !mt-4 !mb-4"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="markdown-editor-theme">
      <div className="flex min-h-screen w-full bg-background">
        <AppContent />
      </div>
    </ThemeProvider>
  );
}

export default App;
