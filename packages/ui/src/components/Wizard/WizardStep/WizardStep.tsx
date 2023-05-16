export interface IWizardStepProps {
  label: string;
  children: React.ReactNode;
  nextDisabled?: boolean;
}

// eslint-disable-next-line no-unused-vars
export const WizardStep = ({
  children,
  // eslint-disable-next-line no-unused-vars
  label,
  // eslint-disable-next-line no-unused-vars
  nextDisabled = false,
}: IWizardStepProps) => {
  return <section className="h-full">{children}</section>;
};
