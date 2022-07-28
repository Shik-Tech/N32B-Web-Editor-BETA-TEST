import styled from "@emotion/styled";
import {
    Button,
    Chip,
    FormControl,
    IconButton,
    Paper,
    Stack,
    TextField
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useCallback, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
        MSBFirst,
        minValue,
        maxValue },
    handleSysExChange,
    handleSysExMSBLSBSwitch,
    handleMinValueChange,
    handleMaxValueChange
}) {
    const classes = useStyles();
    const [editChipIndex, setEditChipIndex] = useState(-1);
    // console.log(sysExMessage);
    // console.log(editChipIndex);
    // const moveCard = useCallback((dragIndex, hoverIndex) => {
    //     handleSysExChange(sysExMessage.splice([dragIndex, 1], [hoverIndex, 0, sysExMessage[dragIndex]]));
    // }, []);

    const onDragEnd = useCallback((dragIndex, hoverIndex) => {
        const newSysExMessage = Array.from(sysExMessage);
        const [removed] = newSysExMessage.splice(dragIndex, 1);
        newSysExMessage.splice(hoverIndex, 0, removed);
        // console.log(sysExMessage);
        // console.log(newSysExMessage);
        handleSysExChange(newSysExMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = item => () => {
        const newSysExMessage = [...sysExMessage];
        newSysExMessage.splice(newSysExMessage.indexOf(item), 1);

        console.log(sysExMessage);
        console.log(newSysExMessage);
        handleSysExChange(newSysExMessage);
    };

    function handleByteChange(event) {
        if (/[fF]+7/.test(event.target.value)) return; // Do not allow end of message byte (F7)
        const sysExNewByte = event.target.value
            .replace(/[^0-9a-fA-F]/g, '') // HEX characters only
            .toUpperCase();

        handleSysExChange([
            ...sysExMessage.slice(0, editChipIndex),
            sysExNewByte,
            ...sysExMessage.slice(editChipIndex + 1)
        ]);
    }

    const showEditChip = index => () => {
        setEditChipIndex(index)
    };
    const removeEditChip = () => {
        if (!sysExMessage[editChipIndex].length) {
            handleSysExChange([
                ...sysExMessage.slice(0, editChipIndex),
                ...sysExMessage.slice(editChipIndex + 1),
            ]);
        }
        setEditChipIndex(-1);
    }
    const addMessageByte = () => {
        setEditChipIndex(sysExMessage.length + 1);
        handleSysExChange([
            ...sysExMessage.slice(0, sysExMessage.length),
            "00"
        ]);
    }

    const EditChip = function () {
        return (
            <Stack
                direction="row"
            >
                <TextField
                    value={sysExMessage[editChipIndex]}
                    onBlur={removeEditChip}
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

                    onClick={removeEditChip}
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

    const DraggableChip = function ({ message, index, id, onDragEnd }) {
        const ref = useRef(null);
        const [{ handlerId }, drop] = useDrop({
            accept: 'DraggableChip',
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
                onDragEnd(dragIndex, hoverIndex);
                // Note: we're mutating the monitor item here!
                // Generally it's better to avoid mutations,
                // but it's good here for the sake of performance
                // to avoid expensive index searches.
                item.index = hoverIndex;
            },
        });

        const [{ isDragging }, drag] = useDrag({
            type: 'DraggableChip',
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
                style={{ opacity }}
            >
                {editChipIndex !== index &&
                    <Chip
                        ref={ref}
                        style={{ opacity }}
                        icon={
                            <DragIndicatorRoundedIcon
                                data-handler-id={handlerId}
                            />
                        }
                        label={message}
                        size="small"
                        color="primary"
                        clickable={true}
                        onClick={showEditChip(index)}
                        onDelete={handleDelete(message)}
                    />
                }
                {editChipIndex === index &&
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
                        variant="outlined"
                    />
                </ListItem>

                <DndProvider backend={HTML5Backend}>
                    {sysExMessage.map((message, index) => (
                        <DraggableChip
                            onDragEnd={onDragEnd}
                            id={index}
                            key={index}
                            index={index}
                            message={message}
                        />
                    ))}
                </DndProvider>

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
                <ListItem>
                    <Chip
                        icon={<DragIndicatorRoundedIcon />}
                        label={MSBFirst ? "MSB" : "LSB"}
                        size="small"
                        variant="outlined"
                        color="secondary"
                    />
                </ListItem>
                <ListItem>
                    <Chip
                        icon={<DragIndicatorRoundedIcon />}
                        label={MSBFirst ? "LSB" : "MSB"}
                        size="small"
                        variant="outlined"
                        color="secondary"
                    />
                </ListItem>
                <ListItem>
                    <Chip
                        label={'F7'}
                        size="small"
                        variant="outlined"
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
                >
                    Switch MSB/LSB
                </Button>
            </Stack>

        </Stack>
    )
}

export default SysExForm;