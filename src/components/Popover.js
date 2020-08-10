import React, { useState } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

function Component({ id, placement, item, title, content }) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <span>
      <span id={"Popover-" + id}>
        {item}
      </span>
      <Popover
        placement={item.placement}
        isOpen={popoverOpen}
        target={"Popover-" + id}
        toggle={toggle}
        trigger="hover"
      >
        <PopoverHeader>{title}</PopoverHeader>
        <PopoverBody>
            {content}
        </PopoverBody>
      </Popover>
    </span>
  );
};

export default Component;
