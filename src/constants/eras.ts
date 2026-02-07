export interface Era {
  id: string;
  name: string;
  album: string; // Nombre del álbum asociado
  year: number; // Año de lanzamiento
  colorRationale: string; // Explicación de la paleta de colores
  colors: {
    primary: string;
    secondary: string;
    background: string;
    paper: string;
    text: string;
    accent?: string;
    heroText?: string; // Color específico para texto en hero con gradientes
    heroOverlay?: string; // Overlay semitransparente para mejorar contraste
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
    album: 'Taylor Swift',
    year: 2006,
    colorRationale: 'Tonos verdes y teal representan frescura, naturaleza y nuevos comienzos. Refleja la juventud country y la pureza del álbum debut.',
    colors: {
      primary: '#1D6F5D', // Dark Teal
      secondary: '#B5EAD7', // Light Teal/Green
      background: '#F0FFF4', // Mint Cream
      paper: '#B5EAD7', // Same as secondary
      text: '#0E3B32', // Darker Teal for contrast
      heroText: '#FFFFFF', // Blanco para contraste sobre gradient oscuro
      heroOverlay: 'rgba(14, 59, 50, 0.4)', // Verde oscuro semitransparente
    },
    gradient: 'linear-gradient(135deg, #B5EAD7 0%, #88D8B0 25%, #26A69A 50%, #1D6F5D 75%, #0E3B32 100%)',
    shadowColor: 'rgba(29, 111, 93, 0.4)',
  },
  {
    id: 'fearless',
    name: 'Fearless',
    album: 'Fearless',
    year: 2008,
    colorRationale: 'Dorado y champagne evocan optimismo, romance de cuento de hadas y la "era dorada" del country-pop. Colores cálidos y brillantes.',
    colors: {
      primary: '#CFB53B', // Old Gold
      secondary: '#EAD2AC', // Champagne
      background: '#FFF8E7', // Cosmic Latte
      paper: '#EAD2AC', // Same as secondary
      text: '#4A3200', // Dark Golden Brown
      heroText: '#3E2A00', // Marrón muy oscuro para contraste
      heroOverlay: 'rgba(74, 50, 0, 0.3)', // Marrón dorado semitransparente
    },
    gradient: 'linear-gradient(135deg, #FFF8E7 0%, #EAD2AC 25%, #F4C430 50%, #CFB53B 75%, #996515 100%)',
    shadowColor: 'rgba(207, 181, 59, 0.4)',
  },
  {
    id: 'speak-now',
    name: 'Speak Now',
    album: 'Speak Now',
    year: 2010,
    colorRationale: 'Púrpura y lavanda representan realeza, magia y fantasía. Colores asociados con vestidos de cuento y momentos encantados.',
    colors: {
      primary: '#743089', // Purple
      secondary: '#D2B4DE', // Lilac
      background: '#F9F0FF', // Lavender Blush
      paper: '#D2B4DE', // Same as secondary
      text: '#371544', // Dark Purple
      heroText: '#2B0F35', // Púrpura muy oscuro para contraste
      heroOverlay: 'rgba(55, 21, 68, 0.35)', // Púrpura oscuro semitransparente
    },
    gradient: 'linear-gradient(135deg, #F9F0FF 0%, #E8DAEF 25%, #D2B4DE 50%, #A569BD 75%, #743089 100%)',
    shadowColor: 'rgba(116, 48, 137, 0.4)',
  },
  {
    id: 'red',
    name: 'Red',
    album: 'Red',
    year: 2012,
    colorRationale: 'Rojo profundo simboliza emociones intensas, pasión, amor ardiente y heartbreak. El color más emblemático del álbum.',
    colors: {
      primary: '#9E2A2B', // Deep Red
      secondary: '#E09F9F', // Light Red
      background: '#FFF0F0', // Snow
      paper: '#E09F9F', // Same as secondary
      text: '#540B0E', // Very Dark Red
      heroText: '#FFFFFF', // Blanco para máximo contraste sobre rojos oscuros
      heroOverlay: 'rgba(84, 11, 14, 0.4)', // Rojo muy oscuro semitransparente
    },
    gradient: 'linear-gradient(135deg, #FFF0F0 0%, #F5B7B1 25%, #E74C3C 50%, #C0392B 75%, #922B21 100%)',
    shadowColor: 'rgba(158, 42, 43, 0.4)',
  },
  {
    id: '1989',
    name: '1989',
    album: '1989',
    year: 2014,
    colorRationale: 'Azules cielo representan Nueva York, pop urbano, libertad y cielos despejados. Inspirado en los 80s y la ciudad.',
    colors: {
      primary: '#6CA0DC', // Little Boy Blue
      secondary: '#B6D0E2', // Powder Blue
      background: '#F0F8FF', // Alice Blue
      paper: '#B6D0E2', // Same as secondary
      text: '#1A2530', // Dark Blue Grey
      heroText: '#0D1418', // Azul casi negro para contraste
      heroOverlay: 'rgba(26, 37, 48, 0.35)', // Azul gris oscuro semitransparente
    },
    gradient: 'linear-gradient(135deg, #F0F8FF 0%, #D6EAF8 25%, #AED6F1 50%, #5DADE2 75%, #2E86C1 100%)',
    shadowColor: 'rgba(108, 160, 220, 0.4)',
  },
  {
    id: 'reputation',
    name: 'Reputation',
    album: 'Reputation',
    year: 2017,
    colorRationale: 'Negro y gris oscuro simbolizan misterio, oscuridad, renacimiento y la "serpiente". Era más oscura y dramática.',
    colors: {
      primary: '#1A1A1A', // Almost Black
      secondary: '#4A4A4A', // Dark Grey
      background: '#0D0D0D', // Very Dark Background
      paper: '#4A4A4A', // Same as secondary
      text: '#E8E8E8', // Light Grey
      heroText: '#FFFFFF', // Blanco puro para máximo contraste en oscuro
      heroOverlay: 'rgba(0, 0, 0, 0.5)', // Negro semitransparente fuerte
    },
    gradient: 'linear-gradient(135deg, #D7DBDD 0%, #99A3A4 25%, #616A6B 50%, #34495E 75%, #17202A 100%)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  {
    id: 'lover',
    name: 'Lover',
    album: 'Lover',
    year: 2019,
    colorRationale: 'Rosa y azul pastel evocan romance, dulzura, colores de algodón de azúcar. Paleta brillante, optimista y soñadora.',
    colors: {
      primary: '#F8C8DC', // Pastel Pink
      secondary: '#A7C7E7', // Pastel Blue
      background: '#FFF0F5', // Lavender Blush
      paper: '#A7C7E7', // Same as secondary
      text: '#C2185B', // Dark Pink
      heroText: '#8B0F3D', // Rosa muy oscuro para fuerte contraste
      heroOverlay: 'rgba(194, 24, 91, 0.25)', // Rosa oscuro semitransparente suave
    },
    gradient: 'linear-gradient(135deg, #FFF0F5 0%, #F8C8DC 25%, #F48FB1 50%, #7FB3D5 75%, #A7C7E7 100%)',
    shadowColor: 'rgba(248, 200, 220, 0.5)',
  },
  {
    id: 'folklore',
    name: 'Folklore',
    album: 'Folklore',
    year: 2020,
    colorRationale: 'Grises y beige representan naturaleza, cottagecore, bosques neblinosos. Paleta apagada, introspectiva y orgánica.',
    colors: {
      primary: '#708090', // Slate Grey
      secondary: '#CFCFC4', // Pastel Grey
      background: '#F5F5F5', // White Smoke
      paper: '#CFCFC4', // Same as secondary
      text: '#2F4F4F', // Dark Slate Grey
      heroText: '#1A2528', // Gris muy oscuro para contraste
      heroOverlay: 'rgba(47, 79, 79, 0.3)', // Gris pizarra oscuro semitransparente
    },
    gradient: 'linear-gradient(135deg, #F5F5F5 0%, #E5E7E9 25%, #BDC3C7 50%, #95A5A6 75%, #7F8C8D 100%)',
    shadowColor: 'rgba(112, 128, 144, 0.4)',
  },
  {
    id: 'evermore',
    name: 'Evermore',
    album: 'Evermore',
    year: 2020,
    colorRationale: 'Marrones y tan evocan otoño, naturaleza, historia y cuentos antiguos. Hermano de folklore con tonos más cálidos.',
    colors: {
      primary: '#8B4513', // Saddle Brown
      secondary: '#C7B19C', // Tan
      background: '#FAF0E6', // Linen
      paper: '#C7B19C', // Same as secondary
      text: '#3E2723', // Dark Brown
      heroText: '#2B1810', // Marrón muy oscuro para contraste
      heroOverlay: 'rgba(62, 39, 35, 0.35)', // Marrón oscuro semitransparente
    },
    gradient: 'linear-gradient(135deg, #FAF0E6 0%, #E6D8CC 25%, #D7CCC8 50%, #A1887F 75%, #6D4C41 100%)',
    shadowColor: 'rgba(139, 69, 19, 0.4)',
  },
  {
    id: 'midnights',
    name: 'Midnights',
    album: 'Midnights',
    year: 2022,
    colorRationale: 'Púrpura oscuro y azul medianoche representan la noche, introspección, pensamientos de las 2 AM. Paleta nocturna y misteriosa.',
    colors: {
      primary: '#2D1B4E', // Deep Purple
      secondary: '#5B4A7E', // Muted Purple
      background: '#0A0615', // Almost Black with purple tint
      paper: '#5B4A7E', // Same as secondary
      text: '#D1C4E9', // Light Lavender
      heroText: '#FFFFFF', // Blanco puro para máximo contraste en oscuro
      heroOverlay: 'rgba(10, 6, 21, 0.5)', // Negro púrpura semitransparente fuerte
    },
    gradient: 'linear-gradient(135deg, #E8F8F5 0%, #A9CCE3 25%, #5499C7 50%, #2471A3 75%, #154360 100%)',
    shadowColor: 'rgba(25, 25, 112, 0.5)',
  },
];
