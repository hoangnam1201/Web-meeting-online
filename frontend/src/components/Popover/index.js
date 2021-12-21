import { IconButton, Popover } from '@mui/material'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from 'react'

const BasicPopover = ({ children, ...rest }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <IconButton aria-describedby={id} variant="contained" onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <div>
                    {children}
                </div>
            </Popover>
        </div>
    );
}

export default BasicPopover
