import { forEach } from "lodash";
import styled from "@emotion/styled";
import {
    Button,
    Chip,
    FormControl,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.3),
}));

const useStyles = makeStyles(() => ({
    editInputRoot: {
        borderRadius: 16
    },
    editInput: {
        margin: 0,
        padding: 0,
        fontSize: 13,
        height: 23,
        textAlign: 'center'
    }
}));

function SysExForm({
    currentKnob: {
        sysExMessage,
        valuesIndex,
        MSBFirst,
        minValue,
        maxValue
    },
    handleSysExChange,
    handleSysExMSBLSBSwitch,
    handleMinValueChange,
    handleMaxValueChange,
    handleSysExValuesIndexChange
}) {
    const classes = useStyles();
    const [editChipIndex, setEditChipIndex] = useState(-1);
    const [currentEditValue, setCurrentEditValue] = useState();
    const [fullSysExMessage, setFullSysExMessage] = useState([]);
    const MSBLSB_PLACEHOLDER = "MSBLSB_PLACEHOLDER";

    useEffect(() => {
        const newFullSysExMessage = [];
        forEach(sysExMessage, (message, index) => {
            if (index === valuesIndex) {
                newFullSysExMessage.push(MSBLSB_PLACEHOLDER);
            }
            newFullSysExMessage.push(message);
        });
        if (valuesIndex + 1 > sysExMessage.length) {
            newFullSysExMessage.push(MSBLSB_PLACEHOLDER);
        }
        setEditChipIndex(-1);
        setFullSysExMessage(newFullSysExMessage);
    }, [sysExMessage, valuesIndex, MSBFirst]);

    const reorderItems = (dragIndex, hoverIndex) => {
        const newSysExMessage = [...fullSysExMessage];
        const [removed] = newSysExMessage.splice(dragIndex, 1);
        newSysExMessage.splice(hoverIndex, 0, removed);
        const msbLsbIndex = newSysExMessage.indexOf(MSBLSB_PLACEHOLDER);
        newSysExMessage.splice(msbLsbIndex, 1);
        handleSysExValuesIndexChange(msbLsbIndex);
        handleSysExChange(newSysExMessage);
    };

    const handleDelete = index => () => {
        const newSysExMessage = [...fullSysExMessage];
        newSysExMessage.splice(index, 1);
        const msbLsbIndex = newSysExMessage.indexOf(MSBLSB_PLACEHOLDER);
        newSysExMessage.splice(msbLsbIndex, 1);
        handleSysExValuesIndexChange(msbLsbIndex);
        handleSysExChange(newSysExMessage);
    };

    function handleByteChange(event) {
        if (/[fF]+7/.test(event.target.value)) return; // Do not allow end of message byte (F7)
        setCurrentEditValue(
            event.target.value
                .replace(/[^0-9a-fA-F]/g, '') // HEX characters only
                .toUpperCase()
        );
    }

    const showEditChip = index => () => {
        setCurrentEditValue(fullSysExMessage[index]);
        setEditChipIndex(index)
    };
    const confirmEdit = () => {
        const newSysExMessage = [...fullSysExMessage];
        if (!currentEditValue.length) {
            newSysExMessage.splice(editChipIndex, 1);
        } else {
            newSysExMessage.splice(editChipIndex, 1, currentEditValue);
        }
        const msbLsbIndex = newSysExMessage.indexOf(MSBLSB_PLACEHOLDER);
        newSysExMessage.splice(msbLsbIndex, 1);
        handleSysExValuesIndexChange(msbLsbIndex);
        handleSysExChange(newSysExMessage);
        setCurrentEditValue();
        setEditChipIndex(-1);
    }
    const addMessageByte = () => {
        const newSysExMessage = [...sysExMessage];
        newSysExMessage.push("00");
        handleSysExChange(newSysExMessage);
        // setEditChipIndex(fullSysExMessage.length);
    }

    const EditChip = function () {
        return (
            <Stack
                direction="row"
            >
                <TextField
                    value={currentEditValue}
                    onBlur={confirmEdit}
                    onChange={handleByteChange}
                    autoFocus={true}
                    size={'small'}
                    inputProps={{
                        maxLength: 2
                    }}
                    InputProps={{
                        classes: {
                            root: classes.editInputRoot,
                            input: classes.editInput
                        }
                    }}
                />
                <IconButton
                    color="success"
                    size="small"
                    component="label"
                    variant="outlined"

                    onClick={confirmEdit}
                >
                    <CheckCircleIcon
                        sx={{
                            fontSize: 16
                        }}
                    />
                </IconButton>
            </Stack>

        );
    }

    const DraggableChip = function ({ message, index, id, reorderItems }) {
        const ref = useRef(null);
        const [{ handlerId }, drop] = useDrop({
            accept: 'draggablechip',
            collect(monitor) {
                return {
                    handlerId: monitor.getHandlerId(),
                };
            },
            hover(item, monitor) {
                if (!ref.current) {
                    return;
                }
                const dragIndex = item.index;
                const hoverIndex = index;
                // Don't replace items with themselves
                if (dragIndex === hoverIndex) {
                    return;
                }
                // Determine rectangle on screen
                const hoverBoundingRect = ref.current?.getBoundingClientRect();
                // Get vertical middle
                const hoverMiddleY =
                    (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                // Determine mouse position
                const clientOffset = monitor.getClientOffset();
                // Get pixels to the top
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;
                // Only perform the move when the mouse has crossed half of the items height
                // When dragging downwards, only move when the cursor is below 50%
                // When dragging upwards, only move when the cursor is above 50%
                // Dragging downwards
                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                    return;
                }
                // Dragging upwards
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                    return;
                }
                // Time to actually perform the action
                reorderItems(dragIndex, hoverIndex);
                // Note: we're mutating the monitor item here!
                // Generally it's better to avoid mutations,
                // but it's good here for the sake of performance
                // to avoid expensive index searches.
                item.index = hoverIndex;
            },
        });

        const [{ isDragging }, drag] = useDrag({
            type: 'draggablechip',
            item: () => {
                return { id, index }
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });
        const opacity = isDragging ? 0 : 1;
        drag(drop(ref));

        return (
            <ListItem
                ref={ref}
                data-handler-id={handlerId}
                style={{ opacity }}
            >
                {message === MSBLSB_PLACEHOLDER &&
                    <Chip
                        icon={
                            <DragIndicatorRoundedIcon />
                        }
                        label={MSBFirst ? "MSB/LSB" : "LSB/MSB"}
                        size="small"
                        color="secondary"
                        variant="outlined"
                    />
                }
                {message !== MSBLSB_PLACEHOLDER && editChipIndex !== index &&
                    <Chip
                        icon={
                            <DragIndicatorRoundedIcon />
                        }
                        label={message}
                        size="small"
                        color="primary"
                        clickable={true}
                        onClick={showEditChip(index)}
                        onDelete={handleDelete(index)}
                    />
                }
                {message !== MSBLSB_PLACEHOLDER && editChipIndex === index &&
                    <EditChip />
                }
            </ListItem>
        );
    }

    const MessageList = function () {
        return (
            <Paper
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    maxWidth: 70,
                    p: 2,
                    m: 0,
                }}
                component="ul"
            >
                <ListItem>
                    <Chip
                        label={'F0'}
                        size="small"
                        sx={{ fontSize: 12 }}
                        icon={<PushPinRoundedIcon />}
                    />
                </ListItem>

                <DndProvider backend={HTML5Backend}>
                    {fullSysExMessage.map((message, index) => (
                        <DraggableChip
                            reorderItems={reorderItems}
                            id={index}
                            key={index}
                            index={index}
                            message={message}
                        />
                    ))}
                    {sysExMessage.length < 10 &&
                        <ListItem>
                            <IconButton
                                color="success"
                                size="small"
                                component="label"
                                variant="outlined"
                                onClick={addMessageByte}
                            >
                                <AddCircleOutlineRoundedIcon />
                            </IconButton>
                        </ListItem>
                    }
                </DndProvider>

                <ListItem>
                    <Chip
                        label={'F7'}
                        size="small"
                        sx={{ fontSize: 12 }}
                        icon={<PushPinRoundedIcon />}
                    />
                </ListItem>
            </Paper >
        );
    }

    return (
        <Stack
            direction="row"
            spacing={2}
        >
            <MessageList />
            <Stack
                direction="column"
                spacing={2}
            >
                <FormControl fullWidth>
                    <TextField
                        label="Min value"
                        type="number"
                        size="small"
                        InputProps={{ inputProps: { min: 0, max: 127 } }}
                        value={minValue}
                        onChange={handleMinValueChange}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        label="Max value"
                        type="number"
                        size="small"
                        InputProps={{ inputProps: { min: 0, max: 127 } }}
                        value={maxValue}
                        onChange={handleMaxValueChange}
                    />
                </FormControl>
                <Button
                    onClick={handleSysExMSBLSBSwitch}
                    color="secondary"
                >
                    {MSBFirst &&
                        <Stack
                            direction="row"
                        >
                            <Typography>MSB</Typography>
                            <SwapHorizRoundedIcon />
                            <Typography>LSB</Typography>
                        </Stack>
                    }
                    {!MSBFirst &&
                        <Stack
                            direction="row"
                        >
                            <Typography>LSB</Typography>
                            <SwapHorizRoundedIcon />
                            <Typography>MSB</Typography>
                        </Stack>
                    }
                </Button>
            </Stack>

        </Stack>
    )
}

export default SysExForm;