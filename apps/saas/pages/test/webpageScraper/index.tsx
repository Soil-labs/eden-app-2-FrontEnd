import { Button } from "@eden/package-ui";
import { ChangeEvent, FormEvent, useState } from "react";

const LinkedInScraper = () => {
  const [webpageLink, setWebpageLink] = useState("");
  const [webPageText, setWebPageText] = useState("");
  const [scraping, setScraping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleWebpageLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWebpageLink(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

      const { text } = await response.json();

      console.log("profileText", text);

      setWebPageText(text);
    } catch (error) {
      setError(
        `An error occurred while fetching the LinkedIn profile: ${
          (error as Error).message
        }`
      );
    } finally {
      setScraping(false);
    }
  };

  return (
    <>
      <form
        className=" flex flex-col items-center  space-y-2"
        onSubmit={handleSubmit}
      >
        <label>Extract Text From Page</label>
        <input
          className="w-96 border-2 border-black pl-1"
          onChange={handleWebpageLinkChange}
          placeholder="https://www.exapmple.com"
        />
        <Button
          variant="primary"
          className="w-fit"
          type="submit"
          loading={scraping}
        >
          Submit
        </Button>
        {webPageText && <div>{webPageText}</div>}
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </>
  );
};

export default LinkedInScraper;
