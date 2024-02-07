import {
  BrandedSaasUserLayout,
  Card,
  SEO,
  Wizard,
  WizardStep,
} from "@eden/package-ui";

import type { NextPageWithLayout } from "../../_app";

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <SEO />
      <Card className="mx-auto mt-3 h-[88vh] w-full max-w-5xl bg-white" shadow>
        <div className="w-full p-8">
          <Wizard showStepsHeader>
            <WizardStep label={"questions"}>
              <h3>Questions</h3>
            </WizardStep>
            <WizardStep label={"responses"}>
              <h3>Responses</h3>
            </WizardStep>
            <WizardStep label={"summary"}>
              <h3>Summary</h3>
            </WizardStep>
          </Wizard>
        </div>
      </Card>
    </>
  );
};

HomePage.getLayout = (page) => (
  <BrandedSaasUserLayout>{page}</BrandedSaasUserLayout>
);

export default HomePage;
