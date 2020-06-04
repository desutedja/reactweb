import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {
    FiCheck,
} from 'react-icons/fi'

function Component({color = "", label, labelIcon = "", items}) {
    const listitem = items.map((item, key) => {
            if (!item.disabled)
                return <DropdownItem onClick={item.onClick}>{item.icon}  {item.name}</DropdownItem>
    });

    const [dropdownOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!dropdownOpen)
    
    return (
       <Dropdown size="sm" isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret color="primary">
            {labelIcon} {label} 
        </DropdownToggle> 
        <DropdownMenu>
            { listitem }
        </DropdownMenu>
       </Dropdown>
    )
}

export default Component;
