import React from 'react';
import Input from '../../components/Input';
import SectionSeparator from '../../components/SectionSeparator';

function Component() {
    return (
        <div>
            <form className="Form">
                <Input label="Building Name" />
                <Input label="Legal Name" />
                <Input label="Code Name" />
                <Input label="Available Units" />
                <Input label="Available Floors" />
                <Input label="Available Sections" />
                <Input label="Website" type="url" />
                <Input label="Logo" type="file" />
                <SectionSeparator />
                <Input label="Owner Name" />
                <Input label="Phone" type="tel" />
                <Input label="Email" type="email" />
                <SectionSeparator />
                <Input label="Select Location" type="button" />
                <Input label="Address" type="textarea" />
                <Input label="Province" type="select" options={[
                    {
                        label: 'Jogja',
                        value: 'jogja'
                    }
                ]} />
                <Input label="City" type="select" />
                <Input label="District" type="select" />
                <Input label="ZIP Code" type="number" />
            </form>
        </div>
    )
}

export default Component;