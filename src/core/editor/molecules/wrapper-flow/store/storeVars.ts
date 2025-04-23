class StoreSingleton {
    private static instance: StoreSingleton;
    private store: Record<string, boolean> = {};

    private constructor() {
        // Constructor privado para evitar instanciación directa
    }

    public static getInstance(): StoreSingleton {
        if (!StoreSingleton.instance) {
            StoreSingleton.instance = new StoreSingleton();
        }
        return StoreSingleton.instance;
    }

    public get(key: string): boolean | undefined {
        return this.store[key];
    }

    public set(key: string, value: boolean): void {
        this.store[key] = value;
    }

    public getAll(): Record<string, boolean> {
        return this.store;
    }
}

export default StoreSingleton;