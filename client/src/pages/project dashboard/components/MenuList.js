import {
    Menu,
    MenuItem
} from '@mui/material'
import { useState } from 'react'


/*
* Only one instance is required per page if it is used. Even if there are multiple
* rendered children that use menuList. Use a button to open and pass the button ref to the list
* in order to render.
*/
export default function MenuList({menuItems, onClose, anchorEl}) {
    const open = Boolean(anchorEl);
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
        >
            {menuItems.map((menuItem)=> {
                console.log('should render menuItem')
                return (
                    <MenuItem
                        onClick={()=>onClose(menuItem)}
                        key={menuItem}
                    >
                        {menuItem}
                    </MenuItem>
                )
            })}
        </Menu>
    );
}