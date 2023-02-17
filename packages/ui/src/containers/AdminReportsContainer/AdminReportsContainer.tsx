import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { XIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Layouts, Responsive, WidthProvider } from "react-grid-layout";
import { FaDownload } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { ImCross } from "react-icons/im";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// const widgetPreset = [
//   {
//     i: "widget1",
//     x: 0,
//     y: 0,
//     w: 4,
//     h: 3,
//     content: { type: "graph" as null | string },
//   },
//   {
//     i: "widget2",
//     x: 4,
//     y: 2,
//     w: 2,
//     h: 2,
//     content: {
//       type: "text" as null | string,
//       value: "This is a text for a report",
//     },
//   },
//   {
//     i: "widget3",
//     x: 0,
//     y: 3,
//     w: 2,
//     h: 2,
//     content: { type: null as null | string },
//   },
// ];

export enum CHARTS {
  // eslint-disable-next-line no-unused-vars
  TEXT = "Text",
  // eslint-disable-next-line no-unused-vars
  BARS_NEW_USER = "New Users",
}

export const AdminReportsContainer = () => {
  const [layouts, setLayouts] = useState<Layouts>({});
  const [title, setTitle] = useState<string>("");
  const [widgetArray, setWidgetArray] = useState<any[]>([]);

  useEffect(() => {
    if (localStorage && localStorage.getItem("metrics_report")) {
      setWidgetArray(
        JSON.parse(localStorage.getItem("metrics_report")!).widgets
      );
      setTitle(JSON.parse(localStorage.getItem("metrics_report")!).title);
    }
  }, []);

  const handleAdd = () => {
    setWidgetArray([
      ...widgetArray,
      {
        i: widgetArray.length,
        x: 0,
        y: 9999,
        w: 2,
        h: 2,
        content: {
          title: "widget" + (widgetArray.length + 1),
          type: null as null | string,
        },
      },
    ]);
  };

  const handleDelete = (key: any) => {
    if (!widgetArray) return;
    const tempArray = widgetArray.slice();
    const index = tempArray.indexOf(
      tempArray.find((data: any) => data.i === key)!
    );

    tempArray.splice(index, 1);
    const layoutIndex = layouts.lg.indexOf(
      layouts.lg.find((data: any) => data.i === key)!
    );

    const tempLayouts = { lg: layouts.lg.splice(layoutIndex, 1) };

    setLayouts(tempLayouts);
    setWidgetArray(tempArray);
  };

  const jsonData = (arr = widgetArray) => {
    var data = JSON.stringify({ title: title, widgets: arr });

    return data;
  };

  const encodedJsonData = () => {
    var data = encodeURIComponent(jsonData());

    return "text/json;charset=utf-8," + data;
  };

  const handleModify = (layouts: any, layout: any) => {
    const tempArray = widgetArray ? [...widgetArray!] : [];

    setLayouts(layout);
    layouts?.map((position: any) => {
      tempArray[Number(position.i)].x = position.x;
      tempArray[Number(position.i)].y = position.y;
      tempArray[Number(position.i)].w = position.w;
      tempArray[Number(position.i)].h = position.h;
    });
    setWidgetArray(tempArray);
  };

  useEffect(() => {
    if (!!widgetArray.length && !!title)
      localStorage.setItem("metrics_report", jsonData(widgetArray));
  }, [widgetArray, title]);

  const readFile = (e: any) => {
    return new Response(e.target.files[0]).json().then(
      (json) => {
        console.log(json);
        return json;
      },
      (err) => {
        // not json
        console.log("Err! Not a JSON", err);
      }
    );
  };

  return (
    <div className="w-full h-9/10 overflow-y-scroll">
      <section className="fixed right-12 bottom-12 z-10">
        <div>
          <input
            type="file"
            id="upload"
            className="hidden"
            onChange={async (e) => {
              const fileData = await readFile(e);

              if (fileData) {
                setTitle(fileData.title);
                setWidgetArray(fileData.widgets);
              }
            }}
          />

          <button
            type="button"
            className="cursor-pointer group flex items-center justify-center mb-2 h-[48px] w-[48px] text-slate-600 text-bold rounded-full bg-white shadow-md hover:cursor-pointer hover:bg-slate-400 hover:text-slate-100 hover:translate-x-1 transition-transform"
          >
            <span className="cursor-pointer text-center text-slate-500 text-sm absolute right-[52px] invisible group-hover:visible">
              upload template
            </span>
            <label htmlFor="upload">
              <FiUpload className="cursor-pointer" width={48} />
            </label>
          </button>
        </div>

        <a
          className="group flex items-center justify-center mb-2 h-[48px] w-[48px] text-slate-600 text-bold rounded-full bg-white shadow-md hover:cursor-pointer hover:bg-slate-400 hover:text-slate-100 hover:translate-x-1 transition-transform"
          href={`data:${encodedJsonData()}`}
          download={title.toLowerCase().split(" ").join("_") + ".json"}
        >
          <span className="text-center text-slate-500 text-sm absolute right-[52px] invisible group-hover:visible">
            save template
          </span>
          <button>
            <FaDownload width={48} />
          </button>
        </a>
        <button
          className="group flex items-center justify-center h-[48px] w-[48px] text-white text-bold rounded-full bg-accentColor shadow-md hover:cursor-pointer hover:bg-black hover:translate-x-1 transition-transform"
          onClick={() => handleAdd()}
        >
          <span className="text-center text-slate-500 text-sm absolute right-[52px] invisible group-hover:visible">
            add widget
          </span>
          <ImCross className="rotate-45" width={48} />
        </button>
      </section>
      <h1 className="ml-4 mt-2 text-2xl">
        <input
          className="bg-transparent outline-none w-1/2"
          value={title}
          type="text"
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
      </h1>
      {/* xxxxxx{JSON.stringify(widgetArray)}xxxxxxx yyyyyy{JSON.stringify(layouts)}
      yyyyyy */}
      <ResponsiveReactGridLayout
        key={widgetArray?.toString()}
        onLayoutChange={handleModify}
        verticalCompact={true}
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        preventCollision={false}
        cols={{ lg: 8, md: 8, sm: 4, xs: 2, xxs: 2 }}
        autoSize={true}
        margin={{
          lg: [20, 20],
          md: [20, 20],
          sm: [20, 20],
          xs: [20, 20],
          xxs: [20, 20],
        }}
      >
        {widgetArray?.map((widget: any, index: number) => {
          return (
            <div
              className="relative reactGridItem rounded-lg shadow-sm bg-white relative p-4"
              key={index}
              data-grid={{
                x: widget?.x,
                y: widget?.y,
                w: widget?.w,
                h: widget?.h,
                i: widget.i,
                minW: 2,
                maxW: Infinity,
                minH: 2,
                maxH: Infinity,
                isDraggable: true,
                isResizable: true,
              }}
            >
              <h3>
                <input
                  type="text"
                  value={widget.content.title}
                  className="w-8/10 outline-none mb-8"
                  onMouseDown={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const _newWidgetArray = [...widgetArray];

                    _newWidgetArray[index].content.title =
                      e.currentTarget.value;

                    setWidgetArray(_newWidgetArray);
                  }}
                />
              </h3>
              <button
                className="deleteButton absolute right-2 top-2"
                onClick={() => handleDelete(widget.i)}
              >
                <XIcon className="inline-block h-4 w-4 cursor-pointer text-gray-900 hover:text-slate-400" />
              </button>
              <section className="h-[80%]">
                {!widget.content?.type ? (
                  <select
                    defaultValue={""}
                    onFocus={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={(e) => {
                      const _newWidgetArray = [...widgetArray];

                      _newWidgetArray[index].content = {
                        ..._newWidgetArray[index].content,
                        type: e.currentTarget.value,
                      };

                      setWidgetArray(_newWidgetArray);
                    }}
                  >
                    <option value="" disabled>
                      Select your option
                    </option>
                    <option value={CHARTS.BARS_NEW_USER}>
                      {CHARTS.BARS_NEW_USER}
                    </option>
                    <option value={CHARTS.TEXT}>{CHARTS.TEXT}</option>
                  </select>
                ) : (
                  <>
                    {widget.content?.type === CHARTS.BARS_NEW_USER && (
                      // <Bar data={_mockdata} />
                      <BarsNewMembers />
                    )}
                    {widget.content?.type === CHARTS.TEXT && (
                      <textarea
                        defaultValue={widget.content?.value}
                        className="w-full outline-none h-full resize-none"
                        placeholder="Type some text here..."
                      ></textarea>
                    )}
                  </>
                )}
              </section>
            </div>
          );
        })}
      </ResponsiveReactGridLayout>
    </div>
  );
};

// ---------- CHARTS ------------

import { gql, useQuery } from "@apollo/client";

export const BarsNewMembers = () => {
  const NEW_MEMBERS = gql`
    query newMembers {
      memberstatsGroupByMonth {
        _id {
          month
          year
        }
        count
      }
    }
  `;

  const { data: newMembersData } = useQuery(NEW_MEMBERS, {
    context: { serviceName: "soilservice" },
  });

  const formatData = () => {
    const _labels = newMembersData?.memberstatsGroupByMonth.map(
      (_item: any) => `${_item._id.month}/${_item._id.year}`
    );
    const _data = newMembersData?.memberstatsGroupByMonth.map(
      (_item: any) => _item.count
    );

    debugger;

    const chartData = {
      labels: _labels,
      datasets: [
        {
          //       label: "My First Dataset",
          data: _data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return chartData;
  };

  return (
    <>
      {/* {JSON.stringify(formatData())} */}
      <Bar data={formatData()} />
    </>
  );
};
