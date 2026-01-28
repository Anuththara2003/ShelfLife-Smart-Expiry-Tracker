import { Platform } from 'react-native';


const tintColorLight = '#EE5253';
const tintColorDark = '#FF8E8E'; 

export const Colors = {
  light: {
    text: '#2D3436',         
    background: '#F8F9FB',     
    tint: tintColorLight,      
    icon: '#636E72',
    tabIconDefault: '#ADADAD',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',           
    error: '#EE5253',
    success: '#4CAF50',
  },
  dark: {
    text: '#F8F9FB',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#25282B',
    error: '#FF6B6B',
    success: '#81C784',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});