/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

const soundSets = {
    operagx: {
        click1: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/default/click1.wav"),
        click2: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/default/click2.wav"),
        click3: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/default/click3.wav"),
        backspace: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/default/backspace.wav")
    },
    anime: {
        click1: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/anime/click1.wav"),
        click2: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/anime/click2.wav"),
        click3: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/anime/click3.wav"),
        backspace: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/anime/backspace.wav")
    },
    cozy: {
        click1: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/cozy/click1.wav"),
        click2: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/cozy/click2.wav"),
        click3: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/cozy/click3.wav"),
        backspace: new Audio("https://github.com/EvilNick2/vencord/raw/main/keyboardSounds/sounds/cozy/backspace.wav")
    }
};

let selectedSoundSet = soundSets.operagx;

const ignoredKeys = ["CapsLock", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", "AltLeft", "AltRight", "MetaLeft", "MetaRight", "ArrowUp", "ArrowRight", "ArrowLeft", "ArrowDown", "MediaPlayPause", "MediaStop", "MediaTrackNext", "MediaTrackPrevious", "MediaSelect", "MediaEject", "MediaVolumeUp", "MediaVolumeDown", "AudioVolumeUp", "AudioVolumeDown"];

const keydown = (e: KeyboardEvent) => {
    if (ignoredKeys.includes(e.code)) return;
    if (!selectedSoundSet) return;
    for (const sound of Object.values(selectedSoundSet)) sound.pause();
    if (e.code === "Backspace") {
        selectedSoundSet.backspace.currentTime = 0;
        selectedSoundSet.backspace.play();
    } else {
        const click = selectedSoundSet[`click${Math.floor(Math.random() * 3) + 1}`];
        click.currentTime = 0;
        click.play();
    }
};

const setVolume = (volume: number) => {
    if (!selectedSoundSet) return;
    for (const sound of Object.values(selectedSoundSet)) {
        sound.volume = volume / 100;
    }
};

const settings = definePluginSettings({
    volume: {
        description: "Volume",
        type: OptionType.SLIDER,
        markers: [0, 100],
        stickToMarkers: false,
        default: 100,
        onChange: value => setVolume(value)
    },
    sounds: {
        description: "Choose which set of sounds to use",
        type: OptionType.SELECT,
        default: "operagx",
        options: [
            {
                label: "Opera GX",
                value: "operagx",
            },
            {
                label: "Anime",
                value: "anime",
            },
            {
                label: "Cozy",
                value: "cozy",
            },
        ],
        onChange: value => {
            selectedSoundSet = soundSets[value];
            setVolume(settings.store.volume !== undefined ? settings.store.volume : 100);
        }
    }
});

export default definePlugin({
    name: "Keyboard Sounds",
    description: "Adds the Opera GX Keyboard Sounds to Discord",
    authors: [
        { name: "EvilNick", id: 391839189160951808n },
    ],
    settings,
    start: () => {
        const soundSetKey = settings.store.sounds || "operagx";
        selectedSoundSet = soundSets[soundSetKey];
        setVolume(settings.store.volume !== undefined ? settings.store.volume : 100);
        document.addEventListener("keydown", keydown);
    },
    stop: () => document.removeEventListener("keydown", keydown),
});
