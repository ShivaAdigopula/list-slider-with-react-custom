import React from "react";

import { VisibilityContext } from "react-horizontal-scrolling-menu";

export function Card({
  itemId,
  selected,
  onClick,
  title
}: {
  itemId: string;
  selected: boolean;
  onClick: Function;
  title: string;
}) {
  const visibility = React.useContext(VisibilityContext);

  const visible = visibility.isItemVisible(itemId);
  const itemIdDivisibleBy5 = +itemId % 5 === 0;

  return (
    <div
      onClick={() => onClick(visibility)} // NOTE: for center items
      role="button"
      style={{
        //border: "1px solid",
        display: "inline-block",
        margin: "0 5px",
        width: "10px",
        height: "100px",
        userSelect: "none"
      }}
      className="card"
    >
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignSelf: "center",
            justifySelf: "center"
          }}
        >
          <div
            style={{
              width: "2px",
              backgroundColor: selected ? "red" : "grey",
              height: itemIdDivisibleBy5 ? "60px" : "30px",
              marginTop: itemIdDivisibleBy5 ? "0" : "15px"
            }}
          ></div>
          {itemIdDivisibleBy5 && (
            <div style={{ marginTop: "5px", textAlign: "center" }}>
              {itemId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
