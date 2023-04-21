class helper {
    static greet(name: string): string {
        return `Hello, ${name}!`;
    }

    static add(a: number, b: number): number {
        return a + b;
    }

    static formatDate(date: Date): string {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
}

export default helper;