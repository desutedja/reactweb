import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {
    FiCheck,
} from 'react-icons/fi'

function Component({color = "", label, labelIcon = "", items}) {
    const listitem = items.map((item, key) => {
            if (!item.disabled)
                return <DropdownItem key={key} onClick={item.onClick}>{item.icon}  {item.name}</DropdownItem>
    });

    const [dropdownOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!dropdownOpen)
    
    return (
       <ButtonDropdown size="sm" isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret color="primary" outline>
            {labelIcon} {label} 
        </DropdownToggle> 
        <DropdownMenu>
            { listitem }
        </DropdownMenu>
       </ButtonDropdown>
    )
}

export default Component;
