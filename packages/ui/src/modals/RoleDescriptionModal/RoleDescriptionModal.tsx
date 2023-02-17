import { RoleType } from "@eden/package-graphql/generated";
import {
  Button,
  Dropdown,
  Modal,
  SwitchButton,
  TextArea,
  TextField,
  TextHeading3,
} from "@eden/package-ui";
import { useState } from "react";

export interface RoleDescriptionModalInterface {
  isModalOpen: boolean;
  roles: any;
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (val: any) => void;
}

export const RoleDescriptionModal = ({
  roles,
  isModalOpen,
  handleSubmit,
}: RoleDescriptionModalInterface) => {
  const [selectedRole, setSelectedRole] = useState({ title: null, _id: null });
  const [modifiedRoles, setModifiedRoles] = useState(roles);
  const [unpaid, setUnpaid] = useState(false);

  const handleChangeDescription = (e: any) => {
    const newRoles = modifiedRoles.map((role: RoleType) => {
      if (role._id !== selectedRole._id) return role;
      return {
        ...role,
        description: e.target.value,
      };
    });

    setModifiedRoles(newRoles);
  };

  const handleChangeResponsibility = (val: any) => {
    const newRoles = modifiedRoles.map((role: RoleType) => {
      if (role._id !== selectedRole._id) return role;
      return {
        ...role,
        keyResponsibilities: val,
      };
    });

    setModifiedRoles(newRoles);
  };

  const handleSetHoursPerWeek = (e: any) => {
    const newRoles = modifiedRoles.map((role: RoleType) => {
      if (role._id !== selectedRole._id) return role;
      return {
        ...role,
        hoursPerWeek: Number(e.target.value),
      };
    });

    setModifiedRoles(newRoles);
  };

  const handleChangeOpenPositions = (val: any) => {
    const newRoles = modifiedRoles.map((role: RoleType) => {
      if (role._id !== selectedRole._id) return role;
      return {
        ...role,
        openPositions: Number(val.name),
      };
    });

    setModifiedRoles(newRoles);
  };

  const handleSetBudget = (val: any) => {
    const newRoles = modifiedRoles?.map((role: RoleType) => {
      if (role?._id !== selectedRole?._id) return role;
      if (role?._id === selectedRole?._id) {
        return {
          ...role,
          budget: {
            ...role?.budget,
            ...val,
          },
        };
      }
    });

    setModifiedRoles(newRoles);
  };

  const handleUnpaid = (e: any) => {
    setUnpaid(e.target.checked);
    if (e.target.checked) handleSetBudget!({ perHour: "0", token: "" });
    if (!e.target.checked) handleSetBudget!({ perHour: "0", token: "" });
  };

  return (
    <Modal
      open={isModalOpen}
      title="Please add description & detail of the role for people to have more context when they're invited to apply!"
    >
      <div className="grid grid-cols-5 gap-8 pt-2">
        <div className="col-span-1 pt-4">
          {roles.map((role: any) => (
            <div
              key={role._id}
              onClick={() =>
                setSelectedRole({ title: role.title, _id: role._id })
              }
              className={`border-soilGray mb-4 w-full ${
                selectedRole._id === role._id && "border-soilGreen-600"
              } cursor-pointer rounded-lg border-2 px-4 py-2 text-center text-xl`}
            >
              {role.title}
            </div>
          ))}
        </div>
        <div
          className="border-soilGreen-600 col-span-4 rounded-lg border-2 p-4"
          key={selectedRole?._id}
        >
          <TextHeading3>{selectedRole?.title}</TextHeading3>
          <div className="relative flex w-full items-start justify-center gap-5">
            {selectedRole._id === null && (
              <div className="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-[rgba(255,255,255,0.9)] text-3xl">
                No role is selected
              </div>
            )}
            <div className="h-full w-full">
              <p>Describe the role:</p>
              <TextArea
                key={selectedRole._id}
                value={
                  modifiedRoles.find(
                    (role: any) => selectedRole._id === role._id
                  )?.description
                }
                onChange={handleChangeDescription}
                className="h-full"
                rows={10}
                height={"100%"}
                placeholder="start typing here"
              />
            </div>
            <div className="flex flex-col items-start justify-start">
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-row content-center items-center">
                  <div className="w-24">
                    <TextField
                      name="hoursPerWeek"
                      placeholder="0"
                      radius="rounded"
                      type="number"
                      onChange={handleSetHoursPerWeek!}
                      defaultValue={
                        modifiedRoles.find(
                          (role: any) => role._id === selectedRole._id
                        )?.hoursPerWeek
                      }
                    />
                  </div>
                  <span className="font-sm ml-2">hours/week</span>
                </div>
              </div>
              <div className="w-full">
                <label className="text-sm font-medium text-gray-700">
                  Open positions
                </label>
                <div className="w-5/12">
                  <Dropdown
                    radius="rounded"
                    placeholder="#"
                    items={[
                      { _id: 1, name: "1" },
                      { _id: 2, name: "2" },
                      { _id: 2, name: "3" },
                      { _id: 2, name: "4" },
                    ]}
                    value={
                      modifiedRoles.find(
                        (role: any) => role._id === selectedRole._id
                      )?.openPositions
                    }
                    onSelect={handleChangeOpenPositions}
                  />
                </div>
              </div>
              <span className="text-md tracking-wide">
                Set the rewards for the contributor:
              </span>
              <div className="flex w-full flex-row content-center items-center">
                <div className="mr-2 w-2/3">
                  <TextField
                    key={"" + unpaid}
                    name="budget"
                    placeholder="0"
                    radius="rounded"
                    type="number"
                    defaultValue={
                      unpaid
                        ? ""
                        : modifiedRoles.find(
                            (role: RoleType) => role._id === selectedRole?._id
                          )?.budget?.perHour
                    }
                    onChange={(e) => {
                      handleSetBudget({ perHour: e.target.value });
                    }}
                    disabled={unpaid}
                  />
                </div>
                <div className="w-1/3">
                  <TextField
                    key={"" + unpaid}
                    name="token"
                    placeholder="token"
                    radius="rounded"
                    type="text"
                    defaultValue={
                      unpaid
                        ? ""
                        : modifiedRoles.find(
                            (role: RoleType) => role._id === selectedRole?._id
                          )?.budget?.token
                    }
                    onChange={(e) => handleSetBudget({ token: e.target.value })}
                    disabled={unpaid}
                  />
                </div>
              </div>
              <div className="mt-3">
                <SwitchButton
                  name="unpaid"
                  label="Unpaid"
                  onChange={handleUnpaid}
                />
              </div>
              <div>
                <p>Key responsibilities</p>
                <TextArea
                  value={
                    modifiedRoles.find(
                      (role: RoleType) => role._id === selectedRole?._id
                    )?.keyResponsibilities
                  }
                  onChange={(e) => handleChangeResponsibility(e.target.value)}
                  placeholder="start typing here"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        className="mx-auto mt-4"
        onClick={() => handleSubmit(modifiedRoles)}
      >
        All done!
      </Button>
    </Modal>
  );
};
