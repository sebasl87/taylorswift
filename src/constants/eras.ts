export interface Era {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    paper: string;
    text: string;
    accent?: string;
  };
  fontHeading?: string;
  fontBody?: string;
  gradient: string;
  shadowColor: string;
}

export const ERAS: Era[] = [
  {
    id: 'taylor-swift',
    name: 'Taylor Swift',
    colors: {
      primary: '#1D6F5D', // Dark Teal
      secondary: '#B5EAD7', // Light Teal/Green
      background: '#F0FFF4', // Mint Cream
      paper: '#FFFFFF',
      text: '#0E3B32', // Darker Teal for contrast
    },
    gradient: 'linear-gradient(135deg, #B5EAD7 0%, #88D8B0 25%, #26A69A 50%, #1D6F5D 75%, #0E3B32 100%)',
    shadowColor: 'rgba(29, 111, 93, 0.4)',
  },
  {
    id: 'fearless',
    name: 'Fearless',
    colors: {
      primary: '#CFB53B', // Old Gold
      secondary: '#EAD2AC', // Champagne
      background: '#FFF8E7', // Cosmic Latte
      paper: '#FFFFFF',
      text: '#4A3200', // Dark Golden Brown
    },
    gradient: 'linear-gradient(135deg, #FFF8E7 0%, #EAD2AC 25%, #F4C430 50%, #CFB53B 75%, #996515 100%)',
    shadowColor: 'rgba(207, 181, 59, 0.4)',
  },
  {
    id: 'speak-now',
    name: 'Speak Now',
    colors: {
      primary: '#743089', // Purple
      secondary: '#D2B4DE', // Lilac
      background: '#F9F0FF', // Lavender Blush
      paper: '#FFFFFF',
      text: '#371544', // Dark Purple
    },
    gradient: 'linear-gradient(135deg, #F9F0FF 0%, #E8DAEF 25%, #D2B4DE 50%, #A569BD 75%, #743089 100%)',
    shadowColor: 'rgba(116, 48, 137, 0.4)',
  },
  {
    id: 'red',
    name: 'Red',
    colors: {
      primary: '#9E2A2B', // Deep Red
      secondary: '#E09F9F', // Light Red
      background: '#FFF0F0', // Snow
      paper: '#FFFFFF',
      text: '#540B0E', // Very Dark Red
    },
    gradient: 'linear-gradient(135deg, #FFF0F0 0%, #F5B7B1 25%, #E74C3C 50%, #C0392B 75%, #922B21 100%)',
    shadowColor: 'rgba(158, 42, 43, 0.4)',
  },
  {
    id: '1989',
    name: '1989',
    colors: {
      primary: '#6CA0DC', // Little Boy Blue
      secondary: '#B6D0E2', // Powder Blue
      background: '#F0F8FF', // Alice Blue
      paper: '#FFFFFF',
      text: '#1A2530', // Dark Blue Grey
    },
    gradient: 'linear-gradient(135deg, #F0F8FF 0%, #D6EAF8 25%, #AED6F1 50%, #5DADE2 75%, #2E86C1 100%)',
    shadowColor: 'rgba(108, 160, 220, 0.4)',
  },
  {
    id: 'reputation',
    name: 'Reputation',
    colors: {
      primary: '#333333', // Dark Grey
      secondary: '#777777', // Grey
      background: '#121212', // Very Dark Grey
      paper: '#1E1E1E', // Dark Grey Paper
      text: '#F5F5F5', // White Smoke
    },
    gradient: 'linear-gradient(135deg, #D7DBDD 0%, #99A3A4 25%, #616A6B 50%, #34495E 75%, #17202A 100%)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  {
    id: 'lover',
    name: 'Lover',
    colors: {
      primary: '#F8C8DC', // Pastel Pink
      secondary: '#A7C7E7', // Pastel Blue
      background: '#FFF0F5', // Lavender Blush
      paper: '#FFFFFF',
      text: '#C2185B', // Dark Pink
    },
    gradient: 'linear-gradient(135deg, #FFF0F5 0%, #F8C8DC 25%, #F48FB1 50%, #7FB3D5 75%, #A7C7E7 100%)',
    shadowColor: 'rgba(248, 200, 220, 0.5)',
  },
  {
    id: 'folklore',
    name: 'Folklore',
    colors: {
      primary: '#708090', // Slate Grey
      secondary: '#CFCFC4', // Pastel Grey
      background: '#F5F5F5', // White Smoke
      paper: '#FFFFFF',
      text: '#2F4F4F', // Dark Slate Grey
    },
    gradient: 'linear-gradient(135deg, #F5F5F5 0%, #E5E7E9 25%, #BDC3C7 50%, #95A5A6 75%, #7F8C8D 100%)',
    shadowColor: 'rgba(112, 128, 144, 0.4)',
  },
  {
    id: 'evermore',
    name: 'Evermore',
    colors: {
      primary: '#8B4513', // Saddle Brown
      secondary: '#C7B19C', // Tan
      background: '#FAF0E6', // Linen
      paper: '#FFFFFF',
      text: '#3E2723', // Dark Brown
    },
    gradient: 'linear-gradient(135deg, #FAF0E6 0%, #E6D8CC 25%, #D7CCC8 50%, #A1887F 75%, #6D4C41 100%)',
    shadowColor: 'rgba(139, 69, 19, 0.4)',
  },
  {
    id: 'midnights',
    name: 'Midnights',
    colors: {
      primary: '#191970', // Midnight Blue
      secondary: '#483D8B', // Dark Slate Blue
      background: '#0F172A', // Slate 900
      paper: '#1E293B', // Slate 800
      text: '#E2E8F0', // Slate 200
    },
    gradient: 'linear-gradient(135deg, #E8F8F5 0%, #A9CCE3 25%, #5499C7 50%, #2471A3 75%, #154360 100%)',
    shadowColor: 'rgba(25, 25, 112, 0.5)',
  },
];
