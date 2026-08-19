import React, { useState, useEffect, createContext, useContext } from "react";
import { supabase, supabaseEnabled } from "./supabaseClient.js";
import { COLORS } from "./icons.jsx";

const AuthContext = createContext({ session: null, signOut: () => {} });
export const useAuth = () => useContext(AuthContext);

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(supabaseEnabled);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabaseEnabled) return;
    const failSafe = setTimeout(() => setLoading(false), 6000);
    supabase.auth.getSession().then(({ data }) => {
      clearTimeout(failSafe);
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      clearTimeout(failSafe);
      setSession(sess);
      setLoading(false);
    });
    return () => { clearTimeout(failSafe); sub.subscription.unsubscribe(); };
  }, []);

  if (!supabaseEnabled) {
    return <AuthContext.Provider value={{ session: null, signOut: () => {} }}>{children}</AuthContext.Provider>;
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#14161A", color: "#8A8E96", fontFamily: "Inter, sans-serif", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Logowanie…
      </div>
    );
  }

  if (!session) {
    const sendLink = async (e) => {
      e.preventDefault();
      setError("");
      const trimmed = email.trim();
      if (!trimmed) return;
      setSending(true);
      const { error: err } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { emailRedirectTo: window.location.origin + window.location.pathname },
      });
      setSending(false);
      if (err) setError(err.message);
      else setSent(true);
    };
    const signInWithGithub = async () => {
      setError("");
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: window.location.origin + window.location.pathname },
      });
      if (err) setError(err.message);
    };
    return (
      <div style={{ minHeight: "100vh", background: "#14161A", color: "#EDEAE3", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 340, width: "100%" }}>
          <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
            Przypakowany <span style={{ color: COLORS.brass }}>Tata</span>
          </div>
          {sent ? (
            <div style={{ marginTop: 20, background: "#1D2025", border: "1px solid #2B3038", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, marginBottom: 6, fontWeight: 600 }}>Sprawdź maila</div>
              <div style={{ fontSize: 13, color: "#8A8E96" }}>Wysłaliśmy link logowania na {email}. Kliknij go, żeby wejść do appki.</div>
              <button onClick={() => setSent(false)} style={{ marginTop: 14, background: "none", border: "none", color: "#8A8E96", fontSize: 12, textDecoration: "underline", cursor: "pointer" }}>Podaj inny e-mail</button>
            </div>
          ) : (
            <div style={{ marginTop: 20, background: "#1D2025", border: "1px solid #2B3038", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 13, color: "#8A8E96", marginBottom: 10 }}>Zaloguj się, żeby Twój plan i historia były zapisane w chmurze i dostępne z każdego urządzenia.</div>

              <button type="button" onClick={signInWithGithub}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#2B3038", color: "#EDEAE3", border: "none", borderRadius: 10, padding: "11px 0", fontWeight: 600, fontSize: 13.5, cursor: "pointer", marginBottom: 14 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
                Zaloguj się przez GitHub
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 14px" }}>
                <div style={{ flex: 1, height: 1, background: "#2B3038" }} />
                <div style={{ fontSize: 11, color: "#8A8E96" }}>lub</div>
                <div style={{ flex: 1, height: 1, background: "#2B3038" }} />
              </div>

              <form onSubmit={sendLink}>
                <input type="email" required placeholder="twoj@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", background: "#2B3038", border: "none", borderRadius: 8, padding: 10, color: "#EDEAE3", fontSize: 14, marginBottom: 10 }} />
                {error && <div style={{ fontSize: 12, color: "#B3502E", marginBottom: 10 }}>{error}</div>}
                <button type="submit" disabled={sending}
                  style={{ width: "100%", background: COLORS.brass, color: "#1A1500", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 13.5, cursor: sending ? "default" : "pointer", opacity: sending ? 0.7 : 1 }}>
                  {sending ? "Wysyłanie…" : "Wyślij link logowania"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, signOut: () => supabase.auth.signOut() }}>
      {children}
    </AuthContext.Provider>
  );
}
