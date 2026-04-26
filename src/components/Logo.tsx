import React from 'react';
import Svg, { Path, Text, G, Rect, Defs, Filter, FeOffset, FeGaussianBlur, FeColorMatrix, FeMerge, FeMergeNode } from 'react-native-svg';
import { colors } from '../constants/colors';

interface LogoProps {
  size?: number;
  showBackground?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 120, showBackground = false }) => {
  const viewBoxSize = 1200;
  const scale = size / viewBoxSize;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
      <Defs>
        <Filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
          <FeOffset dx="0" dy="12" result="offset" />
          <FeGaussianBlur in="offset" stdDeviation="6" result="blur" />
          <FeColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"
            result="shadow"
          />
          <FeMerge>
            <FeMergeNode in="shadow" />
            <FeMergeNode in="SourceGraphic" />
          </FeMerge>
        </Filter>
      </Defs>

      {showBackground && <Rect width={viewBoxSize} height={viewBoxSize} fill={colors.primary} rx={100} />}
      
      <G transform="translate(200, 640)">
        <Text
          x="0"
          y="0"
          fontSize="180"
          fontWeight="700"
          fill={colors.secondary}
          // Note: Font family might not match exactly without loading Inter
          fontFamily="System" 
          filter="url(#textShadow)"
        >
          Solvent
        </Text>

        <G transform="translate(800, 0)">
          <Path
            d="M0 -180 L-70 20 L0 20 L-100 300 L120 0 L40 0 L160 -180 Z"
            fill="none"
            stroke={colors.secondary}
            strokeWidth="22"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </G>
      </G>
    </Svg>
  );
};
