import React, { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { IMidi, IMidiResponse } from '../../types/midi.types';
import MidiList from './parts/MidiList';
import s from './styles.module.scss';
import { $api } from '../../http/axios';

const ProfilePage: React.FC = () => {
    const { user, isLoading } = useUser();
    const navigate = useNavigate();
    const [midiFiles, setMidiFiles] = useState<IMidi[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, _setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/?login=true');
            return;
        }

        if (user) {
            const fetchMidiFiles = async () => {
                try {
                    const response = await $api.get<IMidiResponse>('/midi/user-midi', {
                        params: {
                            user_id: user.id,
                            page: currentPage,
                            limit,
                        },
                    });

                    setMidiFiles(response.data.midi_files);
                } catch (error) {
                    console.error('Error fetching MIDI files:', error);
                }
            };

            fetchMidiFiles();
        }
    }, [user, currentPage, navigate, isLoading]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return <div className={s.loading}>Загрузка...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className={s.profile}>
            <div className={s.userInfo}>
                <h1>Профиль</h1>
                <p>
                    Email: <span>{user.email}</span>
                </p>
            </div>
            <MidiList
                midiFiles={midiFiles}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ProfilePage;
