import OptionInterface from './interfaces/OptionInterface';
import { NoiseType } from './NoiseType';
/**
 * JS reverb effect class
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019-2021 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 * @see       {@link https://github.com/logue/Reverb.js}
 *            {@link https://github.com/web-audio-components/simple-reverb}
 */
export default class Reverb {
    /** Version strings */
    readonly version: string;
    /** Build date */
    readonly build: string;
    /** AudioContext */
    private readonly ctx;
    /** Wet Level (Reverberated node) */
    private readonly wetGainNode;
    /** Dry Level (Original sound node) */
    private readonly dryGainNode;
    /** Impulse response filter */
    private readonly filterNode;
    /** Convolution node for applying impulse response */
    private readonly convolverNode;
    /** Output nodse */
    private readonly outputNode;
    /** Option */
    private readonly _options;
    /** Connected flag */
    private isConnected;
    /**
     * constructor
     * @param ctx Root AudioContext
     * @param options Configure
     */
    constructor(ctx: AudioContext, options: OptionInterface | undefined);
    /**
     * Connect the node for the reverb effect to the original sound node.
     * @param sourceNode Input source node
     */
    connect(sourceNode: AudioNode): AudioNode;
    /**
     * Disconnect the reverb node
     * @param sourceNode Input source node
     */
    disconnect(sourceNode: AudioNode | undefined): AudioNode | undefined;
    /**
     * Dry/Wet ratio
     * @param mix
     */
    mix(mix: number): void;
    /**
     * Set Impulse Response time length (second)
     * @param value
     */
    time(value: number): void;
    /**
     * Impulse response decay rate.
     * @param value
     */
    decay(value: number): void;
    /**
     * Delay before reverberation starts
     * @param value time[ms]
     */
    delay(value: number): void;
    /**
     * Reverse the impulse response.
     * @param reverse
     */
    reverse(reverse: boolean): void;
    /**
     * Filter for impulse response
     * @param type
     */
    filterType(type: BiquadFilterType): void;
    /**
     * Filter frequency applied to impulse response
     * @param freq
     */
    filterFreq(freq: number): void;
    /**
     * Filter quality.
     * @param q
     */
    filterQ(q: number): void;
    /**
     * Inpulse Response Noise algorithm.
     * @param type
     */
    setNoise(type: NoiseType): void;
    /**
     * return true if in range, otherwise false
     * @private
     * @param x Target value
     * @param min Minimum value
     * @param max Maximum value
     * @return
     */
    private inRange;
    /**
     * Utility function for building an impulse response
     * from the module parameters.
     * @private
     */
    private buildImpulse;
    /**
     * Generate white noise
     */
    private static whiteNoise;
}
//# sourceMappingURL=Reverb.d.ts.map