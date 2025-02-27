import { useMachine } from "@xstate/react";
import { setup } from "xstate";
import "./App.css";
import Entry from "./pages/entry";
import Home from "./pages/home";
import TopBar from "./topBar/topbar";
import { ExpandableCardExamples } from "./components/card";
import { Toaster } from "@/components/ui/sonner";

interface EntryContextType {
  count: number;
  maxCount: number;
}

interface EntryEvents {
  type: "NEXT" | "WRONG_PASSWORD" | "BACK";
}

const entryMachine = setup({
  types: {
    context: {} as EntryContextType,
    events: {} as EntryEvents,
    input: {} as { maxCount: number },
  },
  actions: {
    incrementCount: ({ context }) => {
      context.count += 1;
    },
  },
}).createMachine({
  id: "entry",
  context: ({ input }) => ({
    count: 0,
    maxCount: input.maxCount,
  }),
  initial: "entry",
  states: {
    entry: {
      on: {
        NEXT: "home",
        WRONG_PASSWORD: {
          actions: "incrementCount",
          guard: ({ context }) => context.count < context.maxCount,
        },
      },
    },
    home: {
      on: {
        BACK: "entry",
      },
    },
  },
});

function App() {
  const [state, send] = useMachine(entryMachine, {
    input: { maxCount: 30 },
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-y-auto">
        {/* {state.matches("entry") ? (
        <Entry
          onNext={() => send({ type: "NEXT" })}
          onWrongPassword={() => send({ type: "WRONG_PASSWORD" })}
        />
      ) : (
        <Home />
      )} */}
        <ExpandableCardExamples />
      </main>

      <Toaster />
    </div>
  );
}

export default App;
