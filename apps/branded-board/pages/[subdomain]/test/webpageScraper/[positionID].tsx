import { gql, useMutation } from "@apollo/client";
// import { UserContext } from "@eden/package-context";
import { Button, TextArea } from "@eden/package-ui";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

export const WEBPAGE_TO_MEMORY = gql`
  mutation ($fields: websiteToMemoryCompanyInput!) {
    websiteToMemoryCompany(fields: $fields) {
      report
    }
  }
`;

const LinkedInScraper = () => {
  const [webpageLink, setWebpageLink] = useState("");
  const [pastedText, setPastedText] = useState("");

  const router = useRouter();
  const { positionID } = router.query;

  // const [webPageText, setWebPageText] = useState("");
  const [scraping, setScraping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);

  // const { currentUser } = useContext(UserContext);

  const [websiteToMemoryCompany] = useMutation(WEBPAGE_TO_MEMORY, {
    onCompleted({ websiteToMemoryCompany }) {
      console.log(
        "websiteToMemoryCompany.report",
        websiteToMemoryCompany.report
      );
      let jobDescription = websiteToMemoryCompany.report.replace(/<|>/g, "");

      //Change - to •
      jobDescription = jobDescription.replace(/-\s/g, "• ");

      setReport(jobDescription);

      setScraping(false);
    },
  });

  const handleWebpageLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWebpageLink(e.target.value);
  };

  const handlePastedTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
  };

  const handleLinkSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setScraping(true);

    const queryParams = new URLSearchParams({ url: webpageLink }).toString();

    try {
      const response = await fetch(
        `/api/webpage_scraper/webpage_scraper?${queryParams}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        let error;

        try {
          const { error: serverError } = await response.json();

          error = serverError;
        } catch (jsonError) {
          error = "An error occurred while decoding the response JSON";
        }
        setError(`HTTP error! status: ${response.status}, error: ${error}`);
        throw new Error(
          `HTTP error! status: ${response.status}, error: ${error}`
        );
      }

      console.log("API response:", response);

      const { textResponse } = await response.json();

      websiteToMemoryCompany({
        variables: {
          // fields: { message: textResponse, userID: currentUser?._id },
          fields: {
            message: textResponse,
            positionID: positionID,
          },
        },
      });

      // setReport(textResponse);
    } catch (error) {
      setError(
        `An error occurred while fetching the LinkedIn profile: ${
          (error as Error).message
        }
        
        Please copy the text from the job post page manually and paste it in the textfield below`
      );
    }
  };

  const handleTextSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setScraping(true);
    console.log("pastedText", pastedText);

    websiteToMemoryCompany({
      variables: {
        fields: { message: pastedText, positionID: positionID },
      },
    });
    setPastedText("");
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <form
        className=" flex flex-col items-center  space-y-2"
        onSubmit={handleLinkSubmit}
      >
        <label>Extract Text From Page</label>
        <input
          className="w-96 border-2 border-black pl-1"
          onChange={handleWebpageLinkChange}
          placeholder="https://www.example.com"
        />
        <Button
          variant="primary"
          className="w-fit"
          type="submit"
          loading={scraping}
        >
          Submit Link
        </Button>
        {report && <div className="whitespace-pre-wrap">{report}</div>}
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <form
        className="flex w-3/12 flex-col items-center  space-y-2"
        onSubmit={handleTextSubmit}
      >
        <label>Paste the text from the Position Page Here</label>

        <TextArea
          value={pastedText}
          rows={15}
          onChange={handlePastedTextChange}
        />
        <Button variant="primary" type="submit">
          Submit Text
        </Button>
      </form>
    </div>
  );
};

export default LinkedInScraper;
