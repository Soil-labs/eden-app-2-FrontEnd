import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT } from "@eden/package-graphql";
import { Mutation, Project } from "@eden/package-graphql/generated";
import {
  Button,
  EmojiSelector,
  Modal,
  SocialMediaInput,
  TextArea,
  TextField,
} from "@eden/package-ui";
import { useEffect, useState } from "react";

export interface IEditProjectModalProps {
  project?: Project;
  showModal?: boolean;
  onClose?: () => void;
}

export const EditProjectModal = ({
  project,
  showModal,
  onClose,
}: IEditProjectModalProps) => {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");
  const [backColorEmoji, setBackColorEmoji] = useState("#ffffff");
  const [descriptionOneLine, setDescriptionOneLine] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [links, setLinks] = useState<{
    github: string | "";
    twitter: string | "";
    notion: string | "";
  }>({
    github: "",
    twitter: "",
    notion: "",
  });

  useEffect(() => {
    if (project) {
      setTitle(project?.title as string);
      setEmoji(project?.emoji as string);
      setBackColorEmoji((project?.backColorEmoji as string) || "#ffffff");
      setDescriptionOneLine(project?.descriptionOneLine as string);
      setDescription(project?.description as string);
      const twitter = project?.collaborationLinks?.find(
        (link) => link?.title === "twitter"
      );

      const github = project?.collaborationLinks?.find(
        (link) => link?.title === "github"
      );

      const notion = project?.collaborationLinks?.find(
        (link) => link?.title === "notion"
      );

      setLinks({
        twitter: twitter?.link as string,
        github: github?.link as string,
        notion: notion?.link as string,
      });
    }
  }, [project]);

  const [updateProject, {}] = useMutation(UPDATE_PROJECT, {
    onCompleted({ updateProject }: Mutation) {
      if (!updateProject) console.log("updateProject is null");
      //   console.log(updateProject);
      onClose && onClose();
      setTimeout(() => {
        setSubmitting(false);
      }, 2000);
    },
  });

  const handleSubmit = () => {
    setSubmitting(true);
    updateProject({
      variables: {
        fields: {
          _id: project?._id,
          title,
          description,
          descriptionOneLine,
          emoji,
          backColorEmoji,
          collaborationLinks: [
            {
              title: "twitter",
              link: links.twitter,
            },
            {
              title: "github",
              link: links.github,
            },
            {
              title: "notion",
              link: links.notion,
            },
          ],
        },
      },
    });
  };

  return (
    <Modal open={showModal} onClose={onClose}>
      <div className={`h-7/10 flex w-full flex-col justify-start px-2`}>
        <div>
          <div className="mb-5">
            <span className="text-base font-semibold tracking-wide">
              Edit Project
            </span>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="col-span-1">
              <div>
                <TextField
                  label={`Project Name`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Start typing here"
                  radius="rounded"
                  maxLength={100}
                />
              </div>
              <div className={`m-6 flex justify-between`}>
                <div className={``}>
                  <div className={`block text-sm font-medium text-gray-700`}>
                    Project Icon
                  </div>
                  <div className={`mx-2`}>
                    <EmojiSelector
                      emoji={emoji}
                      onSelection={(value) => setEmoji(value)}
                    />
                  </div>
                </div>
                <div>
                  <div className={`block text-sm font-medium text-gray-700`}>
                    Icon Background
                  </div>
                  <div className="mx-auto flex h-[60px] w-[60px] items-center overflow-hidden rounded-full border-2 border-zinc-400/50">
                    <input
                      type="color"
                      className="-m-2 h-[100px] w-[100px] cursor-pointer"
                      value={backColorEmoji}
                      onChange={(e) => setBackColorEmoji(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <TextField
                  label={`One liner:`}
                  value={descriptionOneLine}
                  onChange={(e) => setDescriptionOneLine(e.target.value)}
                  placeholder="Start typing here"
                  radius="rounded"
                  maxLength={100}
                />
              </div>
              <div className="mt-3">
                <TextArea
                  name="description"
                  label={`Short description:`}
                  value={description}
                  placeholder={`Start typing here`}
                  rows={5}
                  className="border-1 text-xs"
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={280}
                />
              </div>
            </div>
            <div className="flex-start flex flex-col">
              <div>
                <span className="text-sm font-semibold tracking-wide">
                  Change links for project:
                </span>
              </div>
              <SocialMediaInput
                platform={`twitter`}
                shape={`rounded`}
                value={links?.twitter as string}
                onChange={(e) => {
                  setLinks({ ...links, twitter: e.target.value });
                }}
              />
              <SocialMediaInput
                platform={`github`}
                shape={`rounded`}
                value={links?.github as string}
                onChange={(e) => {
                  setLinks({ ...links, github: e.target.value });
                }}
              />
              <SocialMediaInput
                platform={`notion`}
                shape={`rounded`}
                value={links?.notion as string}
                onChange={(e) => {
                  setLinks({ ...links, notion: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        <div className={`bottom-2 mt-auto flex w-full justify-center`}>
          {!submitting && (
            <Button
              variant={`primary`}
              onClick={handleSubmit}
              disabled={submitting}
            >
              Confirm
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
