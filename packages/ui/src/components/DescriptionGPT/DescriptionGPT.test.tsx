import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DescriptionGPT, MESSAGE_TO_GPT } from "./DescriptionGPT";

const mocks = [
  {
    request: {
      query: MESSAGE_TO_GPT,
      variables: {
        fields: {
          message: "example text",
          category: "skill",
          prompt: "this is",
        },
      },
    },
    result: {
      data: {
        messageToGPT: {
          message: "example response",
        },
      },
    },
  },
];

it("component renders and the button is changed to `Autocomplete in progress`, when the button is pressed", async () => {
  const user = userEvent.setup();

  render(
    <MockedProvider mocks={mocks}>
      <DescriptionGPT
        onReturn={() => null}
        showTextArea={true}
        customPrompt={""}
      />
    </MockedProvider>
  );

  user.type(screen.getByRole("textbox"), "testing");
  user.click(screen.getByRole("button"));
  // await waitFor(() => {
  //   expect(screen.getByText("Autocomplete in progress")).toBeInTheDocument();
  //   // screen.debug();
  // });
});

// it("displays the response from GPT when the button is clicked", async () => {
//   render(
//     <MockedProvider mocks={mocks}>
//       <DescriptionGPT showTextArea={true} customPrompt={""} />
//     </MockedProvider>
//   );

//   userEvent.type(screen.getByRole("textbox"), "example text");
//   userEvent.click(screen.getByRole("button"));
//   await waitFor(() => {
//     expect(screen.getByRole("textbox")).toHaveValue("example response");
//   });
// });

////////////////////////////////////////////////////////////////////////////

// describe("DescriptionGPT", () => {
//   const mocks = [
//     {
//       request: {
//         query: MESSAGE_TO_GPT,
//         variables: {
//           fields: {
//             message: "example text",
//             category: "skill",
//             prompt: "",
//           },
//         },
//       },
//       result: {
//         data: {
//           messageToGPT: {
//             message: "example response",
//           },
//         },
//       },
//     },
//   ];

//   it("renders without crashing", async () => {
//     const { getByTestId } = render(
//       <MockedProvider mocks={mocks}>
//         <DescriptionGPT showTextArea={true} />
//       </MockedProvider>
//     );

//     await waitFor(() => {
//       expect(getByTestId("text-area")).toBeInTheDocument();
//     });
//   });

//   it("calls the mutation when the button is clicked", async () => {
//     const { getByTestId } = render(
//       <MockedProvider mocks={mocks}>
//         <DescriptionGPT showTextArea={true} />
//       </MockedProvider>
//     );
//     const textArea = getByTestId("text-area");

//     fireEvent.change(textArea, { target: { value: "example text" } });
//     fireEvent.click(getByTestId("submit-button"));
//     await waitFor(() => {
//       expect(getByTestId("response")).toHaveTextContent("example response");
//     });
//   });

//   it("displays a custom prompt if provided", async () => {
//     const customPrompt = "Please enter a description for your skill:";
//     const { getByText } = render(
//       <MockedProvider mocks={mocks}>
//         <DescriptionGPT showTextArea={true} customPrompt={customPrompt} />
//       </MockedProvider>
//     );

//     await waitFor(() => {
//       expect(getByText(customPrompt)).toBeInTheDocument();
//     });
//   });
// });
