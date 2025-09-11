export enum ElementType {
    Expression = 'expression',
    Gesture = 'gesture',
    Action = 'action',
    Object = 'object',
    Style = 'style',
    Location = 'location',
}

export type ElementImage = {
    [key in ElementType]?: File | null;
};

export interface ElementDefinition {
    id: ElementType;
    label: string;
}
