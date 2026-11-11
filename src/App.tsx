import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { About } from "./pages/About";
import { CaseStudy } from "./pages/CaseStudy";
import { Contact } from "./pages/Contact";
import {
  servicePage,
  servicePageDe,
  servicePath,
  servicePathDe,
} from "./copy";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Service } from "./pages/Service";
import { Work } from "./pages/Work";

/** Shared by the browser app and the build-time prerender. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path={servicePath}
          element={<Service content={servicePage} />}
        />
        <Route
          path={servicePathDe}
          element={<Service content={servicePageDe} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <AppRoutes />
    </BrowserRouter>
  );
}
