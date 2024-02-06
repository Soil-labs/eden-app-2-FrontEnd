// SalaryPopup.tsx
import React, { useState } from "react";

interface SalaryPopupProps {
  mode: "salary" | "level" | "availability";
  minSalary?: number;
  maxSalary?: number;
  level?: string;
  minHours?: number;
  maxHours?: number;
  // eslint-disable-next-line no-unused-vars
  onDone: (data: {
    minSalary?: number;
    maxSalary?: number;
    level?: string;
    minHours?: number;
    maxHours?: number;
    sentMessageToEdenAI?: string;
  }) => void;
}

const SalaryPopup: React.FC<SalaryPopupProps> = ({
  mode,
  minSalary: initialMinSalary,
  maxSalary: initialMaxSalary,
  level: initialLevel,
  minHours: initialMinHours,
  maxHours: initialMaxHours,
  onDone,
}) => {
  const [minSalary, setMinSalary] = useState<number>(initialMinSalary || 0);
  const [maxSalary, setMaxSalary] = useState<number>(initialMaxSalary || 0);
  const [level, setLevel] = useState<string>(initialLevel || "");
  const [minHours, setMinHours] = useState<number>(initialMinHours || 0);
  const [maxHours, setMaxHours] = useState<number>(initialMaxHours || 0);

  // const [sentMessageToEdenAI, setSentMessageToEdenAI] = useState<string>("");

  const renderHoursInputs = () => (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="minHours" className="mb-1 block">
          Min Hours
        </label>
        <input
          type="number"
          id="minHours"
          className="w-full rounded border border-gray-300 px-3 py-2"
          value={minHours}
          onChange={(e) => setMinHours(Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="maxHours" className="mb-1 block">
          Max Hours
        </label>
        <input
          type="number"
          id="maxHours"
          className="w-full rounded border border-gray-300 px-3 py-2"
          value={maxHours}
          onChange={(e) => setMaxHours(Number(e.target.value))}
        />
      </div>
    </div>
  );

  const renderSalaryInputs = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="minSalary" className="mb-1 block">
          Min Salary
        </label>
        <input
          type="number"
          id="minSalary"
          className="w-full rounded border border-gray-300 px-3 py-2"
          value={minSalary}
          onChange={(e) => setMinSalary(Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="maxSalary" className="mb-1 block">
          Max Salary
        </label>
        <input
          type="number"
          id="maxSalary"
          className="w-full rounded border border-gray-300 px-3 py-2"
          value={maxSalary}
          onChange={(e) => setMaxSalary(Number(e.target.value))}
        />
      </div>
    </div>
  );

  const renderLevelSelect = () => (
    <div>
      <label htmlFor="level" className="mb-1 block">
        Level
      </label>
      <select
        id="level"
        className="w-full rounded border border-gray-300 px-3 py-2"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="">Select a level</option>
        <option value="junior">Junior</option>
        <option value="mid">Mid</option>
        <option value="senior">Senior</option>
      </select>
    </div>
  );

  const handleSubmit = () => {
    if (mode === "salary") {
      const sentMessageToEdenAIT = `The salary of the candidate can be between ${minSalary}$ and ${maxSalary}$`;

      // setSentMessageToEdenAI(sentMessageToEdenAIT);

      onDone({
        minSalary,
        maxSalary,
        level,
        minHours,
        maxHours,
        sentMessageToEdenAI: sentMessageToEdenAIT,
      });
    } else if (mode === "level") {
      const sentMessageToEdenAIT = `The level of expertise of the candidate can should be ${level}`;

      console.log("sentMessageToEdenAIT = ", sentMessageToEdenAIT);

      // setSentMessageToEdenAI(sentMessageToEdenAIT);
      onDone({
        minSalary,
        maxSalary,
        level,
        minHours,
        maxHours,
        sentMessageToEdenAI: sentMessageToEdenAIT,
      });
    } else if (mode === "availability") {
      const sentMessageToEdenAIT = `The availability of the candidate can be between ${minHours} and ${maxHours}`;

      // setSentMessageToEdenAI(sentMessageToEdenAIT);
      onDone({
        minSalary,
        maxSalary,
        level,
        minHours,
        maxHours,
        sentMessageToEdenAI: sentMessageToEdenAIT,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-1/2 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-xl">
          Enter{" "}
          {mode === "salary"
            ? "Salary Range"
            : mode === "level"
            ? "User Level"
            : "Availability Hours"}
        </h2>
        {mode === "salary" && renderSalaryInputs()}
        {mode === "level" && renderLevelSelect()}
        {mode === "availability" && renderHoursInputs()}
        <button
          className="float-right mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleSubmit}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SalaryPopup;
