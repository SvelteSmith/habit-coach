import { useState, useEffect } from 'react';
import { getColors, ImageColorsResult } from 'react-native-image-colors';

interface ColorScheme {
  gradient: string[];
  background: string;
  primary: string;
  secondary: string;
}

interface UseImageColorsResult {
  colors: ColorScheme | null;
  loading: boolean;
  error: string | null;
}

const defaultColors: ColorScheme = {
  gradient: ['#34d399', '#22c55e', '#16a34a'],
  background: 'rgba(52, 211, 153, 0.7)',
  primary: '#34d399',
  secondary: '#22c55e',
};

const processImageColors = (result: ImageColorsResult): ColorScheme => {
  try {
    if (result.platform === 'android') {
      const { dominant, vibrant, darkVibrant, lightVibrant } = result;
      return {
        gradient: [
          vibrant || dominant || '#34d399',
          dominant || vibrant || '#22c55e',
          darkVibrant || dominant || '#16a34a',
        ],
        background: `${dominant || '#34d399'}B3`, // 70% opacity
        primary: vibrant || dominant || '#34d399',
        secondary: lightVibrant || vibrant || '#22c55e',
      };
    } else if (result.platform === 'ios') {
      const { background, primary, secondary, detail } = result;
      return {
        gradient: [
          primary || '#34d399',
          secondary || '#22c55e', 
          detail || background || '#16a34a',
        ],
        background: `${background || '#34d399'}B3`, // 70% opacity
        primary: primary || '#34d399',
        secondary: secondary || '#22c55e',
      };
    } else {
      // Web fallback
      const { vibrant, darkVibrant, lightVibrant } = result as any;
      return {
        gradient: [
          vibrant || '#34d399',
          lightVibrant || '#22c55e',
          darkVibrant || '#16a34a',
        ],
        background: `${vibrant || '#34d399'}B3`, // 70% opacity
        primary: vibrant || '#34d399',
        secondary: lightVibrant || '#22c55e',
      };
    }
  } catch (error) {
    console.warn('Error processing image colors:', error);
    return defaultColors;
  }
};

export const useImageColors = (imageUri: string): UseImageColorsResult => {
  const [colors, setColors] = useState<ColorScheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const extractColors = async () => {
      if (!imageUri) {
        setColors(defaultColors);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getColors(imageUri, {
          fallback: '#34d399',
          cache: true,
          key: imageUri,
        });

        const processedColors = processImageColors(result);
        setColors(processedColors);
      } catch (err) {
        console.warn('Failed to extract colors from image:', err);
        setError(err instanceof Error ? err.message : 'Failed to extract colors');
        setColors(defaultColors);
      } finally {
        setLoading(false);
      }
    };

    extractColors();
  }, [imageUri]);

  return { colors, loading, error };
};

export default useImageColors;