import React, { useEffect, useMemo, useState } from 'react';
import { FixedSizeGrid as List } from 'react-window'; // Dodaj react-window
import {
  Button,
  Box,
  Field,
  Flex,
  Popover,
  Typography,
  useComposedRefs,
} from '@strapi/design-system';
import { CaretDown } from '@strapi/icons';
import { useField, type InputProps, type FieldValue } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import tags from "./tags.json";
import LazyIcon from './LazyIcon';

const ColorPreview = styled.div`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: ${(props) => props.color};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  border-radius: 0.5rem;

  &:hover, &.selected {
    background: rgba(255,255,255,0.1);
    cursor: pointer;
  }
  &:active {
    opacity: 0.65;
  }
`

const ColorPickerToggle = styled(Button)`
  & > span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  svg {
    width: ${({ theme }) => theme.spaces[2]};
    height: ${({ theme }) => theme.spaces[2]};
  }

  svg > path {
    fill: ${({ theme }) => theme.colors.neutral500};
    justify-self: flex-end;
  }
`;

const ColorPickerPopover = styled(Popover.Content)`
  padding: ${({ theme }) => theme.spaces[2]};
  min-height: 270px;
`;

type ColorPickerInputProps = InputProps &
  FieldValue & {
    labelAction?: React.ReactNode;
  };

const iconEntries = Object.entries(tags);

const IconPicker = React.forwardRef<HTMLButtonElement, ColorPickerInputProps>(
  (
    { hint, disabled = false, labelAction, label, name, required = false, onChange, value, error },
    forwardedRef
  ) => {
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Dodaj pole wyszukiwania
    const iconPickerButtonRef = React.useRef<HTMLButtonElement>(null!);
    const { formatMessage } = useIntl();

    const filteredIconNames = useMemo(() => {
      const filteredIconEntries = searchTerm ? iconEntries.filter(([name, tags]) => [name, ...tags].some(tag => tag.includes(searchTerm))) : iconEntries;
      return filteredIconEntries.map(([name]) => name)
    }, [searchTerm]);

    useEffect(() => {
      setShowIconPicker(false);
    }, [value])


    const composedRefs = useComposedRefs(forwardedRef, iconPickerButtonRef);

    // Ustawienia dla siatki
    const columnCount = 10; // Liczba ikon w jednym wierszu
    const itemWidth = 40;
    const itemHeight = 40;

    return (
      <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
        <Flex direction="column" alignItems="stretch" gap={1}>
          <Field.Label action={labelAction}>{label}</Field.Label>
          <Popover.Root onOpenChange={setShowIconPicker}>
            <Popover.Trigger>
              <ColorPickerToggle
                ref={composedRefs}
                aria-controls="icon-picker-value"
                aria-haspopup="dialog"
                aria-expanded={showIconPicker}
                aria-disabled={disabled}
                disabled={disabled}
                variant="tertiary"
                size="L"
              >
                <Flex>
                  <div style={{ height: "20px", width: "20px", marginRight: "10px" }}>
                    <LazyIcon name={value} style={{width: "100%", height: "100%"}} />
                  </div>
                  <Typography
                    textColor={value ? undefined : 'neutral600'}
                    variant="omega"
                  >
                    {value || "Select icon"}
                  </Typography>
                </Flex>
                <CaretDown aria-hidden />
              </ColorPickerToggle>
            </Popover.Trigger>
            <ColorPickerPopover sideOffset={4}>
              <div style={{marginBottom: "12px"}}>
                <Field.Input
                  type="search"
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                />
              </div>
              <List
               columnCount={columnCount}
               columnWidth={itemWidth}
               height={250}
               rowCount={Math.ceil(filteredIconNames.length / columnCount)}
               rowHeight={itemHeight}
               width={itemWidth * columnCount}
              >
                {({ columnIndex, rowIndex, style }) => {
                  const index = rowIndex * columnCount + columnIndex;
                  if (index >= filteredIconNames.length) return null;
                  const key = filteredIconNames[index];

                  return (
                    <IconButton
                      type="button"
                      className={key === value ? "selected" : ""}
                      key={key}
                      style={{...style}}
                      onClick={() => onChange(name, key)}
                    >
                      <LazyIcon name={key} />
                    </IconButton>
                  );
                }}
              </List>
            </ColorPickerPopover>
          </Popover.Root>
          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);

export default IconPicker;
