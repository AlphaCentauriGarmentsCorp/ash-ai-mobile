import { dropdownsApi, type DropdownOption } from '@api';
import { FormDropdownOption } from '@components/common/FormDropdown';
import { useEffect, useState } from 'react';

export interface DropdownData {
  apparelTypes: FormDropdownOption[];
  patternTypes: FormDropdownOption[];
  serviceTypes: FormDropdownOption[];
  printMethods: FormDropdownOption[];
  sizeLabels: FormDropdownOption[];
  printLabelPlacements: FormDropdownOption[];
  materials: FormDropdownOption[];
  additionalOptions: FormDropdownOption[];
  freebies: FormDropdownOption[];
  placementMeasurements: FormDropdownOption[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDropdownData = (): DropdownData => {
  const [apparelTypes, setApparelTypes] = useState<FormDropdownOption[]>([]);
  const [patternTypes, setPatternTypes] = useState<FormDropdownOption[]>([]);
  const [serviceTypes, setServiceTypes] = useState<FormDropdownOption[]>([]);
  const [printMethods, setPrintMethods] = useState<FormDropdownOption[]>([]);
  const [sizeLabels, setSizeLabels] = useState<FormDropdownOption[]>([]);
  const [printLabelPlacements, setPrintLabelPlacements] = useState<FormDropdownOption[]>([]);
  const [materials, setMaterials] = useState<FormDropdownOption[]>([]);
  const [additionalOptions, setAdditionalOptions] = useState<FormDropdownOption[]>([]);
  const [freebies, setFreebies] = useState<FormDropdownOption[]>([]);
  const [placementMeasurements, setPlacementMeasurements] = useState<FormDropdownOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convertToFormOptions = (items: DropdownOption[]): FormDropdownOption[] => {
    return items.map(item => ({
      label: item.name,
      value: item.id.toString(),
    }));
  };

  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        apparelTypesRes,
        patternTypesRes,
        serviceTypesRes,
        printMethodsRes,
        sizeLabelsRes,
        printLabelPlacementsRes,
        materialsRes,
        additionalOptionsRes,
        freebiesRes,
        placementMeasurementsRes,
      ] = await Promise.allSettled([
        dropdownsApi.getApparelTypes(),
        dropdownsApi.getPatternTypes(),
        dropdownsApi.getServiceTypes(),
        dropdownsApi.getPrintMethods(),
        dropdownsApi.getSizeLabels(),
        dropdownsApi.getPrintLabelPlacements(),
        dropdownsApi.getMaterials(),
        dropdownsApi.getAdditionalOptions(),
        dropdownsApi.getFreebies(),
        dropdownsApi.getPlacementMeasurements(),
      ]);

      // Process results
      if (apparelTypesRes.status === 'fulfilled' && apparelTypesRes.value.success) {
        setApparelTypes(convertToFormOptions(apparelTypesRes.value.data));
      } else {
        console.warn('Failed to load apparel types');
      }

      if (patternTypesRes.status === 'fulfilled' && patternTypesRes.value.success) {
        setPatternTypes(convertToFormOptions(patternTypesRes.value.data));
      } else {
        console.warn('Failed to load pattern types');
      }

      if (serviceTypesRes.status === 'fulfilled' && serviceTypesRes.value.success) {
        setServiceTypes(convertToFormOptions(serviceTypesRes.value.data));
      } else {
        console.warn('Failed to load service types');
      }

      if (printMethodsRes.status === 'fulfilled' && printMethodsRes.value.success) {
        setPrintMethods(convertToFormOptions(printMethodsRes.value.data));
      } else {
        console.warn('Failed to load print methods');
      }

      if (sizeLabelsRes.status === 'fulfilled' && sizeLabelsRes.value.success) {
        setSizeLabels(convertToFormOptions(sizeLabelsRes.value.data));
      } else {
        console.warn('Failed to load size labels');
      }

      if (printLabelPlacementsRes.status === 'fulfilled' && printLabelPlacementsRes.value.success) {
        setPrintLabelPlacements(convertToFormOptions(printLabelPlacementsRes.value.data));
      } else {
        console.warn('Failed to load print label placements');
      }

      if (materialsRes.status === 'fulfilled' && materialsRes.value.success) {
        setMaterials(convertToFormOptions(materialsRes.value.data));
      } else {
        console.warn('Failed to load materials');
      }

      // Override additional options API data with business-specific data
      // API returns test data ("Lavinia Kidd") instead of actual business options
      console.log('Using business-specific additional options (API has test data)');
      const businessAdditionalOptions = [
        { label: "Collar", value: "collar" },
        { label: "Cuffs", value: "cuffs" },
        { label: "Combi", value: "combi" },
        { label: "Bias Tape", value: "bias_tape" },
        { label: "Side Slit", value: "side_slit" },
        { label: "Flatbed", value: "flatbed" },
        { label: "Buttons", value: "buttons" },
        { label: "Zipper", value: "zipper" },
        { label: "Linings", value: "linings" },
        { label: "Pangiti", value: "pangiti" },
        { label: "Sleeveless", value: "sleeveless" },
        { label: "Longsleeves", value: "longsleeves" },
        { label: "3/4 Sleeves", value: "three_quarter_sleeves" },
        { label: "Pocket", value: "pocket" },
        { label: "Kangaroo Pocket", value: "kangaroo_pocket" },
        { label: "Reversible", value: "reversible" },
        { label: "Raglan", value: "raglan" },
        { label: "Hooded", value: "hooded" },
        { label: "Long Tee", value: "long_tee" },
        { label: "Batok", value: "batok" }
      ];
      setAdditionalOptions(businessAdditionalOptions);

      if (freebiesRes.status === 'fulfilled' && freebiesRes.value.success) {
        setFreebies(convertToFormOptions(freebiesRes.value.data));
      } else {
        console.warn('Failed to load freebies from API, using fallback data');
        // Fallback data only when API fails
        const fallbackFreebies = [
          { label: "Stickers", value: "sticker" },
          { label: "Keychain", value: "keychain" },
          { label: "Tote Bag", value: "tote_bag" },
          { label: "Cap/Hat", value: "hat" },
          { label: "None", value: "none" }
        ];
        setFreebies(fallbackFreebies);
      }

      if (placementMeasurementsRes.status === 'fulfilled' && placementMeasurementsRes.value.success) {
        setPlacementMeasurements(convertToFormOptions(placementMeasurementsRes.value.data));
      } else {
        console.warn('Failed to load placement measurements from API, using fallback data');
        // Fallback data only when API fails
        const fallbackPlacementMeasurements = [
          { label: "Center Chest", value: "center_chest" },
          { label: "Left Chest", value: "left_chest" },
          { label: "Full Front", value: "full_front" },
          { label: "Center Back", value: "center_back" },
          { label: "Upper Back", value: "upper_back" },
          { label: "Short Sleeve", value: "short_sleeve" },
          { label: "Long Sleeve", value: "long_sleeve" },
          { label: "Neck Label", value: "neck_label" },
          { label: "Side Seam Label", value: "side_seam_label" },
          { label: "Hem Label", value: "hem_label" }
        ];
        setPlacementMeasurements(fallbackPlacementMeasurements);
      }

      // Check if any requests failed
      const failedRequests = [
        apparelTypesRes,
        patternTypesRes,
        serviceTypesRes,
        printMethodsRes,
        sizeLabelsRes,
        printLabelPlacementsRes,
        materialsRes,
        additionalOptionsRes,
        freebiesRes,
        placementMeasurementsRes,
      ].filter(res => res.status === 'rejected');

      if (failedRequests.length > 0) {
        console.warn(`${failedRequests.length} dropdown API endpoints failed`);
        setError(`Failed to load ${failedRequests.length} dropdown categories`);
      }

    } catch (error: any) {
      console.error('Error fetching dropdown data:', error);
      setError('Failed to load dropdown options');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  return {
    apparelTypes,
    patternTypes,
    serviceTypes,
    printMethods,
    sizeLabels,
    printLabelPlacements,
    materials,
    additionalOptions,
    freebies,
    placementMeasurements,
    loading,
    error,
    refetch: fetchDropdownData,
  };
};