import React, { useEffect, useState } from 'react';
import { find } from 'lodash';
import { WebMidi } from "webmidi";
import {
  N32B,
  // HighResEditor,
  // DualModeEditor,
  Editor,
  PresetOperations,
  ConnectDevice,
  // PresetSelect,
  Version
} from './components';
import {
  // defaultsPresets,
  // dualModePresets,
  // highResPresets
} from './presetTemplates';
import Popup from 'react-popup';
import defaultPreset from './presetTemplates/default/default.json';
import logo from './components/images/shik-logo-white-orange_1024x1024.png';
import './App.css';
import './Popup.css';
import { Container } from '@mui/system';
import {
  AppBar,
  Box,
  Divider,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import { validateValueRange } from './components/PresetOperations/utils';
import { ModeIndexes } from './components/Editor/Modes';


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
      Popup.close();
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
    console.log(e);
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

  return (
    <Container maxWidth="lg">
      {!deviceIsConnected &&
        <ConnectDevice />
      }
      {deviceIsConnected &&
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Container>
              <Toolbar disableGutters>
                <Stack direction="row" spacing={2}>
                  <img src={logo} alt="SHIK Logo" height={48} />
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    N32B Editor
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Device: {midiOutput.name}
                  </Typography>
                  {/* <PresetSelect
                handlePresetChange={handlePresetChange}
                handlePresetNameChange={handlePresetNameChange}
                currentPresetIndex={currentPresetIndex}
                presets={presets}
              /> */}
                </Stack>
              </Toolbar>
            </Container>
          </AppBar>

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
              divider={<Divider />}
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

              <PresetOperations
                // isDualMode={isDualMode}
                currentPreset={currentPreset}
                midiInput={midiInput}
                midiOutput={midiOutput}
                currentDevicePresetIndex={currentDevicePresetIndex}
                handleLoadNewPreset={handleLoadNewPreset}
                updateCurrentDevicePresetIndex={updateCurrentDevicePresetIndex}
              />
            </Stack>
          </Stack>
        </Box>
      }
    </Container >
  );
}

export default App;
