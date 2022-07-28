import React, { useEffect, useRef, useState } from 'react';
import { findIndex, isEmpty } from 'lodash';
import { WebMidi } from "webmidi";
import {
  N32B,
  Editor,
  SysExEditor,
  UpdateDevice,
  ConnectDevice,
  Version,
  SyncDevice
} from './components';
import {
} from './presetTemplates';
import defaultPreset from './presetTemplates/default/default.json';
import sysExPreset from './presetTemplates/default/sysEx.json';
import logo from './components/images/shik-logo-small.png';
import './App.css';
import { Container } from '@mui/system';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import SimCardDownloadRoundedIcon from '@mui/icons-material/SimCardDownloadRounded';
import { validateValueRange } from './components/UpdateDevice/utils';
import { ModeIndexes } from './components/Editor/Modes';
import { SEND_FIRMWARE_VERSION, SYNC_KNOBS } from './components/UpdateDevice/commands';

function App() {
  const [deviceIsConnected, setDeviceIsConnected] = useState(false);
  const [midiInput, setMidiInput] = useState(null);
  const [midiOutput, setMidiOutput] = useState(null);
  const [currentPreset, updatePreset] = useState();
  const [selectedKnobIndex, setSelectedKnobIndex] = useState(0);
  const [knobsData, setKnobsData] = useState();
  const [currentDevicePresetIndex, updateCurrentDevicePresetIndex] = useState(0);
  const [firmwareVersion, setFirmwareVersion] = useState();
  const [midiDeviceName, setMidiDeviceName] = useState();
  const appVersion = 'v2.1.0';

  useEffect(() => {
    WebMidi.enable((err) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      }
      WebMidi.addListener("connected", function (event) {
        if (WebMidi.getInputByName("N32B")) {
          setMidiInput(WebMidi.getInputByName("N32B"));
          setMidiOutput(WebMidi.getOutputByName("N32B"));
        }
      });

      WebMidi.addListener("disconnected", function (event) {
        setMidiInput(null);
        setMidiOutput(null);
      });
    }, true);
  });

  useEffect(() => {
    if (midiOutput && midiInput) {
      midiInput.addListener('programchange', undefined, handleProgramChange);
      midiInput.addListener('sysex', 'all', handleSysex);
      handleGetDeviceFirmwareVersion();
      handleLoadFromDevice();
      setMidiDeviceName(midiOutput.name);
      setDeviceIsConnected(true);

      return () => {
        midiInput.removeListener('programchange', undefined, handleProgramChange);
        midiInput.removeListener('sysex', undefined, handleSysex);
        setFirmwareVersion(null);
      };
    } else {
      setDeviceIsConnected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiInput, midiOutput]);

  useEffect(() => {
    if (midiOutput) {
      midiOutput.sendProgramChange(currentDevicePresetIndex, 1);
    }
  }, [currentDevicePresetIndex, midiOutput]);

  useEffect(() => {
    if (isEmpty(knobsData)) return;
    updatePreset(prev => ({
      ...prev,
      knobs: [...knobsData]
    }));
  }, [knobsData]);

  useEffect(() => {
    updatePreset(prev => ({
      ...prev,
      presetID: currentDevicePresetIndex
    }));
  }, [currentDevicePresetIndex]);

  useEffect(() => {
    if (firmwareVersion && firmwareVersion[0] > 29) {
      updatePreset(sysExPreset);
      setKnobsData(sysExPreset.knobs);
    } else {
      updatePreset(defaultPreset);
      setKnobsData(defaultPreset.knob);
    }
  }, [firmwareVersion]);

  const fileInput = useRef(null);
  const handleFileInputClick = event => {
    event.target.value = null;
    fileInput.current.click();
  }
  const handleLoadPreset = e => {
    const reader = new FileReader();
    if (fileInput.current.files.length > 0) {
      const file = fileInput.current.files[0];
      reader.onload = (event => {
        const preset = JSON.parse(event.target.result);
        setKnobsData(preset.knobs);
      });
      reader.readAsText(file);
    }
  }
  const handleSavePreset = async () => {
    const fileName = `N32B-Preset-${currentPreset.presetID}`;
    const json = JSON.stringify(currentPreset);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleKnobDataChange(data) {
    setKnobsData(prevKnobsData => [
      ...prevKnobsData.slice(0, selectedKnobIndex),
      {
        ...prevKnobsData[selectedKnobIndex],
        ...data
      },
      ...prevKnobsData.slice(selectedKnobIndex + 1)
    ]);
  }
  const handleProgramChange = event => {
    updateCurrentDevicePresetIndex(event.data[1]);
  }

  function handleReadFromDevice(data, knobIndex) {
    setKnobsData(prevKnobsData => [
      ...prevKnobsData.slice(0, knobIndex),
      {
        ...prevKnobsData[knobIndex],
        ...data
      },
      ...prevKnobsData.slice(knobIndex + 1)
    ]);
  }

  const handleSysex = event => {
    const {
      dataBytes,
      message: {
        manufacturerId
      }
    } = event;
    if (manufacturerId[0] === 32) {
      switch (dataBytes[0]) {
        case SEND_FIRMWARE_VERSION:
          if (dataBytes.length > 2) {
            setFirmwareVersion(dataBytes.slice(1));
          }
          break;
        case SYNC_KNOBS:
          if (dataBytes.length > 7) {
            const knobIndex = findIndex(knobsData, knob => knob.hardwareId === dataBytes[1]);
            if (knobIndex > -1) {
              const knobData = {
                ...knobsData[knobIndex],
                mode: dataBytes[5],
                msb: dataBytes[2],
                lsb: dataBytes[3],
                channel: dataBytes[4],
                invert_a: Boolean(dataBytes[6]),
                invert_b: Boolean(dataBytes[7])
              };
              handleReadFromDevice(knobData, knobIndex);
            }
          }
          break;

        default:
          break;
      }
    }
  }


  function handleSysExChange(sysExMessage) {
    // const value = event.target.value
    //   .replace(/.{1,2}(?=(.{2})+$)/g, '$& ') // Space after 2 digits
    if (sysExMessage.length > 10) return; // Limit sysEx data
    handleKnobDataChange({ sysExMessage });
  }

  function handleSysExMSBLSBSwitch() {
    handleKnobDataChange({
      MSBFirst: !knobsData[selectedKnobIndex].MSBFirst
    });
  }

  function handleSysExValuesIndexChange(valuesIndex) {
    handleKnobDataChange({
      valuesIndex
    });
  }

  function handleMinValueChange(event) {
    handleKnobDataChange({
      minValue: validateValueRange(event.target)
    });
  }
  function handleMaxValueChange(event) {
    handleKnobDataChange({
      maxValue: validateValueRange(event.target)
    });
  }
  function handleModeSelect(event) {
    let newData = {
      mode: parseInt(event.target.value)
    };
    if (newData.mode === ModeIndexes.KNOB_MODE_HIRES) {
      if (knobsData[selectedKnobIndex].msb > 31) {
        newData = {
          ...newData,
          msb: 0,
          lsb: 32
        }
      } else {
        newData = {
          ...newData,
          lsb: knobsData[selectedKnobIndex].msb + 32
        }
      }
    }
    handleKnobDataChange(newData);
  }

  function handleChannelChange(event) {
    handleKnobDataChange({
      channel: parseInt(event.target.value)
    });
  }

  function handleMSBChange(event) {
    handleKnobDataChange({
      msb: validateValueRange(event.target)
    });
  }
  function handleLSBChange(event) {
    handleKnobDataChange({
      lsb: validateValueRange(event.target)
    });
  }

  function handleHiResChange(event) {
    handleKnobDataChange({
      msb: validateValueRange(event.target),
      lsb: validateValueRange(event.target) + 32
    });
  }

  function handleInvertValueAChange(event) {
    handleKnobDataChange({
      invert_a: event.target.checked
    });
  }

  function handleInvertValueBChange(event) {
    handleKnobDataChange({
      invert_b: event.target.checked
    });
  }
  const handleGetDeviceFirmwareVersion = () => {
    midiOutput.sendSysex(32, [SEND_FIRMWARE_VERSION]);
  }
  const handleLoadFromDevice = () => {
    midiOutput.sendSysex(32, [SYNC_KNOBS]);
  }
  const handleFirmwareUpdate = () => {
    window.open("https://shik.tech/firmware-update/");
  }

  return (
    <Container maxWidth="lg">
      <Box>
        <AppBar position="static" >
          <Toolbar variant="dense">
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" light />}
                sx={{ flexGrow: 1 }}
              >
                <Box
                  component="img"
                  alt="SHIK logo"
                  src={logo}
                  sx={{
                    height: 20,
                    pt: 1
                  }}
                />
                <Typography sx={{ pt: 1 }} variant="body2" component="div">
                  N32B Editor
                </Typography>
                {deviceIsConnected && firmwareVersion &&
                  <Typography sx={{ pt: 1 }} variant="body2" component="div">
                    {midiDeviceName} < Typography variant="caption" >(v.{firmwareVersion.join('.')})</Typography>
                  </Typography>
                }
              </Stack>
              {deviceIsConnected && !firmwareVersion &&
                <Button
                  onClick={handleFirmwareUpdate}
                  color="error"
                >
                  Firmware Update
                </Button>
              }
              {deviceIsConnected && firmwareVersion && currentPreset &&
                <Stack
                  direction="row"
                  spacing={2}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<UploadFileRoundedIcon />}
                    onClick={handleFileInputClick}
                  >
                    Load
                    <input
                      hidden
                      type="file"
                      ref={fileInput}
                      onChange={handleLoadPreset}
                    />
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="success"
                    endIcon={<SimCardDownloadRoundedIcon />}
                    onClick={handleSavePreset}
                  >
                    Save
                  </Button>

                  <UpdateDevice
                    currentPreset={currentPreset}
                    midiOutput={midiOutput}
                    currentDevicePresetIndex={currentDevicePresetIndex}
                    updateCurrentDevicePresetIndex={updateCurrentDevicePresetIndex}
                  />

                  <SyncDevice
                    currentPreset={currentPreset}
                    currentDevicePresetIndex={currentDevicePresetIndex}
                    updateCurrentDevicePresetIndex={updateCurrentDevicePresetIndex}
                    handleLoadFromDevice={handleLoadFromDevice}
                  />
                </Stack>
              }

              {/* <PresetSelect
                handlePresetChange={handlePresetChange}
                handlePresetNameChange={handlePresetNameChange}
                currentPresetIndex={currentPresetIndex}
                presets={presets}
              /> */}
            </Stack>
          </Toolbar>
        </AppBar>
        {!deviceIsConnected &&
          <ConnectDevice />
        }

        {deviceIsConnected && firmwareVersion && knobsData &&
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={4}
            sx={{ mt: 2 }}
          >
            <Stack>
              <N32B
                knobsData={knobsData}
                selectedKnobIndex={selectedKnobIndex}
                setSelectedKnob={setSelectedKnobIndex}
              />
              <Version appVersion={appVersion} />
            </Stack>

            <Stack
              sx={{ flexGrow: 1 }}
              spacing={2}
            >
              <Typography variant="h5" component="div" gutterBottom>
                Editing Knob: <span className="currentKnob">{knobsData[selectedKnobIndex].id}</span>
              </Typography>
              {firmwareVersion[0] < 30 &&
                <Editor
                  currentKnob={knobsData[selectedKnobIndex]}
                  handleChannelChange={handleChannelChange}
                  handleMSBChange={handleMSBChange}
                  handleLSBChange={handleLSBChange}
                  handleInvertValueAChange={handleInvertValueAChange}
                  handleInvertValueBChange={handleInvertValueBChange}
                  handleHiResChange={handleHiResChange}
                  handleModeSelect={handleModeSelect}
                />
              }
              {firmwareVersion[0] > 29 &&
                <SysExEditor
                  currentKnob={knobsData[selectedKnobIndex]}
                  handleSysExChange={handleSysExChange}
                  handleSysExMSBLSBSwitch={handleSysExMSBLSBSwitch}
                  handleMinValueChange={handleMinValueChange}
                  handleMaxValueChange={handleMaxValueChange}
                  handleSysExValuesIndexChange={handleSysExValuesIndexChange}
                />
              }
            </Stack>
          </Stack>
        }
      </Box>
    </Container >
  );
}

export default App;
