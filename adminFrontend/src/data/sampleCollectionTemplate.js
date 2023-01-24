export const template = {
    collectionName: 'animal',
    fields: {
        count: {
            label: 'Count',
            formInputType: 'tel',
            required: true,
            exampleValue: '3',
        },
        species: {
            label: 'Species',
            formInputType: 'text',
            required: false,
            unique: false,
            exampleValue: 'arachnid',
        },
        'animal-password': {
            label: 'Animal Password',
            formInputType: 'password',
            exampleValue: 'ankie901dk',
        },
        'eating-habit': {
            label: 'Eating Habit',
            formInputType: 'select',
            exampleValue: 'select an option',
            options: [
                {
                    id: 0,
                    value: '',
                    text: 'Select a eating habit',
                },
                {
                    id: 1,
                    value: 'carnivore',
                    text: 'Carnivore',
                },
                {
                    id: 2,
                    value: 'herbivore',
                    text: 'Herbivore',
                },
                {
                    id: 3,
                    value: 'omnivore',
                    text: 'Omnivore',
                },
            ],
        },
        description: {
            label: 'Description',
            formInputType: 'textarea',
            exampleValue: 'Some animal description',
        },
        'registration-time': {
            label: 'Registration Time',
            formInputType: 'time',
            exampleValue: '21:00',
        },
        'is-alive': {
            label: 'Is Alive',
            formInputType: 'checkbox',
            required: true,
            unique: false,
        },
        gender: {
            label: 'Gender',
            formInputType: 'radio',
            exampleValue: '',
            options: [
                {
                    id: 0,
                    checked: true,
                    value: 'male',
                    text: 'Male',
                },
                {
                    id: 1,
                    checked: false,
                    value: 'female',
                    text: 'Female',
                },
            ],
        },
        'create-new': {
            label: '+ Create',
            formInputType: 'submit',
        },
    },
    config: {
        includeTimeStamps: true,
    },
};
