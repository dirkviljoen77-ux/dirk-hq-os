export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: "#1e293b",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2>DIRK HQ OS</h2>

      <nav style={{ marginTop: "30px", lineHeight: "2.2" }}>
        <p>🏠 Dashboard</p>
        <p>📁 Projects</p>
        <p>🎥 Broadcast</p>
        <p>🏉 Sports</p>
        <p>💰 Finance</p>
        <p>📄 Documents</p>
        <p>🤖 AI Assistant</p>
        <p>⚙️ Settings</p>
      </nav>
    </aside>
  );
}