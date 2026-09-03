window.__ModuleLoader__.load({ id: "@zerorigin-studio/dsh-deepseek-chat", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_client = require("@deepseek-ai/dsh-client-store");
var import_jsx_runtime = require("react/jsx-runtime");
var CHAT_URL = "https://chat.deepseek.com/";
var SETTINGS_NAMESPACE = "dsh-chat-entry";
var SHOW_ENTRY_FIELD = "showEntry";
var ChatEntryPolicy = class {
  show = (0, import_client.createSnapshotStore)(true);
  host;
  /**
   * @param host - durable preference scope owned by this plugin; absent
   * compositions stay process-local (visible by default).
   */
  constructor(host) {
    this.host = host;
    if (host !== void 0) {
      host.subscribe(() => {
        this.adopt(host);
      });
      this.adopt(host);
    }
  }
  /** Change the preference; the live value publishes before the durable write. */
  setShow(next) {
    if (this.show.getSnapshot() === next) return;
    this.show.set(next);
    void this.host?.set(SHOW_ENTRY_FIELD, next);
  }
  /** Adopt the scope's accepted durable value without writing it back. */
  adopt(host) {
    const section = host.getSnapshot().value;
    if (section === void 0 || this.show.getSnapshot() === section.showEntry) return;
    this.show.set(section.showEntry);
  }
};
function openInDesktopWindow(e) {
  // Desktop-shell integration: the client injects the standard window.dsh.desktop
  // SDK (and a legacy window.__DSH_DESKTOP_API__ for backward compat). Any plugin
  // needing a native multi-window just calls window.dsh.desktop.openWindow({ url,
  // title }), which talks to the client over WebView2 host messaging
  // (window.chrome.webview.postMessage) — no cross-origin fetch / CORS. Without a
  // desktop host (plain web / third-party shells) the anchor navigates as before.
  const dsh = window.dsh && window.dsh.desktop;
  const raw = (window.chrome && window.chrome.webview && window.chrome.webview.postMessage) ? window.chrome.webview : null;
  if (!dsh && !raw) return;
  e.preventDefault();
  let p;
  if (dsh) {
    p = dsh.openWindow({ url: CHAT_URL, title: "DeepSeek 网页对话" });
  } else {
    raw.postMessage(JSON.stringify({ type: "dsh.desktop.openWindow", url: CHAT_URL, title: "DeepSeek 网页对话" }));
    p = Promise.resolve();
  }
  if (p && typeof p.catch === "function") {
    p.catch(function () { window.location.href = CHAT_URL; });
  }
}
// The sidebar New Session button is hard-coded by the harness (no injectable
// slot around it), so the entry button is mounted next to it via DOM: both
// buttons share the row 50/50. The harness repo stays untouched.
function findNewSessionButton() {
  const needles = ["new session", "new chat", "新对话", "新建会话", "新会话"];
  // Expanded: the real New Session button carries its label text, while the
  // wordmark (logo) button shares the same aria-label but renders no text —
  // match by text first so the logo is never wrapped.
  for (const b of document.querySelectorAll("button")) {
    const t = (b.textContent || "").trim();
    if (t && needles.some((n) => t === n || t.startsWith(n))) return b;
  }
  // Collapsed / fallback: aria-label match, skipping buttons whose svg is a
  // large wordmark (the real button only ever shows a 16-18px glyph).
  for (const b of document.querySelectorAll("button[aria-label]")) {
    const label = (b.getAttribute("aria-label") || "").toLowerCase();
    if (!needles.some((n) => label.includes(n.toLowerCase()))) continue;
    const svg = b.querySelector("svg");
    if (svg && svg.getBoundingClientRect().width > 32) continue; // wordmark
    return b;
  }
  return null;
}
const CHAT_ENTRY_ID = "dsh-chat-entry";
// Hover/active affordance matching the harness New Session button
// (.newSession:hover uses --dsw-alias-button-floating-hover); the railed
// icon form uses the lighter interactive fill, and the row keeps the 120ms
// background transition the harness controls use.
function ensureEntryStyles() {
  if (document.getElementById("dsh-chat-entry-styles")) return;
  const st = document.createElement("style");
  st.id = "dsh-chat-entry-styles";
  st.textContent = [
    "#" + CHAT_ENTRY_ID + " a { transition: none; }",
    "#" + CHAT_ENTRY_ID + " a:hover { background: var(--dsw-alias-button-floating-hover); }",
    "#" + CHAT_ENTRY_ID + "[data-rail=\"1\"] a:hover { background: var(--dsw-alias-interactive-bg-hover); }",
    "#" + CHAT_ENTRY_ID + " a:active { transform: scale(0.98); }",
    // Mirrors the harness rail-in slide (New Session icon slides in 49px
    // from the former rail right edge) and the wide-in fade.
    "@keyframes dsh-entry-rail-in { from { opacity: 0; transform: translateX(49px); } }",
    "@keyframes dsh-entry-wide-in { from { opacity: 0; } }"
  ].join("\n");
  document.head.appendChild(st);
}
function createEntry() {
  // One-time DOM build: the wide/rail swap later only mutates inline
  // styles so CSS transitions (and the rail-in slide) play smoothly — the
  // element is never destroyed and recreated on collapse/expand.
  const host = document.createElement("div");
  host.id = CHAT_ENTRY_ID;
  host.style.cssText = "display:flex;box-sizing:border-box;flex:none;align-items:stretch;margin:0 2px 10px";
  const a = document.createElement("a");
  a.href = CHAT_URL;
  a.title = "DeepSeek 网页对话";
  a.style.cssText = "flex:1;min-width:0;display:flex;align-items:center;justify-content:center;box-sizing:border-box;gap:6px;padding:0 8px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-primary);cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;line-height:22px;text-decoration:none;white-space:nowrap;overflow:hidden";
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.style.cssText = "flex:none;display:flex";
  icon.innerHTML = '<svg width="14" height="14" viewBox="3 3 18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H5l-3 2 1.5-4A8 8 0 1 1 21 12z"/><path d="M8.5 10h7M8.5 13.5h4.5"/></svg>';
  const label = document.createElement("span");
  label.textContent = "\u7F51\u9875\u5BF9\u8BDD"; // 网页对话
  a.appendChild(icon);
  a.appendChild(label);
  // Hover via JS: the base background is inline, a stylesheet rule can't
  // beat it. Colors are mode-aware (set in updateEntry); never re-apply a
  // stale base on leave or the rail icon stays stuck on the wide base.
  a.addEventListener("mouseenter", () => { a.style.background = host.refs.hoverBg; });
  a.addEventListener("mouseleave", () => { a.style.background = host.refs.baseBg; });
  a.addEventListener("click", openInDesktopWindow);
  host.appendChild(a);
  host.refs = { a, icon, label };
  return host;
}
function updateEntry(host, wide) {
  const { a, icon, label } = host.refs;
  const svg = icon.querySelector("svg");
  host.setAttribute("data-rail", wide ? "" : "1");
  host.style.margin = wide ? "0 2px 10px" : "0 0 12px";
  if (wide) {
    host.style.width = "";
    a.style.height = "38px";
    a.style.padding = "0 8px";
    a.style.borderColor = "var(--dsw-alias-border-l2)";
    a.style.borderRadius = "12px";
    host.refs.baseBg = "var(--dsw-alias-button-elevated-fill)";
    host.refs.hoverBg = "var(--dsw-alias-button-floating-hover)";
  } else {
    const nb = findNewSessionButton();
    const w = nb ? nb.getBoundingClientRect().width : 36;
    host.style.width = (w > 0 ? w : 36) + "px";
    a.style.height = "36px";
    a.style.padding = "0";
    a.style.borderColor = "transparent";
    a.style.borderRadius = "8px";
    host.refs.baseBg = "transparent";
    host.refs.hoverBg = "var(--dsw-alias-interactive-bg-hover)";
  }
  // Set the base background for the current mode instantly (no color cross-
  // fade) so a collapse doesn't flash the previous mode's fill.
  a.style.background = host.refs.baseBg;
  label.style.display = wide ? "" : "none";
  if (svg) {
    const s = wide ? 14 : 18;
    svg.setAttribute("width", s);
    svg.setAttribute("height", s);
  }
}
function playEntryAnimation(host, wide) {
  if (!host) return;
  cancelRailWait();
  if (wide) {
    // Expand: snap to the wide button instantly with NO fade/translate,
    // matching the harness Native New Session button (which stays visible
    // and never fades in during expand). A wide-in fade reads as a
    // "loading from above" PPT-style pop-in.
    host.style.opacity = "";
    host.style.animation = "none";
    return;
  }
  // Collapse: unlike the other icons (which ride the sidebar width down),
  // the chat entry stays hidden until the sidebar has finished contracting,
  // then slides in right-to-left into its slot below the New Session rail
  // icon.
  playRailInAfterCollapse(host);
}
var _railWait = { raf: 0, cancel: false };
function cancelRailWait() {
  _railWait.cancel = true;
  if (_railWait.raf) cancelAnimationFrame(_railWait.raf);
  _railWait.raf = 0;
}
function playRailInAfterCollapse(host) {
  // Ride the harness collapse exactly like a native icon: do NOT hide, do
  // NOT delay. We wait for the collapse "settle" (when the native controls
  // start their rail-in animation - i.e. their transform leaves "none") and
  // then slide the chat entry in on that same frame, so it collapses into
  // the rail together with the New Session button (same right-to-left
  // motion, no disappearing gap, no late re-entry).
  const ref = findNewSessionButton();
  _railWait.cancel = false;
  let frames = 0;
  const tick = () => {
    if (_railWait.cancel) { _railWait.raf = 0; return; }
    frames++;
    const nativeMoving = !!(ref && getComputedStyle(ref).transform !== "none");
    if (nativeMoving || frames >= 120) {
      _railWait.raf = 0;
      host.style.opacity = "";
      host.style.animation = "none";
      void host.offsetWidth;
      host.style.animation = "dsh-entry-rail-in 150ms var(--ds-ease-in-out, ease-in-out) backwards";
      return;
    }
    _railWait.raf = requestAnimationFrame(tick);
  };
  _railWait.raf = requestAnimationFrame(tick);
}
function mountBelowEntry(wide) {
  ensureEntryStyles();
  const existing = document.getElementById(CHAT_ENTRY_ID);
  const nb = findNewSessionButton();
  if (!nb || !nb.parentElement) return false;
  let host = existing;
  if (!host) {
    host = createEntry();
    nb.parentElement.insertBefore(host, nb.nextSibling);
  }
  updateEntry(host, wide);
  playEntryAnimation(host, wide);
  return true;
}
function unmountBelowEntry() {
  const host = document.getElementById(CHAT_ENTRY_ID);
  if (host) host.remove();
}
function ChatEntry({ wide, useShow }) {
  const show = useShow((value) => value);
  // Mount once: wait for the harness sidebar DOM, then insert the entry.
  (0, import_react.useEffect)(() => {
    if (!show) return;
    let mounted = false;
    let obs = null;
    const stopWatching = () => {
      clearInterval(timer);
      if (obs) obs.disconnect();
    };
    const tryMount = () => {
      if (!mounted && mountBelowEntry(wide)) {
        mounted = true;
        stopWatching();
      }
    };
    const timer = setInterval(tryMount, 150);
    tryMount();
    obs = new MutationObserver(tryMount);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => {
      clearInterval(timer);
      if (obs) obs.disconnect();
      unmountBelowEntry();
    };
  }, [show]);
  // Rail/wide toggles: update styles + play the matching animation in place
  // (NO rebuild), so the entry slides with the New Session icon.
  (0, import_react.useEffect)(() => {
    if (!show) return;
    const host = document.getElementById(CHAT_ENTRY_ID);
    if (!host) return;
    updateEntry(host, wide);
    playEntryAnimation(host, wide);
  }, [show, wide]);
  return null;
}
function ChatEntryToggle({ useShow, setShow }) {
  const show = useShow((value) => value);
  const toggle = () => {
    setShow?.(!show);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "12px 0",
    width: "100%",
    boxSizing: "border-box"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: "20px",
        color: "var(--dsw-alias-label-primary)"
      }, children: "\u7F51\u9875\u5BF9\u8BDD\u5165\u53E3" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
        fontSize: 12,
        lineHeight: "18px",
        marginTop: 2,
        color: "var(--dsw-alias-label-secondary)"
      }, children: "\u5728\u4FA7\u8FB9\u680F\u5E95\u90E8\uFF08\u8BBE\u7F6E\u6309\u94AE\u4E0A\u65B9\uFF09\u663E\u793A chat.deepseek.com \u7684\u7F51\u9875\u5BF9\u8BDD\u5165\u53E3\u3002" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type: "button",
        role: "switch",
        "aria-checked": show,
        "aria-label": "\u7F51\u9875\u5BF9\u8BDD\u5165\u53E3",
        onClick: toggle,
        style: {
          flex: "none",
          width: 38,
          height: 22,
          padding: 0,
          cursor: "pointer",
          position: "relative",
          borderRadius: 999,
          border: "1px solid var(--dsw-alias-border-l2)",
          background: show ? "var(--dsw-alias-button-info-fill)" : "var(--dsw-alias-bg-layer-2)",
          transition: "background-color 120ms ease"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
          position: "absolute",
          top: 1,
          left: 1,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transform: show ? "translateX(18px)" : "translateX(0)",
          transition: "transform 120ms ease"
        } })
      }
    )
  ] });
}
var inject = ["slots", "settingsScope"];
function apply(ctx) {
  const scope = ctx.settingsScope.bind({ namespace: SETTINGS_NAMESPACE });
  const policy = new ChatEntryPolicy(scope);
  ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
    name: "sidebar.footer.action",
    id: "chat-entry",
    inject: () => ({ hooks: { show: policy.show } })
  }, ChatEntry));
  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "chat-entry-toggle",
    order: 30,
    inject: () => ({
      hooks: { show: policy.show },
      setShow: (next) => {
        policy.setShow(next);
      }
    })
  }, ChatEntryToggle));
}
return module.exports; } });
