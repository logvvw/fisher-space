export declare class Topic {
    id: number;
    name: string;
    description?: string;
    coverImage?: string;
    color: string;
    postCount: number;
    followCount: number;
    viewCount: number;
    isHot: boolean;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}
