import Link from "next/link";

export default function BusinessNav() {
  return <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
    {[['Quotations','/istream/quotations'],['Jobs','/istream/jobs'],['Clients','/istream/clients'],['Catalogue & Pricing','/istream/catalogue']].map(([label, href]) =>
      <Link key={href} href={href} style={{ padding: "9px 14px", borderRadius: 8, background: "#1E293B", border: "1px solid #334155", color: "#E2E8F0", textDecoration: "none", fontWeight: 700 }}>{label}</Link>)}
  </nav>;
}
