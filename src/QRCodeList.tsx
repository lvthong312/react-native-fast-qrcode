import { useState, useRef, type ReactNode, useEffect, useMemo } from 'react';
import {
  Animated,
  Image,
  TouchableOpacity,
  View,
  Text,
  type ViewStyle,
  type ImageStyle,
  type TextStyle,
  StyleSheet,
  Easing,
} from 'react-native';
import QRCode, { type QRCodeProps } from './QRCode';

interface QRCodeListProps {
  values: string[];
  qrcodeProps?: Omit<QRCodeProps, 'value'>;
  initialIndex?: number;
  onChangeIndex?: (index: number) => void;
  showArrows?: boolean;
  arrowSize?: number;
  containerStyle?: ViewStyle;
  arrowStyle?: ImageStyle;

  // pagination built-in
  showDots?: boolean;
  dotSize?: number;
  dotColor?: string;
  activeDotColor?: string;
  paginationType?: 'dot' | 'fraction' | 'both';
  paginationPosition?: 'top' | 'bottom' | 'left' | 'right';
  fractionTextStyle?: TextStyle;
  contentStyle?: ViewStyle;

  // custom
  renderPagination?: (index: number, total: number) => ReactNode;

  // animation
  animationType?: 'slide' | 'fade' | 'scale' | 'none';
  animationDuration?: number;
  animationEasing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

const SLIDE_DISTANCE = 300;

const easingMap = {
  'linear': Easing.linear,
  'ease': Easing.ease,
  'ease-in': Easing.in(Easing.ease),
  'ease-out': Easing.out(Easing.ease),
  'ease-in-out': Easing.inOut(Easing.ease),
};

const QRCodeList = ({
  values,
  qrcodeProps,
  initialIndex = 0,
  onChangeIndex,
  showArrows = true,
  arrowSize = 24,
  containerStyle,
  arrowStyle,
  showDots = true,
  dotSize = 8,
  dotColor = '#ccc',
  activeDotColor = '#000',
  paginationType = 'dot',
  paginationPosition = 'bottom',
  fractionTextStyle,
  contentStyle,
  renderPagination,
  animationType = 'slide',
  animationDuration = 150,
  animationEasing = 'ease',
}: QRCodeListProps) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (initialIndex >= 0) {
      setIndex(initialIndex);
    }
  }, [initialIndex]);
  const [, setDirection] = useState<1 | -1>(1);

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const handleChangeIndex = (newIndex: number, dir: 1 | -1) => {
    setDirection(dir);

    if (animationType === 'none') {
      setIndex(newIndex);
      onChangeIndex?.(newIndex);
      return;
    }

    const easingFunc = easingMap[animationEasing];

    if (animationType === 'slide') {
      Animated.timing(translateX, {
        toValue: -dir * SLIDE_DISTANCE,
        duration: animationDuration,
        easing: easingFunc,
        useNativeDriver: true,
      }).start(() => {
        setIndex(newIndex);
        onChangeIndex?.(newIndex);
        translateX.setValue(dir * SLIDE_DISTANCE);
        Animated.timing(translateX, {
          toValue: 0,
          duration: animationDuration,
          easing: easingFunc,
          useNativeDriver: true,
        }).start();
      });
    } else if (animationType === 'fade') {
      Animated.timing(opacity, {
        toValue: 0,
        duration: animationDuration,
        easing: easingFunc,
        useNativeDriver: true,
      }).start(() => {
        setIndex(newIndex);
        onChangeIndex?.(newIndex);
        Animated.timing(opacity, {
          toValue: 1,
          duration: animationDuration,
          easing: easingFunc,
          useNativeDriver: true,
        }).start();
      });
    } else if (animationType === 'scale') {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0,
          duration: animationDuration,
          easing: easingFunc,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: animationDuration,
          easing: easingFunc,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex(newIndex);
        onChangeIndex?.(newIndex);
      });
    }
  };

  const animatedStyle =
    animationType === 'slide'
      ? { transform: [{ translateX }] }
      : animationType === 'fade'
        ? { opacity }
        : animationType === 'scale'
          ? { transform: [{ scale }] }
          : {}; // none
  const listQR = useMemo(() => {
    return values?.map((el) => <QRCode value={el} {...qrcodeProps} />);
  }, [values]);
  const renderDefaultPagination = () => (
    <View style={styles.paginationContainer}>
      {(paginationType === 'dot' || paginationType === 'both') && showDots && (
        <View style={styles.dotsContainer}>
          {values.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: i === index ? activeDotColor : dotColor,
                },
              ]}
            />
          ))}
        </View>
      )}
      {(paginationType === 'fraction' || paginationType === 'both') && (
        <Text style={[styles.fractionText, fractionTextStyle]}>
          {index + 1}/{values.length}
        </Text>
      )}
    </View>
  );

  const paginationNode =
    renderPagination?.(index, values.length) ?? renderDefaultPagination();

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {paginationPosition === 'top' && paginationNode}

      <View style={[styles.rowContainer, contentStyle]}>
        {paginationPosition === 'left' && paginationNode}

        {showArrows && (
          <TouchableOpacity
            onPress={() => index > 0 && handleChangeIndex(index - 1, -1)}
            style={{
              backgroundColor: 'rgb(35,43,53)',
              padding: 8,
              borderRadius: 100,
            }}
          >
            <Image
              source={require('./images/ic_left_chevron.png')}
              style={[
                { width: arrowSize, height: arrowSize, tintColor: 'white' },
                arrowStyle,
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        <Animated.View style={animatedStyle}>{listQR?.[index]}</Animated.View>

        {showArrows && (
          <TouchableOpacity
            onPress={() =>
              index < values.length - 1 && handleChangeIndex(index + 1, 1)
            }
            style={{
              backgroundColor: 'rgb(35,43,53)',
              padding: 8,
              borderRadius: 100,
            }}
          >
            <Image
              source={require('./images/ic_right_chevron.png')}
              style={[
                { width: arrowSize, height: arrowSize, tintColor: 'white' },
                arrowStyle,
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {paginationPosition === 'right' && paginationNode}
      </View>

      {paginationPosition === 'bottom' && paginationNode}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    gap: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    backgroundColor: '#ccc',
  },
  fractionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default QRCodeList;
