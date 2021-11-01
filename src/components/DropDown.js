import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function Component({ color = "", label, labelIcon = "", items }) {
    const listitem = items.map((el) => {
        return (<DropdownItem key={el.value}>{el.name} {el.label}
            </DropdownItem>);
    });

    const [dropdownOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!dropdownOpen)

    return (
        <ButtonDropdown size="sm" isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret color="primary" outline>
                {labelIcon} {label}
            </DropdownToggle>
            <DropdownMenu>
                {listitem}
            </DropdownMenu>
        </ButtonDropdown>
    )
}

export default Component;
