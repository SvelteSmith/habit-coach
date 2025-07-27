import React, { createContext, useContext, useEffect, useState } from 'react';
import { getColorSchemeForImage } from '../../utils/color-extractor';

interface ColorScheme {
  gradient: string[];
  background: string;
  primary: string;
  secondary: string;
}

interface ColorCache {
  [imageUri: string]: ColorScheme;
}

interface ColorContextType {
  getColorsForImage: (imageUri: string) => ColorScheme;
  isLoading: boolean;
}

const ColorContext = createContext<ColorContextType | null>(null);

const defaultColors: ColorScheme = {
  gradient: ['#34d399', '#22c55e', '#16a34a'],
  background: 'rgba(52, 211, 153, 0.7)',
  primary: '#34d399',
  secondary: '#22c55e',
};


interface ColorProviderProps {
  children: React.ReactNode;
  imageUris: string[];
}

export const ColorProvider: React.FC<ColorProviderProps> = ({ children, imageUris }) => {
  const [colorCache, setColorCache] = useState<ColorCache>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const extractAllColors = () => {
      setIsLoading(true);
      const cache: ColorCache = {};

      try {
        imageUris.forEach((uri) => {
          try {
            const colors = getColorSchemeForImage(uri);
            cache[uri] = colors;
          } catch (error) {
            console.warn(`Failed to extract colors for ${uri}:`, error);
            cache[uri] = defaultColors;
          }
        });

        setColorCache(cache);
      } catch (error) {
        console.warn('Error extracting colors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (imageUris.length > 0) {
      extractAllColors();
    }
  }, [imageUris]);

  const getColorsForImage = (imageUri: string): ColorScheme => {
    return colorCache[imageUri] || defaultColors;
  };

  return (
    <ColorContext.Provider value={{ getColorsForImage, isLoading }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = (): ColorContextType => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};