import React from 'react';
import PropTypes from 'prop-types';

class Select extends React.Component {
    onChange(event) {
        let selectedValue = this.props.options.find((option) => {
            return option[this.props.valueKey || 'value'] === event.target.value;
        });

        this.props.onChange(selectedValue);
    }

    render() {
        var options = [];

        if (this.props.blankOption) {
            var value = this.props.blankOption[this.props.valueKey || 'value'];
            var name = this.props.blankOption[this.props.nameKey || 'name'];

            options.push(
                <option key='default' value={value}>
                    {name}
                </option>
            );
        }

        if (this.props.options) {
            this.props.options.forEach((option) => {
                var value = option[this.props.valueKey || 'value'];
                var name = option[this.props.nameKey || 'name'];

                options.push(
                    <option key={value} value={value}>
                        {name}
                    </option>
                );
            });
        }

        var selectStyle = {};
        if (this.props.button) {
            selectStyle = {
                display: 'inline-block',
                width: '67%'
            };
        }

        return (
            <div className='form-group'>
                <label
                    htmlFor={this.props.name}
                    className={this.props.labelClass + ' control-label'}
                >
                    {this.props.label}
                </label>
                <div className={this.props.fieldClass}>
                    <select
                        ref={this.props.name}
                        style={selectStyle}
                        className='form-control'
                        id={this.props.name}
                        value={this.props.value}
                        onChange={this.onChange.bind(this)}
                        onBlur={this.props.onBlur}
                    >
                        {options}
                    </select>
                    {this.props.validationMessage ? (
                        <span className='help-block'>{this.props.validationMessage} </span>
                    ) : null}
                    {this.props.button ? (
                        <button
                            className='btn btn-default select-button'
                            onClick={this.props.button.onClick}
                        >
                            {this.props.button.text}
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }
}

Select.displayName = 'Select';
Select.propTypes = {
    blankOption: PropTypes.object,
    button: PropTypes.object,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    name: PropTypes.string,
    nameKey: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    options: PropTypes.array,
    validationMessage: PropTypes.string,
    value: PropTypes.string,
    valueKey: PropTypes.string
};

export default Select;
