import { Input } from "@/components/ui/input";
import { useMachine } from "@xstate/react";
import { useId, useState } from "react";
import { createMachine, setup } from "xstate";
import ArrowIcon from "../assets/arrow.svg";
import { icons } from "../assets/icons";
import PasswordIndicator from "../components/passwordIndicator";
import { cn } from "@/lib/utils";

const key_hash = "1";

interface EntryProps {
  onNext: () => void;
  onWrongPassword: () => void;
}

const entryMachine = setup({
  types: {
    context: {} as {
      password: string;
      keyHash: string;
    },
    events: {} as
      | { type: "SET_PASSWORD"; password: string }
      | { type: "UNLOCK"; password: string }
      | { type: "WRONG_PASSWORD" },
  },
  actions: {
    savePassword: (_, params: { password: string }) => {
      // TODO: implement password hash saving
      console.log("Saving password:", params.password);
    },
  },
}).createMachine({
  id: "entry",
  context: {
    password: "",
    keyHash: key_hash,
  },
  initial: key_hash ? "lock" : "start",
  states: {
    start: {
      on: {
        SET_PASSWORD: {
          target: "lock",
          actions: {
            type: "savePassword",
            params: ({ event }) => ({
              password: event.password,
            }),
          },
        },
      },
    },
    lock: {
      on: {
        UNLOCK: [
          {
            target: "unlocked",
            guard: ({ event, context }) => {
              // TODO: implement proper password verification
              return event.password === "123456";
            },
          },
          {
            target: "lock",
            actions: ({ event }) => {
              console.log("Wrong password:", event.password);
            },
          },
        ],
      },
    },
    unlocked: {
      type: "final",
    },
  },
});

function StarterUpPart() {
  return (
    <div className="mt-auto flex flex-col gap-8 items-center justify-center mb-8">
      <img src={ArrowIcon} alt="App logo" />
      <div className="flex flex-col items-center gap-1">
        <div className="font-bold text-xl font-sans text-gray-900 dark:text-[#f6f6f6]">
          Getting Started with KeySphere
        </div>
        <div className="text-[12px] text-slate-500 font-sans text-center dark:text-[#f6f6f6]/40">
          Please set your password. This program only stores its hash locally
          for verification. <br />
          If you lose your password, you{" "}
          <span className="text-rose-500">cannot</span> access your repository
          or recover it.
        </div>
      </div>
    </div>
  );
}

function StarterDownPart() {
  return <PasswordIndicator />;
}

function UnlockUpPart() {
  return (
    <div className="mt-auto flex flex-col gap-8 items-center justify-center mb-8">
      <img src={ArrowIcon} alt="App logo" />
      <div className="flex flex-col items-center gap-1">
        <div className="font-bold text-xl font-sans text-gray-900 dark:text-[#f6f6f6]">
          Unlock KeySphere
        </div>
        <div className="text-[12px] text-slate-500 font-sans dark:text-gray-400">
          Enter password to access your vault.
        </div>
      </div>
    </div>
  );
}

function UnlockDownPart({ onNext, onWrongPassword }: EntryProps) {
  const id = useId();
  const [passhash, setPasshash] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passhash === key_hash) {
      onNext();
    } else {
      onWrongPassword();
      setPasshash("");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        id={id}
        className="pe-9"
        placeholder="Password"
        type="password"
        value={passhash}
        onChange={(e) => setPasshash(e.target.value)}
      />
      <button
        className={cn(
          "absolute inset-y-0 right-0",
          "flex h-full w-9 items-center justify-center",
          "rounded-r-lg",
          "cursor-pointer",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "text-gray-500/80 dark:text-gray-400",
          "hover:text-gray-900 dark:hover:text-gray-100",
          "focus:z-10",
          "transition duration-300"
        )}
        type="submit"
      >
        <icons.key_3 size={16} />
      </button>
    </form>
  );
}

export default function Entry({ onNext, onWrongPassword }: EntryProps) {
  const [state, send] = useMachine(entryMachine);

  return (
    <div className="flex flex-col h-screen select-none transition">
      <div className="h-1/2 bg-gradient-to-b from-white to-blue-50 border-b border-slate-200 dark:border-[#FFFFFF08] flex flex-col dark:bg-none dark:bg-inherit">
        {state.matches("start") ? <StarterUpPart /> : <UnlockUpPart />}
      </div>
      <div className="h-1/2 bg-slate-100 border-t border-slate-200 dark:border-[#FFFFFF08] flex flex-col items-center justify-center dark:bg-inherit">
        <div className="mb-auto mt-8 relative z-10">
          {state.matches("start") ? (
            <StarterDownPart />
          ) : (
            <UnlockDownPart
              onNext={() => {
                // send({
                //   type: "UNLOCK",
                // });
                onNext();
              }}
              onWrongPassword={onWrongPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
}
