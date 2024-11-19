"use client";
import { participants as participantsData } from "@/lib/participants";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Participant = {
  name: string;
  present: boolean;
};

type Data = {
  participants: Participant[];
  selectedParticipants: string[];
};

export default function Home() {
  const [data, setLocalStorage] = useLocalStorage<Data>({
    participants: participantsData.map((p) => ({ name: p, present: true })),
    selectedParticipants: [],
  });

  const { participants, selectedParticipants } = data;

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
    const selectedNames = [];
    const namesCopy = participants.filter((p) => p.present).map((p) => p.name);

    while (selectedNames.length < 5) {
      const randomIndex = Math.floor(Math.random() * namesCopy.length);
      selectedNames.push(namesCopy[randomIndex]);
      const availableParticipants = participants.filter((p) => p.present);
      if (availableParticipants.length >= 5) {
        namesCopy.splice(randomIndex, 1);
      }
    }

    setLocalStorage({ ...data, selectedParticipants: selectedNames });
  };

  const handleReroll = (dayIndex: number) => {
    const selection = [...selectedParticipants];
    let unselectedParticipants = participants
      .filter((p) => p.present)
      .map((p) => p.name)
      .filter((name) => !selection.includes(name));

    if (unselectedParticipants.length === 0) {
      unselectedParticipants = participants
        .filter((p) => p.present)
        .map((p) => p.name);
    }

    const randomIndex = Math.floor(
      Math.random() * unselectedParticipants.length,
    );
    selection[dayIndex] = unselectedParticipants[randomIndex];
    setLocalStorage({ ...data, selectedParticipants: selection });
  };

  return (
    <main className={"w-full py-6"}>
      <h1 className={"font-bold text-2xl text-center"}>
        Opus Reco Daily Meeting Presenter Planning
      </h1>
      <ul className={"flex gap-3 justify-evenly py-6 mt-6"}>
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

      <ul className={"flex w-full justify-evenly py-6 mt-10"}>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
          (day, i) => (
            <li
              key={day}
              className={
                "border-2 border-black p-5 flex flex-col items-center justify-around w-52 h-52"
              }
            >
              <span className={"font-bold"}>{day}</span>
              <span>{selectedParticipants[i]}</span>
              {!!selectedParticipants[i] && (
                <Button onClick={() => handleReroll(i)} size={"sm"}>
                  Reroll
                </Button>
              )}
            </li>
          ),
        )}
      </ul>
      {!!selectedParticipants.length && (
        <h3 className={"text-center font-bold text-2xl mt-5"}>
          Congratulations
        </h3>
      )}
    </main>
  );
}
