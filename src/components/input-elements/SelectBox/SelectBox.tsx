import React, { useRef, useState } from 'react';

import { ArrowDownHeadIcon } from 'assets';

import {
    classNames,
    defaultColors,
    fontSize,
    fontWeight,
    getColorVariantsFromColorThemeValue,
    sizing,
    spacing
} from 'lib';
import { MarginTop } from '../../../lib';
import Modal from 'components/layout-elements/Modal';

export interface SelectBoxProps {
    defaultValue?: any,
    handleSelect?: { (value: any): void },
    placeholder?: string,
    marginTop?: MarginTop,
    children: React.ReactElement[],
}

const SelectBox = ({
    defaultValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSelect = (value) => null,
    placeholder = 'Select...',
    marginTop = 'mt-0',
    children,
}: SelectBoxProps) => {
    const [showModal, setShowModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(defaultValue);

    const dropdownRef = useRef(null);

    type ValueToNameMapping = {
        [value: string]: string
    }
    const valueToNameMapping: ValueToNameMapping = {};
    const consturctValueToNameMapping = () => {
        React.Children.map(children, (child) => {
            valueToNameMapping[child.props.value] = child.props.name;
        });
    };
    consturctValueToNameMapping();

    const getOptionNamesFromChildren = (children: React.ReactElement[]): string[] => (
        React.Children.map(children, (child) => {
            return String(child.props.name);
        })
    );

    const getFilteredOptionNames = (searchQuery: string, allOptionNames: string[]) => {
        return searchQuery === ''
            ? allOptionNames
            : allOptionNames.filter((optionName: string) => {
                return optionName.toLowerCase().includes(searchQuery.toLowerCase());
            });
    };

    const allOptionNames = getOptionNamesFromChildren(children);
    const filteredOptionNames = new Set(getFilteredOptionNames(searchQuery, allOptionNames));

    return (
        <div ref={ dropdownRef } className={ classNames(
            'relative w-full min-w-[10rem] rounded-md shadow-sm border',
            getColorVariantsFromColorThemeValue(defaultColors.border).borderColor,
            marginTop,
        ) }>
            <input
                key={ selectedItem ? valueToNameMapping[selectedItem] : null }
                className={ classNames(
                    'w-full rounded-md focus:ring-2 focus:outline-0',
                    getColorVariantsFromColorThemeValue(defaultColors.white).bgColor,
                    getColorVariantsFromColorThemeValue(defaultColors.canvasBackground).hoverBgColor,
                    getColorVariantsFromColorThemeValue(defaultColors.ring).focusRingColor,
                    getColorVariantsFromColorThemeValue(defaultColors.darkText).textColor,
                    'placeholder:text-gray-500', // template string / string concatenation not possible with tailwind
                    spacing.twoXl.paddingLeft,
                    spacing.sm.paddingTop,
                    spacing.sm.paddingBottom,
                    fontSize.sm,
                    fontWeight.md,
                    'pr-10' // avoid text overflow at arrow down icon
                ) }
                type="input"
                placeholder={ selectedItem ? undefined : placeholder }
                defaultValue={ selectedItem ? valueToNameMapping[selectedItem] : undefined }
                onChange={ (e) => setSearchQuery(e.target.value) }
                onClick={ () => setShowModal(!showModal) }
            />
            <button
                className={ classNames(
                    'absolute top-1/2 -translate-y-1/2',
                    spacing.twoXl.right,
                ) }
                onClick={ () => setShowModal(!showModal) }
            >
                <ArrowDownHeadIcon
                    className={ classNames(
                        'flex-none',
                        sizing.lg.height,
                        sizing.lg.width,
                        spacing.twoXs.negativeMarginRight,
                        getColorVariantsFromColorThemeValue(defaultColors.lightText).textColor,
                    ) }
                    aria-hidden="true"
                />
            </button>
            <Modal
                showModal={ filteredOptionNames.size === 0 ? false : showModal }
                setShowModal={ setShowModal }
                triggerRef={ dropdownRef }
            >
                { React.Children.map(children, (child) => {
                    if (filteredOptionNames.has(String(child.props.name))) {
                        return (
                            <>
                                { React.cloneElement(child, {
                                    privateProps: {
                                        setSelectedItemValue: setSelectedItem,
                                        isActive: selectedItem === child.props.value,
                                        handleSelect: handleSelect,
                                        setShowModal: setShowModal,
                                    }
                                }) }
                            </>
                        );
                    }
                    return null;
                }) }
            </Modal>
        </div>
    );
};

export default SelectBox;