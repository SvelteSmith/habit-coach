interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ColorScheme {
  gradient: string[];
  background: string;
  primary: string;
  secondary: string;
}

// Convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Calculate color brightness
const getBrightness = (r: number, g: number, b: number): number => {
  return (r * 299 + g * 587 + b * 114) / 1000;
};

// Calculate color distance
const colorDistance = (c1: RGB, c2: RGB): number => {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) + 
    Math.pow(c1.g - c2.g, 2) + 
    Math.pow(c1.b - c2.b, 2)
  );
};

// Extract dominant colors from image using a simplified approach
export const extractColorsFromImage = async (imageUri: string): Promise<ColorScheme> => {
  try {
    // Create a canvas to analyze the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve) => {
      img.onload = () => {
        // Resize for performance
        const maxSize = 100;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          resolve(getDefaultColors());
          return;
        }
        
        const pixels = imageData.data;
        const colorCounts: { [key: string]: { count: number; rgb: RGB } } = {};
        
        // Sample pixels (skip some for performance)
        for (let i = 0; i < pixels.length; i += 16) { // Skip every 4 pixels
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          
          // Skip transparent pixels
          if (a < 128) continue;
          
          // Quantize colors to reduce variations
          const quantizedR = Math.round(r / 32) * 32;
          const quantizedG = Math.round(g / 32) * 32;
          const quantizedB = Math.round(b / 32) * 32;
          
          const key = `${quantizedR},${quantizedG},${quantizedB}`;
          
          if (colorCounts[key]) {
            colorCounts[key].count++;
          } else {
            colorCounts[key] = {
              count: 1,
              rgb: { r: quantizedR, g: quantizedG, b: quantizedB }
            };
          }
        }
        
        // Sort colors by frequency
        const sortedColors = Object.values(colorCounts)
          .sort((a, b) => b.count - a.count)
          .map(item => item.rgb);
        
        // Filter out very similar colors and very dark/light colors
        const distinctColors: RGB[] = [];
        for (const color of sortedColors) {
          const brightness = getBrightness(color.r, color.g, color.b);
          
          // Skip very dark or very light colors
          if (brightness < 30 || brightness > 220) continue;
          
          // Check if this color is distinct from existing ones
          const isDistinct = distinctColors.every(existing => 
            colorDistance(color, existing) > 50
          );
          
          if (isDistinct) {
            distinctColors.push(color);
          }
          
          // We only need 3-4 colors
          if (distinctColors.length >= 4) break;
        }
        
        // If we don't have enough colors, use defaults
        if (distinctColors.length < 2) {
          resolve(getDefaultColors());
          return;
        }
        
        // Create color scheme
        const colors = distinctColors.slice(0, 3);
        const hexColors = colors.map(c => rgbToHex(c.r, c.g, c.b));
        
        const colorScheme: ColorScheme = {
          gradient: hexColors.length >= 3 ? hexColors : [...hexColors, ...getDefaultColors().gradient.slice(hexColors.length)],
          background: `${hexColors[0]}B3`, // 70% opacity
          primary: hexColors[0],
          secondary: hexColors[1] || hexColors[0],
        };
        
        resolve(colorScheme);
      };
      
      img.onerror = () => {
        resolve(getDefaultColors());
      };
      
      img.src = imageUri;
    });
  } catch (error) {
    console.warn('Error extracting colors:', error);
    return getDefaultColors();
  }
};

// Fallback colors
const getDefaultColors = (): ColorScheme => ({
  gradient: ['#34d399', '#22c55e', '#16a34a'],
  background: 'rgba(52, 211, 153, 0.7)',
  primary: '#34d399',
  secondary: '#22c55e',
});

// For React Native, we'll use predefined color schemes based on image categories
export const getColorSchemeForImage = (imageUri: string): ColorScheme => {
  // Analyze the image URL to determine category and return appropriate colors
  if (imageUri.includes('1571019613914')) {
    // Exercise image - energetic reds/oranges
    return {
      gradient: ['#ff6b6b', '#ee5a52', '#d63031'],
      background: 'rgba(255, 107, 107, 0.7)',
      primary: '#ff6b6b',
      secondary: '#ee5a52',
    };
  } else if (imageUri.includes('1490645935967')) {
    // Nutrition image - natural greens
    return {
      gradient: ['#00b894', '#00a085', '#00875f'],
      background: 'rgba(0, 184, 148, 0.7)',
      primary: '#00b894',
      secondary: '#00a085',
    };
  } else if (imageUri.includes('1506905925346')) {
    // Mindfulness image - calming purples
    return {
      gradient: ['#6c5ce7', '#5f3dc4', '#4c63d2'],
      background: 'rgba(108, 92, 231, 0.7)',
      primary: '#6c5ce7',
      secondary: '#5f3dc4',
    };
  } else if (imageUri.includes('1541781774459')) {
    // Sleep image - peaceful blues
    return {
      gradient: ['#74b9ff', '#0984e3', '#2d3436'],
      background: 'rgba(116, 185, 255, 0.7)',
      primary: '#74b9ff',
      secondary: '#0984e3',
    };
  } else if (imageUri.includes('1551288049')) {
    // Progress image - vibrant pinks
    return {
      gradient: ['#fd79a8', '#e84393', '#6c5ce7'],
      background: 'rgba(253, 121, 168, 0.7)',
      primary: '#fd79a8',
      secondary: '#e84393',
    };
  }
  
  return getDefaultColors();
};