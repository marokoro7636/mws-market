import { useState } from "react";
import Chip from "@mui/material/Chip";
import { SxProps } from '@mui/system'

interface ChipButtonProps {
    label: string;
    defaultSelected?: boolean;
    onChange?: (selected: boolean) => void;
    sx?: SxProps
}

function ChipButton({ label, defaultSelected = false, onChange = () => { }, sx = null }: ChipButtonProps) {
    const [selected, setSelected] = useState(defaultSelected || false);
    console.log("CHIP", label, selected)

    const handleClick = () => {
        const newSelected = !selected;
        setSelected(newSelected);
        if (onChange) {
            onChange(newSelected);
        }
    };

    sx = {
        ...sx,
        color: selected ? "primary" : "default"
    }

    return (
        <Chip
            label={label}
            color={selected ? "primary" : "default"}
            onClick={handleClick}
            clickable
            variant="outlined"
            size="small"
            sx={sx}
        />
    );
}

export default ChipButton;