import {Config} from '@remotion/cli/config';

// Set entry point to the Remotion index file
Config.setEntryPoint('./src/index.tsx');

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');

// Quality settings
Config.setJpegQuality(80);
Config.setCrf(23);

// Performance settings
Config.setConcurrency(4);

// Audio settings
Config.setAudioCodec('aac');

export default Config;