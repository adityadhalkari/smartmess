import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const USERS = [
  { id: 1, role: "student",  name: "Arjun Sharma",   email: "arjun@college.edu",  password: "student123", avatar: "AS", college: "VIT Pune", year: "1st Year" },
  { id: 2, role: "owner",   name: "Rajesh Patel",    email: "rajesh@mess.com",    password: "owner123",   avatar: "RP", messId: 1 },
  { id: 3, role: "admin",   name: "Dr. Priya Menon", email: "admin@smartmess.com",password: "admin123",   avatar: "PM" },
  { id: 4, role: "student",  name: "Sneha Iyer",     email: "sneha@college.edu",  password: "student123", avatar: "SI", college: "COEP Pune", year: "3rd Year" },
  { id: 5, role: "owner",   name: "Meena Gupta",     email: "meena@mess.com",     password: "owner123",   avatar: "MG", messId: 2 },
];

const CATEGORIES = [
  { id: "veg",    label: "Pure Veg",     icon: "🌿", color: "#22c55e" },
  { id: "nonveg", label: "Non-Veg",      icon: "🍗", color: "#ef4444" },
  { id: "vegan",  label: "Vegan",        icon: "🥦", color: "#84cc16" },
  { id: "jain",   label: "Jain",         icon: "🏺", color: "#f59e0b" },
  { id: "combo",  label: "Combo Mess",   icon: "🍱", color: "#6366f1" },
  { id: "tiffin", label: "Tiffin Service",icon: "🛵", color: "#ec4899" },
];

const MESSES = [
  {
    id: 1, name: "Ruchira Mess", owner: "Rajesh Patel", ownerId: 2,
    category: "veg", address: "Near VIT Kondhwa", distance: "0.3 km",
    rating: 4.5, reviews: 128, price: 2800, priceUnit: "/month",
    tags: ["Hygienic", "Home Style", "Trial Available"],
    open: true, capacity: 80, enrolled: 64,
    image: "🏠",
    todayMenu: {
      breakfast: ["Poha", "Chai", "Bread Butter"],
      lunch: ["Dal Makhani", "Roti", "Rice", "Sabzi", "Salad", "Papad"],
      dinner: ["Paneer Butter Masala", "Roti", "Rice", "Dal", "Dessert"],
      snacks: ["Samosa", "Tea"]
    },
    weeklySpecial: "Sunday Special Thali",
    timing: "7AM–10AM · 12PM–3PM · 7PM–10PM",
    amenities: ["AC Dining", "Purified Water", "WiFi", "Laundry"],
    verified: true,
  },
  {
    id: 2, name: "Mumbai Tiffin House", owner: "Meena Gupta", ownerId: 5,
    category: "combo", address: "Near VIT Bibwewadi", distance: "0.7 km",
    rating: 4.2, reviews: 89, price: 3200, priceUnit: "/month",
    tags: ["Delivery Available", "South Indian", "North Indian"],
    open: true, capacity: 60, enrolled: 48,
    image: "🍱",
    todayMenu: {
      breakfast: ["Idli", "Sambar", "Dosa", "Chutney"],
      lunch: ["Rajma", "Jeera Rice", "Roti", "Curd", "Pickle"],
      dinner: ["Chicken Curry", "Egg Bhurji", "Roti", "Rice"],
      snacks: ["Vada Pav", "Coffee"]
    },
    weeklySpecial: "Friday Biryani Special",
    timing: "6:30AM–9:30AM · 12PM–2:30PM · 7PM–9:30PM",
    amenities: ["Home Delivery", "Tiffin Service", "Weekly Menu"],
    verified: true,
  },
  {
    id: 3, name: "Green Bowl Vegan Mess", owner: "Kiran Nair", ownerId: null,
    category: "vegan", address: "Bharti Vidyapeeth Back Gate", distance: "1.2 km",
    rating: 4.7, reviews: 56, price: 4500, priceUnit: "/month",
    tags: ["Organic", "Cold-pressed Juices", "No Onion Garlic"],
    open: true, capacity: 40, enrolled: 38,
    image: "🥗",
    todayMenu: {
      breakfast: ["Overnight Oats", "Smoothie Bowl", "Multigrain Toast"],
      lunch: ["Chickpea Curry", "Brown Rice", "Quinoa Salad", "Hummus"],
      dinner: ["Tofu Stir-fry", "Millet Roti", "Lentil Soup"],
      snacks: ["Fruit Bowl", "Herbal Tea"]
    },
    weeklySpecial: "Sunday Detox Thali",
    timing: "7AM–9AM · 12PM–2PM · 7PM–9PM",
    amenities: ["Organic Produce", "No Plastic", "Composting"],
    verified: false,
  },
  {
    id: 4, name: "Mughal Darbar Non-Veg Mess", owner: "Salim Khan", ownerId: null,
    category: "nonveg", address: "FC Road Pune", distance: "1.8 km",
    rating: 4.0, reviews: 201, price: 3500, priceUnit: "/month",
    tags: ["Halal", "Mughlai", "Biryani Daily"],
    open: false, capacity: 100, enrolled: 72,
    image: "🍖",
    todayMenu: {
      breakfast: ["Paya Soup", "Roti", "Anda Bhurji"],
      lunch: ["Mutton Biryani", "Chicken Curry", "Raita", "Salad"],
      dinner: ["Fish Fry", "Dal", "Rice", "Roti"],
      snacks: ["Kebab Roll", "Lassi"]
    },
    weeklySpecial: "Friday Biryani + Seekh Kebab",
    timing: "8AM–10AM · 1PM–3PM · 8PM–10PM",
    amenities: ["Halal Certified", "Party Orders", "Catering"],
    verified: true,
  },
];

