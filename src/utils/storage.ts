interface IStorage {
    set: (name: string, item: any) => void;
    get: (name: string) => any;
    delete: (name: string) => void;
}

/**
 * Класс используемый для взаимодействия с localStorage
 */
export const Storage: IStorage = {
    /**
     * Добавление элемента в хранилище
     */
    set: (name, item) => {
        localStorage.setItem('guitar_' + name, JSON.stringify(item));
    },
    /**
     * Получение элемента из хранилища
     */
    get: (name) => {
        const item = localStorage.getItem('guitar_' + name);

        if (item) {
            return JSON.parse(item);
        }
    },
    /**
     * Добавление элемента в хранилище
     */
    delete: (name) => {
        localStorage.removeItem('guitar_' + name);
    },
};
