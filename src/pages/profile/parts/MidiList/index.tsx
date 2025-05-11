import React, { useRef } from 'react';
import s from './styles.module.scss';
import { IMidi } from '../../../../types/midi.types';
import { $api } from '../../../../http/axios';
import MidiPlayer from 'midi-player-js';

interface MidiListProps {
    midiFiles: IMidi[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const MidiList: React.FC<MidiListProps> = ({
    midiFiles,
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const playerRef = useRef<MidiPlayer.Player | null>(null);
    // const synthRef = useRef<Tone.PolySynth | null>(null);

    // useEffect(() => {
    //     // Инициализируем синтезатор
    //     synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();

    //     // Инициализируем MIDI плеер с обработчиком событий
    //     playerRef.current = new MidiPlayer.Player((event: any) => {
    //         if (event.name === 'Note on' && event.velocity > 0) {
    //             // Преобразуем MIDI ноту в частоту
    //             const note = Tone.Frequency(event.noteNumber, 'midi').toNote();
    //             synthRef.current?.triggerAttack(note, undefined, event.velocity / 127);
    //         } else if (
    //             event.name === 'Note off' ||
    //             (event.name === 'Note on' && event.velocity === 0)
    //         ) {
    //             const note = Tone.Frequency(event.noteNumber, 'midi').toNote();
    //             synthRef.current?.triggerRelease(note);
    //         }
    //     });

    //     return () => {
    //         // Очистка при размонтировании
    //         playerRef.current?.stop();
    //         synthRef.current?.dispose();
    //     };
    // }, []);

    const handlePlay = async (fileId: string | number) => {
        try {
            const response = await $api.get('/midi/get', {
                params: { file_id: fileId },
                responseType: 'arraybuffer',
            });

            // Создаем новый плеер, если его еще нет
            if (!playerRef.current) {
                playerRef.current = new MidiPlayer.Player();
            }

            // Останавливаем предыдущее воспроизведение
            playerRef.current.stop();

            // Загружаем и воспроизводим MIDI
            playerRef.current.loadArrayBuffer(response.data);
            playerRef.current.play();
        } catch (error) {
            console.error('Error playing MIDI file:', error);
        }
    };

    return (
        <div className={s.midiList}>
            <h2>Мои MIDI-файлы</h2>
            <div className={s.list}>
                {midiFiles.map((midi) => (
                    <div key={midi.id} className={s.midiItem}>
                        <div className={s.midiInfo}>
                            <h3>{midi.file_name}</h3>
                            {/* <p>Создан: {formatDate(midi.created_at)}</p> */}
                        </div>
                        <div className={s.midiActions}>
                            <button className={s.playButton} onClick={() => handlePlay(midi.id)}>
                                Воспроизвести
                            </button>
                            <button className={s.downloadButton}>Скачать</button>
                        </div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className={s.pagination}>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={s.pageButton}
                    >
                        Назад
                    </button>
                    <span className={s.pageInfo}>
                        Страница {currentPage} из {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={s.pageButton}
                    >
                        Вперед
                    </button>
                </div>
            )}
        </div>
    );
};

export default MidiList;
