import { ChangeEvent, useState } from 'react';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';
import { ThemeToggle } from './components/toggle';
import { Logo } from './components/logo';

interface Note {
  id: string;
  title: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnSorce = localStorage.getItem('notes');
    // Verifica se há notas armazenadas no localStorage
    if (notesOnSorce) {
      // Se houver, converte a string JSON de volta para um array de objetos
      return JSON.parse(notesOnSorce) as Note[];
    }
    return [];
  });

  function onNoteCreated(title: string, content: string) {
    const newNote = {
      id: crypto.randomUUID(), // Gera um ID único em formato de string para a nota
      title: title, // Pega os 20 primeiros caracteres do conteúdo
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes([newNote, ...notes]);
    // O JSON.stringify converte o array de objetos de volta para uma string JSON
    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function onNoteUpdated(id: string, title: string, content: string) {
    // Atualiza o conteúdo da nota com o id passado por parâmetro
    const notesArray = notes.map((note) => {
      if (note.id === id) {
        return { ...note, title, content };
      }
      return note;
    });

    setNotes(notesArray);
    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    // Retira a nota com o id passado por parâmetro e atualiza notas restantes
    const notesArray = notes.filter((note) => note.id !== id);
    setNotes(notesArray);
    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearch(query);
  }

  const filteredNotes =
    search !== ''
      ? notes.filter(
          (note) =>
            note.title
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()) ||
            note.content
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()),
        ) // Filtra as notas com base na pesquisa e com case sensitive
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-6 md:my-12 space-y-6 px-5">
      <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-300 font-bold">
        <span className="inline-flex items-center gap-1">
          <Logo /> MyNotes
        </span>
        <ThemeToggle />
      </div>

      {notes.length > 0 ? (
        <form className="w-full">
          <input
            type="text"
            placeholder="Busque em suas notas..."
            className="w-full text-3xl font-semibold tracking-tight outline-none pb-1 border-b border-b-slate-300 dark:border-slate-600 focus-visible:border-lime-400 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-500 dark:text-slate-300"
            autoFocus
            onChange={handleSearch}
          />
        </form>
      ) : (
        <p className="rounded-md shadow dark:shadow-none shadow-slate-300 bg-white dark:bg-slate-800 overflow-hidden hover:ring-2 text-slate-600 dark:text-slate-400 p-5">
          Pressione no botão + logo abaixo, para inserir uma nota.
        </p>
      )}

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[210px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onNoteUpdated={onNoteUpdated}
            onNoteDeleted={onNoteDeleted}
          />
        ))}
      </section>
    </div>
  );
}
