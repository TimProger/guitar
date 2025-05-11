export interface IMidi {
    file_name: string;
    id: string;
}

export interface IMidiResponse {
    midi_files: IMidi[];
}
