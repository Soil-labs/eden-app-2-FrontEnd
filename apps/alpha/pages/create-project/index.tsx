import { Project } from "@eden/package-graphql/generated";
import {
  AppUserLayout,
  Card,
  CreateProjectContainer,
  GridItemSix,
  GridLayout,
  SEO,
  ViewProjectContainer,
} from "@eden/package-ui";
import { PROJECT_STEPS } from "@eden/package-ui/utils/enums/fill-project-steps";
import { useState } from "react";

import { NextPageWithLayout } from "../_app";

const CreateProjectPage: NextPageWithLayout = () => {
  const [step, setStep] = useState(PROJECT_STEPS.START);
  const [project, setProject] = useState<Project>();

  const [roleIndex, setRoleIndex] = useState<number>(0);

  return (
    <>
      <SEO />
      <GridLayout>
        <GridItemSix>
          <CreateProjectContainer
            step={step}
            state={project}
            setState={setProject}
            setStep={setStep}
            roleIndex={roleIndex}
            onSetRoleIndex={setRoleIndex}
          />
        </GridItemSix>
        <GridItemSix>
          <Card shadow className={"h-85 bg-white"}>
            <ViewProjectContainer
              step={step}
              project={{
                ...project,
              }}
              roleIndex={roleIndex}
              onSetRoleIndex={setRoleIndex}
            />
          </Card>
        </GridItemSix>
      </GridLayout>
    </>
  );
};

CreateProjectPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default CreateProjectPage;
