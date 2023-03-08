import { useQuery } from "@apollo/client";
import { FIND_ROLE_TEMPLATES } from "@eden/package-graphql";
import { Maybe, RoleTemplate } from "@eden/package-graphql/generated";
import { Button, Modal, RoleSelector } from "@eden/package-ui";
import { useState } from "react";

export interface RoleModalProps {
  roles?: Maybe<Array<Maybe<RoleTemplate>>>;
  openModal?: boolean;
  firstRoleAssigned?: boolean;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (role: Maybe<RoleTemplate>) => void;
  // eslint-disable-next-line no-unused-vars
  onRoleSelected?: (_id: Maybe<string>) => void;
}

export const RoleModal = ({
  openModal,
  firstRoleAssigned,
  onSubmit,
  onRoleSelected,
}: RoleModalProps) => {
  const [selectedRole, setSelectedRole] = useState<Maybe<RoleTemplate> | null>(
    null
  );

  const { data: roles } = useQuery(FIND_ROLE_TEMPLATES, {
    variables: {
      fields: {},
    },
  });

  const onSelect = (val: Maybe<RoleTemplate>) => {
    setSelectedRole(val);
    onRoleSelected && onRoleSelected(val?._id!);
  };

  return (
    <>
      <Modal open={openModal} closeOnEsc={false}>
        <div className={`h-5/10 relative p-1`}>
          <div className={`font-poppins text-justify text-base font-semibold`}>
            {firstRoleAssigned ? (
              <span>
                Select another role for your project, these roles can help you
                find right people to work with.
              </span>
            ) : (
              <span>
                {`Welcome to Eden, a project/person matching protocol. We're here
                to help you find talent, that is tailored to your needs - please
                tell us more about your project.`}
              </span>
            )}
          </div>
          <div className={`my-2 text-sm text-slate-500`}>
            {`Choose just one role for now, you'll be able to add more later.`}
          </div>
          <div className="flex flex-row justify-center justify-items-center">
            <div>
              <div className="mt-5 mb-4 text-base font-semibold">
                {" "}
                Who are you looking for?
              </div>
              <div className="">
                {roles?.findRoleTemplates && (
                  <RoleSelector
                    roles={roles ? roles.findRoleTemplates : []}
                    onSelect={onSelect}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={`absolute bottom-2  flex w-full justify-center`}>
            <Button
              variant={`primary`}
              onClick={() => {
                if (!!selectedRole) {
                  setTimeout(() => {
                    onSubmit(selectedRole);
                  }, 1000);
                }
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
