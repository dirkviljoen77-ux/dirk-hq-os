"use client";

import { useEffect, useState } from "react";
import {
  getFinance,
  updateFinance,
} from "@/lib/actions/finance.actions";

type Props = {
  projectId: string;
};

export default function FinancePanel({
  projectId,
}: Props) {
  const [finance, setFinance] = useState({
    approvedBudget: 0,
    forecastCost: 0,
    actualCost: 0,
    contingency: 0,
    currency: "USD",
  });

  async function loadFinance() {
    const data = await getFinance(projectId);

    if (data) {
      setFinance(data);
    }
  }

  useEffect(() => {
    loadFinance();
  }, [projectId]);

  async function save() {
    await updateFinance(projectId, finance);
    alert("Finance saved.");
  }

  const forecastProfit = finance.approvedBudget - finance.forecastCost;
  const actualProfit = finance.approvedBudget - finance.actualCost;
  const margin = finance.approvedBudget ? actualProfit / finance.approvedBudget * 100 : 0;

  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        Job Costing
      </h2>

      <FinanceField
        label="Quoted Revenue"
        value={finance.approvedBudget}
        onChange={(v) =>
          setFinance({
            ...finance,
            approvedBudget: v,
          })
        }
      />

      <FinanceField
        label="Forecast Cost"
        value={finance.forecastCost}
        onChange={(v) =>
          setFinance({
            ...finance,
            forecastCost: v,
          })
        }
      />

      <FinanceField
        label="Actual Cost"
        value={finance.actualCost}
        onChange={(v) =>
          setFinance({
            ...finance,
            actualCost: v,
          })
        }
      />

      <FinanceField
        label="Contingency"
        value={finance.contingency}
        onChange={(v) =>
          setFinance({
            ...finance,
            contingency: v,
          })
        }
      />

      <div
        style={{
          marginTop: 30,
          background: "#0F172A",
          padding: 20,
          borderRadius: 12,
        }}
      >
        <h3>Executive Summary</h3>

        <p>
          Forecast Gross Profit:
          {" "}
          {finance.currency} {forecastProfit.toLocaleString()}
        </p>

        <p>
          Actual Gross Profit:
          {" "}
          {finance.currency} {actualProfit.toLocaleString()}
        </p>
        <p>Gross Margin: {margin.toFixed(1)}%</p>
      </div>

      <button
        onClick={save}
        style={{
          marginTop: 24,
          padding: "12px 20px",
          border: "none",
          borderRadius: 8,
          background: "#2563EB",
          color: "white",
          cursor: "pointer",
        }}
      >
        Save Finance
      </button>
    </>
  );
}

function FinanceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div
      style={{
        marginBottom: 20,
      }}
    >
      <label>{label}</label>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        style={{
          width: "100%",
          marginTop: 6,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #475569",
          background: "#0F172A",
          color: "white",
        }}
      />
    </div>
  );
}
