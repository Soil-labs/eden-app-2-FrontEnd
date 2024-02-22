import { Position } from "@eden/package-graphql/generated";
import { CVUploadGPT } from "@eden/package-ui";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlineFile } from "react-icons/ai";
// import { AiOutlineEyeInvisible } from "react-icons/ai";

interface UploadCVContainerProps {
  setTitleRole: Dispatch<SetStateAction<string>>;
  setTopSkills: Dispatch<SetStateAction<any>>;
  setContent: Dispatch<SetStateAction<any>>;
  handleCvEnd: () => void;
  position: Position;
  editMode: boolean;
}

const UploadCVContainer = ({
  setTitleRole,
  setTopSkills,
  setContent,
  handleCvEnd,
  // eslint-disable-next-line no-unused-vars
  position,
  editMode,
}: UploadCVContainerProps) => {
  const router = useRouter();
  const { positionID } = router.query;

  const handleDataFromCVUploadGPT = (data: any) => {
    const role = data.saveCVtoUser.titleRole;
    const skills = data.saveCVtoUser.mainSkills;

    setTitleRole(role);
    setTopSkills(skills);
    setContent({
      matchPercentage: data.saveCVtoUser.matchPercentage,
      improvementPoints: data.saveCVtoUser.improvementPoints,
      strongFit: data.saveCVtoUser.strongFit,
      growthAreas: data.saveCVtoUser.growthAreas,
      experienceAreas: data.saveCVtoUser.experienceAreas,
    });
  };
  const [recaptcha, setRecaptcha] = useState<string | null>(null);

  return (
    <div className="w-full pt-8">
      <div className="mx-auto mb-6 max-w-2xl">
        <div className="bg-edenGray-100 text-edenGray-900 mb-2 flex h-12 w-12 items-center justify-center rounded-2xl pb-px pl-px">
          <AiOutlineFile size={"1.2rem"} />
        </div>
        <p className="">CV Upload</p>
        <p className="text-edenGray-700 text-xs">
          Upload your CV and Eden will give you personalized feedbacks on it for{" "}
          {position?.name}!
        </p>
      </div>
      <section className="mb-4 flex h-48 w-full flex-col items-center justify-center rounded-md pt-4">
        {!recaptcha && ReCAPTCHA && !editMode ? (
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY || ""}
            onChange={(val: any) => {
              if (val) {
                setRecaptcha(val);
              }
            }}
          />
        ) : (
          <CVUploadGPT
            onDataReceived={handleDataFromCVUploadGPT}
            handleEnd={handleCvEnd}
            positionID={positionID}
          />
        )}
      </section>
    </div>
  );
};

export default UploadCVContainer;
