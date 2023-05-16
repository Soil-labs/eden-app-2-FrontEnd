import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  ChangeEvent,
  // FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsCheckCircle } from "react-icons/bs";
import { toast } from "react-toastify";

import { Loading } from "../../elements";
// export const CV_TO_SUMMARY = gql`
//   mutation ($fields: CVtoSummaryInput!) {
//     CVtoSummary(fields: $fields) {
//       result
//     }
//   }
// `;

export const SAVE_CV_TO_USER = gql`
  mutation SaveCVtoUser($fields: saveCVtoUserInput) {
    saveCVtoUser(fields: $fields) {
      success
    }
  }
`;

export interface ICVUploadGPTProps {
  timePerWeek?: number;
  seed?: string;
}

// eslint-disable-next-line no-unused-vars
export const CVUploadGPT = ({ timePerWeek, seed }: ICVUploadGPTProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [uploadCounter, setUploadCounter] = useState(0);

  // const [summary, setSummary] = useState<string | null>(null);
  const { currentUser } = useContext(UserContext);

  const [SaveCVtoUser] = useMutation(SAVE_CV_TO_USER, {
    // onCompleted({ SaveCVtoUser }) {
    //   console.log("SaveCVtoUser", SaveCVtoUser);
    //   console.log("SaveCVtoUser.result", SaveCVtoUser.result);
    //   setSummary(SaveCVtoUser.result);
    // },
    onCompleted: (data) => {
      console.log("------>", data);

      setUploading(false);
      setUploaded(true);
      toast.success("success");
    },
    onError: (err) => {
      setUploading(false);
      toast.error(err.message);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      //When user tries to upload the same CV the second time
      setUploadCounter((prevCounter) => prevCounter + 1);
      e.target.value = ""; // Clear the file input
    }
  };

  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (file) {
      setUploading(true);

      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64File = ((reader.result as string) || "").split(",")[1];
        const response = await fetch("../api/process-pdf/process-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileBuffer: base64File }),
        });

        if (response.ok) {
          const { text } = await response.json();

          console.log("text.split", text.split(" ").length > 10);

          if (text.split(" ").length > 10) {
            SaveCVtoUser({
              variables: {
                fields: {
                  // cvString: text
                  userID: currentUser?._id,
                  cvContent: text,
                },
              },
            });
            if (fileInput.current) {
              fileInput.current.value = "";
            }
            setFile(null);
          } else {
            toast.error(
              <div className="flex flex-col justify-center space-y-1">
                <div className="text-lg text-black">
                  Please upload a different CV we didn&apos;t identify any text
                  on this one
                </div>
                <div className="text-sm">
                  *Also, feel free to continue without uploading your Resume
                </div>
              </div>
            );
            // toast.info(
            //   "Also, feel free to continue without uploading your Resume"
            // );
            setUploading(false);
            return;
          }

          console.log(text);
        } else {
          const { error } = await response.json();

          console.log("error", error);
        }
      };

      reader.readAsDataURL(file);
    }
  }, [file, uploadCounter]);

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!file) {
  //     return;
  //   }
  //   const reader = new FileReader();

  //   reader.onloadend = async () => {
  //     const base64File = ((reader.result as string) || "").split(",")[1];
  //     const response = await fetch("../api/process-pdf/process-pdf", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ fileBuffer: base64File }),
  //     });

  //     if (response.ok) {
  //       const { text } = await response.json();

  //       SaveCVtoUser({
  //         variables: {
  //           fields: {
  //             // cvString: text
  //             userID: currentUser?._id,
  //             cvContent: text,
  //           },
  //         },
  //       });

  //       console.log(text);
  //     } else {
  //       const { error } = await response.json();

  //       console.log("error aaa", error);
  //     }
  //   };

  //   reader.readAsDataURL(file);
  // };

  // const summaryList = summary
  //   ? summary
  //       .split("•")
  //       .filter((item) => item.trim() !== "")
  //       .map((item, index) => <li key={index}>{item}</li>)
  //   : [];

  // console.log("summaryList", summaryList);

  return (
    <div className="w-fit ">
      <form
        // onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center space-y-2"
      >
        {/* <label>Resume(CV)</label> */}
        {/* <label htmlFor="input" className="text-center text-sm">
          Upload Recent Resume for Better Results Form Our AI
        </label> */}
        <label htmlFor="file-upload" className="relative">
          <div
            className={`cursor-pointer rounded-md border-2 px-4 py-1 hover:border-black hover:bg-black hover:text-white ${
              uploaded
                ? " !cursor-default !border-gray-200 !bg-gray-200 !text-black"
                : ""
            }`}
          >
            Upload .pdf file
          </div>
          {uploaded && (
            <BsCheckCircle
              size={24}
              color="#40f83f"
              className="absolute -right-[40px] top-[6px]"
            />
          )}
        </label>
        <input
          disabled={uploaded}
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInput}
          type="file"
          accept=".pdf"
        ></input>
        {uploading && <Loading title="uploading" />}
        {/* <button
          className="rounded-lg border-2 border-blue-400 px-2 font-bold text-blue-400 hover:border-blue-700 hover:bg-blue-700 hover:text-white"
          type="submit"
        >
          Upload Resume
        </button> */}
      </form>
      {/* {summary ? (
        <div className="ml-2 mt-2 w-fit rounded-md border-2 border-black pl-6 pr-4 ">
          <label htmlFor="ul" className="text-right text-lg font-bold">
            CV Summary:
          </label>
          <ul className="list-outside list-disc space-y-[3px] ">
            {summaryList}
          </ul>
        </div>
      ) : null} */}
    </div>
  );
};
