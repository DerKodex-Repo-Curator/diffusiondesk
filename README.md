# DiffusionDesk

<p align="center">
  <img src="./screenshots/hero.png" alt="DiffusionDesk Hero" width="100%" />
</p>

<p align="center">
  <strong>Modern local-first AI image workstation for ComfyUI.</strong>
</p>

<p align="center">
  Text2Image • Image2Image • Inpaint • Inpaint Sketch
</p>

<p align="center">
  Premium glass UI inspired by modern creative software.
</p>

---

## Preview

<p align="center">
  <img src="./screenshots/dashboard.png" width="100%" />
</p>

<p align="center">
  <img src="./screenshots/inpaint.png" width="49%" />
  <img src="./screenshots/settings.png" width="49%" />
</p>

---

## Features

- Modern glassmorphism UI
- Local-first architecture
- Direct ComfyUI integration
- Text2Image
- Image2Image
- Inpaint
- Inpaint Sketch
- Generation history
- Checkpoint selector
- Dark / Light mode
- Local proxy with CORS handling
- Configurable API endpoint
- Responsive design

---

## Installation

bash
git clone https://github.com/tonybriant/diffusiondesk.git
cd diffusiondesk
npm install
npm run dev

---

## Dependencies

You need to have ComfyUI installed and running.
You can do this by either opening the ComfyUI App and checking the console for the port comfyui is being exposed on (typically http://127.0.0.1:8188)
Or you can run comfyui backend directly from Terminal by navigating to the ComfyUI application folder:

cd ~/ComfyUI
python main.py

You also need to import the SD1.5 JSON to your nodes/workflow.

## Access DiffusionDesk from another device within your LAN.

Change the Vite dev server host from localhost-only to LAN-accessible.
In package.json, change your dev script from:
"dev": "vite --host 127.0.0.1"
to: "dev": "vite --host 0.0.0.0"

then run: npm run dev 

Vite should show something like:
Local:   http://localhost:5173/
Network: http://192.168.x.x:5173/

Open the Network URL from another device on the same Wi-Fi/LAN.

