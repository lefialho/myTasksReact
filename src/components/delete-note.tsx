import * as Dialog from "@radix-ui/react-dialog";
import { X, Trash2Icon } from "lucide-react";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };

  onNoteDeleted: (id: string) => void;
}

export function DeleteNote({note, onNoteDeleted }: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <span className="absolute bottom-3 right-3 border rounded-full p-1 hover:bg-slate-700">
          <Trash2Icon className="size-4" />
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md outline-none grid">
          <Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <div className="p-5 ">
            <Dialog.Title className="text-lg font-semibold text-slate-300 pb-4">
              Apagar nota
            </Dialog.Title>

            <Dialog.Description className=" text-sm leading-6 text-slate-400 overflow-hidden relative">
              Você tem certeza que deseja excluir essa nota?
            </Dialog.Description>
          </div>

          <footer className="self-end flex">
            <Dialog.Close className="focus-visible:bg-lime-700 focus-visible:text-lime-200 text-lime-950 bg-lime-400 hover:bg-lime-500 w-full py-4">
              Cancelar
            </Dialog.Close>
            <button
              className="bg-red-400 w-full hover:bg-red-500"
              onClick={() => onNoteDeleted(note.id)}
            >
              Sim
            </button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
