import { PricingType } from '../entities/pricing.entity';
export declare class CreatePricingDto {
    type: PricingType;
    price: number;
    unit?: string;
    description?: string;
    isActive?: boolean;
}
export declare class UpdatePricingDto {
    type?: PricingType;
    price?: number;
    unit?: string;
    description?: string;
    isActive?: boolean;
}
