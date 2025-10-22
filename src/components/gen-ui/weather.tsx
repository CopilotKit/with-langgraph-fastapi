import { defineToolCallRenderer } from "@copilotkitnext/react";

// @ts-ignore
export const weatherToolRender = defineToolCallRenderer({
  name: "get_weather",
  render: ({ args }) => {
    return <WeatherCard location={args.location} />;
  },
});

// Weather card component where the location is based on what the agent sets via tool calls.
function WeatherCard({ location }: { location?: string }) {
  return (
    <div className="max-w-sm w-full rounded-[28px] border border-slate-200/80 px-8 py-9 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Weather in
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            {location || "Unknown location"}
          </h3>
        </div>
        <div className="rounded-full bg-sky-100 p-3 text-sky-500">
          <SunIcon className="h-10 w-10" />
        </div>
      </div>

      <div className="mt-10 flex items-end gap-3">
        <span className="text-7xl font-light text-slate-900">70</span>
        <span className="mb-2 text-xl font-medium text-slate-400">°F</span>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Updated{" "}
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

type IconProps = {
  className?: string;
};

// Sun icon for clear weather
function SunIcon({ className = "h-10 w-10 text-white" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <circle cx="12" cy="12" r="4" className="opacity-90" />
      <path
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
      />
    </svg>
  );
}
