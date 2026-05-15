# DiffusionDesk

A premium image generation frontend for ComfyUI.

## Features

- Text2Image
- Image2Image
- Inpaint
- Inpaint Sketch with direct draw-on-image masking
- Local ComfyUI proxy to avoid CORS issues
- Configurable ComfyUI API URL
- Configurable checkpoint folder path
- Checkpoint dropdown
- Dark/light theme
- Recent generation history
- Responsive UI

## Requirements

- Node.js
- ComfyUI installed and running locally
- At least one checkpoint visible to ComfyUI

ComfyUI Desktop for macOS often runs on:

```text
http://127.0.0.1:8000
```

Manual/GitHub ComfyUI installs often run on:

```text
http://127.0.0.1:8188
```

## Install

```bash
cd "/PATH/TO/DIFFUSIONDESK/ZIP"
unzip diffusiondesk.zip
cd diffusiondesk
npm install
npm run dev
```

Open:

```Browser
http://127.0.0.1:5173
```

## Settings

Open Settings inside DiffusionDesk and configure:

```text
ComfyUI API URL
Checkpoint Folder
Theme
```

Example checkpoint folder for ComfyUI Desktop on macOS:

```text
/PATH/TO/ComfyUI/models/checkpoints
```

## Compatibility note

DiffusionDesk can discover any checkpoint ComfyUI can see, but workflow compatibility depends on the model family.

This first version uses simple SD-style workflows. SDXL, Flux, SD3, Pony, ControlNet-heavy workflows, and specialty pipelines may require dedicated workflow templates later.

## Safety note

The local proxy only allows localhost ComfyUI targets such as:

```text
http://127.0.0.1:8000
http://127.0.0.1:8188
http://localhost:8188
```
