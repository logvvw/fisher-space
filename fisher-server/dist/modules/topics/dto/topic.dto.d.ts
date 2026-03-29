export declare class CreateTopicDto {
    name: string;
    description?: string;
    coverImage?: string;
    color?: string;
    isHot?: boolean;
    status?: 'active' | 'inactive';
}
export declare class UpdateTopicDto {
    name?: string;
    description?: string;
    coverImage?: string;
    color?: string;
    isHot?: boolean;
    status?: 'active' | 'inactive';
}
