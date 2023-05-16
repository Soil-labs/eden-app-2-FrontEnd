import { Button } from "@eden/package-ui";
import { ChangeEvent, FormEvent, useState } from "react";

const LinkedInScraper = () => {
  const [profileLink, setProfileLink] = useState("");
  const [linkedInText, setLinkedInText] = useState("");
  const [scraping, setScraping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileLink(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setScraping(true);

    const queryParams = new URLSearchParams({ url: profileLink }).toString();

    try {
      const response = await fetch(
        `/api/linkedin_scraper_api/linkedin_scraper?${queryParams}`,
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

      const { profileText } = await response.json();

      setLinkedInText(profileText);
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
        <label>LinkedIn Profile</label>
        <input
          className="w-96 border-2 border-black pl-1"
          onChange={handleProfileLinkChange}
          placeholder="https://www.linkedin.com/in/example/"
        />
        <Button
          variant="primary"
          className="w-fit"
          type="submit"
          loading={scraping}
        >
          Submit
        </Button>
        {linkedInText && <div>{linkedInText}</div>}
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </>
  );
};

export default LinkedInScraper;
