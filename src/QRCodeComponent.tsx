import React from 'react';
import Svg, {
  Rect,
  Circle,
  Polygon,
  Image,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { generateMatrix } from './genMatrix';

export interface QRCodeComponentProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  ecl?: 'L' | 'M' | 'Q' | 'H';
  logo?: string | number; // URL hoặc require()
  logoSize?: number;
  gradient?: {
    from: string;
    to: string;
    direction?: 'vertical' | 'horizontal';
  };
  style?: 'square' | 'circle' | 'diamond' | 'rounded';
  cornerRadius?: number;

  // Finder pattern style
  finderColor?: string;
  finderRadius?: number;
}

export const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  value,
  size = 200,
  color = 'black',
  backgroundColor = 'white',
  ecl = 'M',
  logo,
  logoSize = 40,
  gradient,
  style = 'square',
  cornerRadius = 4,
  finderColor,
  finderRadius = 0,
}) => {
  const [matrix, setMatrix] = React.useState<number[][] | null>(null);

  React.useEffect(() => {
    setMatrix(generateMatrix(value, ecl));
  }, [value, ecl]);

  if (!matrix) return null;

  const numCells = matrix.length;
  const cellSize = size / numCells;

  const renderCell = (row: number, col: number, isFinder: boolean) => {
    const x = col * cellSize;
    const y = row * cellSize;
    const fill = gradient
      ? 'url(#grad)'
      : isFinder
        ? finderColor || color
        : color;

    if (style === 'circle') {
      return (
        <Circle
          key={`${row}-${col}`}
          cx={x + cellSize / 2}
          cy={y + cellSize / 2}
          r={cellSize / 2}
          fill={fill}
        />
      );
    }

    if (style === 'diamond') {
      return (
        <Polygon
          key={`${row}-${col}`}
          points={`
            ${x + cellSize / 2},${y}
            ${x + cellSize},${y + cellSize / 2}
            ${x + cellSize / 2},${y + cellSize}
            ${x},${y + cellSize / 2}
          `}
          fill={fill}
        />
      );
    }

    return (
      <Rect
        key={`${row}-${col}`}
        x={x}
        y={y}
        width={cellSize}
        height={cellSize}
        rx={isFinder ? finderRadius : style === 'rounded' ? cornerRadius : 0}
        ry={isFinder ? finderRadius : style === 'rounded' ? cornerRadius : 0}
        fill={fill}
      />
    );
  };

  return (
    <Svg width={size} height={size}>
      {/* Background */}
      <Rect width={size} height={size} fill={backgroundColor} />

      {/* Gradient */}
      {gradient && (
        <Defs>
          <LinearGradient
            id="grad"
            x1="0%"
            y1="0%"
            x2={gradient.direction === 'horizontal' ? '100%' : '0%'}
            y2={gradient.direction === 'vertical' ? '100%' : '0%'}
          >
            <Stop offset="0%" stopColor={gradient.from} />
            <Stop offset="100%" stopColor={gradient.to} />
          </LinearGradient>
        </Defs>
      )}

      {/* QR cells */}
      {matrix.map((row, r) =>
        row.map((cell, c) => {
          if (!cell) return null;

          const inFinder =
            (r < 7 && c < 7) || // top-left
            (r < 7 && c >= numCells - 7) || // top-right
            (r >= numCells - 7 && c < 7); // bottom-left

          return renderCell(r, c, inFinder);
        })
      )}

      {/* Logo ở giữa */}
      {logo && (
        <Image
          href={logo}
          width={logoSize}
          height={logoSize}
          x={(size - logoSize) / 2}
          y={(size - logoSize) / 2}
          preserveAspectRatio="xMidYMid slice"
        />
      )}
    </Svg>
  );
};

export default QRCodeComponent;
