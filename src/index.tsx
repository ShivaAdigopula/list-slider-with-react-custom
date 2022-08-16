import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

import { Card } from "./card";
import "./globalStyles.css";
import "./hideScrollbar.css";
import "./firstItemMargin.css";
import "./lastItemMargin.css";
import useDrag from "./useDrag";

const start = 1990;
const stop = 2022;
const step = 1;

// NOTE: embrace power of CSS flexbox!
// import "./hideScrollbar.css";
// import "./firstItemMargin.css";

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const getId = (index: number) => `${index}`;

const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (v, i) => start + i * step);

const getItems = () =>
  range(start, stop, step).map((value) => ({ id: getId(value) }));

function App() {
  const [items] = React.useState(getItems);
  let centerLineRef = useRef(null);
  const { dragStop, dragging } = useDrag();
  const [selected, setSelected] = React.useState<string>("");

  const handleItemClick = (itemId: string) => ({
    getItemById,
    scrollToItem
  }: scrollVisibilityApiType) => {
    if (dragging) {
      return false;
    }
    setSelected(selected !== itemId ? itemId : "");
    // NOTE: for center items
    scrollToItem(getItemById(itemId), "smooth", "center", "nearest");
  };

  const findClosestElement = () => {
    const { x } = centerLineRef.current.getBoundingClientRect();

    const allWithClass = Array.from(
      document.getElementsByClassName("react-horizontal-scrolling-menu--item")
    );

    let closestElement = allWithClass[0];

    let distance = Math.abs(x - closestElement.getBoundingClientRect().x);

    allWithClass.forEach((item) => {
      if (distance > Math.abs(x - item.getBoundingClientRect().x)) {
        closestElement = item;
        distance = Math.abs(x - item.getBoundingClientRect().x);
      }
    });
    return closestElement;
  };

  function onWheel(
    { getItemById, visibleItems }: scrollVisibilityApiType,
    ev: React.WheelEvent
  ): void {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    const closestElement = findClosestElement();

    setSelected(
      getItemById(closestElement.getAttribute("data-key")).key.replace(
        "-separator",
        ""
      )
    );

    if (isThouchpad) {
      ev.stopPropagation();
      return;
    }
  }

  const onInit = ({ getItemById, scrollToItem }: scrollVisibilityApiType) => {
    setSelected(String(start));
    scrollToItem(getItemById(String(start)), "smooth", "center");
  };

  return (
    <>
      <div className="example" style={{ paddingTop: "100px" }}>
        <div
          style={{
            fontSize: "40px",
            textAlign: "center",
            margin: "10px"
          }}
        >
          {selected}
        </div>
        <div onMouseLeave={dragStop}>
          <div className="center-line" ref={centerLineRef}></div>
          <ScrollMenu
            onInit={onInit}
            onWheel={onWheel}
            options={{ throttle: 0 }} // NOTE: for center items
          >
            {items.map(({ id }) => (
              <Card
                title={id}
                itemId={id}
                key={id}
                onClick={handleItemClick(id)}
                selected={id == selected}
              />
            ))}
          </ScrollMenu>
        </div>
      </div>
    </>
  );
}
export default App;

ReactDOM.render(<App />, document.getElementById("root"));
