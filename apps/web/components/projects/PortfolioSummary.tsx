export default function PortfolioSummary() {
  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: 12,
        padding: 24,
        border: "1px solid #334155",
        height: "fit-content",
      }}
    >
      <h2
        style={{
          color: "white",
          marginTop: 0,
        }}
      >
        Portfolio Summary
      </h2>

      <table
        style={{
          width: "100%",
          color: "#CBD5E1",
          borderSpacing: "0 14px",
        }}
      >
        <tbody>
          <tr>
            <td>Total Projects</td>
            <td style={{ textAlign: "right" }}>5</td>
          </tr>

          <tr>
            <td>Active</td>
            <td style={{ textAlign: "right" }}>4</td>
          </tr>

          <tr>
            <td>On Track</td>
            <td style={{ textAlign: "right" }}>3</td>
          </tr>

          <tr>
            <td>At Risk</td>
            <td style={{ textAlign: "right" }}>1</td>
          </tr>

          <tr>
            <td>Completed</td>
            <td style={{ textAlign: "right" }}>1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}