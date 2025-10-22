import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

export interface AgentStatePanelProps {
  state?: any;
}

export const AgentStatePanel = ({ state }: AgentStatePanelProps) => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="rounded-[28px] border border-slate-200/80 bg-white/30 px-8 py-9 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Agent State
            </h2>
            <p className="mt-3 text-sm text-slate-100">
              Latest snapshot of the agent&apos;s context and data.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white/70 px-5 py-5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.7)] h-[520px] overflow-auto">
          {state && (
            <div className="overflow-auto">
              <JsonView src={state} collapsed={1} enableClipboard={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
