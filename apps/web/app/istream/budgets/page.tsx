export const dynamic = "force-dynamic";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import BusinessNav from "@/components/istream/BusinessNav";
import BudgetManager from "@/components/istream/BudgetManager";
import { getFinancialControl } from "@/lib/actions/financial-control.actions";

export default async function BudgetsPage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const year = Number((await searchParams).year) || new Date().getFullYear(); const data = await getFinancialControl(year);
  return <AppShell title="Istream Business"><BusinessNav/><div className="head"><div><h1>Monthly Budgets</h1><p>Plan sales and operating costs. Actuals are calculated from invoices and job expenses.</p></div><div><Link href={`/istream/budgets?year=${year-1}`}>← {year-1}</Link><strong>{year}</strong><Link href={`/istream/budgets?year=${year+1}`}>{year+1} →</Link></div></div><BudgetManager year={year} initial={data.months.map(({ month, salesBudget, expenseBudget, notes }) => ({ month, salesBudget, expenseBudget, notes }))}/><style>{`.head{display:flex;justify-content:space-between;align-items:end;gap:18px;margin-bottom:20px}.head h1{margin:0}.head p{color:#94a3b8}.head div:last-child{display:flex;gap:12px;align-items:center}.head a{color:#60a5fa}@media(max-width:700px){.head{display:grid}}`}</style></AppShell>;
}
