import "./Range.scss";
import type { AppClassProperties } from "../types";
export type RangeProps = {
    updateData: (value: number) => void;
    app: AppClassProperties;
    testId?: string;
};
export declare const Range: ({ updateData, app, testId }: RangeProps) => import("react/jsx-runtime").JSX.Element;
