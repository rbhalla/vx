import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import additionalProps from '../util/additionalProps';
import stackOrder from '../util/stackOrder';
import stackOffset from '../util/stackOffset';
import { area, stack as d3stack } from 'd3-shape';

Stack.propTypes = {
  className: PropTypes.string,
  top: PropTypes.number,
  left: PropTypes.number,
  keys: PropTypes.array,
  data: PropTypes.array,
  curve: PropTypes.func,
  defined: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  x: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  x0: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  x1: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  y: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  y0: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  y1: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  order: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
  offset: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
  render: PropTypes.func,
  reverse: PropTypes.bool
};

export default function Stack({
  className,
  top = 0,
  left = 0,
  keys,
  data,
  curve,
  defined,
  x,
  x0,
  x1,
  y0,
  y1,
  value,
  order,
  offset,
  render,
  reverse = false,
  ...restProps
}) {
  const stack = d3stack();
  if (keys) stack.keys(keys);
  if (value) stack.value(value);
  if (order) stack.order(stackOrder(order));
  if (offset) stack.offset(stackOffset(offset));

  const path = area();
  if (x) path.x(x);
  if (x0) path.x0(x0);
  if (x1) path.x1(x1);
  if (y0) path.y0(y0);
  if (y1) path.y1(y1);
  if (curve) path.curve(curve);
  if (defined) path.defined(defined);

  const seriesData = stack(data);
  if (reverse) seriesData.reverse();

  if (render) {
    return (
      <Group top={top} left={left}>
        {render({ seriesData, path })}
      </Group>
    );
  }

  return (
    <Group top={top} left={left}>
      {seriesData.map((series, i) => {
        return (
          <path
            className={cx('vx-stack', className)}
            key={`stack-${i}-${series.key || ''}`}
            d={path(series)}
            {...additionalProps(restProps, {
              datum: series[i],
              index: i,
              series
            })}
          />
        );
      })}
    </Group>
  );
}
