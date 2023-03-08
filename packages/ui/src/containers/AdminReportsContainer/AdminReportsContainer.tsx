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
    <div className="h-9/10 w-full overflow-y-scroll">
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
            className="text-bold group mb-2 flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition-transform hover:translate-x-1 hover:cursor-pointer hover:bg-slate-400 hover:text-slate-100"
          >
            <span className="invisible absolute right-[52px] cursor-pointer text-center text-sm text-slate-500 group-hover:visible">
              upload template
            </span>
            <label htmlFor="upload">
              <FiUpload className="cursor-pointer" width={48} />
            </label>
          </button>
        </div>

        <a
          className="text-bold group mb-2 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition-transform hover:translate-x-1 hover:cursor-pointer hover:bg-slate-400 hover:text-slate-100"
          href={`data:${encodedJsonData()}`}
          download={title.toLowerCase().split(" ").join("_") + ".json"}
        >
          <span className="invisible absolute right-[52px] text-center text-sm text-slate-500 group-hover:visible">
            save template
          </span>
          <button>
            <FaDownload width={48} />
          </button>
        </a>
        <button
          className="text-bold bg-accentColor group flex h-[48px] w-[48px] items-center justify-center rounded-full text-white shadow-md transition-transform hover:translate-x-1 hover:cursor-pointer hover:bg-black"
          onClick={() => handleAdd()}
        >
          <span className="invisible absolute right-[52px] text-center text-sm text-slate-500 group-hover:visible">
            add widget
          </span>
          <ImCross className="rotate-45" width={48} />
        </button>
      </section>
      <h1 className="ml-4 mt-2 text-2xl">
        <input
          className="w-1/2 bg-transparent outline-none"
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
              className="reactGridItem relative relative rounded-lg bg-white p-4 shadow-sm"
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
                  className="w-8/10 mb-8 outline-none"
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

                      if (e.currentTarget.value === CHARTS.BARS_NEW_USER) {
                        _newWidgetArray[index].content = {
                          ..._newWidgetArray[index].content,
                          range: "days",
                        };
                      }

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
                      <>
                        <BarsNewMembers
                          range={widget.content.range}
                          startDate={widget.content.startDate}
                          endDate={widget.content.endDate}
                        />
                        <div className="flex">
                          <div>
                            <label className="mr-2">range</label>
                            <select
                              name="range"
                              defaultValue={widget.content.range || "days"}
                              onChange={(e) => {
                                const _newWidgetArray = [...widgetArray];

                                _newWidgetArray[index].content.range =
                                  e.currentTarget.value;

                                delete _newWidgetArray[index].content.startDate;
                                delete _newWidgetArray[index].content.endDate;

                                setWidgetArray(_newWidgetArray);
                              }}
                            >
                              <option value="months">months</option>
                              <option value="days">days</option>
                            </select>
                          </div>
                          {widget.content.range === "months" ? (
                            <div className="ml-auto flex flex-col">
                              <div>
                                <label className="mr-2">start</label>
                                <input
                                  className="mr-2"
                                  type="month"
                                  name="start"
                                  defaultValue={widget.content.startDate}
                                  onChange={(e) => {
                                    const _newWidgetArray = [...widgetArray];

                                    _newWidgetArray[index].content.startDate =
                                      e.target.value;

                                    setWidgetArray(_newWidgetArray);
                                  }}
                                />
                              </div>
                              <div>
                                <label className="mr-2">end</label>
                                <input
                                  className="mr-2"
                                  type="month"
                                  name="end"
                                  defaultValue={widget.content.endDate}
                                  onChange={(e) => {
                                    const _newWidgetArray = [...widgetArray];

                                    _newWidgetArray[index].content.endDate =
                                      e.target.value;

                                    setWidgetArray(_newWidgetArray);
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="ml-auto flex flex-col">
                              <div>
                                <label className="mr-2">start</label>
                                <input
                                  className="mr-2"
                                  type="date"
                                  name="start"
                                  defaultValue={widget.content.startDate}
                                  onChange={(e) => {
                                    const _newWidgetArray = [...widgetArray];

                                    _newWidgetArray[index].content.startDate =
                                      e.target.value;

                                    setWidgetArray(_newWidgetArray);
                                  }}
                                />
                              </div>
                              <div>
                                <label className="mr-2">end</label>
                                <input
                                  className="mr-2"
                                  type="date"
                                  name="end"
                                  defaultValue={widget.content.endDate}
                                  onChange={(e) => {
                                    const _newWidgetArray = [...widgetArray];

                                    _newWidgetArray[index].content.endDate =
                                      e.target.value;

                                    setWidgetArray(_newWidgetArray);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {widget.content?.type === CHARTS.TEXT && (
                      <textarea
                        defaultValue={widget.content?.value}
                        className="h-full w-full resize-none outline-none"
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

export const BarsNewMembers = ({ range, startDate, endDate }: any) => {
  const NEW_MEMBERS = gql`
    query ($fields: statsInput) {
      membersStats(fields: $fields) {
        date {
          day
          month
          year
        }
        count
      }
    }
  `;

  const { data: newMembersData } = useQuery(NEW_MEMBERS, {
    variables: {
      fields: {
        range: range,
        // start of the selected range timestamp
        startDate: Number(new Date(startDate)) / 1000,
        // end of the selected range timestamp
        endDate:
          range === "months"
            ? Number(
                new Date(endDate).setMonth(new Date(endDate).getMonth() + 1)
              ) / 1000
            : Number(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1)
              ) / 1000,
      },
    },
    skip: !range || !startDate || !endDate,
  });

  const formatData = () => {
    const _labels = newMembersData?.membersStats.map((_item: any) =>
      range === "months"
        ? `${_item.date.month}/${_item.date.year}`
        : `${_item.date.month}/${_item.date.day}/${_item.date.year}`
    );
    const _data = newMembersData?.membersStats.map((_item: any) => _item.count);

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
