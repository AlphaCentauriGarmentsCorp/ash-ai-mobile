// Main API exports
export { additionalOptionsApi, type AdditionalOption, type CreateAdditionalOptionRequest, type UpdateAdditionalOptionRequest } from './additionalOptions';
export { apparelTypeApi, type ApparelType, type CreateApparelTypeRequest, type UpdateApparelTypeRequest } from './apparelType';
export { authApi } from './auth';
export { apiClient } from './client';
export { clientsApi } from './clients';
export { default as API_CONFIG } from './config';
export { dropdownsApi, type DropdownOption } from './dropdowns';
export { dropdownSettingsApi, type CreateDropdownSettingRequest, type DropdownSetting, type DropdownSettingType, type UpdateDropdownSettingRequest } from './dropdownSettings';
export { freebiesApi, type CreateFreebieRequest, type Freebie, type UpdateFreebieRequest } from './freebies';
export { materialApi, supplierApi, type CreateSupplierRequest, type Material, type Supplier } from './materialSuppliers';
export { orderApi } from './order';
export { patternTypeApi, type CreatePatternTypeRequest, type PatternType, type UpdatePatternTypeRequest } from './patternType';
export { placementMeasurementApi, type CreatePlacementMeasurementRequest, type PlacementMeasurement, type UpdatePlacementMeasurementRequest } from './placementMeasurement';
export { printLabelPlacementApi, type CreatePrintLabelPlacementRequest, type PrintLabelPlacement, type UpdatePrintLabelPlacementRequest } from './printLabelPlacement';
export { printMethodApi, type CreatePrintMethodRequest, type PrintMethod, type UpdatePrintMethodRequest } from './printMethod';
export { serviceTypeApi, type CreateServiceTypeRequest, type ServiceType, type UpdateServiceTypeRequest } from './serviceType';
export { uploadApi } from './upload';

// Services
export * from '../services';

// Types
export * from './types';

