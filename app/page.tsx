"use client";
import { participants as participantsData } from "@/lib/participants";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState } from "react";

type Participant = {
  name: string;
  present: boolean;
};

type Data = {
  participants: Participant[];
};

export default function Home() {
  const [data, setLocalStorage] = useLocalStorage<Data>({
    participants: participantsData.map((p) => ({ name: p, present: true })),
  });

  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    "",
  );

  const { participants } = data;

  const handleParticipantAvailabilityChange = (name: string) => {
    const updatedParticipants = participants.map((p) => {
      if (p.name === name) {
        return {
          ...p,
          present: !p.present,
        };
      }
      return p;
    });
    setLocalStorage({ ...data, participants: updatedParticipants });
  };

  const handleAssign = () => {
    const availableParticipants = participants.filter((p) => p.present);
    const randomIndex = Math.floor(
      Math.random() * availableParticipants.length,
    );
    setSelectedParticipant(availableParticipants[randomIndex].name);
  };

  return (
    <main className={"w-full py-6"}>
      <h1 className={"font-bold text-2xl text-center"}>
        Opus Reco Daily Meeting Presenter Planning
      </h1>
      <ul
        className={"flex gap-3 justify-evenly py-6 mt-6 flex-wrap m-auto w-2/3"}
      >
        {participants.map((participant) => (
          <li key={participant.name} className={"flex flex-col items-center"}>
            <h2
              className={
                !participant.present ? "text-gray-400 text-lg" : "text-lg"
              }
            >
              {participant.name}
            </h2>
            <Checkbox
              onClick={() =>
                handleParticipantAvailabilityChange(participant.name)
              }
              className={"mt-2"}
              checked={participant.present}
            />
          </li>
        ))}
      </ul>
      <div className={"w-full flex justify-center mt-10"}>
        <Button size={"lg"} onClick={handleAssign}>
          Assign
        </Button>
      </div>

      <div className={"text-center mt-10 text-2xl flex flex-col items-center"}>
        <span>And the winner is:</span>
        {selectedParticipant && (
          <span className={"text-3xl mt-10 animate-scale-unscale"}>
            🎉 {selectedParticipant} 🎉
          </span>
        )}
      </div>

      {!!selectedParticipant && (
        <h3 className={"text-center font-bold text-2xl mt-10"}>
          Congratulations
        </h3>
      )}
    </main>
  );
}
