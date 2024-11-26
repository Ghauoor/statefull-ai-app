import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

export default function useKeyBoardOffsetHeight() {
  const [keyboardOffsetHeight, setKeyboardOffsetHeight] = useState(0);
  useEffect(() => {
    const keyboadWillShowAndroidListner = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        setKeyboardOffsetHeight(e.endCoordinates.height);
      },
    );
    const keyboadWillHideAndroidListner = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardOffsetHeight(0);
      },
    );
    const keyboadWillHideIosListner = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardOffsetHeight(0);
      },
    );
    const keyboadWillShowIosListner = Keyboard.addListener(
      'keyboardWillShow',
      e => {
        setKeyboardOffsetHeight(e.endCoordinates.height);
      },
    );

    return () => {
      keyboadWillShowAndroidListner.remove();
      keyboadWillHideAndroidListner.remove();
      keyboadWillHideIosListner.remove();
      keyboadWillShowIosListner.remove();
    };
  }, []);

  return keyboardOffsetHeight;
}
