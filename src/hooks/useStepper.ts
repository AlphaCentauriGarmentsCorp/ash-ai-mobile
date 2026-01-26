import { useState } from 'react';

interface UseStepperProps {
  initialStep?: number;
  totalSteps: number;
}

interface UseStepperReturn {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoBack: boolean;
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToFirstStep: () => void;
  goToLastStep: () => void;
  reset: () => void;
}

export function useStepper({
  initialStep = 0,
  totalSteps,
}: UseStepperProps): UseStepperReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const canGoNext = currentStep < totalSteps - 1;
  const canGoBack = currentStep > 0;

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (canGoNext) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (canGoBack) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToFirstStep = () => {
    setCurrentStep(0);
  };

  const goToLastStep = () => {
    setCurrentStep(totalSteps - 1);
  };

  const reset = () => {
    setCurrentStep(initialStep);
  };

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoBack,
    goToStep,
    nextStep,
    previousStep,
    goToFirstStep,
    goToLastStep,
    reset,
  };
}

export default useStepper;
