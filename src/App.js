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
import { AppBar, Box, Divider, Grid, IconButton, Menu, Stack, Toolbar, Typography } from '@mui/material';


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

  return (
    <Container maxWidth="lg">
      {!deviceIsConnected &&
        <ConnectDevice />
      }
      {deviceIsConnected &&
        <>
          <AppBar position="static">
            <Container>
              <Toolbar disableGutters>
                <Stack direction="row" spacing={2}>
                  <img src={logo} alt="SHIK Logo" height={48} />
                  <div className="title">N32B Editor</div>
                  <label>Device:</label>
                  <div className="headerValue">{midiOutput.name}</div>
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

          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <N32B
                  knobsData={currentPreset.knobs}
                  knobsPerRow={knobsPerRow}
                  selectedKnobIndex={selectedKnobIndex}
                  setSelectedKnob={setSelectedKnobIndex}
                />
                <Version appVersion={appVersion} />
              </Grid>

              <Grid item xs={6}>
                Editing Knob: <span className="currentKnob">{currentPreset.knobs[selectedKnobIndex].id}</span>
                {/* {!isDualMode &&
                <label className="highResolution">
                  <input type="checkbox" checked={highResolution} onChange={handleHighResolutionChange} /> Hi-Res
                </label>
              } */}

                <Divider />

                <div className="row flex-2">
                  <Editor
                    knobData={knobsData[selectedKnobIndex]}
                    handleKnobDataChange={handleKnobDataChange}
                    setIsPristine={setIsPristine}
                  />
                </div>

                <Divider />


                <PresetOperations
                  // isDualMode={isDualMode}
                  currentPreset={currentPreset}
                  midiInput={midiInput}
                  midiOutput={midiOutput}
                  currentDevicePresetIndex={currentDevicePresetIndex}
                  handleLoadNewPreset={handleLoadNewPreset}
                  updateCurrentDevicePresetIndex={updateCurrentDevicePresetIndex}
                />
              </Grid>
            </Grid>
          </Box>
        </>
      }
    </Container >
  );
}

export default App;
