'use client';

import * as React from 'react';
import { motion, AnimatePresence, type Transition } from 'motion/react';
import { Popover } from '@base-ui-components/react/popover';
import { cn } from '@/lib/utils';

type RadialMenuProps = {
  children?: React.ReactNode;
  menuItems: MenuItem[];
  size?: number;
  iconSize?: number;
  bandWidth?: number;
  innerGap?: number;
  outerGap?: number;
  outerRingWidth?: number;
  onSelect?: (item: MenuItem) => void;
};

type MenuItem = {
  id: number;
  label: string;
  icon: React.ComponentType<any>;
  handler?: () => void;
  state?: 'on' | 'off';
};

type Point = { x: number; y: number };

const menuTransition: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 1,
};

const wedgeTransition: Transition = {
  duration: 0.05,
  ease: 'easeOut',
};

const FULL_CIRCLE = 360;
const START_ANGLE = -90;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polarToCartesian(radius: number, angleDeg: number): Point {
  const rad = degToRad(angleDeg);
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

function slicePath(
  index: number,
  total: number,
  wedgeRadius: number,
  innerRadius: number,
) {
  if (total <= 0) return '';

  if (total === 1) {
    return `
      M ${wedgeRadius} 0
      A ${wedgeRadius} ${wedgeRadius} 0 1 1 ${-wedgeRadius} 0
      A ${wedgeRadius} ${wedgeRadius} 0 1 1 ${wedgeRadius} 0
      M ${innerRadius} 0
      A ${innerRadius} ${innerRadius} 0 1 0 ${-innerRadius} 0
      A ${innerRadius} ${innerRadius} 0 1 0 ${innerRadius} 0
    `;
  }

  const anglePerSlice = FULL_CIRCLE / total;
  const midDeg = START_ANGLE + anglePerSlice * index;
  const halfSlice = anglePerSlice / 2;

  const startDeg = midDeg - halfSlice;
  const endDeg = midDeg + halfSlice;

  const outerStart = polarToCartesian(wedgeRadius, startDeg);
  const outerEnd = polarToCartesian(wedgeRadius, endDeg);
  const innerStart = polarToCartesian(innerRadius, startDeg);
  const innerEnd = polarToCartesian(innerRadius, endDeg);

  const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

  return `
    M ${outerStart.x} ${outerStart.y}
    A ${wedgeRadius} ${wedgeRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}
    L ${innerEnd.x} ${innerEnd.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}
    Z
  `;
}

function RadialMenu({
  children,
  menuItems,
  size = 240,
  iconSize = 18,
  bandWidth = 50,
  innerGap = 8,
  outerGap = 8,
  outerRingWidth = 12,
  onSelect,
}: RadialMenuProps) {
  const radius = size / 2;

  const outerRingOuterRadius = radius;
  const outerRingInnerRadius = outerRingOuterRadius - outerRingWidth;

  const wedgeOuterRadius = outerRingInnerRadius - outerGap;
  const wedgeInnerRadius = wedgeOuterRadius - bandWidth;

  const iconRingRadius = (wedgeOuterRadius + wedgeInnerRadius) / 2;

  const centerRadius = Math.max(wedgeInnerRadius - innerGap, 0);

  const slice = 360 / menuItems.length;

  const itemRefs = React.useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);

  const resetActive = () => setActiveIndex(null);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) resetActive();
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleCenterClick = () => {
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger
        render={(triggerProps) => {
          return (
            <button
              {...triggerProps}
              className={cn('select-none outline-none cursor-pointer bg-white p-2 rounded-full', triggerProps.className)}
              onClick={handleClick}
            >
              {children}
            </button>
          );
        }}
      />

      <AnimatePresence>
        {open && (
          <Popover.Portal keepMounted>
            <Popover.Positioner
              align="center"
              sideOffset={0}
              className="outline-none"
            >
              <Popover.Popup
                style={{ width: size, height: size }}
                className="relative rounded-full overflow-hidden shadow-xl outline-none"
                render={
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={menuTransition}
                  />
                }
              >
                <svg
                  className="absolute inset-0 size-full"
                  viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
                >
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const midDeg = START_ANGLE + slice * index;
                    const { x: iconX, y: iconY } = polarToCartesian(
                      iconRingRadius,
                      midDeg,
                    );
                    const ICON_BOX = iconSize * 2;
                    const isActive = activeIndex === index;
                    const isStateOn = item.state === 'on';

                    return (
                      <g
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => itemRefs.current[index]?.click()}
                        onMouseEnter={() => {
                          setActiveIndex(index);
                          itemRefs.current[index]?.focus();
                        }}
                      >
                        <motion.path
                          d={slicePath(
                            index,
                            menuItems.length,
                            outerRingOuterRadius,
                            outerRingInnerRadius,
                          )}
                          className={cn({
                            'fill-neutral-700': isActive && !item.state,
                            'fill-neutral-800': !isActive && !item.state,
                            'fill-[#353e27]': isStateOn,
                            'fill-[#ff6b6b]': isActive && item.state === 'off',
                            'fill-[#521316]': !isActive && item.state === 'off',
                          })}
                          initial={false}
                          transition={wedgeTransition}
                        />
                        <motion.path
                          d={slicePath(
                            index,
                            menuItems.length,
                            wedgeOuterRadius,
                            wedgeInnerRadius,
                          )}
                          className={cn(
                            'stroke-neutral-600 stroke-1',
                            {
                              'fill-neutral-700':
                                isActive && !item.state,
                              'fill-neutral-800':
                                !isActive && !item.state,
                              'fill-[#353e27]':
                                isStateOn,
                              'fill-[#ff6b6b]':
                                isActive && item.state === 'off',
                              'fill-[#521316]':
                                !isActive && item.state === 'off',
                            },
                          )}
                          initial={false}
                          transition={wedgeTransition}
                        />

                        <foreignObject
                          x={iconX - ICON_BOX / 2}
                          y={iconY - ICON_BOX / 2}
                          width={ICON_BOX}
                          height={ICON_BOX}
                        >
                          <button
                            ref={(el: HTMLElement | null) => {
                              itemRefs.current[index] = el;
                            }}
                            onFocus={() => setActiveIndex(index)}
                            onClick={() => {
                              if (item.handler) {
                                item.handler();
                              }
                              onSelect?.(item);
                            }}
                            aria-label={item.label}
                            className={cn(
                              'size-full flex items-center justify-center rounded-full outline-none',
                              {
                                'text-neutral-400': !item.state,
                                'text-white': item.state === 'off',
                                'text-gray-600': isStateOn,
                                'text-neutral-900 dark:text-neutral-50':
                                  isActive && !item.state,
                              },
                            )}
                          >
                            <Icon 
                              size={iconSize} 
                              style={{ width: iconSize, height: iconSize }}
                            />
                          </button>
                        </foreignObject>
                      </g>
                    );
                  })}

                  <circle
                    cx={0}
                    cy={0}
                    r={centerRadius}
                    className="fill-neutral-950 stroke-1 opacity-50 stroke-neutral-600 cursor-pointer"
                    onClick={handleCenterClick}
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={3}
                    className="fill-none stroke-neutral-600"
                  />
                </svg>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
}

export { RadialMenu };
