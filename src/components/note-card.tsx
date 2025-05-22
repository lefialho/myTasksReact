import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    date: Date;
    content: string;
  };

  onNoteUpdated: (id: string, title: string, content: string) => void; //void = sem retorno, vazio
  onNoteDeleted: (id: string) => void;
}

export function NoteCard({
  note,
  onNoteDeleted,
  onNoteUpdated,
}: NoteCardProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [open, setOpen] = useState(false);

  function handleTitleChanged(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleContentChanged(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
  }

  function handleSaveNote(e: FormEvent) {
    e.preventDefault();

    if (content === '') return;

    onNoteUpdated(note.id, title, content);
    setOpen(false);
    toast.success('Nota salva com sucesso!');
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="relative text-left p-5 flex flex-col gap-3 rounded-md shadow dark:shadow-none shadow-slate-300 bg-white dark:bg-slate-800 overflow-hidden hover:ring-2 text-slate-600 dark:text-slate-400 hover:ring-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
        <h2 className="font-bold text-lg dark:text-slate-300 line-clamp-2">
          {title}
        </h2>

        <span className="inline-block text-sm font-medium text-slate-400 dark:text-slate-500">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>

        <p
          className="text-slate-500 dark:text-slate-400 line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: note.content.replace(/(?:\r\n|\r|\n)/g, '</br>'),
          }}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-white dark:bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-200 hover dark:bg-slate-800 text-slate-400 hover:text-slate-500 dark:hover:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-bl-sm">
            <X className="size-5" />
          </Dialog.Close>

          <Dialog.Title className="text-lg font-semibold p-5 pb-0">
            <input
              className="text-lg leading-6 w-full text-slate-600 dark:text-slate-300 bg-transparent resize-none flex-1 outline-none"
              type="text"
              placeholder="Título da nota"
              onChange={handleTitleChanged}
              value={title}
            />
          </Dialog.Title>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="inline-block text-sm font-medium text-slate-400 dark:text-slate-500">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>

            <Dialog.Description className="leading-6 h-full">
              <textarea
                className="w-full h-full overflow-hidden leading-6 text-slate-500 dark:text-slate-400 bg-transparent resize-none flex-1 outline-none"
                onChange={handleContentChanged}
                autoFocus
                value={content}
              />
            </Dialog.Description>
          </div>

          <div className="flex">
            <button
              onClick={handleSaveNote}
              disabled={!content}
              type="button"
              className="w-full py-4 text-sm outline-none font-medium focus-visible:bg-lime-600 focus-visible:text-lime-200 text-lime-950  bg-lime-400 hover:bg-lime-500 disabled:bg-slate-600 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              Salvar nota
            </button>

            <button
              onClick={() => onNoteDeleted(note.id)}
              type="button"
              className="w-full py-4 text-center text-sm text-slate-300 bg-slate-700 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-900 focus-visible:bg-slate-800 dark:focus-visible:bg-slate-900 font-medium group outline-none"
            >
              Deseja{' '}
              <span className="text-red-400 group-hover:underline underline-offset-2">
                apagar essa nota
              </span>{' '}
              ?
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
