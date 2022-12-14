import { UserContext } from "@eden/package-context";
import { ServerTemplate } from "@eden/package-graphql/generated";
import { Avatar } from "@eden/package-ui";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { CheckIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import isEmpty from "lodash/isEmpty";
import { Fragment, useContext, useEffect, useState } from "react";

export interface IServerSelectorProps {
  disabled?: boolean;
  value?: string;
  btnBGcolor?: string;
  onChangeString?: React.Dispatch<React.SetStateAction<string>>;
  onChangeServer?: React.Dispatch<React.SetStateAction<ServerTemplate>>;
}

export const ServerSelector = ({
  disabled,
  value,
  onChangeString,
  onChangeServer,
  btnBGcolor = "bg-gray-200",
}: IServerSelectorProps) => {
  const [selected, setSelected] = useState<ServerTemplate>({});

  const { memberServers } = useContext(UserContext);

  const btnClasses = clsx(
    "relative flex justify-between items-center border border-gray-300 text-center cursor-pointer rounded-2xl py-1 px-3 shadow-lg hover:shadow-sm hover:border-gray-500 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300 sm:text-sm",
    btnBGcolor,
    {
      "border-green-500": isEmpty(selected),
    }
  );

  useEffect(() => {
    if (selected) {
      onChangeString && onChangeString(selected._id as string);
      onChangeServer && onChangeServer(selected);
    }
  }, [selected]);

  useEffect(() => {
    if (value) {
      const selectedServer = memberServers?.find(
        (item) => item._id === value
      ) as ServerTemplate;

      setSelected(selectedServer);
    }
  }, [value]);

  return (
    <Listbox
      value={selected}
      multiple={false}
      disabled={disabled}
      onChange={setSelected}
    >
      <div className="relative mt-1">
        <Listbox.Button className={btnClasses}>
          {isEmpty(selected) ? (
            <span className="mr-2 block truncate font-medium py-1">
              Select Server
            </span>
          ) : (
            <div className={`truncate flex font-medium mr-2`}>
              <Avatar size={`xs`} src={selected.serverAvatar as string} />
              <div className={`my-auto ml-2`}>{selected.name}</div>
            </div>
          )}
          <ChevronDownIcon width={12} />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="fixed z-50 mt-1 max-h-60 min-w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {memberServers &&
              memberServers.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-green-100 text-green-900" : "text-gray-900"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={`truncate flex ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        <Avatar size={`xs`} src={item.serverAvatar as string} />
                        <div className={`my-auto ml-2`}>{item.name}</div>
                      </div>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
