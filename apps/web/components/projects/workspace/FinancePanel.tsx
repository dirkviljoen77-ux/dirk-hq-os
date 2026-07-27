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

  const variance =
    finance.approvedBudget - finance.forecastCost;

  const remaining =
    finance.approvedBudget - finance.actualCost;

  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        Project Finance
      </h2>

      <FinanceField
        label="Approved Budget"
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
          Budget Variance:
          {" "}
          {variance.toLocaleString()}
        </p>

        <p>
          Budget Remaining:
          {" "}
          {remaining.toLocaleString()}
        </p>
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