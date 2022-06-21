import React, { useEffect, useRef, useState } from 'react';
import { find } from 'lodash';
import { WebMidi } from "webmidi";
import {
  N32B,
  // HighResEditor,
  // DualModeEditor,
  Editor,
  UpdateDevice,
  ConnectDevice,
  // PresetSelect,
  Version
} from './components';
import {
  // defaultsPresets,
  // dualModePresets,
  // highResPresets
} from './presetTemplates';
import defaultPreset from './presetTemplates/default/default.json';
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
import { LOAD_PRESET } from './components/UpdateDevice/commands';


function App() {
  const appVersion = "v2.0.0";
  const knobsPerRow = 8;

  const [deviceIsConnected, setDeviceIsConnected] = useState(false);
  const [midiInput, setMidiInput] = useState(null);
  const [midiOutput, setMidiOutput] = useState(null);
  const [currentPreset, updatePreset] = useState(defaultPreset);
  const [selectedKnobIndex, setSelectedKnobIndex] = useState(0);
  // const [selectedKnobData, setSelectedKnobData] = useState(defaultPreset.knobs[0]);
  const [knobsData, setKnobsData] = useState(defaultPreset.knobs);
  // const [currentPresetIndex, updateCurrentPresetIndex] = useState(0);
  const [currentDevicePresetIndex, updateCurrentDevicePresetIndex] = useState(0);
  // const [currentPresetName, updatePresetName] = useState('');
  // const [highResolution, updateHighResolution] = useState(true);
  const [presets, setPresets] = useState([]);
  const [isPristine, setIsPristine] = useState(true);

  useEffect(() => {
    WebMidi.enable((err) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      }
      WebMidi.addListener("connected", function (e) {
        if (WebMidi.getInputByName("N32B")) {
          // setPresets(defaultsPresets);
          setMidiInput(WebMidi.getInputByName("N32B"));
          setMidiOutput(WebMidi.getOutputByName("N32B"));
        }
      });

      WebMidi.addListener("disconnected", function (e) {
        setMidiInput(null);
        setMidiOutput(null);
      });
    }, true);
  });

  useEffect(() => {
    if (midiOutput && midiInput) {
      setDeviceIsConnected(true);
      midiInput.addListener('programchange', undefined, handleProgramChange);
      midiInput.addListener('sysex', 'all', handleSysex);

      return () => {
        midiInput.removeListener('programchange', undefined, handleProgramChange);
        midiInput.removeListener('sysex', undefined, handleSysex);
      };
    } else {
      setDeviceIsConnected(false);
    }
  }, [midiInput, midiOutput]);


  // useEffect(() => {
  //   if (presets.length > 0) {
  //     updatePreset(presets[currentPresetIndex]);
  //   }
  // }, [presets, currentPresetIndex]);


  useEffect(() => {
    if (midiOutput) {
      midiOutput.sendProgramChange(currentDevicePresetIndex, 1);

      updatePreset(prev => ({
        ...prev,
        presetID: currentDevicePresetIndex
      }));
    }
  }, [currentDevicePresetIndex, midiOutput]);

  useEffect(() => {
    updatePreset(prev => ({
      ...prev,
      knobs: [...knobsData]
    }))
  }, [knobsData]);

  // useEffect(() => {
  //   const isExistingPreset = find(presets, preset => preset.presetName === 'User Custom');
  //   if (!isExistingPreset) {
  //     setPresets(prev => ([
  //       {
  //         ...currentPreset,
  //         presetName: 'User Custom'
  //       },
  //       ...prev
  //     ]));
  //   }
  //   updateCurrentPresetIndex(0);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isPristine]);

  // const handlePresetChange = e => {
  //   setIsPristine(true);
  //   updateCurrentPresetIndex(parseInt(e.target.value));
  // }

  const fileInput = useRef(null);

  const handleLoadPreset = e => {
    const reader = new FileReader();
    if (fileInput.current.files.length > 0) {
      const file = fileInput.current.files[0];
      // updatePresetName(file.name);
      reader.onload = (event => {
        const preset = JSON.parse(event.target.result);
        handleLoadNewPreset(preset);
        updateCurrentDevicePresetIndex(0);
      });
      reader.readAsText(file);
    }
  }

  const handleSavePreset = e => {
    // const presetFilePath = dialog.showSaveDialogSync({
    //     title: 'Save Preset',
    //     buttonLabel: 'Save Preset'
    // });
    // if (presetFilePath) {
    //     try {
    //         jetpack.write(presetFilePath, currentPreset);
    //     }
    //     catch (err) {
    //         console.log('error: ', err);
    //     }
    // }
  }

  function handleKnobDataChange(data) {
    setKnobsData([
      ...knobsData.slice(0, selectedKnobIndex),
      {
        ...knobsData[selectedKnobIndex],
        ...data
      },
      ...knobsData.slice(selectedKnobIndex + 1)
    ]);
  }
  const handleProgramChange = e => {
    updateCurrentDevicePresetIndex(e.data[1]);
  }

  const handleLoadNewPreset = preset => {
    setPresets(prev => ([
      preset,
      ...prev
    ]));
  }

  // const handlePresetNameChange = e => {
  //   updatePreset(prev => ({
  //     ...prev,
  //     presetName: e.target.value
  //   }));
  // }

  const handleSysex = e => {
    // console.log(e);
  }

  function handleModeSelect(e) {
    let newData = {
      mode: parseInt(e.target.value)
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

  function handleChannelChange(e) {
    handleKnobDataChange({
      channel: parseInt(e.target.value)
    });
  }

  function handleMSBChange(e) {
    handleKnobDataChange({
      msb: validateValueRange(e.target)
    });
  }
  function handleLSBChange(e) {
    handleKnobDataChange({
      lsb: validateValueRange(e.target)
    });
  }

  function handleHiResChange(e) {
    handleKnobDataChange({
      msb: validateValueRange(e.target),
      lsb: validateValueRange(e.target) + 32
    });
  }

  function handleInvertValueAChange(e) {
    handleKnobDataChange({
      invert_a: e.target.checked
    });
  }

  function handleInvertValueBChange(e) {
    handleKnobDataChange({
      invert_b: e.target.checked
    });
  }

  const handleLoadFromDevice = e => {
    midiOutput.sendSysex(32, [LOAD_PRESET]);
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
                {deviceIsConnected &&
                  <Typography sx={{ pt: 1 }} variant="body2" component="div">
                    Device: {midiOutput.name}
                  </Typography>
                }
              </Stack>
              {deviceIsConnected &&
                <Stack
                  direction="row"
                  spacing={2}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<UploadFileRoundedIcon />}
                    onClick={() => fileInput.current.click()}
                  >
                    Load
                  </Button>
                  <input
                    className="hiddenField"
                    type="file"
                    ref={fileInput}
                    onChange={handleLoadPreset}
                  />
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

                  {/* <Button
                    // endIcon={<DownloadingRoundedIcon />}
                    onClick={handleLoadFromDevice}
                  >
                    <Typography>
                      Device Settings
                    </Typography>
                  </Button> */}
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
        {deviceIsConnected &&
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={4}
            sx={{ mt: 2 }}
          >
            <Stack>
              <N32B
                knobsData={currentPreset.knobs}
                knobsPerRow={knobsPerRow}
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
                Editing Knob: <span className="currentKnob">{currentPreset.knobs[selectedKnobIndex].id}</span>
              </Typography>

              <Editor
                currentKnob={knobsData[selectedKnobIndex]}
                handleKnobDataChange={handleKnobDataChange}
                handleChannelChange={handleChannelChange}
                handleMSBChange={handleMSBChange}
                handleLSBChange={handleLSBChange}
                handleInvertValueAChange={handleInvertValueAChange}
                handleInvertValueBChange={handleInvertValueBChange}
                handleHiResChange={handleHiResChange}
                handleModeSelect={handleModeSelect}
              />


            </Stack>
          </Stack>
        }
      </Box>
    </Container >
  );
}

export default App;
