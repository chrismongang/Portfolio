import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { copy, leadForm } from "../copy";

export function Contact() {
  // Someone who just sent the form on /start arrives with name and email filled in.
  const lead = useLocation().state as { name?: string; email?: string } | null;

  useEffect(() => {
    void (async () => {
      const cal = await getCalApi({ namespace: "15min" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-5xl flex-1 flex-col px-4 pb-4 md:px-8">
      <h1 className="mb-4 text-center text-[28px] font-medium tracking-[-0.03em] md:text-[32px]">
        {copy.contactTitle}
      </h1>
      <div className="min-h-[720px] w-full flex-1">
        <Cal
          namespace="15min"
          calLink="chris-mongang-9njh0l/15min"
          calOrigin="https://app.cal.com"
          style={{ width: "100%", height: "100%", overflow: "auto" }}
          config={{
            layout: "month_view",
            useSlotsViewOnSmallScreen: "true",
            lang: "en",
            ...(lead?.name ? { name: lead.name } : {}),
            ...(lead?.email ? { email: lead.email } : {}),
          }}
        />
      </div>
      {lead ? null : (
        <Link
          to="/start"
          className="mt-6 text-center text-[15px] font-medium text-muted hover:text-ink"
        >
          {leadForm.preferForm} →
        </Link>
      )}
    </div>
  );
}
