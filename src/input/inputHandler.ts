import { ReadStream } from 'tty';
import {TypedEmitter} from 'tiny-typed-emitter';
import { windows, unix } from './keyCodes';

const isWin = process.platform === 'win32';

export enum InputKey {
  CHAR,
  UP,
  DOWN
}

export interface InputEvents {
  'change': (handler: InputHandler, key: InputKey) => void;
  'exit': () => void;
  'select': () => void;
}

export default class InputHandler extends TypedEmitter<InputEvents> {
  private _value: Array<string | Buffer>;
  private _stdin: ReadStream;
  cursorPos: number;

  constructor({ stdin }: { stdin: ReadStream }) {
    super();
    this._value = [];
    this.cursorPos = 0;
    this._stdin = stdin;

    stdin.on('error', (e) => {
      this.end();
      console.error(e);
    });

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    if (!isWin) {
      stdin.setEncoding('utf8');
    }

    stdin.on('data', this.onKeyPress.bind(this));
  }

  get value(): string {
    return this._value.join('');
  }

  onKeyPress(key: Buffer): void {
    let keyMap;
    let keyCode;
    let char;

    if (isWin) {
      keyMap = windows;
      keyCode = key.toJSON().data.toString();
      char = key.toString();
    } else {
      keyMap = unix;
      keyCode = key;
      char = key;
    }

    const {
      ctrlC,
      ctrlD,
      esc,
      left,
      right,
      backspace,
      del,
      up,
      down,
      enter,
    } = keyMap;

    let changed = false;
    let inputKey = InputKey.CHAR;
    switch (keyCode) {
      case ctrlC:
      case ctrlD:
      case esc:
        this.emit('exit');
        break;
      case left:
        this.cursorPos = Math.max(0, this.cursorPos - 1);
        changed = true;
        break;
      case right:
        this.cursorPos = Math.min(this._value.length, this.cursorPos + 1);
        changed = true;
        break;
      case backspace:
        if (this.cursorPos !== 0) {
          this._value.splice(this.cursorPos - 1, 1);
          this.cursorPos = Math.max(0, this.cursorPos - 1);
          changed = true;
        }
        break;
      case del:
        if (this._value.length > this.cursorPos) {
          this._value.splice(this.cursorPos, 1);
          changed = true;
        }
        break;
      case enter:
        this.emit('select')
        break;
      case up:
        inputKey = InputKey.UP;
        break;
      case down:
        inputKey = InputKey.DOWN;
        break;
      default:
        this.insertChar(char);
        changed = true;
    }

    if (changed || inputKey !== InputKey.CHAR) {
      this.emit('change', this, inputKey)
    }
  }
  
  insertChar(char: string | Buffer): void {
    this._value.splice(this.cursorPos, 0, char);
    this.cursorPos++;
  }

  end(): void {
    this.removeAllListeners();
    this._stdin.setRawMode(false);    
  }
}
