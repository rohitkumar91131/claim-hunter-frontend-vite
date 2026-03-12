import { useState, useLayoutEffect, useRef } from 'react';
import { Copy, Check, Terminal, Key, BookOpen, Zap, Clock, BarChart2, ShieldAlert } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

function Badge({ method }) {
    const styles = {
        GET: 'bg-green-500/10 text-green-400 border-green-500/30',
        POST: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold font-mono border ${styles[method] || 'bg-muted/10 text-muted border-border-custom'}`}>
            {method}
        </span>
    );
}

function CodeBlock({ code, language = 'bash' }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            toast.error('Failed to copy to clipboard.');
        });
    };

    return (
        <div className="relative group bg-[#0d0d0d] rounded-xl border border-border-custom overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border-custom bg-foreground/5">
                <span className="text-xs text-muted font-mono">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
                    title="Copy code"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="overflow-x-auto p-4 text-sm text-foreground/90 font-mono leading-relaxed whitespace-pre">{code}</pre>
        </div>
    );
}

function EndpointCard({ method, path, title, description, auth, requestBody, responseSchema, curlExample, fetchExample }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="api-card border border-border-custom rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/40">
            <button
                className="w-full flex items-center gap-3 p-4 bg-card hover:bg-foreground/5 transition-colors text-left"
                onClick={() => setOpen(o => !o)}
            >
                <Badge method={method} />
                <code className="text-sm font-mono text-foreground flex-1">{path}</code>
                <span className="text-muted text-sm hidden sm:block">{title}</span>
                {auth && (
                    <span className="flex items-center gap-1 text-xs text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 rounded px-2 py-0.5 shrink-0">
                        <Key className="w-3 h-3" />
                        Auth
                    </span>
                )}
                <span className="text-muted ml-2 text-lg leading-none">{open ? '−' : '+'}</span>
            </button>

            {open && (
                <div className="border-t border-border-custom p-5 space-y-5 bg-background">
                    <p className="text-muted text-sm leading-relaxed">{description}</p>

                    {auth && (
                        <div className="flex items-start gap-2 text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-4 py-3">
                            <Key className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>Requires an active session cookie. <a href="/login" className="underline hover:text-yellow-300">Sign in</a> first.</span>
                        </div>
                    )}

                    {requestBody && (
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Request Body</h4>
                            <CodeBlock code={requestBody} language="json" />
                        </div>
                    )}

                    {responseSchema && (
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Response Schema</h4>
                            <CodeBlock code={responseSchema} language="json" />
                        </div>
                    )}

                    {curlExample && (
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">cURL Example</h4>
                            <CodeBlock code={curlExample} language="bash" />
                        </div>
                    )}

                    {fetchExample && (
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">JavaScript (fetch)</h4>
                            <CodeBlock code={fetchExample} language="javascript" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Section({ icon: Icon, title, children }) {
    return (
        <section className="api-section space-y-4">
            <div className="flex items-center gap-3 border-b border-border-custom pb-3">
                {Icon && <Icon className="w-5 h-5 text-primary" />}
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
            </div>
            {children}
        </section>
    );
}

export default function ApiDocs() {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.api-section');
            sections.forEach(section => {
                gsap.fromTo(section,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
                        scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' }
                    }
                );
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-background text-foreground transition-colors duration-300">

            {/* Header */}
            <header className="border-b border-border-custom py-16 text-center">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-6">
                        <Terminal className="w-3.5 h-3.5" />
                        REST API Reference
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
                        Claim Hunter API
                    </h1>
                    <p className="text-lg text-muted font-light">
                        Integrate fact-checking and misinformation detection directly into your application.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                        <span className="text-muted">Base URL:</span>
                        <code className="px-3 py-1 rounded-lg bg-card border border-border-custom text-primary font-mono text-sm select-all">
                            {BASE_URL}
                        </code>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-16 max-w-4xl space-y-14">

                {/* Authentication Overview */}
                <Section icon={Key} title="Authentication">
                    <div className="bg-card rounded-xl border border-border-custom p-5 space-y-3 text-sm text-muted leading-relaxed">
                        <p>
                            The API uses <strong className="text-foreground">cookie-based session authentication</strong>.
                            After a successful <code className="bg-foreground/10 px-1.5 py-0.5 rounded text-xs">POST /auth/login</code>,
                            the server sets an <code className="bg-foreground/10 px-1.5 py-0.5 rounded text-xs">HttpOnly</code> session cookie automatically.
                        </p>
                        <p>
                            All subsequent requests to protected endpoints must include this cookie.
                            When using <strong className="text-foreground">cURL</strong>, use <code className="bg-foreground/10 px-1.5 py-0.5 rounded text-xs">-c cookies.txt -b cookies.txt</code> flags.
                            When using <strong className="text-foreground">fetch</strong>, set <code className="bg-foreground/10 px-1.5 py-0.5 rounded text-xs">credentials: &apos;include&apos;</code>.
                        </p>
                    </div>
                    <CodeBlock
                        language="bash"
                        code={`# Step 1 — Login and save cookies
curl -s -c cookies.txt \\
  -X POST ${BASE_URL}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"yourpassword"}'

# Step 2 — Use saved cookies for authenticated requests
curl -s -b cookies.txt ${BASE_URL}/auth/me`}
                    />
                </Section>

                {/* Auth Endpoints */}
                <Section icon={Key} title="Auth Endpoints">
                    <EndpointCard
                        method="POST"
                        path="/auth/register"
                        title="Register"
                        description="Create a new user account. Returns the created user object on success."
                        auth={false}
                        requestBody={`{
  "email": "you@example.com",
  "password": "yourpassword"
}`}
                        responseSchema={`{
  "id": "uuid",
  "email": "you@example.com"
}`}
                        curlExample={`curl -X POST ${BASE_URL}/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"yourpassword"}'`}
                        fetchExample={`const res = await fetch('${BASE_URL}/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'you@example.com', password: 'yourpassword' }),
});
const user = await res.json();`}
                    />
                    <EndpointCard
                        method="POST"
                        path="/auth/login"
                        title="Login"
                        description="Authenticate with email and password. On success the server sets an HttpOnly session cookie — no token is returned in the body."
                        auth={false}
                        requestBody={`{
  "email": "you@example.com",
  "password": "yourpassword"
}`}
                        responseSchema={`{
  "message": "Login successful"
}`}
                        curlExample={`curl -c cookies.txt -X POST ${BASE_URL}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"yourpassword"}'`}
                        fetchExample={`await fetch('${BASE_URL}/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email: 'you@example.com', password: 'yourpassword' }),
});`}
                    />
                    <EndpointCard
                        method="POST"
                        path="/auth/logout"
                        title="Logout"
                        description="Clears the session cookie and invalidates the current session."
                        auth={true}
                        responseSchema={`{
  "message": "Logged out successfully"
}`}
                        curlExample={`curl -b cookies.txt -X POST ${BASE_URL}/auth/logout`}
                        fetchExample={`await fetch('${BASE_URL}/auth/logout', {
  method: 'POST',
  credentials: 'include',
});`}
                    />
                    <EndpointCard
                        method="GET"
                        path="/auth/me"
                        title="Get Current User"
                        description="Returns the profile of the currently authenticated user."
                        auth={true}
                        responseSchema={`{
  "id": "uuid",
  "email": "you@example.com"
}`}
                        curlExample={`curl -b cookies.txt ${BASE_URL}/auth/me`}
                        fetchExample={`const res = await fetch('${BASE_URL}/auth/me', {
  credentials: 'include',
});
const user = await res.json();`}
                    />
                </Section>

                {/* Analysis Endpoints */}
                <Section icon={Zap} title="Analysis Endpoints">
                    <EndpointCard
                        method="POST"
                        path="/analyze/"
                        title="Analyze Text (AI)"
                        description="Analyze text using the AI backend (requires a Google API key configured on the server). Returns a full analysis result including claims, risk score, emotional tone, and logical fallacies."
                        auth={true}
                        requestBody={`{
  "text": "Breaking news: Scientists discover miracle cure for all diseases."
}`}
                        responseSchema={`{
  "summary_score": 82,
  "overall_risk_level": "High",
  "emotional_tone": "Sensational",
  "manipulation_score": 7,
  "claims": [
    {
      "claim": "Scientists discover miracle cure for all diseases",
      "reasoning": "Extraordinary claim with no cited source or evidence.",
      "risk": "High"
    }
  ],
  "logicalFallacies": [
    {
      "name": "Hasty Generalization",
      "description": "Overgeneralizing from limited or unspecified data."
    }
  ]
}`}
                        curlExample={`curl -b cookies.txt -X POST ${BASE_URL}/analyze/ \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Breaking news: Scientists discover miracle cure."}'`}
                        fetchExample={`const res = await fetch('${BASE_URL}/analyze/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ text: 'Breaking news: Scientists discover miracle cure.' }),
});
const result = await res.json();`}
                    />
                    <EndpointCard
                        method="POST"
                        path="/analyze/direct"
                        title="Analyze Text (No API Key)"
                        description="Analyze text using local heuristics — no Google API key required. Ideal for development and testing. Returns the same response schema as the AI endpoint."
                        auth={true}
                        requestBody={`{
  "text": "Drinking lemon water every morning cures cancer."
}`}
                        responseSchema={`{
  "summary_score": 74,
  "overall_risk_level": "High",
  "emotional_tone": "Alarmist",
  "manipulation_score": 6,
  "claims": [ ... ],
  "logicalFallacies": [ ... ]
}`}
                        curlExample={`curl -b cookies.txt -X POST ${BASE_URL}/analyze/direct \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Drinking lemon water every morning cures cancer."}'`}
                        fetchExample={`const res = await fetch('${BASE_URL}/analyze/direct', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ text: 'Drinking lemon water every morning cures cancer.' }),
});
const result = await res.json();`}
                    />
                    <EndpointCard
                        method="GET"
                        path="/analyze/get?text={your_text}"
                        title="Analyze Text via GET"
                        description="Analyze text using a simple GET request — pass the text as a query parameter. Perfect for quick integrations, browser testing, and tools that prefer GET over POST. Uses local heuristics (no API key required)."
                        auth={true}
                        responseSchema={`{
  "summary_score": 45,
  "overall_risk_level": "Medium",
  "emotional_tone": "Neutral",
  "manipulation_score": 3,
  "claims": [ ... ],
  "logicalFallacies": [ ... ]
}`}
                        curlExample={`curl -b cookies.txt \\
  "${BASE_URL}/analyze/get?text=The%20moon%20is%20made%20of%20cheese"`}
                        fetchExample={`const text = 'The moon is made of cheese';
const res = await fetch(
  \`${BASE_URL}/analyze/get?text=\${encodeURIComponent(text)}\`,
  { credentials: 'include' }
);
const result = await res.json();`}
                    />
                </Section>

                {/* History Endpoints */}
                <Section icon={Clock} title="History Endpoints">
                    <EndpointCard
                        method="GET"
                        path="/history/"
                        title="Get Analysis History"
                        description="Returns a list of all analyses performed by the currently authenticated user, sorted newest first."
                        auth={true}
                        responseSchema={`[
  {
    "id": "uuid",
    "original_text": "...",
    "summary_score": 55,
    "overall_risk_level": "Medium",
    "created_at": "2024-01-15T10:30:00Z"
  }
]`}
                        curlExample={`curl -b cookies.txt ${BASE_URL}/history/`}
                        fetchExample={`const res = await fetch('${BASE_URL}/history/', {
  credentials: 'include',
});
const history = await res.json();`}
                    />
                    <EndpointCard
                        method="GET"
                        path="/history/{id}"
                        title="Get Analysis by ID"
                        description="Returns the full analysis result for a specific history record by its UUID."
                        auth={true}
                        responseSchema={`{
  "id": "uuid",
  "original_text": "...",
  "summary_score": 55,
  "overall_risk_level": "Medium",
  "emotional_tone": "Neutral",
  "manipulation_score": 3,
  "claims": [ ... ],
  "logicalFallacies": [ ... ],
  "created_at": "2024-01-15T10:30:00Z"
}`}
                        curlExample={`curl -b cookies.txt ${BASE_URL}/history/your-analysis-uuid`}
                        fetchExample={`const res = await fetch(\`${BASE_URL}/history/\${id}\`, {
  credentials: 'include',
});
const detail = await res.json();`}
                    />
                </Section>

                {/* Dashboard Endpoints */}
                <Section icon={BarChart2} title="Dashboard Endpoints">
                    <EndpointCard
                        method="GET"
                        path="/dashboard/stats"
                        title="Get Dashboard Stats"
                        description="Returns aggregate statistics for the authenticated user — total analyses, average risk score, risk distribution, and the 5 most recent analyses."
                        auth={true}
                        responseSchema={`{
  "total_analyses": 42,
  "average_score": 58.3,
  "risk_distribution": {
    "low": 18,
    "medium": 15,
    "high": 9
  },
  "recent_analyses": [
    {
      "id": "uuid",
      "original_text": "...",
      "summary_score": 72,
      "overall_risk_level": "High",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}`}
                        curlExample={`curl -b cookies.txt ${BASE_URL}/dashboard/stats`}
                        fetchExample={`const res = await fetch('${BASE_URL}/dashboard/stats', {
  credentials: 'include',
});
const stats = await res.json();`}
                    />
                </Section>

                {/* Error Responses */}
                <Section icon={ShieldAlert} title="Error Responses">
                    <div className="bg-card rounded-xl border border-border-custom p-5 text-sm text-muted space-y-3">
                        <p>All errors return a JSON body with a <code className="bg-foreground/10 px-1.5 py-0.5 rounded text-xs">detail</code> or <code className="bg-foreground/10 px-1.5 py-0.5 rounded text-xs">message</code> field.</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-border-custom text-foreground">
                                        <th className="py-2 pr-4 font-semibold">Status</th>
                                        <th className="py-2 pr-4 font-semibold">Meaning</th>
                                        <th className="py-2 font-semibold">Common Cause</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-custom">
                                    {[
                                        ['400', 'Bad Request', 'Missing or invalid request body / query params'],
                                        ['401', 'Unauthorized', 'No session cookie or session expired — login required'],
                                        ['404', 'Not Found', 'Resource (e.g. history ID) does not exist'],
                                        ['422', 'Unprocessable Entity', 'Validation error on request data'],
                                        ['429', 'Too Many Requests', 'Rate limit exceeded — slow down'],
                                        ['503', 'Service Unavailable', 'AI backend is temporarily unavailable'],
                                    ].map(([code, meaning, cause]) => (
                                        <tr key={code}>
                                            <td className="py-2 pr-4 font-mono text-danger">{code}</td>
                                            <td className="py-2 pr-4 font-medium text-foreground">{meaning}</td>
                                            <td className="py-2">{cause}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <CodeBlock
                        language="json"
                        code={`// Example error response body
{
  "detail": "Not authenticated"
}`}
                    />
                </Section>

                {/* Quick Start */}
                <Section icon={BookOpen} title="Quick Start — Full Example">
                    <CodeBlock
                        language="bash"
                        code={`# 1. Register
curl -X POST ${BASE_URL}/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"dev@example.com","password":"secret123"}'

# 2. Login (saves session cookie to cookies.txt)
curl -c cookies.txt -X POST ${BASE_URL}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"dev@example.com","password":"secret123"}'

# 3. Analyze text (AI endpoint)
curl -b cookies.txt -X POST ${BASE_URL}/analyze/ \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Scientists say drinking bleach cures COVID-19."}'

# 4. Or use the GET endpoint (no body needed)
curl -b cookies.txt \\
  "${BASE_URL}/analyze/get?text=Scientists%20say%20drinking%20bleach%20cures%20COVID-19."

# 5. Check your analysis history
curl -b cookies.txt ${BASE_URL}/history/`}
                    />
                </Section>

            </div>
        </div>
    );
}
