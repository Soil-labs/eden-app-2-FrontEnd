import { UserProvider } from "@eden/package-context";
import {
  AppUserLayout,
  CreateProjectViews1,
  CreateProjectViews2,
  CreateProjectViews3,
  CreateProjectViews4,
  CreateProjectViews5,
  CreateProjectViews6,
  GridItemSix,
  GridLayout,
  SEO,
} from "@eden/package-ui";
import { useEffect, useState } from "react";

import { NextPageWithLayout } from "../../_app";

const FillProfilePage: NextPageWithLayout = () => {
  const [step, setStep] = useState(1);

  const [state, setState] = useState<any>({});

  const onNext = (data: any) => {
    setState((prev: any) => ({ ...prev, [step]: data }));
    setStep((prev) => prev + 1);
  };

  const stepView = () => {
    switch (step) {
      case 1:
        return <CreateProjectViews1 onNext={onNext} />;

      case 2:
        return (
          <CreateProjectViews2
            onNext={onNext}
            onBack={() => setStep((prev) => prev - 1)}
          />
        );
      case 3:
        return (
          <CreateProjectViews3
            onNext={onNext}
            onSkip={() => setStep((prev) => prev + 1)}
            onBack={() => setStep((prev) => prev - 1)}
          />
        );
      case 4:
        return (
          <CreateProjectViews4
            onNext={onNext}
            onBack={() => setStep((prev) => prev - 1)}
          />
        );
      case 5:
        return (
          <CreateProjectViews5
            onNext={onNext}
            onBack={() => setStep((prev) => prev - 1)}
          />
        );
      case 6:
        return (
          <CreateProjectViews6
            onNext={() => null}
            onLaunch={() => null}
            onNewPosition={() => null}
            onBack={() => setStep((prev) => prev - 1)}
          />
        );

      default:
        <div />;
        break;
    }
  };

  useEffect(() => {
    console.info({ state });
  }, [state]);

  return (
    <>
      <SEO />
      <GridLayout>
        <GridItemSix>{stepView()}</GridItemSix>

        <GridItemSix>
          <div />
        </GridItemSix>
      </GridLayout>
    </>
  );
};

FillProfilePage.getLayout = (page) => (
  <AppUserLayout>
    <UserProvider>{page}</UserProvider>
  </AppUserLayout>
);

export default FillProfilePage;
