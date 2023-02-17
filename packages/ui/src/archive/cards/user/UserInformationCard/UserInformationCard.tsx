import { Maybe, PreviousProjectsType } from "@eden/package-graphql/generated";
import {
  Button,
  Calendar,
  Card,
  CheckBox,
  Modal,
  TextArea,
  TextField,
} from "@eden/package-ui";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { IoIosExpand } from "react-icons/io";

export interface UserInformationCardProps {
  previousProjects?: Maybe<PreviousProjectsType>;
  isEditable?: boolean;
}

export const UserInformationCard = ({
  previousProjects,
  isEditable,
}: UserInformationCardProps) => {
  const [showExpandModal, setShowExpandModal] = useState(false);
  const [showEditModal, setshowEditModal] = useState(false);
  const [toggleEndDate, setToggleEndDate] = useState(false);

  if (!previousProjects) {
    return null;
  }

  const onExpand = () => {
    setShowExpandModal(true);
  };

  const onEdit = () => {
    setshowEditModal(true);
  };

  return (
    <div>
      <Card shadow>
        <div className={`flex flex-row justify-between justify-items-stretch`}>
          <div>
            <button
              className={`basis-1/8 w-full text-zinc-400`}
              onClick={onExpand}
            >
              <IoIosExpand size="20px" />
            </button>
          </div>
          <div className={`basis-3/4 self-center`}>
            <div
              className={`mb-4 mt-5 flex flex-col content-center items-center justify-center justify-items-center`}
            >
              <div className={`text-xl`}>{previousProjects?.positionName}</div>
              <div className={`text-base text-slate-500`}>
                {previousProjects?.title}
              </div>
              <div className={`mt-1 text-sm text-slate-500`}>
                {previousProjects?.startDate} - {previousProjects?.endDate}
              </div>
            </div>
          </div>
          <div>
            {isEditable ? (
              <button
                className={` basis-1/8 w-full text-zinc-400`}
                onClick={onEdit}
              >
                <FiEdit3 size="20px" />
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Card>
      <Modal open={showExpandModal} closeOnEsc={true}>
        <div className={`relative`}>
          <div className={`font-poppins my-2 text-left text-xl font-semibold`}>
            <span>{previousProjects.positionName}</span>
          </div>
          <div className={`text-base text-slate-500`}>
            {previousProjects?.title}
          </div>
          <div className={`mt-1 text-sm text-slate-500`}>
            {previousProjects?.startDate} - {previousProjects?.endDate}
          </div>
          <div className={`mx-1 mt-3 text-lg text-slate-700`}>
            {previousProjects?.description}
          </div>
        </div>
      </Modal>
      <Modal open={showEditModal} closeOnEsc={true}>
        <div className={``}>
          <div className={`font-poppins my-2 text-left text-xl`}>
            <TextField
              label="Position Name"
              value={String(previousProjects.positionName)}
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
          <div className={`font-poppins my-4 text-left text-xl`}>
            <TextField
              label="Position Title"
              value={String(previousProjects.title)}
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
          <div className={`mt-4`}>
            <div className="text-sm font-normal text-gray-700">
              Duration Of Work
            </div>
            <div>
              <CheckBox
                label="Currently Working Here"
                onChange={() => setToggleEndDate(!toggleEndDate)}
              />
            </div>
            <div className="mt-2 flex flex-row content-between justify-evenly">
              <Calendar label="Start Date" timePicker={false} />
              {!toggleEndDate ? (
                <Calendar label="End Date" timePicker={false} />
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className={`mx-1 mt-4 text-lg text-slate-700`}>
            <div className="text-sm font-normal text-gray-700">Description</div>
            <TextArea
              placeholder={`Start typing here`}
              rows={8}
              value={String(previousProjects.description)}
              onChange={(e) => console.log(e.target.value)}
            />
          </div>

          <div className={`bottom-2 mt-8  flex w-full justify-between`}>
            <Button variant={`default`} onClick={() => console.log("asas")}>
              Cancel
            </Button>
            <Button variant={`primary`} onClick={() => console.log("asas")}>
              Save Information
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
