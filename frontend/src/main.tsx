+import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

// Global error handlers to surface runtime errors into the DOM for easier debugging
window.addEventListener("error", (evt) => {
  try {
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `<pre style="white-space:pre-wrap;color:#b71c1c;background:#fff3f3;padding:16px;border-left:4px solid #b71c1c">Runtime error:\n${
        (evt.error && evt.error.stack) || evt.message
      }</pre>`;
    }
  } catch {
    // ignore
  }
});

window.addEventListener("unhandledrejection", (evt) => {
  try {
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `<pre style="white-space:pre-wrap;color:#b71c1c;background:#fff3f3;padding:16px;border-left:4px solid #b71c1c">Unhandled promise rejection:\n${
        (evt.reason && evt.reason.stack) || evt.reason
      }</pre>`;
    }
  } catch {
    // ignore
  }
});

// Initialize the app via dynamic import so import-time errors are catchable
(async function initApp() {
  try {
    const module = await import("./App.tsx");
    const App = module.default;
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    console.error("App initialization failed:", err);
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `<pre style="white-space:pre-wrap;color:#b71c1c;background:#fff3f3;padding:16px;border-left:4px solid #b71c1c">App initialization error:\n${
        err instanceof Error ? err.stack : String(err)
      }</pre>`;
    }
  }
})();
