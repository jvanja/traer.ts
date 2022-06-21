export interface Force {

  turnOn: () => void;
  turnOff: () => void;
  isOn: () => boolean;
  isOff: () => boolean;
  apply: () => void;

}
