import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { leadForm as text } from "../copy";
import { privacyPath } from "../legal";

const steps = 5;

const primaryButton =
  "rounded-xl bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6] px-5 py-2.5 text-[15px] font-medium text-ink hover:from-[#bdecd9] hover:to-[#a6dcf0] disabled:cursor-not-allowed disabled:opacity-40";
const input =
  "w-full rounded-xl border border-placeholder bg-white px-4 py-3 text-[16px] text-ink outline-none placeholder:text-muted focus:border-ink";

function Choice({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-xl px-4 py-3 text-[15px] font-medium text-ink ${
        selected
          ? "bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6]"
          : "bg-button hover:bg-placeholder"
      }`}
    >
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Start() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [stage, setStage] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  // Hidden from people. Bots fill it in, and the server then drops the entry.
  const [fax, setFax] = useState("");

  const canContinue = [
    company.trim() !== "",
    stage !== "",
    goals.length > 0,
    timing !== "",
    name.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
  ][step];

  function toggleGoal(goal: string) {
    if (goal === text.goals.unsure) {
      setGoals(goals.includes(goal) ? [] : [goal]);
      return;
    }
    const picked = goals.filter((item) => item !== text.goals.unsure);
    setGoals(
      picked.includes(goal)
        ? picked.filter((item) => item !== goal)
        : [...picked, goal],
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!canContinue || status === "sending") return;
    if (step < steps - 1) {
      setStep(step + 1);
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          company,
          website,
          stage,
          goals,
          timing,
          name,
          email,
          whatsapp,
          message,
          fax,
        }),
      });
      setStatus(response.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    const firstName = name.trim().split(" ")[0];
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-6 pb-16 pt-16 text-center md:pt-24">
        <h1 className="text-balance text-[28px] font-medium leading-[1.15] tracking-[-0.03em] md:text-[40px]">
          {text.done.title(firstName)}
        </h1>
        <p className="mt-5 text-pretty text-[16px] leading-relaxed text-muted md:text-[18px]">
          {text.done.text(website.trim() || company.trim())}
        </p>
        <p className="mt-14 text-[15px] text-muted">{text.done.callQuestion}</p>
        <Link
          to="/contact"
          state={{ name: name.trim(), email: email.trim() }}
          className="mt-4 rounded-xl bg-button px-5 py-2.5 text-[15px] font-medium text-ink hover:bg-placeholder"
        >
          {text.done.callButton}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pb-16 pt-10 md:pt-16">
      <h1 className="text-balance text-center text-[28px] font-medium leading-[1.15] tracking-[-0.03em] md:text-[40px]">
        {text.title}
      </h1>
      <p className="mt-3 text-center text-[15px] text-muted md:text-[17px]">
        {text.intro}
      </p>

      <form
        onSubmit={submit}
        noValidate
        className="mt-10 rounded-2xl border border-placeholder p-6 md:p-8"
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: steps }, (_, index) => (
              <span
                key={index}
                className={`h-1.5 w-6 rounded-full ${
                  index <= step ? "bg-ink" : "bg-placeholder"
                }`}
              />
            ))}
          </div>
          <span className="text-[13px] tabular-nums text-muted">
            {step + 1} / {steps}
          </span>
        </div>

        {step === 0 ? (
          <fieldset className="space-y-4">
            <legend className="mb-6 text-[20px] font-medium tracking-[-0.02em] md:text-[22px]">
              {text.company.question}
            </legend>
            <Field label={text.company.companyLabel}>
              <input
                className={input}
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder={text.company.companyPlaceholder}
                autoComplete="organization"
                maxLength={120}
              />
            </Field>
            <Field label={text.company.websiteLabel}>
              <input
                className={input}
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder={text.company.websitePlaceholder}
                inputMode="url"
                autoCapitalize="none"
                autoComplete="url"
                maxLength={200}
              />
            </Field>
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset>
            <legend className="mb-6 text-[20px] font-medium tracking-[-0.02em] md:text-[22px]">
              {text.stage.question}
            </legend>
            <div className="flex flex-wrap gap-2">
              {text.stage.options.map((option) => (
                <Choice
                  key={option}
                  label={option}
                  selected={stage === option}
                  onClick={() => {
                    setStage(option);
                    setStep(2);
                  }}
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset>
            <legend className="mb-2 text-[20px] font-medium tracking-[-0.02em] md:text-[22px]">
              {text.goals.question}
            </legend>
            <p className="mb-6 text-[14px] text-muted">{text.goals.hint}</p>
            <div className="flex flex-wrap gap-2">
              {[...text.goals.options, text.goals.unsure].map((option) => (
                <Choice
                  key={option}
                  label={option}
                  selected={goals.includes(option)}
                  onClick={() => toggleGoal(option)}
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset>
            <legend className="mb-6 text-[20px] font-medium tracking-[-0.02em] md:text-[22px]">
              {text.timing.question}
            </legend>
            <div className="flex flex-wrap gap-2">
              {text.timing.options.map((option) => (
                <Choice
                  key={option}
                  label={option}
                  selected={timing === option}
                  onClick={() => {
                    setTiming(option);
                    setStep(4);
                  }}
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 4 ? (
          <fieldset className="space-y-4">
            <legend className="mb-6 text-[20px] font-medium tracking-[-0.02em] md:text-[22px]">
              {text.reach.question}
            </legend>
            <Field label={text.reach.nameLabel}>
              <input
                className={input}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                maxLength={120}
                autoFocus
              />
            </Field>
            <Field label={text.reach.emailLabel}>
              <input
                className={input}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                maxLength={200}
              />
            </Field>
            <Field label={text.reach.whatsappLabel}>
              <input
                className={input}
                type="tel"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder={text.reach.whatsappPlaceholder}
                autoComplete="tel"
                maxLength={40}
              />
            </Field>
            <Field label={text.reach.messageLabel}>
              <textarea
                className={`${input} min-h-24 resize-y`}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={text.reach.messagePlaceholder}
                rows={3}
                maxLength={1000}
              />
            </Field>
            <input
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              name="fax"
              value={fax}
              onChange={(event) => setFax(event.target.value)}
            />
            <p className="pt-2 text-[13px] text-muted">
              {text.reach.privacy}{" "}
              <Link to={privacyPath} className="underline hover:text-ink">
                {text.reach.privacyLink}
              </Link>
            </p>
          </fieldset>
        ) : null}

        {status === "error" ? (
          <p role="alert" className="mt-6 text-[14px] text-[#b3261e]">
            {text.error}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="text-[15px] font-medium text-muted hover:text-ink"
            >
              ← {text.back}
            </button>
          ) : (
            <span />
          )}
          {/* The two single-choice steps move on by themselves the first time. */}
          {step === 1 || step === 3 ? (
            canContinue ? (
              <button type="submit" className={primaryButton}>
                {text.next} →
              </button>
            ) : null
          ) : (
            <button
              type="submit"
              disabled={!canContinue || status === "sending"}
              className={primaryButton}
            >
              {step < steps - 1
                ? `${text.next} →`
                : status === "sending"
                  ? text.sending
                  : `${text.send} →`}
            </button>
          )}
        </div>
      </form>

      <Link
        to="/contact"
        className="mt-8 text-center text-[15px] font-medium text-muted hover:text-ink"
      >
        {text.preferCall} →
      </Link>
    </div>
  );
}
