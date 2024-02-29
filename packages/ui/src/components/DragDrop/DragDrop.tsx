import { Button } from "@eden/package-ui";
import { DragDropContext } from "@hello-pangea/dnd";
import dynamic from "next/dynamic";
import { useState } from "react";

export interface IDragDropProps {
  title?: string;
  elements?: { id: string; content: string }[];
  onNext?: () => void;
  onPrev?: () => void;
  // eslint-disable-next-line no-unused-vars
  onReOrder?: (skillsOrder: string[]) => void;
}

export const DragDrop = ({
  title = "",
  elements = [],
  onNext,
  onPrev,
  // eslint-disable-next-line no-unused-vars
  onReOrder,
}: IDragDropProps) => {
  const Column = dynamic(() => import("./Column"), { ssr: false });
  const handleNext = () => {
    if (onNext) onNext!();
  };

  const handleBack = () => {
    if (onPrev) onPrev!();
  };

  const shortener = (num: number) => {
    const numbers = [];

    for (var i = 0; i < num; i++) {
      numbers.push(i);
    }
    return numbers;
  };
  const initialData = {
    tasks: elements,
    columns: {
      "column-1": {
        id: "column-1",
        title: "",
        taskIds: shortener(elements.length),
        opacity: 0,
      },
      "column-2": {
        id: "column-2",
        title: "⭐ GODLIKE",
        taskIds: [],
        opacity: 100,
      },
      "column-3": {
        id: "column-3",
        title: "🎉️ DECENT",
        taskIds: [],
        opacity: 60,
      },
      "column-4": {
        id: "column-4",
        title: "🤩 LEARNING",
        taskIds: [],
        opacity: 30,
      },
    },

    columnOrder: ["column-1", "column-2", "column-3", "column-4"],
  };
  const [first, setfirst] = useState<any>(initialData);

  const reorderColumnList = (
    sourceCol: any,
    startIndex: any,
    endIndex: number
  ) => {
    const newTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = newTaskIds.splice(startIndex, 1);

    newTaskIds.splice(endIndex, 0, removed);

    const newColumn = {
      ...sourceCol,
      taskIds: newTaskIds,
    };

    return newColumn;
  };

  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return;

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the user drops within the same column but in a different positoin
    const sourceCol = first.columns[source.droppableId];
    const destinationCol = first.columns[destination.droppableId];

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...first,
        columns: {
          ...first.columns,
          [newColumn.id]: newColumn,
        },
      };

      setfirst(newState);
      return;
    }

    // If the user moves from one column to another
    const startTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(destinationCol.taskIds);

    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };

    const newState = {
      ...first,
      columns: {
        ...first.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };

    setfirst(newState);
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4 text-center text-white">
      <div className="text-md font-thin text-black">{title}</div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="text-sm  text-black">
          Ranked highest means you&apos;re most professional, ranked lowest -
          you&apos;re still learning.
        </div>
        <div className="flex flex-col justify-between gap-4">
          {first.columnOrder.map((columnId: any) => {
            const column = first.columns[columnId];
            const tasks = column.taskIds.map(
              (taskId: any) => first.tasks[taskId]
            );

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </div>
      </DragDropContext>

      <div className="flex justify-between pt-6">
        <div>
          {onPrev && (
            <Button radius="rounded" variant={`secondary`} onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
        <Button radius="rounded" variant={`secondary`} onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};
