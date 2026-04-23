import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if (import.meta.env.DEV) {
  import("@/seeds/runSeeds").then(({ runArticleSeeds }) => {
    runArticleSeeds();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
