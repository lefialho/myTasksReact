import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, X, PlusCircle } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface NewNoteCardProps {
  onNoteCreated: (title: string, content: string) => void; //void = sem retorno, vazio
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isRercording, setIsRecording] = useState(false);

  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  function handleTitleChanged(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);

    if (e.target.value === '') return;
  }

  function handleContentChanged(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);

    if (e.target.value === '') {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(e: FormEvent) {
    e.preventDefault();

    if (content === '') return;

    onNoteCreated(title, content);
    setContent('');
    setShouldShowOnboarding(true);

    toast.success('Nota salva com sucesso!');
  }

  function handleStartRecording() {
    // Verifica se a API de reconhecimento de fala está disponível no navegador
    const isSpeeechRecognitionAPIAvailable =
      'SpeechREcoginition' in window || 'webkitSpeechRecognition' in window;

    if (!isSpeeechRecognitionAPIAvailable) {
      alert('API de reconhecimento de fala não suportada neste navegador.');
      return;
    }

    const SpeerchRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeerchRecognitionAPI();

    setIsRecording(true);
    setShouldShowOnboarding(false);

    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true; // Permite reconhecimento de fala contínuo, até pedir para parar
    speechRecognition.maxAlternatives = 0; // Número máximo de alternativas de reconhecimento de fala
    speechRecognition.interimResults = true; // Permite resultados no momento da fala e não apenas quando termina

    speechRecognition.onresult = (e) => {
      // Converte o results para um array com métodos do array
      const transcription = Array.from(e.results).reduce((text, result) => {
        return text.concat(result[0].transcript); // posição 0 porque só tem uma alternativa - maxAlternatives = 1
      }, '');

      setContent(transcription); // Atualiza o conteúdo com a transcriçãoß
    };

    speechRecognition.onerror = (e) => {
      console.log(e.error);
      setIsRecording(false);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  function setDefault() {
    setContent('');
    setShouldShowOnboarding(true);
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="fixed z-10 bottom-4 right-4 md:bottom-8 md:right-8 p-0.5 outline-none focus-visible:bg-lime-400 bg-lime-400 hover:bg-lime-500 text-slate-500 rounded-full">
        <PlusCircle className="size-10 stroke-1" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          onEscapeKeyDown={setDefault}
          className="overflow-hidden fixed inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-white dark:bg-slate-700 md:rounded-md flex flex-col outline-none z-20"
        >
          <Dialog.Close
            onClick={setDefault}
            className="absolute right-0 top-0 p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-500 dark:hover:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-bl-sm"
          >
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <button
              type="button"
              onClick={setDefault}
              className="absolute left-0 top-0 p-1.5 dark:hover:bg-slate-800 dark:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-br-sm"
            >
              <ChevronLeft className="size-5" />
            </button>

            <Dialog.Title className="text-sm font-semibold text-slate-500 dark:text-slate-300 px-5 pt-10 pb-0">
              Adicionar nota
            </Dialog.Title>

            <div className="flex flex-1 flex-col gap-3 p-5">
              {shouldShowOnboarding ? (
                <Dialog.Description className="leading-relaxed text-lg text-slate-400 dark:text-slate-400 overflow-hidden">
                  Comece{' '}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-medium text-lime-500 dark:text-lime-400 hover:underline underline-offset-2"
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir,{' '}
                  <button
                    onClick={handleStartEditor}
                    className="font-medium text-lime-500 dark:text-lime-400 hover:underline underline-offset-2"
                  >
                    utilize apenas texto
                  </button>
                  .
                </Dialog.Description>
              ) : (
                <div className="flex flex-col gap-4 h-full">
                  <h2>
                    <input
                      className="text-lg leading-6 w-full text-slate-600 dark:text-slate-300 dark:placeholder-slate-500 bg-transparent resize-none flex-1 outline-none "
                      type="text"
                      placeholder="Título da nota"
                      onChange={handleTitleChanged}
                      autoFocus
                    />
                  </h2>

                  <textarea
                    onChange={handleContentChanged}
                    autoFocus
                    placeholder="Nota..."
                    className="leading-6 text-slate-400 dark:text-slate-400 bg-transparent resize-none flex-1 outline-none"
                    value={content}
                  ></textarea>
                </div>
              )}
            </div>

            {isRercording ? (
              <button
                onClick={handleStopRecording}
                type="button"
                className="flex items-center justify-center gap-2 w-full py-4 text-sm outline-none font-medium text-slate-300 bg-slate-900 hover:text-slate-100 focus-visible:bg-slate-950 focus-visible:text-slate-200"
              >
                <span className="inline-block size-3 rounded-full bg-red-500 animate-[pulse_1s_ease-in-out_infinite] " />
                Gravando! (Clique para parar)
              </button>
            ) : (
              <button
                onClick={handleSaveNote}
                disabled={shouldShowOnboarding}
                type="button"
                className="w-full py-4 text-sm outline-none font-medium focus-visible:bg-lime-700 focus-visible:text-lime-200 text-lime-950  bg-lime-400 hover:bg-lime-500 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-600 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
