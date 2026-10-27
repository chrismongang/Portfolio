import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { copy } from "../copy";

export function Contact() {
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
            lang: "de",
          }}
        />
      </div>
    </div>
  );
}
