import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface AccountFormData {
  // Personal Data
  firstName: string;
  middleName: string;
  lastName: string;
  birthdate: string;
  username: string;
  password: string;
  email: string;
  contactNumber: string;
  gender: string;
  civilStatus: string;
  
  // Address
  currentStreet: string;
  currentProvince: string;
  currentBarangay: string;
  currentCity: string;
  currentPostalCode: string;
  permanentStreet: string;
  permanentProvince: string;
  permanentBarangay: string;
  permanentCity: string;
  permanentPostalCode: string;
  sameAddress: boolean;
  
  // Job Position
  jobPosition: string;
  department: string;
  roleAccess: {
    admin: boolean;
    generalManager: boolean;
    csr: boolean;
    graphicArtist: boolean;
    finance: boolean;
    purchasing: boolean;
    sewer: boolean;
    driver: boolean;
    printer: boolean;
    warehouseManager: boolean;
    screenMaker: boolean;
    qa: boolean;
    packer: boolean;
    cutter: boolean;
    sampleMaker: boolean;
    subordinate: boolean;
  };
  
  // Documents
  pagIbigNo: string;
  sssNo: string;
  philhealthNo: string;
  uploadedFiles: string[];
}

interface AccountFormContextType {
  formData: AccountFormData;
  updateFormData: (data: Partial<AccountFormData>) => void;
  clearFormData: () => void;
}

const initialFormData: AccountFormData = {
  firstName: '',
  middleName: '',
  lastName: '',
  birthdate: '',
  username: '',
  password: '',
  email: '',
  contactNumber: '',
  gender: '',
  civilStatus: '',
  currentStreet: '',
  currentProvince: '',
  currentBarangay: '',
  currentCity: '',
  currentPostalCode: '',
  permanentStreet: '',
  permanentProvince: '',
  permanentBarangay: '',
  permanentCity: '',
  permanentPostalCode: '',
  sameAddress: false,
  jobPosition: '',
  department: '',
  roleAccess: {
    admin: false,
    generalManager: false,
    csr: false,
    graphicArtist: false,
    finance: false,
    purchasing: false,
    sewer: false,
    driver: false,
    printer: false,
    warehouseManager: false,
    screenMaker: false,
    qa: false,
    packer: false,
    cutter: false,
    sampleMaker: false,
    subordinate: false,
  },
  pagIbigNo: '',
  sssNo: '',
  philhealthNo: '',
  uploadedFiles: [],
};

const AccountFormContext = createContext<AccountFormContextType | undefined>(undefined);

export function AccountFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<AccountFormData>(initialFormData);

  const updateFormData = (data: Partial<AccountFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  return (
    <AccountFormContext.Provider value={{ formData, updateFormData, clearFormData }}>
      {children}
    </AccountFormContext.Provider>
  );
}

export function useAccountForm() {
  const context = useContext(AccountFormContext);
  if (!context) {
    throw new Error('useAccountForm must be used within AccountFormProvider');
  }
  return context;
}
