export type Animation<R extends object> = (params: {
    deltaTime: number;
    state?: R;
}) => R | null | undefined;
export declare class AnimationController {
    private static isRunning;
    private static animations;
    static start<R extends object>(key: string, animation: Animation<R>): void;
    private static tick;
    static running(key: string): boolean;
    static cancel(key: string): void;
}