const INIT_REVIEWS = [
  { id: 1, messId: 1, userId: 1, user: "Arjun S.", avatar: "AS", rating: 5, text: "Best mess I've ever had! The dal makhani is absolutely divine. Feels like home cooking.", date: "2 days ago", helpful: 12 },
  { id: 2, messId: 1, userId: 4, user: "Sneha I.", avatar: "SI", rating: 4, text: "Good food, hygienic kitchen. Wish they had more variety on weekdays.", date: "1 week ago", helpful: 8 },
  { id: 3, messId: 2, userId: 1, user: "Arjun S.", avatar: "AS", rating: 4, text: "The combo options are great, and delivery is always on time!", date: "3 days ago", helpful: 5 },
  { id: 4, messId: 3, userId: 4, user: "Sneha I.", avatar: "SI", rating: 5, text: "Finally a vegan mess that doesn't compromise on taste. The smoothie bowls are chef's kiss!", date: "5 days ago", helpful: 15 },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const G = {
  // brand
  primary: "#FF6B2B",
  primaryDark: "#e55a1a",
  secondary: "#1A1A2E",
  accent: "#FFD700",
  // surfaces
  bg: "#F8F5F0",
  card: "#FFFFFF",
  cardAlt: "#FFF8F3",
  border: "#E8E0D8",
  // text
  text: "#1A1A2E",
  textSub: "#6B6B7B",
  textLight: "#9B9BAB",
  // status
  success: "#22C55E",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#6366F1",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: ${G.bg}; color: ${G.text}; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 99px; }
  input, textarea, select { font-family: 'DM Sans', sans-serif; }
  button { font-family: 'DM Sans', sans-serif; cursor: pointer; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes shimmer { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes bounceIn { 0% { transform:scale(0.8); opacity:0; } 60% { transform:scale(1.05); } 100% { transform:scale(1); opacity:1; } }
  @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }

  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .slide-in { animation: slideIn 0.4s ease forwards; }
  .bounce-in { animation: bounceIn 0.4s ease forwards; }
  .float { animation: float 3s ease-in-out infinite; }

  .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(255,107,43,0.15) !important; }

  .btn-primary {
    background: linear-gradient(135deg, ${G.primary}, ${G.primaryDark});
    color: white; border: none; border-radius: 12px;
    padding: 12px 24px; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
    box-shadow: 0 4px 15px rgba(255,107,43,0.3);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,107,43,0.4); }
  .btn-primary:active { transform: translateY(0); }

  .btn-outline {
    background: transparent; color: ${G.primary};
    border: 2px solid ${G.primary}; border-radius: 12px;
    padding: 11px 24px; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-outline:hover { background: ${G.primary}; color: white; }

  .btn-ghost {
    background: transparent; color: ${G.textSub};
    border: 1px solid ${G.border}; border-radius: 10px;
    padding: 8px 16px; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: ${G.primary}; color: ${G.primary}; background: #FFF3EE; }

  .input-field {
    width: 100%; padding: 14px 16px; border: 2px solid ${G.border};
    border-radius: 12px; font-size: 15px; color: ${G.text};
    background: white; transition: border-color 0.2s;
    outline: none;
  }
  .input-field:focus { border-color: ${G.primary}; box-shadow: 0 0 0 4px rgba(255,107,43,0.1); }

  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 600;
    background: #FFF3EE; color: ${G.primary};
  }
  .star { color: ${G.accent}; }
  .badge-open { background: #DCFCE7; color: #16A34A; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 600; }
  .badge-closed { background: #FEE2E2; color: #DC2626; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 600; }
  .badge-verified { background: #EEF2FF; color: #4338CA; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 600; }

  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 11px 16px;
    border-radius: 12px; cursor: pointer; transition: all 0.2s;
    color: ${G.textSub}; font-weight: 500; font-size: 15px; text-decoration: none;
    border: none; background: transparent; width: 100%; text-align: left;
  }
  .nav-item:hover { background: #FFF3EE; color: ${G.primary}; }
  .nav-item.active { background: linear-gradient(135deg, ${G.primary}20, ${G.primary}10); color: ${G.primary}; font-weight: 600; }
  .nav-item.active .nav-dot { width: 6px; height: 6px; background: ${G.primary}; border-radius: 50%; flex-shrink:0; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .modal { background: white; border-radius: 24px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; animation: bounceIn 0.3s ease; }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Stars({ rating, size = 16 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className="star" style={{ fontSize: size, opacity: i <= Math.round(rating) ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  );
}

function Avatar({ initials, size = 38, color = G.primary }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontWeight: 700, fontSize: size * 0.35,
      flexShrink: 0, fontFamily: "'Syne', sans-serif"
    }}>
      {initials}
    </div>
  );
}

function StatCard({ icon, label, value, color = G.primary, sub }) {
  return (
    <div className="card-hover fade-up" style={{
      background: "white", borderRadius: 20, padding: "24px 20px",
      border: `1px solid ${G.border}`, textAlign: "center",
      boxShadow: "0 2px 16px rgba(0,0,0,0.04)"
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Syne', sans-serif" }}>{value}</div>
      <div style={{ fontSize: 13, color: G.textSub, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: G.textLight, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function MessCard({ mess, onView }) {
  const cat = CATEGORIES.find(c => c.id === mess.category);
  return (
    <div className="card-hover fade-up" onClick={() => onView(mess)} style={{
      background: "white", borderRadius: 20, overflow: "hidden",
      border: `1px solid ${G.border}`, cursor: "pointer",
      boxShadow: "0 2px 16px rgba(0,0,0,0.04)"
    }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}11)`,
        padding: "28px 20px", textAlign: "center", position: "relative"
      }}>
        <div style={{ fontSize: 56 }}>{mess.image}</div>
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: cat.color, color: "white",
          padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700
        }}>
          {cat.icon} {cat.label}
        </div>
        {mess.verified && (
          <div className="badge-verified" style={{ position: "absolute", top: 12, left: 12 }}>✓ Verified</div>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Syne', sans-serif", lineHeight: 1.2, flex: 1, paddingRight: 8 }}>{mess.name}</h3>
          <span className={mess.isOpen || mess.open ? "badge-open" : "badge-closed"}>{mess.isOpen || mess.open ? "Open" : "Closed"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Stars rating={mess.rating} size={14} />
          <span style={{ fontSize: 14, fontWeight: 700, color: G.text }}>{mess.rating}</span>
          <span style={{ fontSize: 13, color: G.textSub }}>({mess.reviews} reviews)</span>
        </div>
        <div style={{ fontSize: 13, color: G.textSub, marginBottom: 12 }}>
  📍 {mess.address} · {mess.distance}
  {mess.googleMaps && (
    <a 
      href={mess.googleMaps} 
      target="_blank" 
      rel="noreferrer"
      style={{ 
        marginLeft: 8, 
        color: "#4285F4", 
        fontWeight: 600,
        fontSize: 12 
      }}
    >
      View Map →
    </a>
  )}
</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {mess.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: G.primary, fontFamily: "'Syne', sans-serif" }}>₹{mess.price}</span>
            <span style={{ fontSize: 13, color: G.textSub }}>{mess.priceUnit}</span>
          </div>
          <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>View Details</button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ name: "", email: "", password: "", college: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "student", icon: "🎓", label: "Student" },
    { id: "owner",   icon: "🏪", label: "Mess Owner" },
    { id: "admin",   icon: "🛡️", label: "Admin" },
  ];
async function handleLogin(e) {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    const res = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    onLogin(data.user);
  } catch (err) {
    setError(err.message);
  }
  setLoading(false);
}
  const demos = {
  student: { email: "arjun@college.edu",   password: "password123" },
  owner:   { email: "rajesh@mess.com",      password: "password123" },
  admin:   { email: "admin@smartmess.com",  password: "admin@2024"  },
};

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: `linear-gradient(135deg, ${G.secondary} 0%, #2D2D4E 50%, #1A1A2E 100%)`
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px", color: "white",
        background: `linear-gradient(135deg, ${G.primary}33, transparent)`
      }} className="fade-up">
        <div style={{ fontSize: 48, marginBottom: 16 }} className="float">🍽️</div>
        <h1 style={{
          fontSize: 48, fontWeight: 800, fontFamily: "'Syne', sans-serif",
          lineHeight: 1.1, marginBottom: 16
        }}>
          Smart Mess<br /><span style={{ color: G.primary }}>Management</span><br />System
        </h1>
        <p style={{ fontSize: 16, opacity: 0.8, lineHeight: 1.7, maxWidth: 400 }}>
          Connecting students with the best mess facilities nearby. Real-time menus, transparent pricing, honest reviews.
        </p>
        <div style={{ display: "flex", gap: 20, marginTop: 40 }}>
          {[["1200+", "Students"], ["48", "Messes"], ["4.4★", "Avg Rating"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: G.primary, fontFamily: "'Syne', sans-serif" }}>{v}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{
        width: 480, display: "flex", alignItems: "center", justifyContent: "center", padding: 40,
        background: "white"
      }}>
        <div style={{ width: "100%", maxWidth: 400 }} className="bounce-in">
          {/* Tabs */}
          <div style={{ display: "flex", background: G.bg, borderRadius: 14, padding: 4, marginBottom: 28 }}>
            {["login","register"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "10px", border: "none", cursor: "pointer",
                borderRadius: 11, fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                background: tab === t ? G.primary : "transparent",
                color: tab === t ? "white" : G.textSub
              }}>
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 6 }}>
            {tab === "login" ? "Welcome back!" : "Create account"}
          </h2>
          <p style={{ fontSize: 14, color: G.textSub, marginBottom: 24 }}>
            {tab === "login" ? "Sign in to your account" : "Join SmartMess today"}
          </p>

          {/* Role Selector */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: G.textSub, display: "block", marginBottom: 8 }}>I am a...</label>
            <div style={{ display: "flex", gap: 8 }}>
              {roles.map(r => (
                <button key={r._id} onClick={() => setRole(r.id)} style={{
                  flex: 1, padding: "10px 6px", border: `2px solid ${role === r.id ? G.primary : G.border}`,
                  borderRadius: 12, cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                  background: role === r.id ? "#FFF3EE" : "white",
                  color: role === r.id ? G.primary : G.textSub, fontSize: 11, fontWeight: 600
                }}>
                  <div style={{ fontSize: 22, marginBottom: 3 }}>{r.icon}</div>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "12px 16px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {tab === "register" && (
              <input className="input-field" placeholder="Full Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            )}
            {tab === "register" && role === "student" && (
              <input className="input-field" placeholder="College / University" value={form.college}
                onChange={e => setForm({ ...form, college: e.target.value })} />
            )}
            <input className="input-field" type="email" placeholder="Email address" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="input-field" type="password" placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <button className="btn-primary" onClick={handleLogin} style={{ width: "100%", marginTop: 20, height: 50 }}>
            {loading ? "⏳ Signing in..." : (tab === "login" ? "Sign In →" : "Create Account →")}
          </button>

          {/* Demo Creds */}
          <div style={{ marginTop: 20, padding: 14, background: G.bg, borderRadius: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: G.textSub, marginBottom: 8 }}>DEMO CREDENTIALS</div>
            <div style={{ fontSize: 12, color: G.textSub, lineHeight: 1.8 }}>
              <div>📧 {demos[role].email}</div>
              <div>🔑 {demos[role].password}</div>
            </div>
            <button onClick={() => setForm({ ...form, email: demos[role].email, password: demos[role].password })}
              style={{ marginTop: 8, fontSize: 12, color: G.primary, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              Auto-fill →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED LAYOUT ────────────────────────────────────────────────────────────
function Layout({ user, onLogout, children, navItems, activePage, setPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const roleColors = { student: G.primary, owner: "#6366F1", admin: "#DC2626" };
  const roleColor = roleColors[user.role];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: G.bg }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 260 : 70, flexShrink: 0,
        background: "white", borderRight: `1px solid ${G.border}`,
        display: "flex", flexDirection: "column",
        transition: "width 0.3s ease", overflow: "hidden",
        boxShadow: "2px 0 20px rgba(0,0,0,0.04)"
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>🍽️</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: G.primary }}>SmartMess</div>
              <div style={{ fontSize: 11, color: G.textSub }}>Management System</div>
            </div>
          )}
        </div>

        {/* User */}
        <div style={{ padding: "16px 12px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials={user.avatar} size={38} color={roleColor} />
          {sidebarOpen && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: G.textSub, textTransform: "capitalize" }}>{user.role}</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: 10, overflowY: "auto" }}>
          {navItems.map(item => (
            <button key={item.id} className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)} title={item.label}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              {activePage === item.id && sidebarOpen && <span className="nav-dot" style={{ marginLeft: "auto" }} />}
            </button>
          ))}
        </div>

        {/* Collapse + Logout */}
        <div style={{ padding: 10, borderTop: `1px solid ${G.border}` }}>
          <button className="nav-item" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle">
            <span style={{ fontSize: 16 }}>{sidebarOpen ? "◀" : "▶"}</span>
            {sidebarOpen && "Collapse"}
          </button>
          <button className="nav-item" onClick={onLogout} title="Logout">
            <span style={{ fontSize: 16 }}>🚪</span>
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10, background: "rgba(248,245,240,0.9)",
          backdropFilter: "blur(12px)", borderBottom: `1px solid ${G.border}`,
          padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>
              {navItems.find(n => n.id === activePage)?.label}
            </h2>
            <div style={{ fontSize: 12, color: G.textSub }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: `${roleColor}22`, color: roleColor, padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
              {user.role}
            </div>
            <Avatar initials={user.avatar} size={36} color={roleColor} />
          </div>
        </div>
        <div style={{ padding: 28 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── MESS DETAIL MODAL ────────────────────────────────────────────────────────
function MessDetailModal({ mess, user, reviews, setReviews, onClose, onReview }) {
  const [tab, setTab] = useState("menu");
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: "" });
  const [submitted, setSubmitted] = useState(false);
  const [messReviews, setMessReviews] = useState([]);
    const cat = CATEGORIES.find(c => c.id === mess.category) || CATEGORIES[0];

  useEffect(() => {
    fetch(`http://localhost:5000/api/messes/${mess._id}/reviews`)
      .then(res => res.json())
      .then(data => setMessReviews(data.reviews || []))
      .catch(err => console.error(err));
  }, [mess._id]);
  const mealSlots = { breakfast: "☀️ Breakfast", lunch: "🌞 Lunch", snacks: "🫖 Snacks", dinner: "🌙 Dinner" };

  function submitReview() {
    if (reviewForm.text.trim().length < 10) return;
    onReview(mess.id, reviewForm);
    setSubmitted(true);
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 680 }}>
        {/* Header */}
        <div style={{
          padding: "28px 28px 20px",
          background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}11)`,
          position: "relative"
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16, background: "white",
            border: "none", borderRadius: 50, width: 32, height: 32, cursor: "pointer", fontSize: 16
          }}>✕</button>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ fontSize: 52 }}>{mess.image}</div>
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span className={(mess.isOpen || mess.open) ? "badge-open" : "badge-closed"}>
  {(mess.isOpen || mess.open) ? "Open" : "Closed"}
</span>
                {mess.verified && <span className="badge-verified">✓ Verified</span>}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{mess.name}</h2>
              <div style={{ fontSize: 13, color: G.textSub, marginTop: 4 }}>📍 {mess.address}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <Stars rating={mess.rating} size={15} />
                <span style={{ fontWeight: 700 }}>{mess.rating}</span>
                <span style={{ color: G.textSub, fontSize: 13 }}>({mess.reviews} reviews)</span>
              </div>
            </div>
          </div>
          {/* Quick stats */}
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {[
              ["₹" + mess.price + mess.priceUnit, "Price"],
              [mess.capacity - mess.enrolled + " seats", "Available"],
              [mess.timing.split("·")[0].trim(), "Opens"],
            ].map(([v, l]) => (
              <div key={l} style={{ background: "white", borderRadius: 12, padding: "8px 14px", textAlign: "center", flex: 1 }}>
                <div style={{ fontWeight: 700, color: G.primary, fontSize: 14 }}>{v}</div>
                <div style={{ fontSize: 11, color: G.textSub }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${G.border}`, padding: "0 20px" }}>
          {[["menu","📋 Today's Menu"], ["amenities","✨ Amenities"], ["reviews","⭐ Reviews"]].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "14px 16px", border: "none", background: "none", cursor: "pointer",
              fontSize: 14, fontWeight: 600, borderBottom: tab === t ? `2px solid ${G.primary}` : "2px solid transparent",
              color: tab === t ? G.primary : G.textSub, transition: "all 0.2s"
            }}>{l}</button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {tab === "menu" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {Object.entries(mealSlots).map(([key, label]) => (
                <div key={key} style={{ background: G.bg, borderRadius: 16, padding: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{label}</div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                    {(mess.todayMenu[key] || []).map(item => (
                      <li key={item} style={{ fontSize: 13, color: G.textSub, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div style={{ gridColumn: "1/-1", background: "#FFF3EE", borderRadius: 12, padding: "10px 16px", fontSize: 13 }}>
                <strong>⚡ This week's special:</strong> {mess.weeklySpecial}
              </div>
            </div>
          )}

         {tab === "amenities" && (
  <div>

    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
      {mess.amenities.map(a => (
        <div
          key={a}
          style={{
            background: G.bg,
            borderRadius: 12,
            padding: "10px 16px",
            fontSize: 14,
            fontWeight: 600
          }}
        >
          ✓ {a}
        </div>

      ))}
    </div>

    <div style={{ background: G.bg, borderRadius: 14, padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>⏰ Timings</div>
      <div style={{ color: G.textSub, fontSize: 14 }}>{mess.timing}</div>
    </div>
   
    {/* Google Maps Button */}
{mess.googleMaps && (
  <a 
    href={mess.googleMaps} 
    target="_blank" 
    rel="noreferrer"
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "#4285F4",
      color: "white",
      padding: "12px 20px",
      borderRadius: 12,
      textDecoration: "none",
      fontWeight: 600,
      fontSize: 14,
      marginTop: 16,
      width: "fit-content"
    }}
  >
    📍 Open in Google Maps
  </a>
)}

  </div>
)}

          {tab === "reviews" && (
            <div>
              {/* Reviews list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                {messReviews.length === 0 && <div style={{ color: G.textSub, fontSize: 14 }}>No reviews yet. Be the first!</div>}
                {messReviews.map(r => (
                  <div key={r._id} style={{ background: G.bg, borderRadius: 14, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <Avatar initials={r.user?.avatar || r.avatar}size={32} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{r.user?.name || r.user}</div>
                        <div style={{ fontSize: 12, color: G.textSub }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.date}</div>
                      </div>
                      <div style={{ marginLeft: "auto" }}><Stars rating={r.rating} size={13} /></div>
                    </div>
                    <p style={{ fontSize: 14, color: G.text, lineHeight: 1.6 }}>{r.text}</p>
                    <div style={{ fontSize: 12, color: G.textSub, marginTop: 8 }}>👍 {r.helpful} found this helpful</div>
                  </div>
                ))}
              </div>

              {/* Write review */}
              {user.role === "student" && !submitted && (
                <div style={{ border: `2px solid ${G.border}`, borderRadius: 16, padding: 18 }}>
                  <div style={{ fontWeight: 700, marginBottom: 12 }}>Write a Review</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })} style={{
                        fontSize: 24, background: "none", border: "none", cursor: "pointer",
                        opacity: n <= reviewForm.rating ? 1 : 0.3, transition: "opacity 0.15s"
                      }}>★</button>
                    ))}
                  </div>
                  <textarea className="input-field" rows={3} placeholder="Share your experience..."
                    value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })}
                    style={{ resize: "vertical", marginBottom: 12 }} />
                  <button className="btn-primary" onClick={submitReview} style={{ padding: "10px 24px" }}>Submit Review</button>
                </div>
              )}
              {submitted && (
                <div style={{ background: "#DCFCE7", color: "#15803D", borderRadius: 12, padding: 16, textAlign: "center", fontWeight: 600 }}>
                  ✅ Review submitted! Thank you.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function StudentDashboard({ user, reviews, setReviews }) {
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedMess, setSelectedMess] = useState(null);
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/messes")
      .then(res => res.json())
      .then(data => {
        setMesses(data.messes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const navItems = [
    { id: "home",      icon: "🏠", label: "Home" },
    { id: "explore",   icon: "🔍", label: "Explore Messes" },
    { id: "favorites", icon: "❤️", label: "Favorites" },
    { id: "myreviews", icon: "⭐", label: "My Reviews" },
    { id: "profile",   icon: "👤", label: "My Profile" },
  ];

  const filtered = messes
    .filter(m => catFilter === "all" || m.category === catFilter)
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.address.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "rating" ? b.rating - a.rating : a.price - b.price);

  async function handleReview(messId, form) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        messId,
        rating: form.rating,
        text: form.text,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setReviews(prev => [...prev, data.review]);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
}

  return (
    <>
      <Layout user={user} onLogout={() => window.location.reload()} navItems={navItems} activePage={page} setPage={setPage}>
        {page === "home" && (
          <div>
            {/* Welcome */}
            <div style={{
              background: `linear-gradient(135deg, ${G.secondary}, #2D2D4E)`,
              borderRadius: 24, padding: "32px 36px", marginBottom: 28, color: "white",
              position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", right: 30, top: "50%", transform: "translateY(-50%)", fontSize: 80, opacity: 0.2 }}>🍽️</div>
              <div style={{ fontSize: 14, color: G.primary, fontWeight: 600, marginBottom: 8 }}>Good {new Date().getHours() < 12 ? "Morning" : "Evening"}!</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 6 }}>{user.name} 👋</h2>
              <p style={{ opacity: 0.75, fontSize: 14 }}>{user.college} · {user.year}</p>
              <button className="btn-primary" onClick={() => setPage("explore")} style={{ marginTop: 20 }}>
                🔍 Find Mess Near Me →
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
              <StatCard icon="🏪" label="Nearby Messes" value={MESSES.length} color={G.primary} />
              <StatCard icon="⭐" label="Your Reviews" value={reviews.filter(r => r.userId === user.id).length} color={G.info} />
              <StatCard icon="🟢" label="Open Now" value={MESSES.filter(m => m.open).length} color={G.success} />
            </div>

            {/* Today's Top */}
            <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>⭐ Top Rated Messes</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {MESSES.sort((a,b) => b.rating-a.rating).slice(0,3).map(m => (
                <MessCard key={m.id} mess={m} onView={setSelectedMess} />
              ))}
            </div>
          </div>
        )}

        {page === "explore" && (
          <div>
            {/* Filters */}
            <div style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 20, border: `1px solid ${G.border}`, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <input className="input-field" placeholder="🔍 Search by name or area..." value={search}
                onChange={e => setSearch(e.target.value)} style={{ flex: "1 1 240px" }} />
              <select className="input-field" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: "auto" }}>
                <option value="rating">Sort: Top Rated</option>
                <option value="price">Sort: Lowest Price</option>
              </select>
            </div>

            {/* Category pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              <button onClick={() => setCatFilter("all")} style={{
                padding: "8px 18px", borderRadius: 99, border: `2px solid ${catFilter === "all" ? G.primary : G.border}`,
                background: catFilter === "all" ? G.primary : "white", color: catFilter === "all" ? "white" : G.textSub,
                fontWeight: 600, fontSize: 13, cursor: "pointer"
              }}>All Messes</button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCatFilter(cat.id)} style={{
                  padding: "8px 18px", borderRadius: 99, border: `2px solid ${catFilter === cat.id ? cat.color : G.border}`,
                  background: catFilter === cat.id ? cat.color : "white",
                  color: catFilter === cat.id ? "white" : G.textSub,
                  fontWeight: 600, fontSize: 13, cursor: "pointer"
                }}>{cat.icon} {cat.label}</button>
              ))}
            </div>

            <div style={{ fontSize: 13, color: G.textSub, marginBottom: 14 }}>{filtered.length} messes found</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {filtered.map(m => <MessCard key={m.id} mess={m} onView={setSelectedMess} />)}
            </div>
          </div>
        )}

        {page === "myreviews" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {reviews.filter(r => r.userId === user.id).length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: G.textSub }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
                  <div>You haven't written any reviews yet.</div>
                  <button className="btn-primary" onClick={() => setPage("explore")} style={{ marginTop: 16 }}>Explore Messes</button>
                </div>
              )}
              {reviews.filter(r => r.userId === user.id).map(r => {
                const mess = MESSES.find(m => m.id === r.messId);
                return (
                  <div key={r._id} style={{ background: "white", borderRadius: 20, padding: 20, border: `1px solid ${G.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontWeight: 700 }}>{mess?.name}</div>
                      <Stars rating={r.rating} />
                    </div>
                    <p style={{ fontSize: 14, color: G.text, lineHeight: 1.6 }}>{r.text}</p>
                    <div style={{ fontSize: 12, color: G.textSub, marginTop: 8 }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.date}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {page === "profile" && (
          <div style={{ maxWidth: 500 }}>
            <div style={{ background: "white", borderRadius: 24, padding: 32, border: `1px solid ${G.border}`, textAlign: "center", marginBottom: 20 }}>
              <Avatar initials={user.avatar} size={72} />
              <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne', sans-serif", marginTop: 16 }}>{user.name}</h2>
              <div style={{ color: G.textSub, fontSize: 14, marginTop: 4 }}>{user.email}</div>
              <div style={{ color: G.textSub, fontSize: 13, marginTop: 4 }}>{user.college} · {user.year}</div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: G.primary }}>{reviews.filter(r => r.userId === user.id).length}</div>
                  <div style={{ fontSize: 12, color: G.textSub }}>Reviews</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === "favorites" && (
          <div style={{ textAlign: "center", padding: 60, color: G.textSub }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>❤️</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No favorites yet</div>
            <div>Click the heart icon on any mess to save it here</div>
            <button className="btn-primary" onClick={() => setPage("explore")} style={{ marginTop: 16 }}>Browse Messes</button>
          </div>
        )}
      </Layout>

      {selectedMess && (
        <MessDetailModal
          mess={selectedMess} user={user} reviews={reviews}
          onClose={() => setSelectedMess(null)} onReview={handleReview}
        />
      )}
    </>
  );
}

// ─── OWNER DASHBOARD ──────────────────────────────────────────────────────────
function OwnerDashboard({ user, reviews }) {
  const [page, setPage] = useState("home");
  const [mess, setMess] = useState(null);
  const [messReviews, setMessReviews] = useState([]);
  const [menuEdit, setMenuEdit] = useState({});

  useEffect(() => {
    if (!user.messId) return;

    fetch(`http://localhost:5000/api/messes/${user.messId}`)
      .then(res => res.json())
      .then(data => {
        setMess(data.mess);
        setMenuEdit(data.mess.todayMenu || {});
      })
      .catch(err => console.error(err));

    fetch(`http://localhost:5000/api/messes/${user.messId}/reviews`)
      .then(res => res.json())
      .then(data => setMessReviews(data.reviews || []))
      .catch(err => console.error(err));
  }, [user.messId]);

  async function saveMenu() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/menu/${user.messId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(menuEdit),
        }
      );
      if (res.ok) {
        alert("Menu updated! Students will see it now ✅");
      } else {
        alert("Error saving menu!");
      }
    } catch (err) {
      alert("Backend not connected!");
    }
  }

  if (!mess) return (
    <div style={{ padding: 40, textAlign: "center", color: G.textSub }}>
      ⏳ Loading your mess data...
    </div>
  );
  const navItems = [
    { id: "home",    icon: "📊", label: "Dashboard" },
    { id: "menu",    icon: "📋", label: "Today's Menu" },
    { id: "reviews", icon: "⭐", label: "Reviews" },
    { id: "profile", icon: "🏪", label: "Mess Profile" },
    { id: "analytics",icon: "📈", label: "Analytics" },
  ];

  const mealSlots = { breakfast: "☀️ Breakfast", lunch: "🌞 Lunch", snacks: "🫖 Snacks", dinner: "🌙 Dinner" };
  const avgRating = messReviews.length ? (messReviews.reduce((s, r) => s + r.rating, 0) / messReviews.length).toFixed(1) : mess.rating;
  const occupancy = Math.round((mess.enrolled / mess.capacity) * 100);

  return (
    <Layout user={user} onLogout={() => window.location.reload()} navItems={navItems} activePage={page} setPage={setPage}>
      {page === "home" && (
        <div>
          {/* Mess Hero */}
          <div style={{
            background: `linear-gradient(135deg, #6366F1, #4F46E5)`,
            borderRadius: 24, padding: "28px 32px", marginBottom: 28, color: "white"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 52 }}>{mess.image}</div>
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{mess.name}</h2>
                <div style={{ opacity: 0.8, fontSize: 14, marginTop: 4 }}>📍 {mess.address}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <span style={{ background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 99, fontSize: 12 }}>
                    {mess.isOpen || mess.open ? "🟢 Open" : "🔴 Closed"}
                  </span>
                  {mess.isVerified && <span style={{ background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 99, fontSize: 12 }}>✓ Verified</span>}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            <StatCard icon="⭐" label="Rating" value={avgRating} color="#6366F1" sub={`${messReviews.length} reviews`} />
            <StatCard icon="👥" label="Enrolled" value={mess.enrolled} color={G.primary} sub={`of ${mess.capacity}`} />
            <StatCard icon="📊" label="Occupancy" value={occupancy + "%"} color={G.success} />
            <StatCard icon="💰" label="Monthly Rev." value={"₹" + (mess.enrolled * mess.price / 1000).toFixed(0) + "K"} color={G.warning} />
          </div>

          {/* Recent Reviews */}
          <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 14 }}>💬 Recent Reviews</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {messReviews.slice(-3).reverse().map(r => (
              <div key={r._id} style={{ background: "white", borderRadius: 16, padding: 18, border: `1px solid ${G.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Avatar initials={r.user?.avatar || r.avatar} size={30} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.user?.name || r.user}</div>
                      <div style={{ fontSize: 12, color: G.textSub }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.date}</div>
                    </div>
                  </div>
                  <Stars rating={r.rating} size={14} />
                </div>
                <p style={{ fontSize: 14, color: G.text, lineHeight: 1.6 }}>{r.text}</p>
              </div>
            ))}
            {messReviews.length === 0 && <div style={{ color: G.textSub, fontSize: 14 }}>No reviews yet.</div>}
          </div>
        </div>
      )}

      {page === "menu" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ color: G.textSub }}>Update today's menu in real-time</p>
            <button className="btn-primary" onClick={saveMenu}>💾 Save Changes</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {Object.entries(mealSlots).map(([key, label]) => (
              <div key={key} style={{ background: "white", borderRadius: 20, padding: 20, border: `1px solid ${G.border}` }}>
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16 }}>{label}</div>
                <textarea style={{
                  width: "100%", border: `2px solid ${G.border}`, borderRadius: 12, padding: 12,
                  fontSize: 13, lineHeight: 1.7, color: G.text, resize: "vertical", minHeight: 100,
                  fontFamily: "'DM Sans', sans-serif", outline: "none"
                }}
                  value={(menuEdit[key] || []).join("\n")}
                  onChange={e => setMenuEdit({ ...menuEdit, [key]: e.target.value.split("\n").filter(Boolean) })}
                />
                <div style={{ fontSize: 11, color: G.textSub, marginTop: 6 }}>One item per line</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {page === "reviews" && (
        <div>
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <div style={{ background: "white", borderRadius: 16, padding: "20px 28px", border: `1px solid ${G.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#6366F1", fontFamily: "'Syne', sans-serif" }}>{avgRating}</div>
              <Stars rating={parseFloat(avgRating)} size={20} />
              <div style={{ color: G.textSub, fontSize: 13, marginTop: 6 }}>{messReviews.length} reviews</div>
            </div>
            <div style={{ flex: 1, background: "white", borderRadius: 16, padding: 20, border: `1px solid ${G.border}` }}>
              {[5,4,3,2,1].map(n => {
                const count = messReviews.filter(r => r.rating === n).length;
                const pct = messReviews.length ? Math.round((count/messReviews.length)*100) : 0;
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, width: 20 }}>{n}★</span>
                    <div style={{ flex: 1, background: G.border, borderRadius: 99, height: 8, overflow: "hidden" }}>
                      <div style={{ width: pct + "%", height: "100%", background: "#FBBF24", borderRadius: 99, transition: "width 0.5s" }} />
                    </div>
                    <span style={{ fontSize: 12, color: G.textSub, width: 30 }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {messReviews.map(r => (
              <div key={r._id} style={{ background: "white", borderRadius: 16, padding: 18, border: `1px solid ${G.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Avatar initials={r.user?.avatar || r.avatar}size={36} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.user?.name || r.user}</div>
                      <div style={{ fontSize: 12, color: G.textSub }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.date}</div>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p style={{ fontSize: 14, color: G.text, lineHeight: 1.6 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {page === "analytics" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { label: "Mon", val: 48 }, { label: "Tue", val: 52 }, { label: "Wed", val: 61 },
              { label: "Thu", val: 55 }, { label: "Fri", val: 64 }, { label: "Sat", val: 70 }, { label: "Sun", val: 45 }
            ].map(() => null)}

            <div style={{ background: "white", borderRadius: 20, padding: 24, border: `1px solid ${G.border}`, gridColumn: "1/-1" }}>
              <h3 style={{ fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>📊 Weekly Enrollment Trend</h3>
              <div style={{ display: "flex", align: "end", gap: 8, height: 120, alignItems: "flex-end" }}>
                {[{d:"Mon",v:48},{d:"Tue",v:52},{d:"Wed",v:61},{d:"Thu",v:55},{d:"Fri",v:64},{d:"Sat",v:70},{d:"Sun",v:45}].map(bar => (
                  <div key={bar.d} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: G.textSub, marginBottom: 6 }}>{bar.v}</div>
                    <div style={{
                      height: bar.v * 1.5 + "px", background: `linear-gradient(180deg, #6366F1, #4F46E5)`,
                      borderRadius: "6px 6px 0 0", transition: "height 0.5s"
                    }} />
                    <div style={{ fontSize: 11, color: G.textSub, marginTop: 6 }}>{bar.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 20, padding: 24, border: `1px solid ${G.border}` }}>
              <h3 style={{ fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>🍽️ Meal Popularity</h3>
              {[["Lunch", 92], ["Dinner", 85], ["Breakfast", 67], ["Snacks", 45]].map(([meal, pct]) => (
                <div key={meal} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                    <span>{meal}</span><span style={{ fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ background: G.border, borderRadius: 99, height: 8, overflow: "hidden" }}>
                    <div style={{ width: pct + "%", height: "100%", background: `linear-gradient(90deg, ${G.primary}, ${G.primaryDark})`, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "white", borderRadius: 20, padding: 24, border: `1px solid ${G.border}` }}>
              <h3 style={{ fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>💬 Review Sentiment</h3>
              {[["Positive", 78, G.success], ["Neutral", 14, G.warning], ["Negative", 8, G.danger]].map(([label, pct, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span>{label}</span><span style={{ fontWeight: 700, color }}>{pct}%</span>
                    </div>
                    <div style={{ background: G.border, borderRadius: 99, height: 6, overflow: "hidden", marginTop: 4 }}>
                      <div style={{ width: pct + "%", height: "100%", background: color, borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {page === "profile" && (
        <div style={{ maxWidth: 560 }}>
          <div style={{ background: "white", borderRadius: 24, padding: 28, border: `1px solid ${G.border}` }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 52 }}>{mess.image}</div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{mess.name}</h2>
                <div style={{ color: G.textSub, fontSize: 14 }}>Managed by {user.name}</div>
              </div>
            </div>
            {[
              ["Address", mess.address],
              ["Category", CATEGORIES.find(c => c.id === mess.category)?.label],
              ["Timing", mess.timing],
              ["Price", `₹${mess.price}${mess.priceUnit}`],
              ["Capacity", `${mess.enrolled}/${mess.capacity} seats filled`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${G.border}` }}>
                <span style={{ color: G.textSub, fontSize: 14 }}>{label}</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ user, reviews }) {
  const [page, setPage] = useState("home");
  const [selectedTab, setSelectedTab] = useState("all");
  const [messes, setMesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/messes")
      .then(res => res.json())
      .then(data => setMesses(data.messes || []));

    fetch("http://localhost:5000/api/users", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data.users || []));

    fetch("http://localhost:5000/api/reviews", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAllReviews(data.reviews || []));

    fetch("http://localhost:5000/api/stats", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const totalStudents = stats.students || 0;
  const totalOwners = stats.owners || 0;
  const verifiedMesses = messes.filter(m => m.isVerified).length;
  const openMesses = messes.filter(m => m.isOpen).length;
  const navItems = [
    { id: "home",     icon: "📊", label: "Overview" },
    { id: "messes",   icon: "🏪", label: "All Messes" },
    { id: "users",    icon: "👥", label: "Users" },
    { id: "reviews",  icon: "💬", label: "Reviews" },
    { id: "reports",  icon: "📈", label: "Reports" },
  ];

  

  return (
    <Layout user={user} onLogout={() => window.location.reload()} navItems={navItems} activePage={page} setPage={setPage}>
      {page === "home" && (
        <div>
          <div style={{
            background: `linear-gradient(135deg, #DC2626, #991B1B)`,
            borderRadius: 24, padding: "28px 32px", marginBottom: 28, color: "white"
          }}>
            <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>System Status: 🟢 All systems operational</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>Admin Control Center</h2>
            <p style={{ opacity: 0.8, marginTop: 4, fontSize: 14 }}>Smart Mess Management System · Mumbai Region</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            <StatCard icon="🏪" label="Total Messes" value={stats.totalMesses || messes.length} color="#DC2626" />
<StatCard icon="🎓" label="Students" value={stats.students || 0} color="#6366F1" />
<StatCard icon="🏡" label="Mess Owners" value={stats.owners || 0} color={G.primary} />
<StatCard icon="⭐" label="Total Reviews" value={stats.totalReviews || 0} color={G.warning} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 24, border: `1px solid ${G.border}` }}>
              <h3 style={{ fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>📊 Mess Status Overview</h3>
              {[
                ["Open Now", openMesses, G.success],
                ["Currently Closed", MESSES.length - openMesses, G.danger],
                ["Verified", verifiedMesses, G.info],
                ["Pending Verification", MESSES.length - verifiedMesses, G.warning],
              ].map(([label, count, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${G.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: 14 }}>{label}</span>
                  </div>
                  <span style={{ fontWeight: 800, color, fontSize: 18, fontFamily: "'Syne', sans-serif" }}>{count}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "white", borderRadius: 20, padding: 24, border: `1px solid ${G.border}` }}>
              <h3 style={{ fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>🍽️ By Category</h3>
              {CATEGORIES.map(cat => {
                const count = MESSES.filter(m => m.category === cat.id).length;
                return (
                  <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${G.border}` }}>
                    <span style={{ fontSize: 14 }}>{cat.icon} {cat.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: count * 20, height: 8, background: cat.color, borderRadius: 99 }} />
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {page === "messes" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["all", "open", "closed", "verified", "pending"].map(t => (
              <button key={t} onClick={() => setSelectedTab(t)} style={{
                padding: "8px 18px", borderRadius: 99, border: `2px solid ${selectedTab === t ? "#DC2626" : G.border}`,
                background: selectedTab === t ? "#DC2626" : "white",
                color: selectedTab === t ? "white" : G.textSub,
                fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize"
              }}>{t}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {MESSES.filter(m =>
              selectedTab === "all" ? true :
              selectedTab === "open" ? m.open :
              selectedTab === "closed" ? !m.open :
              selectedTab === "verified" ? m.verified : !m.verified
            ).map(m => {
              const cat = CATEGORIES.find(c => c.id === m.category);
              return (
                <div key={m.id} style={{ background: "white", borderRadius: 16, padding: 20, border: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: 36 }}>{m.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h4 style={{ fontWeight: 700 }}>{m.name}</h4>
                      <span style={{ background: cat.color, color: "white", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{cat.label}</span>
                    </div>
                    <div style={{ fontSize: 13, color: G.textSub, marginTop: 3 }}>📍 {m.address} · Owner: {m.owner?.name || m.ownerName}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <span className={(m.isOpen || m.open) ? "badge-open" : "badge-closed"}>{(m.isOpen || m.open) ? "Open" : "Closed"}</span>
                      {m.verified ? <span className="badge-verified">✓ Verified</span> : <span style={{ background: "#FEF3C7", color: "#D97706", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>⏳ Pending</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "#DC2626", fontSize: 18, fontFamily: "'Syne', sans-serif" }}>{m.rating}★</div>
                    <div style={{ fontSize: 12, color: G.textSub }}>{m.reviews} reviews</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}>Edit</button>
                      {!m.verified && <button className="btn-primary" style={{ fontSize: 12, padding: "6px 12px" }}>Verify</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {page === "users" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {USERS.map(u => (
              <div key={u.id} style={{ background: "white", borderRadius: 16, padding: 18, border: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar initials={u.avatar} size={44} color={u.role === "student" ? G.primary : u.role === "owner" ? "#6366F1" : "#DC2626"} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{u.name}</div>
                  <div style={{ fontSize: 13, color: G.textSub }}>{u.email}</div>
                </div>
                <div style={{
                  padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700, textTransform: "capitalize",
                  background: u.role === "student" ? "#FFF3EE" : u.role === "owner" ? "#EEF2FF" : "#FEE2E2",
                  color: u.role === "student" ? G.primary : u.role === "owner" ? "#6366F1" : "#DC2626"
                }}>{u.role}</div>
                <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}>Manage</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {page === "reviews" && (
        <div>
          <div style={{ marginBottom: 16, fontSize: 14, color: G.textSub }}>{reviews.length} total reviews across all messes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {allReviews.map(r => {
              const mess = MESSES.find(m => m.id === r.messId);
              return (
                <div key={r._id} style={{ background: "white", borderRadius: 16, padding: 18, border: `1px solid ${G.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Avatar initials={r.user?.avatar || r.avatar} size={32} />
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{r.user?.name || r.user}</span>
                        <span style={{ color: G.textSub, fontSize: 13 }}> → {mess?.name}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Stars rating={r.rating} size={14} />
                      <button style={{ background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Remove</button>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: G.text, lineHeight: 1.6 }}>{r.text}</p>
                  <div style={{ fontSize: 12, color: G.textSub, marginTop: 8 }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {page === "reports" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 24, border: `1px solid ${G.border}`, gridColumn: "1/-1" }}>
              <h3 style={{ fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>📈 Platform Growth (Last 6 Months)</h3>
              <div style={{ display: "flex", gap: 8, height: 140, alignItems: "flex-end" }}>
                {[
                  {m:"Nov",students:820,messes:38},{m:"Dec",students:890,messes:40},{m:"Jan",students:950,messes:42},
                  {m:"Feb",students:1050,messes:44},{m:"Mar",students:1150,messes:46},{m:"Apr",students:1200,messes:48}
                ].map(bar => (
                  <div key={bar.m} style={{ flex: 1, display: "flex", gap: 3, alignItems: "flex-end", justifyContent: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: Math.round(bar.students/10) + "px", background: `linear-gradient(180deg, #6366F1, #4F46E5)`, borderRadius: "4px 4px 0 0", minHeight: 10 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: bar.messes * 3 + "px", background: `linear-gradient(180deg, ${G.primary}, ${G.primaryDark})`, borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                    </div>
                    <div style={{ position: "absolute", transform: "translateY(20px)", fontSize: 10, color: G.textSub }}>{bar.m}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 24, justifyContent: "center" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12 }}>
                  <div style={{ width: 12, height: 12, background: "#6366F1", borderRadius: 2 }} />
                  Students
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12 }}>
                  <div style={{ width: 12, height: 12, background: G.primary, borderRadius: 2 }} />
                  Messes
                </div>
              </div>
            </div>
            {[["Total Revenue (est.)", "₹38.4L", "This month", G.success],
              ["Avg. Satisfaction", "4.4/5", "From all reviews", G.warning],
              ["New Registrations", "142", "This month", "#6366F1"],
              ["Complaints Filed", "3", "Pending resolution", G.danger]
            ].map(([title, value, sub, color]) => (
              <div key={title} style={{ background: "white", borderRadius: 20, padding: 24, border: `1px solid ${G.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Syne', sans-serif", color }}>{value}</div>
                <div style={{ fontWeight: 700, marginTop: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: G.textSub, marginTop: 3 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState(INIT_REVIEWS);

  return (
    <>
      <style>{css}</style>
      {!user && <LoginPage onLogin={setUser} />}
      {user && user.role === "student" && <StudentDashboard user={user} reviews={reviews} setReviews={setReviews} />}
      {user && user.role === "owner" && <OwnerDashboard user={user} reviews={reviews} />}
      {user && user.role === "admin" && <AdminDashboard user={user} reviews={reviews} />}
    </>
  );
}
