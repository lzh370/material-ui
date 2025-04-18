import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import composeClasses from '../composeClasses';
import {
  OptionUnstyledProps,
  OptionUnstyledOwnerState,
  OptionUnstyledType,
} from './OptionUnstyled.types';
import { getOptionUnstyledUtilityClass } from './optionUnstyledClasses';
import { useSlotProps } from '../utils';
import useOption from '../useOption';
import { useClassNamesOverride } from '../utils/ClassNameConfigurator';

function useUtilityClasses<OptionValue>(ownerState: OptionUnstyledOwnerState<OptionValue>) {
  const { disabled, highlighted, selected } = ownerState;

  const slots = {
    root: ['root', disabled && 'disabled', highlighted && 'highlighted', selected && 'selected'],
  };

  return composeClasses(slots, useClassNamesOverride(getOptionUnstyledUtilityClass));
}

/**
 * An unstyled option to be used within a SelectUnstyled.
 */
const OptionUnstyled = React.forwardRef(function OptionUnstyled<OptionValue>(
  props: OptionUnstyledProps<OptionValue>,
  ref: React.ForwardedRef<HTMLLIElement>,
) {
  const {
    children,
    component,
    disabled = false,
    label,
    slotProps = {},
    slots = {},
    value,
    ...other
  } = props;

  const Root = component || slots.root || 'li';

  const optionRef = React.useRef<HTMLLIElement>(null);
  const combinedRef = useForkRef(optionRef, ref);

  // If `label` is not explicitly provided, the `children` are used for convenience.
  // This is used to populate the select's trigger with the selected option's label.
  const computedLabel =
    label ?? (typeof children === 'string' ? children : optionRef.current?.innerText);

  const { getRootProps, selected, highlighted, index } = useOption({
    disabled,
    label: computedLabel,
    optionRef: combinedRef,
    value,
  });

  const ownerState: OptionUnstyledOwnerState<OptionValue> = {
    ...props,
    disabled,
    highlighted,
    index,
    selected,
  };

  const classes = useUtilityClasses(ownerState);

  const rootProps = useSlotProps({
    getSlotProps: getRootProps,
    elementType: Root,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    className: classes.root,
    ownerState,
  });

  return <Root {...rootProps}>{children}</Root>;
}) as OptionUnstyledType;

OptionUnstyled.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the option will be disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * A text representation of the option's content.
   * Used for keyboard text navigation matching.
   */
  label: PropTypes.string,
  /**
   * The props used for each slot inside the OptionUnstyled.
   * @default {}
   */
  slotProps: PropTypes.shape({
    root: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  }),
  /**
   * The components used for each slot inside the OptionUnstyled.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  slots: PropTypes.shape({
    root: PropTypes.elementType,
  }),
  /**
   * The value of the option.
   */
  value: PropTypes.any.isRequired,
} as any;

/**
 * An unstyled option to be used within a SelectUnstyled.
 *
 * Demos:
 *
 * - [Unstyled Select](https://mui.com/base/react-select/)
 *
 * API:
 *
 * - [OptionUnstyled API](https://mui.com/base/react-select/components-api/#option-unstyled)
 */
export default React.memo(OptionUnstyled) as OptionUnstyledType;
